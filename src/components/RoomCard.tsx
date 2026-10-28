import React from 'react';
import { Room } from '../types/index.js';
import { Star, Users, ArrowRight } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
  onBook: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onSelect, onBook }) => {
  const primaryImage = room.images?.[0] || '/src/assets/images/room_deluxe_ocean_1793170449247.jpg';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Image Showcase */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={room.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle Destination Tag (Clean, single-line) */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-medium text-white tracking-wide">
          {room.destination}
        </div>
        
        {/* Star Rating Overlay */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-semibold text-slate-800 flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="tabular-nums">{room.rating.toFixed(1)}</span>
          <span className="text-slate-400 font-normal">({room.numReviews})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: unboxed with dot separators */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="font-semibold text-teal-700 uppercase tracking-wider text-[11px]">{room.type}</span>
            <span aria-hidden="true">·</span>
            <span>Suite #{room.roomNumber}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Up to {room.capacity} guests</span>
            </span>
          </div>

          <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-teal-800 transition-colors line-clamp-1 mb-2">
            {room.name}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {room.description}
          </p>

          {/* Key Amenities */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mb-6">
            {room.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-teal-600" />
                <span>{amenity}</span>
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-teal-700 font-medium">+{room.amenities.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Price & Action Module */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block">From</span>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                ${room.pricePerNight}
              </span>
              <span className="text-xs text-slate-500">/ night</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(room)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
            >
              Details
            </button>
            <button
              onClick={() => onBook(room)}
              className="px-4 py-2 bg-slate-900 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <span>Reserve</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
