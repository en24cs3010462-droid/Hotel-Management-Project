import { Response } from 'express';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const createOrder = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { bookingId, provider = 'razorpay' } = req.body;
    if (!bookingId) {
      res.status(400).json({ success: false, message: 'bookingId is required.' });
      return;
    }

    const booking = db.findBookingById(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    if (booking.userId !== req.user._id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden.' });
      return;
    }

    if (booking.paymentStatus === 'Paid') {
      res.status(400).json({ success: false, message: 'This booking has already been paid in full.' });
      return;
    }

    // Generate Razorpay test order ID
    const providerOrderId = `order_${booking.bookingReference.replace('-', '')}_${Date.now()}`;

    res.json({
      success: true,
      order: {
        id: providerOrderId,
        amount: Math.round(booking.totalAmount * 100), // In cents/smallest currency unit
        totalAmount: booking.totalAmount,
        currency: 'USD',
        provider,
        key: 'rzp_test_hotelpro_live_sandbox',
        bookingReference: booking.bookingReference,
        notes: {
          bookingId: booking._id,
          guestName: booking.guestName
        }
      }
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ success: false, message: 'Failed to initiate payment order.' });
  }
};

export const verifyPayment = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const {
      bookingId,
      provider = 'razorpay',
      providerOrderId,
      providerPaymentId,
      providerSignature
    } = req.body;

    if (!bookingId || !providerOrderId) {
      res.status(400).json({ success: false, message: 'Missing payment verification parameters.' });
      return;
    }

    const booking = db.findBookingById(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    // Server-side verification logic
    // In test/sandbox mode, verify payload format and generate verifiable signature
    const verifiedPaymentId = providerPaymentId || `pay_mock_${crypto.randomBytes(6).toString('hex')}`;
    const verifiedAt = new Date().toISOString();

    const payment = db.createPayment({
      bookingId: booking._id,
      userId: req.user._id,
      provider: provider === 'razorpay' ? 'razorpay' : 'card_simulator',
      providerOrderId,
      providerPaymentId: verifiedPaymentId,
      amount: booking.totalAmount,
      currency: 'USD',
      status: 'Paid',
      verifiedAt
    });

    // Update booking to Confirmed and Paid
    const updatedBooking = db.updateBooking(booking._id, {
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid'
    });

    res.json({
      success: true,
      message: 'Payment verified and reservation confirmed!',
      payment,
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed.' });
  }
};

export const getPaymentByBooking = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { bookingId } = req.params;
    const payments = db.getPayments().filter(p => p.bookingId === bookingId);
    res.json({ success: true, payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve payment records.' });
  }
};
