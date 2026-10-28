export type UserRole = 'guest' | 'staff' | 'admin';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export type RoomType = 'Standard' | 'Deluxe' | 'Suite' | 'Family Room' | 'Luxury Suite' | 'Presidential Villa';
export type RoomStatus = 'Available' | 'Occupied' | 'Maintenance';

export interface IRoom {
  _id: string;
  roomNumber: string;
  name: string;
  type: RoomType;
  description: string;
  pricePerNight: number;
  capacity: number;
  amenities: string[];
  images: string[];
  status: RoomStatus;
  destination: string;
  rating: number;
  numReviews: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled' | 'Completed';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface IBooking {
  _id: string;
  bookingReference: string;
  userId: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  numberOfGuests: number;
  numberOfNights: number;
  subtotal: number;
  taxes: number;
  totalAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  cancellationReason?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPayment {
  _id: string;
  bookingId: string;
  userId: string;
  provider: 'razorpay' | 'card_simulator';
  providerOrderId: string;
  providerPaymentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  verifiedAt: string;
  createdAt: string;
}

export interface IReview {
  _id: string;
  userId: string;
  userName: string;
  bookingId: string;
  roomId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
