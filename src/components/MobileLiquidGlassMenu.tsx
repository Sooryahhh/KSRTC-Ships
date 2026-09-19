import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  Home,
  MapPin,
  Package,
  Clock,
  Percent,
  Building2,
  Headphones,
  Bus,
  ChevronRight,
  ShieldCheck,
  Phone,
  Search
} from 'lucide-react';
import { useShipment, ActiveTab } from '../context/ShipmentContext';

export const MobileLiquidGlassMenu: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    shipments,
    userProfile,
    setIsSupportModalOpen,
    setIsCallModalOpen,
    activeShipment,
    setCallPartnerShipment
  } = useShipment();

  if (!isMobileMenuOpen) return null;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'Home',
      label: 'Home Dashboard',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'Track',
      label: 'Track Consignment',
      icon: <MapPin className="w-5 h-5" />
    },
    {
      id: 'Shipments',
      label: 'Book Parcel (New)',
      icon: <Package className="w-5 h-5" />
    },
    {
      id: 'History',
      label: 'Booking History',
      icon: <Clock className="w-5 h-5" />,
      badge: shipments.length
    },
    {
      id: 'Station View',
      label: 'Station View (SC-02)',
      icon: <Building2 className="w-5 h-5" />,
      badge: 'Inward Bay'
    },
    {
      id: 'Discount',
      label: 'Discounts & Tariffs',
      icon: <Percent className="w-5 h-5" />
    }
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-3.5 sm:p-5 md:hidden overflow-y-auto">
        {/* Soft frosted ambient backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/35 backdrop-blur-md transition-opacity"
        />

        {/* Liquid Glass Pop-Up Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: -24 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', damping: 25, stiffness: 320 }
          }}
          exit={{
            opacity: 0,
            scale: 0.92,
            y: -16,
            transition: { duration: 0.18 }
          }}
          className="relative w-full max-w-sm rounded-[32px] liquid-glass p-5 shadow-2xl z-10 my-auto overflow-hidden border border-white/70"
        >
          {/* Top specular reflection gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 opacity-80" />

          {/* Header with Logo & Close Button */}
          <div className="flex items-center justify-between pb-3.5 border-b border-sky-100/70">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
                <Bus className="w-5 h-5 stroke-[2.3]" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-[#0f3b82] block leading-none">
                  KSRTC
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600/90">
                  Parcel Logistics
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full liquid-glass-pill flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all shadow-xs"
              aria-label="Close menu"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* User Profile Card - Malayali Hindu Name */}
          <div className="mt-3.5 p-3 rounded-2xl liquid-glass-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-blue-500/30 shadow-xs shrink-0">
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1 truncate">
                  <span>{userProfile.name}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                </div>
                <div className="text-[11px] font-semibold text-blue-700 truncate">
                  {userProfile.role}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {userProfile.depot}
                </div>
              </div>
            </div>
          </div>

          {/* Main Navigation Items */}
          <div className="mt-3 space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/25'
                      : 'text-slate-700 hover:bg-white/80 active:bg-sky-100/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-blue-600'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-100/80 text-blue-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Support & Contact Bottom Actions */}
          <div className="mt-4 pt-3 border-t border-sky-100/80 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSupportModalOpen(true);
              }}
              className="flex-1 py-2.5 px-3 rounded-2xl liquid-glass-pill text-xs font-bold text-slate-700 hover:text-blue-700 flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Headphones className="w-3.5 h-3.5 text-blue-600" />
              <span>Help & Support</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setCallPartnerShipment(activeShipment);
                setIsCallModalOpen(true);
              }}
              className="py-2.5 px-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Partner</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
