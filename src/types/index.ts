export type UserRole = 'guest' | 'staff' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profileImage?: string;
  createdAt?: string;
}

export type RoomType = 'Standard' | 'Deluxe' | 'Suite' | 'Family Room' | 'Luxury Suite' | 'Presidential Villa';
export type RoomStatus = 'Available' | 'Occupied' | 'Maintenance';

export interface Room {
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
  createdAt?: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled' | 'Completed';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface Booking {
  _id: string;
  bookingReference: string;
  userId: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
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
  room?: Room | {
    name: string;
    roomNumber: string;
    type: string;
    images?: string[];
    destination?: string;
    pricePerNight?: number;
  };
}

export interface Review {
  _id: string;
  userId: string;
  userName: string;
  bookingId: string;
  roomId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalRooms: number;
  availableRooms: number;
  activeReservations: number;
  totalRevenue: number;
  occupancyRate: number;
  recentBookings: (Booking & { roomName: string; roomNumber: string })[];
  revenueByMonth: Record<string, number>;
}
