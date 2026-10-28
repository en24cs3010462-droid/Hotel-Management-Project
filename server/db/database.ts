import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { IUser, IRoom, IBooking, IPayment, IReview } from '../models/types.js';

interface DatabaseSchema {
  users: IUser[];
  rooms: IRoom[];
  bookings: IBooking[];
  payments: IPayment[];
  reviews: IReview[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'hotelpro_db.json');

class JSONDatabase {
  private data: DatabaseSchema = {
    users: [],
    rooms: [],
    bookings: [],
    payments: [],
    reviews: []
  };

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse database file, re-initializing seeds', err);
        this.seedInitialData();
      }
    } else {
      this.seedInitialData();
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save database file', err);
    }
  }

  public seedInitialData() {
    const salt = bcrypt.genSaltSync(10);
    const adminPasswordHash = bcrypt.hashSync('Admin@123', salt);
    const staffPasswordHash = bcrypt.hashSync('Staff@123', salt);
    const guestPasswordHash = bcrypt.hashSync('Guest@123', salt);

    const now = new Date().toISOString();

    const users: IUser[] = [
      {
        _id: 'usr_admin_1',
        name: 'Alexander Sterling',
        email: 'admin@hotelpro.com',
        phone: '+1 (555) 234-5678',
        passwordHash: adminPasswordHash,
        role: 'admin',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        createdAt: now,
        updatedAt: now
      },
      {
        _id: 'usr_staff_1',
        name: 'Elena Rostova',
        email: 'staff@hotelpro.com',
        phone: '+1 (555) 345-6789',
        passwordHash: staffPasswordHash,
        role: 'staff',
        profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        createdAt: now,
        updatedAt: now
      },
      {
        _id: 'usr_guest_1',
        name: 'Julian Vance',
        email: 'guest@hotelpro.com',
        phone: '+1 (555) 987-6543',
        passwordHash: guestPasswordHash,
        role: 'guest',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        createdAt: now,
        updatedAt: now
      }
    ];

    const rooms: IRoom[] = [
      {
        _id: 'room_101',
        roomNumber: '101',
        name: 'Azure Deluxe Oceanfront Suite',
        type: 'Deluxe',
        description: 'Wake up to unobstructed sunrise views over the sapphire waters. Features a private glass-front balcony, hand-carved teak furnishings, Italian marble en-suite bathroom with deep soaking tub, and custom Egyptian cotton linens.',
        pricePerNight: 280,
        capacity: 2,
        amenities: ['Ocean View', 'Private Balcony', 'High-Speed Wi-Fi', 'King Bed', 'Marble Bath', 'Espresso Machine', '24/7 Room Service', 'Mini Bar'],
        images: [
          '/src/assets/images/room_deluxe_ocean_1793170449247.jpg',
          '/src/assets/images/hero_hotel_resort_1793170447914.jpg'
        ],
        status: 'Available',
        destination: 'Malibu Coast',
        rating: 4.9,
        numReviews: 24,
        featured: true,
        createdAt: now,
        updatedAt: now
      },
      {
        _id: 'room_204',
        roomNumber: '204',
        name: 'The Sovereign Executive Skyline Suite',
        type: 'Suite',
        description: 'An architectural sanctuary tailored for discerning executives and travelers. Boasting panoramic skyline views at twilight, separate salon lounge area, walk-in dressing wardrobe, and complimentary sommelier selection upon arrival.',
        pricePerNight: 420,
        capacity: 3,
        amenities: ['Skyline View', 'Separate Lounge', 'Executive Desk', 'Complimentary Champagne', 'Smart Home Controls', 'Rain Shower', 'Valet Parking', 'Airport Transfer'],
        images: [
          '/src/assets/images/room_executive_suite_1793170449292.jpg',
          '/src/assets/images/hero_hotel_resort_1793170447914.jpg'
        ],
        status: 'Available',
        destination: 'New York Central',
        rating: 4.95,
        numReviews: 38,
        featured: true,
        createdAt: now,
        updatedAt: now
      },
      {
        _id: 'room_501',
        roomNumber: '501',
        name: 'Laguna Presidential Infinity Villa',
        type: 'Presidential Villa',
        description: 'The pinnacle of bespoke luxury hospitality. A standalone residence featuring a private heated infinity plunge pool on a private sun deck, high vaulted timber ceilings, artisan stone hearth, dedicated butler service, and private yacht pier access.',
        pricePerNight: 850,
        capacity: 4,
        amenities: ['Private Infinity Pool', 'Dedicated Butler', 'Private Sun Deck', 'Chef Kitchen', 'Panoramic Ocean View', 'Cathedral Ceilings', 'Complimentary Spa Access', 'Helipad Access'],
        images: [
          '/src/assets/images/room_presidential_villa_1793170448795.jpg',
          '/src/assets/images/room_deluxe_ocean_1793170449247.jpg'
        ],
        status: 'Available',
        destination: 'Maui Resort Bay',
        rating: 5.0,
        numReviews: 19,
        featured: true,
        createdAt: now,
        updatedAt: now
      },
      {
        _id: 'room_108',
        roomNumber: '108',
        name: 'Haven Coastal Family Suite',
        type: 'Family Room',
        description: 'Generously proportioned two-bedroom retreat designed for modern families. Includes a master king bedroom, adjoining twin bedroom, private garden terrace, child-safe gaming media zone, and curated artisanal snack pantry.',
        pricePerNight: 350,
        capacity: 5,
        amenities: ['Garden Terrace', 'Two Bedrooms', 'Kid Entertainment Center', 'Full Kitchenette', 'Bathtub & Shower', 'Beach Gear Provided', 'Washer & Dryer', 'Complimentary Breakfast'],
        images: [
          '/src/assets/images/hero_hotel_resort_1793170447914.jpg',
          '/src/assets/images/room_deluxe_ocean_1793170449247.jpg'
        ],
        status: 'Available',
        destination: 'Malibu Coast',
        rating: 4.85,
        numReviews: 31,
        featured: false,
        createdAt: now,
        updatedAt: now
      },
      {
        _id: 'room_102',
        roomNumber: '102',
        name: 'Heritage Classic King Standard',
        type: 'Standard',
        description: 'Thoughtfully curated boutique comfort. Features custom acoustic soundproofing, plush hypoallergenic king mattress, organic Malin+Goetz bath amenities, and a serene courtyard garden view.',
        pricePerNight: 190,
        capacity: 2,
        amenities: ['Courtyard View', 'King Bed', 'Soundproof Windows', 'Fast Wi-Fi', 'Smart TV', 'Workstation', 'Organic Bath Toiletries'],
        images: [
          '/src/assets/images/room_deluxe_ocean_1793170449247.jpg'
        ],
        status: 'Available',
        destination: 'Santa Barbara',
        rating: 4.75,
        numReviews: 42,
        featured: false,
        createdAt: now,
        updatedAt: now
      },
      {
        _id: 'room_305',
        roomNumber: '305',
        name: 'The Grand Panorama Luxury Suite',
        type: 'Luxury Suite',
        description: 'Expansive wrap-around glass corner suite overlooking coastal cliffs and tranquil ocean vistas. Includes private sunset terrace with fire bowl, dual walk-in dressing suites, and bespoke evening mixologist service.',
        pricePerNight: 580,
        capacity: 3,
        amenities: ['Wrap-around Glass Balcony', 'Outdoor Fire Bowl', 'Evening Mixology', 'Deep Soaking Jacuzzi', 'Pillow Menu', 'Breakfast in Bed', 'Chauffeured Limousine'],
        images: [
          '/src/assets/images/room_executive_suite_1793170449292.jpg',
          '/src/assets/images/hero_hotel_resort_1793170447914.jpg'
        ],
        status: 'Available',
        destination: 'Maui Resort Bay',
        rating: 4.98,
        numReviews: 29,
        featured: true,
        createdAt: now,
        updatedAt: now
      }
    ];

    const bookings: IBooking[] = [
      {
        _id: 'bk_sample_1',
        bookingReference: 'HP-84291',
        userId: 'usr_guest_1',
        roomId: 'room_101',
        guestName: 'Julian Vance',
        guestEmail: 'guest@hotelpro.com',
        guestPhone: '+1 (555) 987-6543',
        checkIn: '2026-11-10',
        checkOut: '2026-11-14',
        numberOfGuests: 2,
        numberOfNights: 4,
        subtotal: 1120,
        taxes: 134.4,
        totalAmount: 1254.4,
        bookingStatus: 'Confirmed',
        paymentStatus: 'Paid',
        specialRequests: 'High floor preferred, arriving around 3 PM.',
        createdAt: '2026-10-20T10:00:00.000Z',
        updatedAt: '2026-10-20T10:05:00.000Z'
      },
      {
        _id: 'bk_sample_2',
        bookingReference: 'HP-91304',
        userId: 'usr_guest_1',
        roomId: 'room_204',
        guestName: 'Julian Vance',
        guestEmail: 'guest@hotelpro.com',
        guestPhone: '+1 (555) 987-6543',
        checkIn: '2026-09-01',
        checkOut: '2026-09-04',
        numberOfGuests: 2,
        numberOfNights: 3,
        subtotal: 1260,
        taxes: 151.2,
        totalAmount: 1411.2,
        bookingStatus: 'Completed',
        paymentStatus: 'Paid',
        checkedInAt: '2026-09-01T14:30:00.000Z',
        checkedOutAt: '2026-09-04T11:00:00.000Z',
        createdAt: '2026-08-15T09:00:00.000Z',
        updatedAt: '2026-09-04T11:00:00.000Z'
      }
    ];

    const payments: IPayment[] = [
      {
        _id: 'pay_1',
        bookingId: 'bk_sample_1',
        userId: 'usr_guest_1',
        provider: 'razorpay',
        providerOrderId: 'order_HP84291_DEMO',
        providerPaymentId: 'pay_rzp_mock_84291',
        amount: 1254.4,
        currency: 'USD',
        status: 'Paid',
        verifiedAt: '2026-10-20T10:05:00.000Z',
        createdAt: '2026-10-20T10:05:00.000Z'
      },
      {
        _id: 'pay_2',
        bookingId: 'bk_sample_2',
        userId: 'usr_guest_1',
        provider: 'card_simulator',
        providerOrderId: 'order_HP91304_DEMO',
        providerPaymentId: 'txn_card_91304',
        amount: 1411.2,
        currency: 'USD',
        status: 'Paid',
        verifiedAt: '2026-08-15T09:05:00.000Z',
        createdAt: '2026-08-15T09:05:00.000Z'
      }
    ];

    const reviews: IReview[] = [
      {
        _id: 'rev_1',
        userId: 'usr_guest_1',
        userName: 'Julian Vance',
        bookingId: 'bk_sample_2',
        roomId: 'room_204',
        rating: 5,
        comment: 'Exceeded all expectations! The skyline suite at twilight was breathtaking and the concierge team anticipated our every need. Truly world-class hospitality.',
        createdAt: '2026-09-05T12:00:00.000Z'
      },
      {
        _id: 'rev_2',
        userId: 'usr_guest_1',
        userName: 'Sophia Montgomery',
        bookingId: 'bk_sample_prior',
        roomId: 'room_101',
        rating: 5,
        comment: 'The ocean sound from the private terrace was pure bliss. Impeccable cleanliness, sublime breakfast, and the spa therapists were phenomenal.',
        createdAt: '2026-09-20T15:30:00.000Z'
      }
    ];

    this.data = { users, rooms, bookings, payments, reviews };
    this.save();
  }

  // Users
  public getUsers(): IUser[] {
    return this.data.users;
  }

  public findUserById(id: string): IUser | undefined {
    return this.data.users.find(u => u._id === id);
  }

  public findUserByEmail(email: string): IUser | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): IUser {
    const now = new Date().toISOString();
    const newUser: IUser = {
      ...user,
      _id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: now,
      updatedAt: now
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<IUser>): IUser | null {
    const idx = this.data.users.findIndex(u => u._id === id);
    if (idx === -1) return null;
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.users[idx];
  }

  // Rooms
  public getRooms(): IRoom[] {
    return this.data.rooms;
  }

  public findRoomById(id: string): IRoom | undefined {
    return this.data.rooms.find(r => r._id === id);
  }

  public createRoom(room: Omit<IRoom, '_id' | 'createdAt' | 'updatedAt' | 'rating' | 'numReviews'>): IRoom {
    const now = new Date().toISOString();
    const newRoom: IRoom = {
      ...room,
      _id: 'room_' + Date.now(),
      rating: 5.0,
      numReviews: 0,
      createdAt: now,
      updatedAt: now
    };
    this.data.rooms.push(newRoom);
    this.save();
    return newRoom;
  }

  public updateRoom(id: string, updates: Partial<IRoom>): IRoom | null {
    const idx = this.data.rooms.findIndex(r => r._id === id);
    if (idx === -1) return null;
    this.data.rooms[idx] = {
      ...this.data.rooms[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.rooms[idx];
  }

  public deleteRoom(id: string): boolean {
    const initialLen = this.data.rooms.length;
    this.data.rooms = this.data.rooms.filter(r => r._id !== id);
    if (this.data.rooms.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Availability validation
  public isRoomAvailable(roomId: string, checkIn: string, checkOut: string, excludeBookingId?: string): boolean {
    const reqStart = new Date(checkIn).getTime();
    const reqEnd = new Date(checkOut).getTime();

    if (isNaN(reqStart) || isNaN(reqEnd) || reqStart >= reqEnd) {
      return false;
    }

    const room = this.findRoomById(roomId);
    if (!room || room.status === 'Maintenance') {
      return false;
    }

    // Check all active bookings for this room
    const conflictingBooking = this.data.bookings.find(b => {
      if (b.roomId !== roomId) return false;
      if (excludeBookingId && b._id === excludeBookingId) return false;
      // If cancelled or already completed/checked-out, it does not conflict
      if (b.bookingStatus === 'Cancelled' || b.bookingStatus === 'Completed') return false;

      const bStart = new Date(b.checkIn).getTime();
      const bEnd = new Date(b.checkOut).getTime();

      // Overlap condition: start < bEnd and end > bStart
      return reqStart < bEnd && reqEnd > bStart;
    });

    return !conflictingBooking;
  }

  // Bookings
  public getBookings(): IBooking[] {
    return this.data.bookings;
  }

  public findBookingById(id: string): IBooking | undefined {
    return this.data.bookings.find(b => b._id === id);
  }

  public findBookingByRef(ref: string): IBooking | undefined {
    return this.data.bookings.find(b => b.bookingReference.toLowerCase() === ref.toLowerCase());
  }

  public findBookingsByUser(userId: string): IBooking[] {
    return this.data.bookings.filter(b => b.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createBooking(booking: Omit<IBooking, '_id' | 'bookingReference' | 'createdAt' | 'updatedAt'>): IBooking {
    const now = new Date().toISOString();
    const randomRef = 'HP-' + Math.floor(10000 + Math.random() * 90000);
    const newBooking: IBooking = {
      ...booking,
      _id: 'bk_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      bookingReference: randomRef,
      createdAt: now,
      updatedAt: now
    };
    this.data.bookings.push(newBooking);
    this.save();
    return newBooking;
  }

  public updateBooking(id: string, updates: Partial<IBooking>): IBooking | null {
    const idx = this.data.bookings.findIndex(b => b._id === id);
    if (idx === -1) return null;
    this.data.bookings[idx] = {
      ...this.data.bookings[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.bookings[idx];
  }

  // Payments
  public getPayments(): IPayment[] {
    return this.data.payments;
  }

  public createPayment(payment: Omit<IPayment, '_id' | 'createdAt'>): IPayment {
    const now = new Date().toISOString();
    const newPayment: IPayment = {
      ...payment,
      _id: 'pay_' + Date.now(),
      createdAt: now
    };
    this.data.payments.push(newPayment);
    this.save();
    return newPayment;
  }

  // Reviews
  public getReviews(): IReview[] {
    return this.data.reviews;
  }

  public getReviewsByRoom(roomId: string): IReview[] {
    return this.data.reviews.filter(r => r.roomId === roomId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createReview(review: Omit<IReview, '_id' | 'createdAt'>): IReview {
    const now = new Date().toISOString();
    const newReview: IReview = {
      ...review,
      _id: 'rev_' + Date.now(),
      createdAt: now
    };
    this.data.reviews.push(newReview);

    // Recalculate room rating
    const roomReviews = this.data.reviews.filter(r => r.roomId === review.roomId);
    const avg = roomReviews.reduce((acc, cur) => acc + cur.rating, 0) / roomReviews.length;
    this.updateRoom(review.roomId, {
      rating: parseFloat(avg.toFixed(2)),
      numReviews: roomReviews.length
    });

    this.save();
    return newReview;
  }
}

export const db = new JSONDatabase();
