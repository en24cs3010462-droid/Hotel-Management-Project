import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  getStaffOperations
} from '../controllers/adminController.js';
import { requireAdmin, requireStaffOrAdmin } from '../middleware/auth.js';
import { db } from '../db/database.js';

const router = Router();

// Admin stats & users
router.get('/dashboard', requireAdmin, getDashboardStats);
router.get('/users', requireAdmin, getAllUsers);
router.patch('/users/:id/role', requireAdmin, updateUserRole);

// Bookings management
router.get('/bookings', requireStaffOrAdmin, (req, res) => {
  const { status, search } = req.query;
  let bookings = db.getBookings();

  if (status && status !== 'all') {
    bookings = bookings.filter(b => b.bookingStatus.toLowerCase() === (status as string).toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    bookings = bookings.filter(b =>
      b.bookingReference.toLowerCase().includes(q) ||
      b.guestName.toLowerCase().includes(q) ||
      b.guestEmail.toLowerCase().includes(q)
    );
  }

  const hydrated = bookings.map(b => ({
    ...b,
    room: db.findRoomById(b.roomId)
  }));

  res.json({ success: true, count: hydrated.length, bookings: hydrated });
});

// Staff operations (Arrivals, departures, check-in, check-out)
router.get('/operations', requireStaffOrAdmin, getStaffOperations);

export default router;
