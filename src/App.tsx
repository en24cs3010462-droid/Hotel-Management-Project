import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { HomePage } from './pages/HomePage.js';
import { SuitesExplorerPage } from './pages/SuitesExplorerPage.js';
import { GuestDashboardPage } from './pages/GuestDashboardPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { StaffDashboardPage } from './pages/StaffDashboardPage.js';
import { RoomDetailModal } from './components/RoomDetailModal.js';
import { BookingModal } from './components/BookingModal.js';
import { AuthModal } from './components/AuthModal.js';
import { Room, Booking } from './types/index.js';
import { api } from './services/api.js';

function HotelProApp() {
  const { user, isAuthenticated, isAdmin, isStaff } = useAuth();

  // Navigation tab: 'home' | 'suites' | 'my-bookings' | 'staff' | 'admin'
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Rooms dataset
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState<boolean>(true);

  // Search & Filter state
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const fourDaysLater = new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0];

  const [destination, setDestination] = useState<string>('');
  const [checkIn, setCheckIn] = useState<string>(tomorrow);
  const [checkOut, setCheckOut] = useState<string>(fourDaysLater);
  const [guests, setGuests] = useState<number>(2);
  const [roomType, setRoomType] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedAmenity, setSelectedAmenity] = useState<string>('All');

  // Active Modals
  const [detailRoom, setDetailRoom] = useState<Room | null>(null);
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Fetch rooms with applied filters
  const fetchFilteredRooms = async () => {
    try {
      setLoadingRooms(true);
      const res = await api.getRooms({
        destination: destination || undefined,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        guests: guests || undefined,
        type: roomType !== 'All' ? roomType : undefined,
        minPrice: minPrice > 0 ? minPrice : undefined,
        maxPrice: maxPrice < 1000 ? maxPrice : undefined,
        amenity: selectedAmenity !== 'All' ? selectedAmenity : undefined,
        sort: sortBy !== 'featured' ? sortBy : undefined,
        limit: 50
      });
      if (res.rooms) {
        setRooms(res.rooms);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    fetchFilteredRooms();
  }, [destination, roomType, guests, maxPrice, sortBy, selectedAmenity]);

  const handleSearchTrigger = () => {
    fetchFilteredRooms();
    setCurrentTab('suites');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setDestination('');
    setCheckIn(tomorrow);
    setCheckOut(fourDaysLater);
    setGuests(2);
    setRoomType('All');
    setMinPrice(0);
    setMaxPrice(1000);
    setSortBy('featured');
    setSelectedAmenity('All');
  };

  const handleBookTrigger = (room: Room, customCheckIn?: string, customCheckOut?: string, customGuests?: number) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    if (customCheckIn) setCheckIn(customCheckIn);
    if (customCheckOut) setCheckOut(customCheckOut);
    if (customGuests) setGuests(customGuests);
    setBookingRoom(room);
  };

  // Safe navigation handler
  const handleTabChange = (tab: string) => {
    if (tab === 'my-bookings' && !isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    if (tab === 'admin' && !isAdmin) {
      setAuthModalOpen(true);
      return;
    }
    if (tab === 'staff' && !isStaff) {
      setAuthModalOpen(true);
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-800">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Content Pages */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            rooms={rooms}
            onSelectRoom={(r) => setDetailRoom(r)}
            onBookRoom={(r) => handleBookTrigger(r)}
            onExploreAll={() => setCurrentTab('suites')}
            destination={destination}
            setDestination={setDestination}
            checkIn={checkIn}
            setCheckIn={setCheckIn}
            checkOut={checkOut}
            setCheckOut={setCheckOut}
            guests={guests}
            setGuests={setGuests}
            roomType={roomType}
            setRoomType={setRoomType}
            onSearch={handleSearchTrigger}
          />
        )}

        {currentTab === 'suites' && (
          <SuitesExplorerPage
            rooms={rooms}
            onSelectRoom={(r) => setDetailRoom(r)}
            onBookRoom={(r) => handleBookTrigger(r)}
            destination={destination}
            setDestination={setDestination}
            checkIn={checkIn}
            setCheckIn={setCheckIn}
            checkOut={checkOut}
            setCheckOut={setCheckOut}
            guests={guests}
            setGuests={setGuests}
            roomType={roomType}
            setRoomType={setRoomType}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedAmenity={selectedAmenity}
            setSelectedAmenity={setSelectedAmenity}
            onResetFilters={handleResetFilters}
          />
        )}

        {currentTab === 'my-bookings' && <GuestDashboardPage />}

        {currentTab === 'staff' && <StaffDashboardPage />}

        {currentTab === 'admin' && <AdminDashboardPage />}
      </main>

      {/* Hospitality Footer */}
      <Footer />

      {/* Modals */}
      <RoomDetailModal
        room={detailRoom}
        onClose={() => setDetailRoom(null)}
        onBook={(room, cIn, cOut, gCount) => handleBookTrigger(room, cIn, cOut, gCount)}
      />

      <BookingModal
        room={bookingRoom}
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
        initialGuests={guests}
        isOpen={!!bookingRoom}
        onClose={() => setBookingRoom(null)}
        onSuccess={() => {
          fetchFilteredRooms();
        }}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HotelProApp />
    </AuthProvider>
  );
}
