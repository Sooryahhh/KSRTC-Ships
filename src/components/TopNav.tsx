import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Bus, CheckCircle2, Truck } from 'lucide-react';
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
    shipments
  } = useShipment();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    const found = searchShipment(trackQuery);
    if (found) {
      setActiveShipment(found);
    }
    setActiveTab('Track');
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
    <header className="relative z-30 flex items-center justify-between pb-6 pt-1">
      {/* Brand Logo */}
      <div 
        onClick={() => setActiveTab('Home')}
        className="flex items-center gap-3 cursor-pointer select-none group"
      >
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1060cf] to-[#004bb5] text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
          <Bus className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black tracking-tight text-[#0f3b82] font-sans">
            KSRTC
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600/80 -mt-1">
            Parcel Logistics
          </span>
        </div>
      </div>

      {/* Centered Global Search Bar */}
      <div className="relative flex-1 max-w-xl mx-6">
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
              className="w-full pl-12 pr-10 py-3 bg-white/95 hover:bg-white text-sm font-medium text-slate-800 placeholder-slate-400 rounded-full border border-sky-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 shadow-sm transition-all"
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

      {/* Right Controls: Notifications & User Profile */}
      <div className="flex items-center gap-4">
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
              <span className="absolute 1 top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-sky-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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

        {/* User Profile Card as shown in screenshot */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-1 pr-3 py-1 bg-white hover:bg-sky-50 rounded-full border border-sky-100 shadow-sm transition-all"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-blue-500/20 bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                alt="Ronald Richards"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-sm font-bold text-slate-800 hidden sm:inline">
              Ronald Richards
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-sky-100 p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-bold text-slate-800">Ronald Richards</div>
                <div className="text-slate-400 text-[11px]">ronald.richards@ksrtc.in</div>
                <div className="text-blue-600 font-semibold text-[11px] mt-0.5">Verified Depot Partner</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('History');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-sky-50 text-slate-700 font-medium"
              >
                My Bookings & History
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('Station View');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-sky-50 text-slate-700 font-medium"
              >
                Station Staff Inward Bay
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
