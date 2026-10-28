import React, { useState, useEffect } from 'react';
import { Room, Review } from '../types/index.js';
import { api } from '../services/api.js';
import { X, Star, Users, Check, Calendar, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
  onBook: (room: Room, checkIn?: string, checkOut?: string, guests?: number) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ room, onClose, onBook }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Availability form inside modal
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const fourDaysLater = new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState(tomorrow);
  const [checkOut, setCheckOut] = useState(fourDaysLater);
  const [guestCount, setGuestCount] = useState(2);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<{ available: boolean; message: string } | null>(null);

  useEffect(() => {
    if (room) {
      setActiveImageIdx(0);
      setLoadingReviews(true);
      setAvailabilityResult(null);
      api.getRoomReviews(room._id)
        .then(res => {
          if (res.reviews) setReviews(res.reviews);
        })
        .catch(console.error)
        .finally(() => setLoadingReviews(false));
    }
  }, [room]);

  if (!room) return null;

  const handleCheckDates = async () => {
    if (!checkIn || !checkOut) return;
    setCheckingAvailability(true);
    try {
      const res = await api.checkAvailability(room._id, checkIn, checkOut);
      if (res.available) {
        setAvailabilityResult({
          available: true,
          message: 'Dates are open! This suite is available for your requested stay.'
        });
      } else {
        setAvailabilityResult({
          available: false,
          message: 'This suite has an existing confirmed reservation during those dates. Try adjusting dates.'
        });
      }
    } catch {
      setAvailabilityResult({
        available: false,
        message: 'Unable to check availability at this moment.'
      });
    } finally {
      setCheckingAvailability(false);
    }
  };

  const images = room.images && room.images.length > 0
    ? room.images
    : ['/src/assets/images/room_deluxe_ocean_1793170449247.jpg'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">{room.type}</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">Suite #{room.roomNumber}</span>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{room.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({room.numReviews} verified reviews)</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-8">
          {/* Main Visual Carousel */}
          <div className="space-y-3">
            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 shadow-inner">
              <img
                src={images[activeImageIdx]}
                alt={room.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIdx === idx ? 'border-teal-700 shadow-sm scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Description Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>{room.destination}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Accommodates {room.capacity} guests</span>
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                  {room.name}
                </h2>
              </div>

              <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                <p>{room.description}</p>
              </div>

              {/* Amenities Grid */}
              <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
                  Signature In-Suite Amenities
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-teal-700 stroke-[3]" />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Guest Reviews */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Verified Guest Reviews ({reviews.length})
                  </h4>
                </div>

                {loadingReviews ? (
                  <p className="text-xs text-slate-400">Loading verified impressions...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No reviews yet for this suite. Be the first to experience it.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev._id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-900">{rev.userName}</span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                        <p className="text-[10px] text-slate-400 mt-2">
                          Stay verified · {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Sidebar: Check Dates & Instant Reserve */}
            <div className="lg:col-span-1">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 sticky top-24 space-y-5">
                <div className="flex items-baseline justify-between border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Rate per night</span>
                    <span className="font-display text-3xl font-bold text-slate-900 tabular-nums">
                      ${room.pricePerNight}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">+12% taxes</span>
                </div>

                {/* Date Check Form */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-teal-700" />
                    <span>Check Live Availability</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1 font-medium">Check-In</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => {
                          setCheckIn(e.target.value);
                          setAvailabilityResult(null);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1 font-medium">Check-Out</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => {
                          setCheckOut(e.target.value);
                          setAvailabilityResult(null);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1 font-medium">Guests</label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700"
                    >
                      {Array.from({ length: room.capacity }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Guest{i > 0 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleCheckDates}
                    disabled={checkingAvailability}
                    className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-colors"
                  >
                    {checkingAvailability ? 'Verifying Calendar...' : 'Verify Dates'}
                  </button>

                  {availabilityResult && (
                    <div className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                      availabilityResult.available
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-amber-50 border border-amber-200 text-amber-800'
                    }`}>
                      {availabilityResult.message}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onBook(room, checkIn, checkOut, guestCount);
                      onClose();
                    }}
                    className="w-full py-3 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Proceed to Reservation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 mt-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>Free cancellation up to 48h prior</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
