import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const createReview = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required to post a review.' });
      return;
    }

    const { roomId, bookingId, rating, comment } = req.body;

    if (!roomId || !bookingId || !rating || !comment) {
      res.status(400).json({ success: false, message: 'Room ID, booking reference, rating, and comment are required.' });
      return;
    }

    const numRating = parseInt(rating, 10);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5.' });
      return;
    }

    // Verify booking exists, belongs to user, and is for this room
    const booking = db.findBookingById(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Associated reservation record not found.' });
      return;
    }

    if (booking.userId !== req.user._id) {
      res.status(403).json({ success: false, message: 'You can only review reservations made under your account.' });
      return;
    }

    if (booking.roomId !== roomId) {
      res.status(400).json({ success: false, message: 'Reservation does not match the room being reviewed.' });
      return;
    }

    // Only allow reviews on completed or checked-in stays
    if (booking.bookingStatus !== 'Completed' && booking.bookingStatus !== 'Checked Out') {
      res.status(400).json({
        success: false,
        message: 'You can only review a stay after completion or check-out.'
      });
      return;
    }

    // Prevent duplicate reviews for the same reservation
    const existing = db.getReviews().find(r => r.bookingId === bookingId);
    if (existing) {
      res.status(409).json({ success: false, message: 'You have already submitted a review for this stay.' });
      return;
    }

    const review = db.createReview({
      userId: req.user._id,
      userName: req.user.name,
      bookingId,
      roomId,
      rating: numRating,
      comment: comment.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your review!',
      review
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
};

export const getRoomReviews = (req: Request, res: Response): void => {
  try {
    const { roomId } = req.params;
    const reviews = db.getReviewsByRoom(roomId);
    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Error fetching room reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve reviews.' });
  }
};
