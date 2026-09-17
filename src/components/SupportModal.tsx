import React from 'react';
import { X, Headphones, Phone, Clock, MapPin, ShieldCheck, Mail } from 'lucide-react';
import { useShipment } from '../context/ShipmentContext';

export const SupportModal: React.FC = () => {
  const { isSupportModalOpen, setIsSupportModalOpen, stations } = useShipment();

  if (!isSupportModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">KSRTC Logistics 24/7 Support Desk</h3>
              <p className="text-[11px] text-slate-400">Cargo helpline & station depot inquiry</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSupportModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Main Toll-Free Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-sky-200">Toll-Free All Kerala Helpline</div>
              <div className="text-xl font-black tracking-tight mt-0.5">+91 1800 123 4567</div>
              <div className="text-[11px] text-sky-100 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Operating 24 Hours • 7 Days a Week</span>
              </div>
            </div>

            <a
              href="tel:+9118001234567"
              className="px-4 py-2 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-sky-50 shadow-sm"
            >
              Call Now
            </a>
          </div>

          {/* Depot Direct Contact Numbers */}
          <div>
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Major Depot Cargo Offices</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {stations.slice(0, 6).map((st) => (
                <div key={st.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-slate-800 truncate">{st.city} Hub</div>
                  <div className="text-[11px] text-slate-500">{st.name}</div>
                  <div className="text-blue-600 font-bold mt-1">{st.phone}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Helpful Information */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Collection & Identification Policy</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Consignments must be collected within 48 hours of arrival at destination depot. Please present government ID and the SMS arrival OTP received on the registered recipient phone number.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={() => setIsSupportModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
