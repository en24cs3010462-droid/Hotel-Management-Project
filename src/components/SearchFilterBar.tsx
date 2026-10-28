import React from 'react';
import { Search, Calendar, Users, MapPin, SlidersHorizontal } from 'lucide-react';

interface SearchFilterBarProps {
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
  onSearch: () => void;
  className?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
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
  onSearch,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 sm:p-4 ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center"
      >
        {/* Destination */}
        <div className="relative border-b sm:border-b-0 sm:border-r border-slate-100 pb-2 sm:pb-0 sm:pr-3">
          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-teal-600" />
            <span>Destination / Property</span>
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Malibu, Maui, New York..."
            className="w-full text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
          />
        </div>

        {/* Check-In */}
        <div className="relative border-b sm:border-b-0 sm:border-r border-slate-100 pb-2 sm:pb-0 sm:pr-3">
          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-teal-600" />
            <span>Check-In Date</span>
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full text-xs font-medium text-slate-900 focus:outline-none bg-transparent"
          />
        </div>

        {/* Check-Out */}
        <div className="relative border-b sm:border-b-0 sm:border-r border-slate-100 pb-2 sm:pb-0 sm:pr-3">
          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-teal-600" />
            <span>Check-Out Date</span>
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full text-xs font-medium text-slate-900 focus:outline-none bg-transparent"
          />
        </div>

        {/* Guests & Room Type */}
        <div className="relative pb-2 sm:pb-0 sm:pr-3">
          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1 flex items-center gap-1">
            <Users className="w-3 h-3 text-teal-600" />
            <span>Guests & Category</span>
          </label>
          <div className="flex items-center gap-2">
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="text-xs font-medium text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} Guest{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
            <span className="text-slate-300">·</span>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="text-xs font-medium text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="All">All Suites</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Family Room">Family Room</option>
              <option value="Luxury Suite">Luxury Suite</option>
              <option value="Presidential Villa">Presidential Villa</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3 px-5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span className="whitespace-nowrap">Find Available Stays</span>
          </button>
        </div>
      </form>
    </div>
  );
};
