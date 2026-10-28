import { Response } from 'express';
import { db } from '../db/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { BookingStatus, PaymentStatus } from '../models/types.js';

export const createBooking = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required to make a booking.' });
      return;
    }

    const {
      roomId,
      checkIn,
      checkOut,
      numberOfGuests,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests
    } = req.body;

    if (!roomId || !checkIn || !checkOut || !numberOfGuests) {
      res.status(400).json({ success: false, message: 'Missing required booking parameters.' });
      return;
    }

    const room = db.findRoomById(roomId);
    if (!room) {
      res.status(404).json({ success: false, message: 'Selected room not found.' });
      return;
    }

    const numGuests = parseInt(numberOfGuests, 10);
    if (numGuests > room.capacity) {
      res.status(400).json({
        success: false,
        message: `This room accommodates up to ${room.capacity} guests. You specified ${numGuests}.`
      });
      return;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({ success: false, message: 'Invalid check-in or check-out date.' });
      return;
    }

    if (startDate < now) {
      res.status(400).json({ success: false, message: 'Check-in date cannot be in the past.' });
      return;
    }

    if (endDate <= startDate) {
      res.status(400).json({ success: false, message: 'Check-out date must be after check-in date.' });
      return;
    }

    // Atomic / Server-side check to prevent overlapping double bookings
    const isAvailable = db.isRoomAvailable(roomId, checkIn, checkOut);
    if (!isAvailable) {
      res.status(409).json({
        success: false,
        message: 'This room is not available for the selected dates. Please select different dates or another suite.'
      });
      return;
    }

    // Calculate number of nights
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const numberOfNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Server-side financial calculation (never trust client total!)
    const subtotal = room.pricePerNight * numberOfNights;
    const taxes = parseFloat((subtotal * 0.12).toFixed(2)); // 12% hospitality & municipal tax
    const totalAmount = parseFloat((subtotal + taxes).toFixed(2));

    const booking = db.createBooking({
      userId: req.user._id,
      roomId: room._id,
      guestName: (guestName || req.user.name).trim(),
      guestEmail: (guestEmail || req.user.email).trim().toLowerCase(),
      guestPhone: (guestPhone || '').trim(),
      checkIn,
      checkOut,
      numberOfGuests: numGuests,
      numberOfNights,
      subtotal,
      taxes,
      totalAmount,
      bookingStatus: 'Pending',
      paymentStatus: 'Pending',
      specialRequests: (specialRequests || '').trim()
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully. Please complete payment to confirm your reservation.',
      booking,
      room: {
        name: room.name,
        roomNumber: room.roomNumber,
        type: room.type,
        images: room.images
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking.' });
  }
};

export const getMyBookings = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const bookings = db.findBookingsByUser(req.user._id);

    // Hydrate with room details
    const hydrated = bookings.map(b => {
      const room = db.findRoomById(b.roomId);
      return {
        ...b,
        room: room ? {
          name: room.name,
          roomNumber: room.roomNumber,
          type: room.type,
          images: room.images,
          destination: room.destination,
          pricePerNight: room.pricePerNight
        } : null
      };
    });

    res.json({
      success: true,
      count: hydrated.length,
      bookings: hydrated
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve bookings.' });
  }
};

export const getBookingById = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    let booking = db.findBookingById(id);

    // Support lookup by reference as well
    if (!booking) {
      booking = db.findBookingByRef(id);
    }

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    // Permission check: only booking owner or admin or staff can view
    if (req.user?.role !== 'admin' && req.user?.role !== 'staff' && req.user?._id !== booking.userId) {
      res.status(403).json({ success: false, message: 'Access denied to this reservation record.' });
      return;
    }

    const room = db.findRoomById(booking.roomId);
    const payments = db.getPayments().filter(p => p.bookingId === booking?._id);

    res.json({
      success: true,
      booking: {
        ...booking,
        room,
        payments
      }
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve booking.' });
  }
};

export const cancelBooking = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const booking = db.findBookingById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    // Role verification
    if (req.user?.role !== 'admin' && req.user?._id !== booking.userId) {
      res.status(403).json({ success: false, message: 'Forbidden. You cannot cancel this booking.' });
      return;
    }

    if (booking.bookingStatus === 'Cancelled') {
      res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
      return;
    }

    if (booking.bookingStatus === 'Checked In' || booking.bookingStatus === 'Completed') {
      res.status(400).json({
        success: false,
        message: 'Cannot cancel an in-progress or completed stay.'
      });
      return;
    }

    const updated = db.updateBooking(id, {
      bookingStatus: 'Cancelled',
      cancellationReason: (cancellationReason || 'Cancelled by guest').trim(),
      paymentStatus: booking.paymentStatus === 'Paid' ? 'Refunded' : booking.paymentStatus
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully.',
      booking: updated
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel booking.' });
  }
};

export const updateBookingStatus = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { bookingStatus, paymentStatus } = req.body;

    const booking = db.findBookingById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    const updates: Partial<typeof booking> = {};
    if (bookingStatus) {
      updates.bookingStatus = bookingStatus as BookingStatus;
      if (bookingStatus === 'Checked In') {
        updates.checkedInAt = new Date().toISOString();
      } else if (bookingStatus === 'Checked Out' || bookingStatus === 'Completed') {
        updates.checkedOutAt = new Date().toISOString();
      }
    }

    if (paymentStatus) {
      updates.paymentStatus = paymentStatus as PaymentStatus;
    }

    const updated = db.updateBooking(id, updates);

    res.json({
      success: true,
      message: `Reservation status updated to ${bookingStatus || paymentStatus}.`,
      booking: updated
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ success: false, message: 'Failed to update booking status.' });
  }
};
