import React from 'react';
import { Booking } from '../types/index.js';
import { X, Printer, Building2, CheckCircle, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        {/* Actions Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Official Guest Folio & Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Folio</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 space-y-6 bg-white text-slate-800" id="printable-receipt">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-amber-300" />
                </div>
                <span className="font-display text-xl font-bold text-slate-900 tracking-tight">
                  Hotel<span className="text-teal-700">Pro</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">Luxury Stays & Private Residences</p>
              <p className="text-xs text-slate-400">One Sovereign Way, Malibu Coast</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block">Folio Reference</span>
              <span className="font-mono font-bold text-base text-slate-900">{booking.bookingReference}</span>
              <p className="text-[11px] text-slate-500 mt-1">Issued: {new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Guest and Stay Details */}
          <div className="grid grid-cols-2 gap-4 text-xs pb-4 border-b border-slate-100">
            <div>
              <h5 className="font-semibold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400 mb-1">
                Guest Information
              </h5>
              <p className="font-medium text-slate-800">{booking.guestName}</p>
              <p className="text-slate-500">{booking.guestEmail}</p>
              {booking.guestPhone && <p className="text-slate-500">{booking.guestPhone}</p>}
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400 mb-1">
                Stay Itinerary
              </h5>
              <p className="font-medium text-slate-800">Check-In: {booking.checkIn} (15:00)</p>
              <p className="font-medium text-slate-800">Check-Out: {booking.checkOut} (11:00)</p>
              <p className="text-slate-500">{booking.numberOfNights} Nights · {booking.numberOfGuests} Guests</p>
            </div>
          </div>

          {/* Room Item */}
          <div className="space-y-3">
            <h5 className="font-semibold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
              Reserved Accommodation
            </h5>
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>
                <p className="font-bold text-slate-900">{booking.room?.name || 'Luxury Suite'}</p>
                <p className="text-slate-500">{booking.room?.type || 'Deluxe'} · Suite #{booking.room?.roomNumber || '-'}</p>
              </div>
              <span className="font-mono font-semibold text-slate-800">${booking.subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-slate-600">
              <span>Room Subtotal ({booking.numberOfNights} Nights)</span>
              <span className="font-mono">${booking.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Hospitality, City & Resort Taxes (12%)</span>
              <span className="font-mono">${booking.taxes.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-sm text-slate-900">
              <span>Total Paid</span>
              <span className="font-display text-base text-teal-800 tabular-nums">
                ${booking.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment & Security Status */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">Payment Status: Verified ({booking.paymentStatus})</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Razorpay Verified</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-[10px] text-slate-400 text-center pt-2">
            Thank you for staying with HotelPro. For concierge assistance, dial 0 from your suite phone or call +1 (800) 555-HOTEL.
          </div>
        </div>
      </div>
    </div>
  );
};
