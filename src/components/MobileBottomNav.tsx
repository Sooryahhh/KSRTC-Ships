import React from 'react';
import {
  Home,
  MapPin,
  PlusCircle,
  Building2,
  Menu,
  Clock,
  Package
} from 'lucide-react';
import { useShipment, ActiveTab } from '../context/ShipmentContext';

export const MobileBottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    notificationCount
  } = useShipment();

  return (
    <nav
      className="fixed bottom-3 left-3 right-3 z-40 md:hidden select-none"
      aria-label="Mobile Navigation Dock"
    >
      <div className="relative mx-auto max-w-md rounded-[28px] bg-slate-900/85 backdrop-blur-xl border border-white/20 p-1.5 shadow-2xl shadow-blue-950/40 flex items-center justify-between">
        {/* Specular glass reflection accent */}
        <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />

        {/* Home */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('Home');
            setIsMobileMenuOpen(false);
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-200 ${
            activeTab === 'Home'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white active:scale-95'
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Home</span>
        </button>

        {/* Track */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('Track');
            setIsMobileMenuOpen(false);
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-200 ${
            activeTab === 'Track'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white active:scale-95'
          }`}
        >
          <MapPin className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Track</span>
        </button>

        {/* Center Prominent Book Parcel CTA */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('Shipments');
            setIsMobileMenuOpen(false);
          }}
          className="relative -top-2 flex flex-col items-center justify-center px-3 group active:scale-90 transition-transform"
          title="Book New Consignment"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 ring-4 ring-[#edf4fb]/90 group-hover:scale-105 transition-transform">
            <Package className="w-6 h-6 stroke-[2.4]" />
          </div>
          <span className="text-[10px] font-extrabold text-white mt-0.5 tracking-tight">Book</span>
        </button>

        {/* Station Bay */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('Station View');
            setIsMobileMenuOpen(false);
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-200 ${
            activeTab === 'Station View'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white active:scale-95'
          }`}
        >
          <Building2 className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Bay</span>
        </button>

        {/* More / Menu */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-200 ${
            isMobileMenuOpen
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white active:scale-95'
          }`}
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">More</span>
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900 animate-pulse" />
          )}
        </button>
      </div>
    </nav>
  );
};
