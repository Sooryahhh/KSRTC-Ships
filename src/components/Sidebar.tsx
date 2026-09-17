import React from 'react';
import { Home, MapPin, Package, Clock, Percent, Headphones, Building2, ChevronRight } from 'lucide-react';
import { useShipment, ActiveTab } from '../context/ShipmentContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, shipments, setIsSupportModalOpen } = useShipment();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'Home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'Track',
      label: 'Track',
      icon: <MapPin className="w-5 h-5" />
    },
    {
      id: 'Shipments',
      label: 'Shipments',
      icon: <Package className="w-5 h-5" />
    },
    {
      id: 'History',
      label: 'History',
      icon: <Clock className="w-5 h-5" />,
      badge: shipments.length
    },
    {
      id: 'Station View',
      label: 'Station View',
      icon: <Building2 className="w-5 h-5" />,
      badge: 'SC-02'
    },
    {
      id: 'Discount',
      label: 'Discount',
      icon: <Percent className="w-5 h-5" />
    }
  ];

  return (
    <aside className="w-48 lg:w-52 flex flex-col justify-between shrink-0 pr-4 select-none">
      {/* Primary Navigation Rail */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#dcecfe] text-[#0066cc] shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[#0066cc]' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Need Help? / Contact Support card at bottom as in screenshot */}
      <div 
        onClick={() => setIsSupportModalOpen(true)}
        className="mt-6 p-3.5 bg-white rounded-2xl border border-sky-100 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Headphones className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 leading-tight">
                Need Help?
              </div>
              <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-0.5">
                Contact Support
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 text-[11px] font-bold text-slate-600 pl-1 tracking-tight">
          +91 1800 123 4567
        </div>
      </div>
    </aside>
  );
};
