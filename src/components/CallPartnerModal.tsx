import React, { useState } from 'react';
import { X, Phone, PhoneCall, MessageSquare, Send, CheckCircle2, Shield, User } from 'lucide-react';
import { useShipment } from '../context/ShipmentContext';

export const CallPartnerModal: React.FC = () => {
  const { isCallModalOpen, setIsCallModalOpen, callPartnerShipment, activeShipment } = useShipment();
  const [isCalling, setIsCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  if (!isCallModalOpen) return null;

  const current = callPartnerShipment || activeShipment;
  const partnerName = current.deliveryPartnerName || current.conductorName || 'Ronald Richards';
  const partnerPhone = current.deliveryPartnerPhone || current.conductorPhone || '+91 94470 18234';

  const handleStartCall = () => {
    setIsCalling(true);
    setTimeout(() => {
      setCallConnected(true);
    }, 1500);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Phone className="w-4 h-4 text-blue-600" />
            <span>Delivery Partner Dispatch Line</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsCallModalOpen(false);
              setIsCalling(false);
              setCallConnected(false);
            }}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Partner Profile Card */}
        <div className="p-6 text-center">
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden ring-4 ring-blue-100 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
              alt={partnerName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <h3 className="text-lg font-black text-slate-800 mt-3">{partnerName}</h3>
          <p className="text-xs text-blue-600 font-bold">Official KSRTC Delivery Partner</p>
          <p className="text-xs text-slate-400 mt-0.5">Consignment: {current.trackingNumber}</p>

          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-blue-800 text-xs font-bold">
            <span>Status: Will deliver in {current.etaMinutes || 25} mins</span>
          </div>

          {/* Call simulator view */}
          {isCalling ? (
            <div className="mt-6 p-4 rounded-2xl bg-slate-900 text-white animate-in zoom-in-95 duration-150">
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
                  className="px-6 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  End Call
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <button
                type="button"
                onClick={handleStartCall}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call {partnerPhone}</span>
              </button>
            </div>
          )}

          {/* Quick SMS Message input */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-left">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Send Quick Delivery Note
            </label>
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="e.g. Please leave at depot counter 2..."
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 text-xs font-medium rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs"
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

      </div>
    </div>
  );
};
