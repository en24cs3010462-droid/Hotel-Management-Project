import React from 'react';
import { Room } from '../types/index.js';
import { RoomCard } from '../components/RoomCard.js';
import { SearchFilterBar } from '../components/SearchFilterBar.js';
import { Sparkles, Award, ShieldCheck, Compass, UtensilsCrossed, Waves, ArrowRight, Star } from 'lucide-react';

interface HomePageProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
  onBookRoom: (room: Room) => void;
  onExploreAll: () => void;
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
}

export const HomePage: React.FC<HomePageProps> = ({
  rooms,
  onSelectRoom,
  onBookRoom,
  onExploreAll,
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
  onSearch
}) => {
  const featuredRooms = rooms.slice(0, 3);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center text-white overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_hotel_resort_1793170447914.jpg"
            alt="HotelPro Luxury Resort"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 pb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>The 2026 Sovereign Hospitality Collection</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-[1.15]" style={{ textWrap: 'balance' }}>
            Where Architectural Grandeur Meets Timeless Tranquility
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Discover curated coastal sanctuaries, panoramic city sky suites, and secluded private villas. Designed for effortless relaxation, refined dining, and bespoke stays.
          </p>

          {/* Quick buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onExploreAll}
              className="px-6 py-3 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-lg flex items-center gap-2"
            >
              <span>Explore All Residences</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('amenities-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/30 rounded-xl text-xs font-semibold tracking-wide transition-all"
            >
              The HotelPro Standard
            </button>
          </div>
        </div>

        {/* Floating Search Filter Bar at Bottom of Hero */}
        <div className="absolute bottom-4 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto translate-y-1/2">
          <SearchFilterBar
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
            onSearch={onSearch}
          />
        </div>
      </section>

      {/* Spacer for Search Bar overlap */}
      <div className="h-10 sm:h-12" />

      {/* Trust & Hospitality Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Five-Star Excellence</p>
              <p className="text-[11px] text-slate-500">Forbes Travel Verified 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Guaranteed Protection</p>
              <p className="text-[11px] text-slate-500">Flexible 48h zero-risk cancellation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">24/7 Dedicated Concierge</p>
              <p className="text-[11px] text-slate-500">Private transfers & dining curations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Pristine Waterfronts</p>
              <p className="text-[11px] text-slate-500">Exclusive private beach & piers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Suites Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-1">
              Curated Accommodations
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
              Featured Suites & Residences
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Each room has been individually appointed with bespoke artisan timber, imported marble, and panoramic floor-to-ceiling vistas.
            </p>
          </div>
          <button
            onClick={onExploreAll}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-900 transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>View All {rooms.length} Suites</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              onSelect={onSelectRoom}
              onBook={onBookRoom}
            />
          ))}
        </div>
      </section>

      {/* Experiences & Signature Amenities */}
      <section id="amenities-section" className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">
              Bespoke Experiences
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Hospitality Elevated to an Art Form
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every stay includes access to private wellness therapists, sommelier-curated tastings, and chauffeur services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-950 text-teal-400 flex items-center justify-center">
                <Waves className="w-6 h-6 text-teal-300" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">The Thalasso Thermal Spa</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hydrothermal pools, Himalayan salt grottos, and bespoke organic facial treatments formulated by Swiss dermatology laboratories.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Michelin-Inspired Dining</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Seasonal farm-to-table tasting menus with fresh coastal seafood pairings, served on your private ocean terrace or in our dining room.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center">
                <Compass className="w-6 h-6 text-indigo-300" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Private Yacht Charters</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Embark on private sunset sails, hidden cove snorkeling, and island explorations aboard the hotel's custom Hinckley cruiser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Perspectives / Social Proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block">
            Verified Impressions
          </span>
          <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
            Loved by Discerning Travelers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "The Azure Oceanfront Suite is peerless. Waking up to panoramic sea views and having espresso on our private sun terrace was heaven on earth."
            </p>
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900">Julian Vance</p>
              <p className="text-[11px] text-slate-500">Verified Stay · Azure Deluxe Suite</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Outstanding executive amenities. The high-speed connection, acoustic isolation, and sommelier bottle selection made my business retreat flawless."
            </p>
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900">Sophia Montgomery</p>
              <p className="text-[11px] text-slate-500">Verified Stay · Executive Skyline Suite</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "The presidential villa plunge pool looking out over the sunset was something out of a dream. HotelPro sets the gold standard for luxury hospitality."
            </p>
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900">Marcus Sterling</p>
              <p className="text-[11px] text-slate-500">Verified Stay · Presidential Villa</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
