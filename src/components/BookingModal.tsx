import React, { useState } from 'react';
import { Room, Booking } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { X, Calendar, CreditCard, ShieldCheck, CheckCircle2, ArrowRight, User as UserIcon, Phone, Mail, FileText } from 'lucide-react';

interface BookingModalProps {
  room: Room | null;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  room,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user, isAuthenticated } = useAuth();

  // Booking details
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const fourDaysLater = new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(initialCheckIn || tomorrow);
  const [checkOut, setCheckOut] = useState(initialCheckOut || fourDaysLater);
  const [numberOfGuests, setNumberOfGuests] = useState(initialGuests || 2);
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment method
  const [paymentProvider, setPaymentProvider] = useState<'razorpay' | 'card_simulator'>('razorpay');

  // Steps: 'form' -> 'processing' -> 'success'
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !room) return null;

  // Nights calculation
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const subtotal = room.pricePerNight * nights;
  const taxes = parseFloat((subtotal * 0.12).toFixed(2));
  const totalAmount = parseFloat((subtotal + taxes).toFixed(2));

  const handleCreateAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      // 1. Create booking on server
      const bookingRes = await api.createBooking({
        roomId: room._id,
        checkIn,
        checkOut,
        numberOfGuests,
        guestName: guestName || user?.name || 'Guest Traveler',
        guestEmail: guestEmail || user?.email || 'guest@hotelpro.com',
        guestPhone,
        specialRequests
      });

      const newBooking = bookingRes.booking;

      // 2. Create payment order on server
      setStep('processing');
      const orderRes = await api.createPaymentOrder(newBooking._id, paymentProvider);

      // 3. Simulate Razorpay sandbox processing delay (realistic UX)
      await new Promise(r => setTimeout(r, 1200));

      // 4. Verify payment on server
      const verifyRes = await api.verifyPayment({
        bookingId: newBooking._id,
        provider: paymentProvider,
        providerOrderId: orderRes.order.id,
        providerPaymentId: `pay_rzp_mock_${Math.random().toString(36).substring(2, 9)}`,
        providerSignature: `sig_mock_${Math.random().toString(36).substring(2, 9)}`
      });

      setConfirmedBooking(verifyRes.booking);
      setStep('success');
      onSuccess(verifyRes.booking);
    } catch (err: any) {
      setStep('form');
      setErrorMessage(err.message || 'Booking or payment verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              {step === 'success' ? 'Reservation Confirmed' : 'Complete Your Reservation'}
            </h3>
            <p className="text-xs text-slate-500">
              {room.name} · Suite #{room.roomNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step: Success */}
        {step === 'success' && confirmedBooking && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-2xl font-bold text-slate-900">
                You're All Set!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your reservation at <span className="font-medium text-slate-900">{room.name}</span> has been confirmed. A receipt and confirmation email has been dispatched.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 max-w-md mx-auto text-left space-y-3">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Booking Reference</span>
                <span className="font-mono font-bold text-teal-800 text-sm tracking-wider">
                  {confirmedBooking.bookingReference}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Check-In</span>
                  <span className="font-medium text-slate-800">{confirmedBooking.checkIn} (3:00 PM)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Check-Out</span>
                  <span className="font-medium text-slate-800">{confirmedBooking.checkOut} (11:00 AM)</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                <span className="text-slate-500">Total Paid (Taxes Included)</span>
                <span className="font-display font-bold text-slate-900 text-sm tabular-nums">
                  ${confirmedBooking.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Close & View My Bookings
              </button>
            </div>
          </div>
        )}

        {/* Step: Processing */}
        {step === 'processing' && (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h4 className="font-display text-lg font-bold text-slate-900">
              Processing Secure Payment...
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Verifying order signatures via {paymentProvider === 'razorpay' ? 'Razorpay Test Sandbox' : 'Card Processor'}. Please do not refresh.
            </p>
          </div>
        )}

        {/* Step: Form */}
        {step === 'form' && (
          <form onSubmit={handleCreateAndPay} className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Date and Guest Selection */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                <Calendar className="w-4 h-4 text-teal-700" />
                <span>Stay Dates & Guest Count</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Check-In</label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Check-Out</label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Guests</label>
                  <select
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700"
                  >
                    {Array.from({ length: room.capacity }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} Guest{i > 0 ? 's' : ''} (Max {room.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Guest Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Guest Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Primary Guest Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Julian Vance"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Contact Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="guest@hotelpro.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Phone Number (For arrival concierge)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Special Requests (Optional)</label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Early check-in requested, high floor preferred, hypoallergenic pillows..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700 resize-none"
                />
              </div>
            </div>

            {/* Payment Integration Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-teal-700" />
                  <span>Payment Gateway (Test Mode)</span>
                </h4>
                <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                  Sandbox Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentProvider('razorpay')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentProvider === 'razorpay'
                      ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">Razorpay Test Mode</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">UPI, Cards & NetBanking simulation</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentProvider('card_simulator')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentProvider === 'card_simulator'
                      ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">Instant Card Simulator</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Visa / Mastercard test token</p>
                </button>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>${room.pricePerNight} × {nights} Night{nights > 1 ? 's' : ''}</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Hospitality & Municipal Tax (12%)</span>
                <span className="font-mono tabular-nums">${taxes.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-sm text-slate-900">
                <span>Total Due</span>
                <span className="font-display text-base tabular-nums text-teal-800">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
              >
                <span>Pay & Confirm Reservation (${totalAmount.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Encrypted 256-bit server transaction</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
