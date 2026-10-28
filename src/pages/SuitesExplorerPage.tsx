import React, { useState } from 'react';
import { Room } from '../types/index.js';
import { RoomCard } from '../components/RoomCard.js';
import { Search, Filter, SlidersHorizontal, MapPin, Users, Calendar, RotateCcw } from 'lucide-react';

interface SuitesExplorerPageProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
  onBookRoom: (room: Room) => void;
  destination: string;
  setDestination: (val: string) => void;
  checkIn: string;
  setCheckIn: (val: string) => void;
  checkOut: string;
  setCheckOut: (val: string) => void;
  guests: number;
  setGuests: (val: number) => void;
  roomType: string;
  setRoomType: (val: string) => void;
  minPrice: number;
  setMinPrice: (val: number) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  selectedAmenity: string;
  setSelectedAmenity: (val: string) => void;
  onResetFilters: () => void;
}

export const SuitesExplorerPage: React.FC<SuitesExplorerPageProps> = ({
  rooms,
  onSelectRoom,
  onBookRoom,
  destination,
  setDestination,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  roomType,
  setRoomType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  selectedAmenity,
  setSelectedAmenity,
  onResetFilters
}) => {
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const amenitiesList = [
    'All',
    'Ocean View',
    'Private Balcony',
    'High-Speed Wi-Fi',
    'Private Infinity Pool',
    'Separate Lounge',
    'Marble Bath'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-1">
            Residences & Accommodations
          </span>
          <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
            Explore Available Suites & Villas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing {rooms.length} available luxury accommodations matching your preferences
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-700 shadow-sm"
          >
            <option value="featured">Featured & Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>

          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Filters & Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 space-y-6 ${showFiltersMobile ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-teal-700" />
                <span>Refine Stay</span>
              </h3>
              <button
                onClick={onResetFilters}
                className="text-[11px] text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                <span>Destination</span>
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Search city or coast..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700 bg-slate-50"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Suite Category</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700 bg-slate-50"
              >
                <option value="All">All Categories</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Family Room">Family Room</option>
                <option value="Luxury Suite">Luxury Suite</option>
                <option value="Presidential Villa">Presidential Villa</option>
              </select>
            </div>

            {/* Guest capacity */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-teal-700" />
                <span>Guest Capacity</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuests(num)}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      guests === num
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {num}+
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>Nightly Rate Cap</span>
                <span className="font-mono text-teal-800">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="150"
                max="1000"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>$150/night</span>
                <span>$1,000+/night</span>
              </div>
            </div>

            {/* Amenity Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Signature Amenity</label>
              <div className="space-y-1.5">
                {amenitiesList.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setSelectedAmenity(a === selectedAmenity ? 'All' : a)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedAmenity === a
                        ? 'bg-teal-50 text-teal-900 font-semibold border border-teal-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{a}</span>
                    {selectedAmenity === a && <span className="w-1.5 h-1.5 rounded-full bg-teal-700" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="lg:col-span-3">
          {rooms.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-800">
                No Suites Match Your Filters
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range or clearing destination filters to browse the complete collection.
              </p>
              <button
                onClick={onResetFilters}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onSelect={onSelectRoom}
                  onBook={onBookRoom}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
