import React, { useState } from 'react';
import { Building2, Mail, Phone, MapPin, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal-800 text-amber-400 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5 text-amber-300" />
              </div>
              <span className="font-display text-2xl font-semibold text-white tracking-tight">
                Hotel<span className="text-teal-400">Pro</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Curated luxury sanctuaries, coastal villas, and executive suites designed for unforgettable travel, private leisure, and effortless hospitality.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>One Sovereign Way, Malibu Coast & Central Destinations</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+1 (800) 555-HOTEL (24/7 Global Concierge)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>reservations@hotelpro.com</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Residences & Suites
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Oceanfront Suites</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Skyline Executive Suites</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Presidential Villas</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Family Garden Terraces</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Penthouse Panorama</span></li>
            </ul>
          </div>

          {/* Guest Services */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Guest Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Airport Chauffeur</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Private Dining & Butler</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Holistic Thermal Spa</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Flexible Cancellation</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Best Rate Guarantee</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Privilege Newsletter
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Receive private invitations, seasonal rate privileges, and new retreat releases.
            </p>
            {subscribed ? (
              <div className="p-3 bg-teal-900/50 border border-teal-700/50 rounded-lg text-teal-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>You are subscribed to private privileges.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Join Privilege Circle
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HotelPro Hospitality Group. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Safeguards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
