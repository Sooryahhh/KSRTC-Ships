import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Phone, PhoneCall, Send, CheckCircle2, Shield, User } from 'lucide-react';
import { useShipment } from '../context/ShipmentContext';

export const CallPartnerModal: React.FC = () => {
  const { isCallModalOpen, setIsCallModalOpen, callPartnerShipment, activeShipment } = useShipment();
  const [isCalling, setIsCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  if (!isCallModalOpen) return null;

  const current = callPartnerShipment || activeShipment;
  const partnerName = current.deliveryPartnerName || current.conductorName || 'Pradeep Kumar Panicker';
  const partnerPhone = current.deliveryPartnerPhone || current.conductorPhone || '+91 94470 18234';

  const handleStartCall = () => {
    setIsCalling(true);
    setTimeout(() => {
      setCallConnected(true);
    }, 1400);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageText('');
      setMessageSent(false);
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setIsCallModalOpen(false);
            setIsCalling(false);
            setCallConnected(false);
          }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        />

        {/* Liquid Glass Pop-Up Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', damping: 25, stiffness: 350 }
          }}
          exit={{
            opacity: 0,
            scale: 0.92,
            y: 16,
            transition: { duration: 0.18 }
          }}
          className="relative w-full max-w-md rounded-[32px] liquid-glass p-6 shadow-2xl z-10 overflow-hidden border border-white/70"
        >
          {/* Specular accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 opacity-90" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-sky-100/70">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <div className="w-6 h-6 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span>Delivery Partner Dispatch Line</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsCallModalOpen(false);
                setIsCalling(false);
                setCallConnected(false);
              }}
              className="w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Partner Profile Card */}
          <div className="p-4 text-center">
            <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden ring-4 ring-blue-500/20 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80"
                alt={partnerName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <h3 className="text-lg font-black text-slate-800 mt-3">{partnerName}</h3>
            <p className="text-xs text-blue-600 font-bold">KSRTC Swift Express Pilot & Conductor</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Consignment: {current.trackingNumber}</p>

            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold">
              <span>Status: Will deliver in {current.etaMinutes || 35} mins</span>
            </div>

            {/* Call simulator view */}
            {isCalling ? (
              <div className="mt-5 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md text-white border border-slate-700/50 shadow-inner">
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  {callConnected ? 'Connected (Encrypted Voice Line)' : 'Connecting to Driver Mobile...'}
                </div>
                <div className="text-lg font-mono font-bold mt-1 text-emerald-400">
                  {callConnected ? '00:14 • 4G VoLTE' : 'Ringing...'}
                </div>
                <div className="text-xs text-slate-300 mt-1">{partnerPhone}</div>

                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCalling(false);
                      setCallConnected(false);
                    }}
                    className="px-6 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
                  >
                    End Call
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleStartCall}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-[0.99] text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call {partnerPhone}</span>
                </button>
              </div>
            )}

            {/* Quick SMS Message input */}
            <div className="mt-5 pt-4 border-t border-sky-100/80 text-left">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Send Quick Delivery Note
              </label>
              <form onSubmit={handleSendMessage} className="relative flex items-center">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="e.g. Keep at Counter 2, I will collect by 6 PM"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-white/90 text-xs font-medium rounded-xl border border-sky-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {messageSent && (
                <div className="mt-2 text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Message dispatched to delivery partner handheld!</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
