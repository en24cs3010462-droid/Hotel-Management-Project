import React, { useState, useEffect } from 'react';
import { Booking, Room } from '../types/index.js';
import { api } from '../services/api.js';
import { ReceiptModal } from '../components/ReceiptModal.js';
import { Briefcase, UserCheck, LogOut, Search, Clock, CheckCircle2, BedDouble, AlertCircle, FileText } from 'lucide-react';

export const StaffDashboardPage: React.FC = () => {
  const [arrivals, setArrivals] = useState<Booking[]>([]);
  const [departures, setDepartures] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<'arrivals' | 'departures' | 'rooms'>('arrivals');

  const fetchOperations = async () => {
    try {
      setLoading(true);
      const res = await api.getStaffOperations();
      if (res.arrivals) setArrivals(res.arrivals);
      if (res.departures) setDepartures(res.departures);
      if (res.rooms) setRooms(res.rooms);
    } catch (err) {
      console.error('Failed to fetch operations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperations();
  }, []);

  const handleCheckIn = async (bookingId: string) => {
    try {
      await api.updateBookingStatus(bookingId, { bookingStatus: 'Checked In' });
      await fetchOperations();
    } catch (err: any) {
      alert(err.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async (bookingId: string) => {
    try {
      await api.updateBookingStatus(bookingId, { bookingStatus: 'Completed' });
      await fetchOperations();
    } catch (err: any) {
      alert(err.message || 'Check-out failed');
    }
  };

  const handleToggleRoomStatus = async (room: Room, newStatus: 'Available' | 'Maintenance' | 'Occupied') => {
    try {
      await api.updateRoom(room._id, { status: newStatus });
      await fetchOperations();
    } catch (err: any) {
      alert(err.message || 'Failed to update room status');
    }
  };

  const filteredArrivals = arrivals.filter(b =>
    !searchQuery ||
    b.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.guestName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDepartures = departures.filter(b =>
    !searchQuery ||
    b.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.guestName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
            Operational Desk
          </span>
          <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-amber-600" />
            <span>Front Desk & Hospitality Concierge</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Guest check-in & check-out workflows, arrival logistics, and housekeeping readiness
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference HP-... or guest"
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-amber-600 bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('arrivals')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'arrivals' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Expected Arrivals ({arrivals.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('departures')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'departures' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <LogOut className="w-3.5 h-3.5 text-amber-400" />
          <span>In-House & Departures ({departures.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'rooms' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BedDouble className="w-3.5 h-3.5 text-indigo-400" />
          <span>Room Housekeeping Grid ({rooms.length})</span>
        </button>
      </div>

      {/* Tab: Arrivals */}
      {activeTab === 'arrivals' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Arrivals Pending Check-In
            </h3>
            <span className="text-xs text-slate-500">Standard check-in starts at 15:00</span>
          </div>

          {filteredArrivals.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No arrivals pending check-in.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ref #</th>
                    <th className="py-3 px-4">Guest Name</th>
                    <th className="py-3 px-4">Suite</th>
                    <th className="py-3 px-4">Stay Dates</th>
                    <th className="py-3 px-4">Special Requests</th>
                    <th className="py-3 px-4 text-right">Operational Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredArrivals.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-teal-800">{b.bookingReference}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{b.guestName}</p>
                        <p className="text-[11px] text-slate-400">{b.guestPhone || b.guestEmail}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800">{b.room?.name || 'Suite'}</span>
                        <span className="text-slate-400 block text-[11px]">Room #{b.room?.roomNumber}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {b.checkIn} to {b.checkOut} ({b.numberOfNights}n)
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {b.specialRequests || 'None specified'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setReceiptBooking(b)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg"
                            title="Folio"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCheckIn(b._id)}
                            className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Check-In Guest</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Departures */}
      {activeTab === 'departures' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-display text-lg font-bold text-slate-900">
              In-House Guests & Scheduled Departures
            </h3>
            <span className="text-xs text-slate-500">Standard check-out is 11:00</span>
          </div>

          {filteredDepartures.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No guests currently checked in.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ref #</th>
                    <th className="py-3 px-4">Guest</th>
                    <th className="py-3 px-4">Suite</th>
                    <th className="py-3 px-4">Checked In At</th>
                    <th className="py-3 px-4">Check-Out Date</th>
                    <th className="py-3 px-4 text-right">Operational Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDepartures.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-teal-800">{b.bookingReference}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{b.guestName}</td>
                      <td className="py-3 px-4 text-slate-800">
                        Room #{b.room?.roomNumber} · {b.room?.name}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {b.checkedInAt ? new Date(b.checkedInAt).toLocaleTimeString() : 'Earlier today'}
                      </td>
                      <td className="py-3 px-4 font-medium text-amber-800">{b.checkOut}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setReceiptBooking(b)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg"
                            title="Folio"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCheckOut(b._id)}
                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Complete Check-Out</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Room Housekeeping Grid */}
      {activeTab === 'rooms' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Housekeeping & Readiness Overview
            </h3>
            <span className="text-xs text-slate-500">Click to adjust room operational status</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((r) => (
              <div key={r._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 text-sm">Suite #{r.roomNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    r.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                    r.status === 'Occupied' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {r.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{r.name}</h4>
                  <p className="text-[11px] text-slate-500">{r.type} · Up to {r.capacity} guests</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">Set Status:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleRoomStatus(r, 'Available')}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                        r.status === 'Available' ? 'bg-emerald-700 text-white' : 'bg-white hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      Available
                    </button>
                    <button
                      onClick={() => handleToggleRoomStatus(r, 'Occupied')}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                        r.status === 'Occupied' ? 'bg-amber-600 text-white' : 'bg-white hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      Occupied
                    </button>
                    <button
                      onClick={() => handleToggleRoomStatus(r, 'Maintenance')}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                        r.status === 'Maintenance' ? 'bg-red-600 text-white' : 'bg-white hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      Maint.
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Folio Receipt Modal */}
      <ReceiptModal booking={receiptBooking} onClose={() => setReceiptBooking(null)} />
    </div>
  );
};
