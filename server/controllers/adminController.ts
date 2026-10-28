import { Response } from 'express';
import { db } from '../db/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { UserRole } from '../models/types.js';

export const getDashboardStats = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const users = db.getUsers();
    const rooms = db.getRooms();
    const bookings = db.getBookings();
    const payments = db.getPayments();

    const totalUsers = users.length;
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status === 'Available').length;
    
    const activeReservations = bookings.filter(b =>
      b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked In'
    ).length;

    const totalRevenue = payments
      .filter(p => p.status === 'Paid')
      .reduce((acc, cur) => acc + cur.amount, 0);

    const occupancyRate = totalRooms > 0 
      ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) 
      : 0;

    // Recent 8 bookings with room names
    const recentBookings = [...bookings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
      .map(b => {
        const room = db.findRoomById(b.roomId);
        return {
          ...b,
          roomName: room ? room.name : 'Unknown Room',
          roomNumber: room ? room.roomNumber : '-'
        };
      });

    // Monthly revenue distribution (calculated from real payments)
    const revenueByMonth: Record<string, number> = {};
    payments.forEach(p => {
      if (p.status === 'Paid') {
        const date = new Date(p.verifiedAt || p.createdAt);
        const monthKey = date.toLocaleString('default', { month: 'short' });
        revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + p.amount;
      }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalRooms,
        availableRooms,
        activeReservations,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        occupancyRate,
        recentBookings,
        revenueByMonth
      }
    });
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve administrative statistics.' });
  }
};

export const getAllUsers = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const users = db.getUsers().map(u => {
      const bookingsCount = db.findBookingsByUser(u._id).length;
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        profileImage: u.profileImage,
        createdAt: u.createdAt,
        bookingsCount
      };
    });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve user accounts.' });
  }
};

export const updateUserRole = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['guest', 'staff', 'admin'].includes(role)) {
      res.status(400).json({ success: false, message: 'Valid role (guest, staff, admin) is required.' });
      return;
    }

    // Safety: prevent admin from demoting themselves
    if (req.user?._id === id && role !== 'admin') {
      res.status(400).json({ success: false, message: 'Cannot demote your own administrator account.' });
      return;
    }

    const updated = db.updateUser(id, { role: role as UserRole });
    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.json({
      success: true,
      message: `User ${updated.name}'s role updated to ${role}.`,
      user: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ success: false, message: 'Failed to update user role.' });
  }
};

export const getStaffOperations = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const bookings = db.getBookings();

    const arrivals = bookings.filter(b =>
      b.bookingStatus === 'Confirmed'
    ).map(b => ({
      ...b,
      room: db.findRoomById(b.roomId)
    }));

    const departures = bookings.filter(b =>
      b.bookingStatus === 'Checked In'
    ).map(b => ({
      ...b,
      room: db.findRoomById(b.roomId)
    }));

    const inHouse = bookings.filter(b =>
      b.bookingStatus === 'Checked In'
    ).map(b => ({
      ...b,
      room: db.findRoomById(b.roomId)
    }));

    res.json({
      success: true,
      today,
      arrivals,
      departures,
      inHouseCount: inHouse.length,
      rooms: db.getRooms()
    });
  } catch (error) {
    console.error('Error fetching staff operational data:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve staff operations.' });
  }
};
