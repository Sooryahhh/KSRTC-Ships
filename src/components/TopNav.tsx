import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Bus, CheckCircle2, Truck, Menu } from 'lucide-react';
import { useShipment } from '../context/ShipmentContext';

export const TopNav: React.FC = () => {
  const {
    trackQuery,
    setTrackQuery,
    searchShipment,
    setActiveShipment,
    setActiveTab,
    notificationCount,
    resetNotifications,
    stationLogs,
    shipments,
    userProfile,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useShipment();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    const found = searchShipment(trackQuery);
    if (found) {
      setActiveShipment(found);
    }
    setActiveTab('Track');
    setShowMobileSearch(false);
  };

  const filteredSuggestions = trackQuery.trim()
    ? shipments.filter(
        (s) =>
          s.trackingNumber.toLowerCase().includes(trackQuery.toLowerCase()) ||
          s.receiverName.toLowerCase().includes(trackQuery.toLowerCase()) ||
          s.senderCity.toLowerCase().includes(trackQuery.toLowerCase())
      )
    : shipments.slice(0, 3);

  return (
    <header className="relative z-30 flex items-center justify-between pb-4 sm:pb-6 pt-1 gap-2 sm:gap-4">
      {/* Brand Logo & Mobile Menu Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Menu Button (Hamburger) with Liquid Glass styling */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden relative flex items-center justify-center w-10 h-10 rounded-2xl liquid-glass text-[#0f3b82] hover:text-blue-700 active:scale-95 transition-all shadow-sm border border-white/80"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 stroke-[2.4]" />
          {notificationCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-2 ring-white" />
          )}
        </button>

        <div 
          onClick={() => setActiveTab('Home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#1060cf] to-[#004bb5] text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Bus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0f3b82] font-sans leading-tight">
              KSRTC
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-blue-600/80 -mt-0.5">
              Parcel Logistics
            </span>
          </div>
        </div>
      </div>

      {/* Global Search Bar - Responsive */}
      <div className="relative flex-1 max-w-xl mx-2 sm:mx-6 hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-blue-400 pointer-events-none" />
            <input
              type="text"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Search Tracking, Shipment, or AWB No."
              className="w-full pl-12 pr-10 py-2.5 sm:py-3 bg-white/95 hover:bg-white text-sm font-medium text-slate-800 placeholder-slate-400 rounded-full border border-sky-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 shadow-sm transition-all"
            />
            {trackQuery && (
              <button
                type="button"
                onClick={() => setTrackQuery('')}
                className="absolute right-4 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </form>

        {/* Live Search Autocomplete Dropdown */}
        {isSearchFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-sky-100 p-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="text-[11px] font-semibold tracking-wider text-slate-400 px-3 py-1.5 uppercase">
              Matching Consignments
            </div>
            {filteredSuggestions.length === 0 ? (
              <div className="p-3 text-sm text-slate-500 text-center">
                No shipments found. Press Enter to search public tracking.
              </div>
            ) : (
              filteredSuggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onMouseDown={() => {
                    setTrackQuery(s.trackingNumber);
                    setActiveShipment(s);
                    setActiveTab('Track');
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        {s.trackingNumber}
                      </div>
                      <div className="text-xs text-slate-500">
                        {s.senderCity} → {s.receiverCity} ({s.receiverName})
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                    {s.status}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Mobile Search Trigger, Notifications & User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Search Icon Trigger */}
        <button
          type="button"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden w-10 h-10 rounded-full bg-white flex items-center justify-center border border-sky-100 shadow-sm text-slate-600 hover:text-blue-600 transition-colors"
          title="Search Tracking"
        >
          <Search className="w-4 h-4 text-blue-600" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              resetNotifications();
            }}
            className="relative w-10 h-10 rounded-full bg-white hover:bg-sky-50 flex items-center justify-center border border-sky-100 shadow-sm text-slate-600 hover:text-blue-600 transition-colors"
            title="Recent Station & Dispatch Alerts"
          >
            <Bell className="w-5 h-5 text-blue-600" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-sky-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2">
                <span className="text-sm font-bold text-slate-800">Operational Alerts</span>
                <span className="text-[11px] text-blue-600 font-medium cursor-pointer" onClick={() => setShowNotifications(false)}>Close</span>
              </div>
              <div className="mt-2 max-h-72 overflow-y-auto space-y-2">
                {stationLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{log.trackingNumber}</span>
                      <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                    </div>
                    <div className="text-blue-600 font-medium mt-0.5">{log.action}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{log.details}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Card with Malayali Hindu Name */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 sm:gap-3 pl-1 pr-2 sm:pr-3 py-1 bg-white hover:bg-sky-50 rounded-full border border-sky-100 shadow-sm transition-all"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden ring-2 ring-blue-500/20 bg-slate-200">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800 hidden sm:inline truncate max-w-[130px]">
              {userProfile.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-sky-100 p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-bold text-slate-800 text-sm">{userProfile.name}</div>
                <div className="text-slate-400 text-[11px]">{userProfile.email}</div>
                <div className="text-blue-600 font-semibold text-[11px] mt-0.5">
                  {userProfile.role}
                </div>
                <div className="text-slate-500 text-[10px] mt-0.5">
                  Depot: {userProfile.depot}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('History');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-sky-50 text-slate-700 font-medium"
              >
                My Consignment Bookings
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('Station View');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-sky-50 text-slate-700 font-medium"
              >
                Station Staff Inward Bay (SC-02)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('Shipments');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-sky-50 text-slate-700 font-medium"
              >
                Book New Bus Parcel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Expandable Bar */}
      {showMobileSearch && (
        <div className="absolute top-full left-0 right-0 mt-1 md:hidden bg-white p-3 rounded-2xl shadow-2xl border border-sky-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-blue-500 pointer-events-none" />
            <input
              type="text"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              placeholder="Ref No. (e.g. KSR-48213)"
              className="w-full pl-9 pr-16 py-2.5 bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1.5 bg-blue-600 active:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs"
            >
              Track
            </button>
          </form>

          {/* Quick Tap Pills on Mobile */}
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            <span className="text-slate-400 font-bold shrink-0">Quick:</span>
            {shipments.slice(0, 3).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setTrackQuery(s.trackingNumber);
                  setActiveShipment(s);
                  setActiveTab('Track');
                  setShowMobileSearch(false);
                }}
                className="px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold shrink-0 border border-blue-100 transition-colors"
              >
                {s.trackingNumber}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

