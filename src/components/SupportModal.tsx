import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Headphones, Phone, Clock, MapPin, ShieldCheck, Mail } from 'lucide-react';
import { useShipment } from '../context/ShipmentContext';

export const SupportModal: React.FC = () => {
  const { isSupportModalOpen, setIsSupportModalOpen, stations } = useShipment();

  if (!isSupportModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto">
        {/* Soft frosted ambient backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSupportModalOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        />

        {/* Liquid Glass Pop-Up Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', damping: 25, stiffness: 340 }
          }}
          exit={{
            opacity: 0,
            scale: 0.92,
            y: 16,
            transition: { duration: 0.18 }
          }}
          className="relative w-full max-w-xl rounded-[32px] liquid-glass shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col border border-white/70 my-auto"
        >
          {/* Specular line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 opacity-90" />

          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-sky-100/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-800 tracking-tight">
                  KSRTC Logistics 24/7 Support Desk
                </h3>
                <p className="text-[11px] text-blue-700/80 font-medium">Cargo helpline & station depot inquiry</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSupportModalOpen(false)}
              className="w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-xs text-slate-700">
            
            {/* Main Toll-Free Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-sky-200 tracking-wider">Toll-Free All Kerala Helpline</div>
                <div className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">+91 1800 123 4567</div>
                <div className="text-[11px] text-sky-100 mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Operating 24 Hours • 7 Days a Week</span>
                </div>
              </div>

              <a
                href="tel:+9118001234567"
                className="px-4 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-sky-50 shadow-sm active:scale-95 transition-all"
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
                  <div key={st.id} className="p-2.5 rounded-xl liquid-glass-card">
                    <div className="font-bold text-slate-800 truncate">{st.city} Hub</div>
                    <div className="text-[11px] text-slate-500 truncate">{st.name}</div>
                    <div className="text-blue-700 font-bold mt-1">{st.phone}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Helpful Information */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 backdrop-blur-xs border border-amber-200/80 text-amber-900 space-y-1">
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
          <div className="p-4 border-t border-sky-100/70 flex justify-end">
            <button
              type="button"
              onClick={() => setIsSupportModalOpen(false)}
              className="px-5 py-2.5 rounded-xl liquid-glass-pill text-slate-800 hover:text-blue-700 text-xs font-bold transition-all shadow-xs"
            >
              Close
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
