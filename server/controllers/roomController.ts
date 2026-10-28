import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { RoomType, RoomStatus } from '../models/types.js';

export const getRooms = (req: Request, res: Response): void => {
  try {
    const {
      destination,
      checkIn,
      checkOut,
      guests,
      type,
      minPrice,
      maxPrice,
      amenity,
      sort,
      page = '1',
      limit = '10'
    } = req.query;

    let rooms = db.getRooms();

    // Destination filter
    if (destination && typeof destination === 'string' && destination.trim() !== '') {
      const q = destination.trim().toLowerCase();
      rooms = rooms.filter(r =>
        r.destination.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (type && typeof type === 'string' && type.trim() !== '' && type !== 'All') {
      rooms = rooms.filter(r => r.type.toLowerCase() === type.trim().toLowerCase());
    }

    // Capacity / Guests filter
    if (guests) {
      const numGuests = parseInt(guests as string, 10);
      if (!isNaN(numGuests) && numGuests > 0) {
        rooms = rooms.filter(r => r.capacity >= numGuests);
      }
    }

    // Price range
    if (minPrice) {
      const min = parseFloat(minPrice as string);
      if (!isNaN(min)) {
        rooms = rooms.filter(r => r.pricePerNight >= min);
      }
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice as string);
      if (!isNaN(max)) {
        rooms = rooms.filter(r => r.pricePerNight <= max);
      }
    }

    // Amenity filter
    if (amenity && typeof amenity === 'string' && amenity.trim() !== '') {
      const requiredAmenity = amenity.trim().toLowerCase();
      rooms = rooms.filter(r =>
        r.amenities.some(a => a.toLowerCase().includes(requiredAmenity))
      );
    }

    // Date availability check
    if (checkIn && checkOut && typeof checkIn === 'string' && typeof checkOut === 'string') {
      rooms = rooms.filter(r => db.isRoomAvailable(r._id, checkIn, checkOut));
    }

    // Sorting
    if (sort === 'price_asc') {
      rooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sort === 'price_desc') {
      rooms.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sort === 'rating') {
      rooms.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'popular') {
      rooms.sort((a, b) => b.numReviews - a.numReviews);
    } else {
      // Default: featured first, then rating
      rooms.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
    }

    // Pagination
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const total = rooms.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedRooms = rooms.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      count: paginatedRooms.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      rooms: paginatedRooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve rooms.' });
  }
};

export const getRoomById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const room = db.findRoomById(id);

    if (!room) {
      res.status(404).json({ success: false, message: 'Room not found.' });
      return;
    }

    const reviews = db.getReviewsByRoom(id);

    res.json({
      success: true,
      room,
      reviews
    });
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve room details.' });
  }
};

export const checkAvailability = (req: Request, res: Response): void => {
  try {
    const { roomId, checkIn, checkOut } = req.query;

    if (!roomId || !checkIn || !checkOut) {
      res.status(400).json({
        success: false,
        message: 'roomId, checkIn, and checkOut are required parameters.'
      });
      return;
    }

    const available = db.isRoomAvailable(roomId as string, checkIn as string, checkOut as string);

    res.json({
      success: true,
      roomId,
      checkIn,
      checkOut,
      available
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ success: false, message: 'Failed to verify availability.' });
  }
};

export const createRoom = (req: Request, res: Response): void => {
  try {
    const {
      roomNumber,
      name,
      type,
      description,
      pricePerNight,
      capacity,
      amenities,
      images,
      status = 'Available',
      destination = 'Malibu Coast',
      featured = false
    } = req.body;

    if (!roomNumber || !name || !type || !pricePerNight || !capacity) {
      res.status(400).json({
        success: false,
        message: 'Room number, name, type, price per night, and capacity are required.'
      });
      return;
    }

    // Check unique room number
    const existing = db.getRooms().find(r => r.roomNumber.toLowerCase() === roomNumber.toLowerCase());
    if (existing) {
      res.status(409).json({ success: false, message: `Room #${roomNumber} already exists.` });
      return;
    }

    const newRoom = db.createRoom({
      roomNumber: roomNumber.trim(),
      name: name.trim(),
      type: type as RoomType,
      description: (description || '').trim(),
      pricePerNight: parseFloat(pricePerNight),
      capacity: parseInt(capacity, 10),
      amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',').map((s: string) => s.trim()) : []),
      images: Array.isArray(images) && images.length > 0 ? images : ['/src/assets/images/room_deluxe_ocean_1793170449247.jpg'],
      status: (status as RoomStatus) || 'Available',
      destination: (destination || 'Malibu Coast').trim(),
      featured: Boolean(featured)
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully.',
      room: newRoom
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ success: false, message: 'Failed to create room.' });
  }
};

export const updateRoom = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const room = db.findRoomById(id);

    if (!room) {
      res.status(404).json({ success: false, message: 'Room not found.' });
      return;
    }

    const updates = { ...req.body };
    if (updates.pricePerNight) updates.pricePerNight = parseFloat(updates.pricePerNight);
    if (updates.capacity) updates.capacity = parseInt(updates.capacity, 10);
    if (updates.amenities && !Array.isArray(updates.amenities)) {
      updates.amenities = updates.amenities.split(',').map((s: string) => s.trim());
    }

    const updated = db.updateRoom(id, updates);

    res.json({
      success: true,
      message: 'Room updated successfully.',
      room: updated
    });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ success: false, message: 'Failed to update room.' });
  }
};

export const deleteRoom = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = db.deleteRoom(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Room not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Room deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ success: false, message: 'Failed to delete room.' });
  }
};
