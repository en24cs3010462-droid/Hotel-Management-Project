import React, { useState, useEffect } from 'react';
import { Room, Booking, User, AdminStats, RoomType, RoomStatus } from '../types/index.js';
import { api } from '../services/api.js';
import { ReceiptModal } from '../components/ReceiptModal.js';
import {
  Users,
  Building2,
  DollarSign,
  CalendarCheck,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  RotateCcw,
  Shield,
  FileText
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'bookings' | 'users'>('overview');

  // Filter/search for bookings
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');

  // Modals
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  // New/Edit Room Form state
  const [roomNumber, setRoomNumber] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState<RoomType>('Deluxe');
  const [roomDescription, setRoomDescription] = useState('');
  const [roomPrice, setRoomPrice] = useState(250);
  const [roomCapacity, setRoomCapacity] = useState(2);
  const [roomAmenities, setRoomAmenities] = useState('Ocean View, High-Speed Wi-Fi, King Bed, Marble Bath');
  const [roomDestination, setRoomDestination] = useState('Malibu Coast');
  const [roomStatus, setRoomStatus] = useState<RoomStatus>('Available');
  const [roomSaveLoading, setRoomSaveLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, roomsRes, bookingsRes, usersRes] = await Promise.all([
        api.getAdminStats(),
        api.getRooms({ limit: 100 }),
        api.getAllBookings(),
        api.getAllUsers()
      ]);

      if (statsRes.stats) setStats(statsRes.stats);
      if (roomsRes.rooms) setRooms(roomsRes.rooms);
      if (bookingsRes.bookings) setBookings(bookingsRes.bookings);
      if (usersRes.users) setUsers(usersRes.users);
    } catch (err) {
      console.error('Failed to load admin dataset', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddRoom = () => {
    setEditingRoom(null);
    setRoomNumber(String(Math.floor(100 + Math.random() * 800)));
    setRoomName('');
    setRoomType('Deluxe');
    setRoomDescription('');
    setRoomPrice(280);
    setRoomCapacity(2);
    setRoomAmenities('Ocean View, High-Speed Wi-Fi, King Bed, Marble Bath');
    setRoomDestination('Malibu Coast');
    setRoomStatus('Available');
    setIsAddingRoom(true);
  };

  const handleOpenEditRoom = (r: Room) => {
    setEditingRoom(r);
    setRoomNumber(r.roomNumber);
    setRoomName(r.name);
    setRoomType(r.type);
    setRoomDescription(r.description);
    setRoomPrice(r.pricePerNight);
    setRoomCapacity(r.capacity);
    setRoomAmenities(r.amenities.join(', '));
    setRoomDestination(r.destination);
    setRoomStatus(r.status);
    setIsAddingRoom(true);
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setRoomSaveLoading(true);
    try {
      const amenitiesArr = roomAmenities.split(',').map(s => s.trim()).filter(Boolean);
      if (editingRoom) {
        await api.updateRoom(editingRoom._id, {
          roomNumber,
          name: roomName,
          type: roomType,
          description: roomDescription,
          pricePerNight: roomPrice,
          capacity: roomCapacity,
          amenities: amenitiesArr,
          destination: roomDestination,
          status: roomStatus
        });
      } else {
        await api.createRoom({
          roomNumber,
          name: roomName,
          type: roomType,
          description: roomDescription,
          pricePerNight: roomPrice,
          capacity: roomCapacity,
          amenities: amenitiesArr,
          destination: roomDestination,
          status: roomStatus,
          images: ['/src/assets/images/room_deluxe_ocean_1793170449247.jpg']
        });
      }
      setIsAddingRoom(false);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to save room.');
    } finally {
      setRoomSaveLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!window.confirm('Are you sure you want to delete this room? Existing reservations will remain intact.')) return;
    try {
      await api.deleteRoom(roomId);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete room');
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      await api.updateBookingStatus(bookingId, { bookingStatus: status });
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      await api.updateUserRole(userId, role);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleResetDemo = async () => {
    if (!window.confirm('Reset database to clean luxury demo dataset?')) return;
    try {
      await api.resetDemoData();
      await fetchData();
      alert('Database restored to default demo state.');
    } catch (err: any) {
      alert(err.message || 'Reset failed');
    }
  };

  // Filtered bookings
  const filteredBookings = bookings.filter(b => {
    const matchStatus = bookingStatusFilter === 'all' || b.bookingStatus.toLowerCase() === bookingStatusFilter.toLowerCase();
    const matchSearch = !bookingSearch ||
      b.bookingReference.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.guestName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.guestEmail.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-1">
            Enterprise Operations
          </span>
          <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-teal-800" />
            <span>HotelPro Executive Management Console</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage inventory, reservations, guests, staff access, and financial performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDemo}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Reset to default seed records"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>Reset Demo DB</span>
          </button>
          <button
            onClick={handleOpenAddRoom}
            className="px-4 py-2 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Suite</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
              ${stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-[10px] text-emerald-700 mt-1 font-medium">Verified payments</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Active Stays</span>
              <CalendarCheck className="w-4 h-4 text-teal-600" />
            </div>
            <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
              {stats.activeReservations}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Confirmed & in-house</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Occupancy Rate</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
              {stats.occupancyRate}%
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              {stats.totalRooms - stats.availableRooms} of {stats.totalRooms} rooms filled
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Inventory</span>
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
              {stats.totalRooms}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{stats.availableRooms} available</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Registered Users</span>
              <Users className="w-4 h-4 text-slate-600" />
            </div>
            <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
              {stats.totalUsers}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Guests, staff & admins</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Analytics & Recent Bookings
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'rooms' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Rooms & Suites Inventory ({rooms.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'bookings' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Reservations ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          User Accounts & Roles ({users.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Live Reservation Stream
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Guest</th>
                    <th className="pb-3">Room</th>
                    <th className="pb-3">Dates</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.slice(0, 8).map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/80">
                      <td className="py-3 font-mono font-bold text-teal-800">{b.bookingReference}</td>
                      <td className="py-3 font-medium text-slate-800">{b.guestName}</td>
                      <td className="py-3 text-slate-600">{b.room?.name || 'Suite'}</td>
                      <td className="py-3 text-slate-500">{b.checkIn}</td>
                      <td className="py-3 font-mono font-semibold text-slate-900 tabular-nums">
                        ${b.totalAmount.toFixed(0)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          b.bookingStatus === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                          b.bookingStatus === 'Checked In' ? 'bg-teal-50 text-teal-700' :
                          b.bookingStatus === 'Cancelled' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue Distribution Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Verified Revenue Flow
            </h3>
            <p className="text-xs text-slate-500">
              Calculated dynamically from confirmed customer payments
            </p>
            <div className="space-y-4 pt-4">
              {stats?.revenueByMonth && Object.entries(stats.revenueByMonth).map(([month, val]) => (
                <div key={month} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{month} 2026</span>
                    <span className="font-mono font-bold text-teal-800">${val.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-700 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(15, (val / (stats.totalRevenue || 1)) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Available Rooms</span>
                <span className="font-mono font-semibold text-slate-900">{stats?.availableRooms}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Occupied Suites</span>
                <span className="font-mono font-semibold text-slate-900">{stats ? stats.totalRooms - stats.availableRooms : 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Rooms Management */}
      {activeTab === 'rooms' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">Room & Suite Catalog</h3>
              <p className="text-xs text-slate-500">Add, edit pricing, manage capacity, and toggle room availability</p>
            </div>
            <button
              onClick={handleOpenAddRoom}
              className="px-4 py-2 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Suite</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Suite Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Nightly Rate</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.roomNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{r.name}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{r.description}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{r.type}</td>
                    <td className="py-3 px-4 text-slate-600">{r.destination}</td>
                    <td className="py-3 px-4 font-mono font-bold text-teal-800">${r.pricePerNight}</td>
                    <td className="py-3 px-4 text-slate-600">{r.capacity} Guests</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        r.status === 'Available' ? 'bg-emerald-50 text-emerald-700' :
                        r.status === 'Occupied' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditRoom(r)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Suite"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(r._id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Suite"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: All Bookings Management */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">Reservations Management</h3>
              <p className="text-xs text-slate-500">Search and transition booking lifecycle statuses</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search ref or guest..."
                  className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700"
                />
              </div>

              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Checked In">Checked In</option>
                <option value="Checked Out">Checked Out</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Folio Ref</th>
                  <th className="py-3 px-4">Guest Info</th>
                  <th className="py-3 px-4">Suite</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Stay Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-teal-800">{b.bookingReference}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{b.guestName}</p>
                      <p className="text-[11px] text-slate-400">{b.guestEmail}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{b.room?.name || 'Suite'}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {b.checkIn} to {b.checkOut} ({b.numberOfNights}n)
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900 tabular-nums">
                      ${b.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        b.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={b.bookingStatus}
                        onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-1 font-semibold text-slate-800"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Checked In">Checked In</option>
                        <option value="Checked Out">Checked Out</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setReceiptBooking(b)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 ml-auto"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Folio</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: User Accounts & Roles */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">User Directory & Role Control</h3>
            <p className="text-xs text-slate-500">Assign administrative or staff privileges securely</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Role Privileges</th>
                  <th className="py-3 px-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3 px-4 text-slate-500">{u.phone || '—'}</td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                        className={`text-xs border rounded-lg p-1 font-semibold ${
                          u.role === 'admin' ? 'bg-indigo-50 border-indigo-200 text-indigo-800' :
                          u.role === 'staff' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                          'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <option value="guest">Guest</option>
                        <option value="staff">Hotel Staff</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Room Modal */}
      {isAddingRoom && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900">
              {editingRoom ? `Edit Suite #${editingRoom.roomNumber}` : 'Add New Luxury Suite'}
            </h3>

            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Suite #</label>
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. 402"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as RoomType)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Family Room">Family Room</option>
                    <option value="Luxury Suite">Luxury Suite</option>
                    <option value="Presidential Villa">Presidential Villa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Suite Name</label>
                <input
                  type="text"
                  required
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g. Azure Sovereign Oceanfront Retreat"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  placeholder="Bespoke artisan interiors, private terrace..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nightly Price ($)</label>
                  <input
                    type="number"
                    required
                    min="50"
                    value={roomPrice}
                    onChange={(e) => setRoomPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Guests</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={roomCapacity}
                    onChange={(e) => setRoomCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={roomStatus}
                    onChange={(e) => setRoomStatus(e.target.value as RoomStatus)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amenities (Comma-separated)</label>
                <input
                  type="text"
                  value={roomAmenities}
                  onChange={(e) => setRoomAmenities(e.target.value)}
                  placeholder="Ocean View, King Bed, Marble Bath, Espresso Machine"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Destination</label>
                <input
                  type="text"
                  value={roomDestination}
                  onChange={(e) => setRoomDestination(e.target.value)}
                  placeholder="Malibu Coast"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingRoom(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={roomSaveLoading}
                  className="px-5 py-2 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold disabled:opacity-60"
                >
                  {roomSaveLoading ? 'Saving...' : 'Save Suite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Folio Receipt Modal */}
      <ReceiptModal booking={receiptBooking} onClose={() => setReceiptBooking(null)} />
    </div>
  );
};
