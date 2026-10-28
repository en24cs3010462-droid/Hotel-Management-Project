import React, { useState, useEffect } from 'react';
import { Booking } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { ReceiptModal } from '../components/ReceiptModal.js';
import { ReviewModal } from '../components/ReviewModal.js';
import { Calendar, FileText, Ban, Star, User, Lock, CheckCircle2, Clock, MapPin, AlertCircle } from 'lucide-react';

export const GuestDashboardPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled' | 'profile'>('upcoming');

  // Modal states
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  // Cancellation modal
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState('Change of travel plans');
  const [cancellingLoading, setCancellingLoading] = useState(false);

  // Profile editing
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await api.getMyBookings();
      if (res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingBooking) return;
    setCancellingLoading(true);
    try {
      await api.cancelBooking(cancellingBooking._id, cancellationReason);
      setCancellingBooking(null);
      await fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);
    try {
      await updateProfile({ name, phone });
      setProfileSuccess('Profile details updated successfully.');
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);
    try {
      await api.changePassword({ currentPassword, newPassword });
      setProfileSuccess('Account password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setProfileError(err.message || 'Failed to change password.');
    }
  };

  const upcomingBookings = bookings.filter(b => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Pending' || b.bookingStatus === 'Checked In');
  const completedBookings = bookings.filter(b => b.bookingStatus === 'Completed' || b.bookingStatus === 'Checked Out');
  const cancelledBookings = bookings.filter(b => b.bookingStatus === 'Cancelled');

  const totalSpent = bookings
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((acc, cur) => acc + cur.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-teal-400 block mb-1">
            Guest Portal
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Manage your bespoke reservations, folios, receipts, and stay preferences
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 text-center">
          <div>
            <p className="font-mono text-2xl font-bold text-white tabular-nums">{bookings.length}</p>
            <p className="text-[11px] text-slate-400">Total Stays</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-teal-400 tabular-nums">{upcomingBookings.length}</p>
            <p className="text-[11px] text-slate-400">Upcoming</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-amber-300 tabular-nums">${totalSpent.toFixed(0)}</p>
            <p className="text-[11px] text-slate-400">Total Value</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'upcoming'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Upcoming Itineraries ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'completed'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Past Stays ({completedBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'cancelled'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Cancelled ({cancelledBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Profile & Security
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading reservations...</div>
      ) : activeTab === 'upcoming' ? (
        upcomingBookings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-display text-lg font-bold text-slate-900">No Upcoming Reservations</h3>
            <p className="text-xs text-slate-500">You don't have any upcoming stays scheduled at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((b) => (
              <div key={b._id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono font-bold text-teal-800">{b.bookingReference}</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      {b.bookingStatus}
                    </span>
                    <span>·</span>
                    <span>{b.numberOfNights} Nights</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {b.room?.name || 'Luxury Suite'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-700" />
                      <span>{b.checkIn} to {b.checkOut}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-700" />
                      <span>{b.room?.destination || 'Malibu Coast'}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="text-right pr-2 hidden md:block">
                    <span className="text-[11px] text-slate-400 block">Total Amount</span>
                    <span className="font-display text-lg font-bold text-slate-900 tabular-nums">
                      ${b.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => setReceiptBooking(b)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>Folio Receipt</span>
                  </button>
                  <button
                    onClick={() => setCancellingBooking(b)}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Ban className="w-3.5 h-3.5 text-red-600" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'completed' ? (
        completedBookings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500">No completed stays recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedBookings.map((b) => (
              <div key={b._id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-mono font-bold text-slate-700">{b.bookingReference}</span>
                    <span>·</span>
                    <span className="text-slate-600 font-medium">Completed Stay</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900">{b.room?.name || 'Luxury Suite'}</h3>
                  <p className="text-xs text-slate-500 mt-1">{b.checkIn} — {b.checkOut}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setReviewBooking(b)}
                    className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>Review Stay</span>
                  </button>
                  <button
                    onClick={() => setReceiptBooking(b)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>View Folio</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'cancelled' ? (
        cancelledBookings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500">No cancelled bookings.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cancelledBookings.map((b) => (
              <div key={b._id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm opacity-80">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-slate-500">{b.bookingReference}</span>
                  <span className="text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded text-[11px]">
                    Cancelled
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-800">{b.room?.name || 'Luxury Suite'}</h3>
                <p className="text-xs text-slate-500 mt-1">Dates: {b.checkIn} to {b.checkOut}</p>
                {b.cancellationReason && (
                  <p className="text-xs text-slate-600 italic mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    Reason: {b.cancellationReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        /* Profile & Security Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-700" />
              <span>Personal Information</span>
            </h3>

            {profileSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {profileError}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Cannot be modified)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Save Profile Changes
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-teal-700" />
              <span>Change Password</span>
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password (Min 6 characters)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cancellation Modal Dialog */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-display text-lg font-bold text-slate-900">
                Cancel Reservation {cancellingBooking.bookingReference}?
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you wish to cancel this stay at <span className="font-semibold text-slate-900">{cancellingBooking.room?.name}</span>? Any refundable deposit will be credited back per hotel policy.
            </p>
            <form onSubmit={handleCancelBooking} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for cancellation</label>
                <select
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700"
                >
                  <option value="Change of travel plans">Change of travel plans</option>
                  <option value="Flight or transit rescheduling">Flight or transit rescheduling</option>
                  <option value="Medical or family emergency">Medical or family emergency</option>
                  <option value="Found alternative accommodation">Found alternative accommodation</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingBooking(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Keep Reservation
                </button>
                <button
                  type="submit"
                  disabled={cancellingLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold disabled:opacity-60"
                >
                  {cancellingLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Folio Receipt Modal */}
      <ReceiptModal booking={receiptBooking} onClose={() => setReceiptBooking(null)} />

      {/* Review Modal */}
      <ReviewModal
        booking={reviewBooking}
        isOpen={!!reviewBooking}
        onClose={() => setReviewBooking(null)}
        onReviewSubmitted={fetchBookings}
      />
    </div>
  );
};
