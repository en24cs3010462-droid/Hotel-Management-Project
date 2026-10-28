import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Building2, User as UserIcon, Shield, Briefcase, CalendarCheck, LogOut, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAuth }) => {
  const { user, isAuthenticated, isAdmin, isStaff, logout, quickLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => {
            setCurrentTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
            <Building2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="font-display text-2xl font-semibold tracking-tight text-slate-900 block leading-tight">
              Hotel<span className="text-teal-700">Pro</span>
            </span>
            <span className="text-[11px] text-slate-700 uppercase tracking-widest block font-medium">
              Luxury Stays & Residences
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (single-line, concise) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => setCurrentTab('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'home' ? 'text-teal-700 font-semibold border-b-2 border-teal-700' : 'hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentTab('suites')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'suites' ? 'text-teal-700 font-semibold border-b-2 border-teal-700' : 'hover:text-slate-900'
            }`}
          >
            Suites & Villas
          </button>
          <button
            onClick={() => {
              setCurrentTab('home');
              setTimeout(() => {
                const el = document.getElementById('amenities-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors py-1"
          >
            Experiences & Spa
          </button>
          
          {isAuthenticated && (
            <button
              onClick={() => setCurrentTab('my-bookings')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                currentTab === 'my-bookings' ? 'text-teal-700 font-semibold border-b-2 border-teal-700' : 'hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-teal-600" />
              <span>My Reservations</span>
            </button>
          )}

          {isStaff && (
            <button
              onClick={() => setCurrentTab('staff')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                currentTab === 'staff' ? 'text-teal-700 font-semibold border-b-2 border-teal-700' : 'hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-amber-600" />
              <span>Front Desk</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                currentTab === 'admin' ? 'text-teal-700 font-semibold border-b-2 border-teal-700' : 'hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Admin Center</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-800"
              >
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                  {user.name.charAt(0)}
                </div>
                <span className="whitespace-nowrap max-w-[120px] truncate">{user.name}</span>
                <span className="text-[11px] text-teal-800 font-semibold capitalize bg-teal-50 px-1.5 py-0.5 rounded">
                  {user.role}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-100 py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-600">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentTab('my-bookings');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <CalendarCheck className="w-4 h-4 text-slate-400" />
                    <span>My Bookings</span>
                  </button>
                  {isStaff && (
                    <button
                      onClick={() => {
                        setCurrentTab('staff');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4 text-amber-500" />
                      <span>Staff Operations</span>
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setCurrentTab('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-indigo-500" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                Sign In / Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => {
              setCurrentTab('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-base font-medium text-slate-800"
          >
            Overview
          </button>
          <button
            onClick={() => {
              setCurrentTab('suites');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-base font-medium text-slate-800"
          >
            Suites & Villas
          </button>
          {isAuthenticated && (
            <button
              onClick={() => {
                setCurrentTab('my-bookings');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-base font-medium text-teal-700"
            >
              My Reservations
            </button>
          )}
          {isStaff && (
            <button
              onClick={() => {
                setCurrentTab('staff');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-base font-medium text-amber-700"
            >
              Staff Desk
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => {
                setCurrentTab('admin');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-base font-medium text-indigo-700"
            >
              Admin Dashboard
            </button>
          )}
          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-sm text-red-600 font-medium"
              >
                Sign Out ({user?.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium text-center"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
