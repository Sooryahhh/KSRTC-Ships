import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Printer, Bus, CheckCircle2, ShieldCheck, Download, Copy, Check } from 'lucide-react';
import { useShipment } from '../context/ShipmentContext';

export const WaybillModal: React.FC = () => {
  const { activeWaybillShipment, setActiveWaybillShipment } = useShipment();
  const [copied, setCopied] = React.useState(false);

  if (!activeWaybillShipment) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeWaybillShipment.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto">
        {/* Soft frosted ambient backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveWaybillShipment(null)}
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
          className="relative w-full max-w-2xl rounded-[32px] liquid-glass shadow-2xl z-10 overflow-hidden max-h-[92vh] flex flex-col border border-white/70 my-auto"
        >
          {/* Specular line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 opacity-90" />

          {/* Modal Top Bar */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-sky-100/70 bg-white/50">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Bus className="w-4 h-4 text-blue-600" />
              <span>Official KSRTC Consignment Note (Form TR-48)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-pill text-xs font-bold text-slate-700 hover:text-blue-700 transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveWaybillShipment(null)}
                className="w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

        {/* Printable Consignment Waybill Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800">
          
          {/* Header Block */}
          <div className="text-center pb-4 border-b-2 border-dashed border-slate-200">
            <div className="inline-flex items-center justify-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                K
              </div>
              <span className="text-xl font-black tracking-tight text-[#0f3b82]">
                KERALA STATE ROAD TRANSPORT CORPORATION
              </span>
            </div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-blue-600">
              Parcel & Cargo Logistics Division
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Transport Bhavan, Fort, Thiruvananthapuram - 695023
            </div>
          </div>

          {/* Reference & Barcode row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Waybill Consignment No.</div>
              <div className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{activeWaybillShipment.trackingNumber}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs text-blue-600 font-semibold p-1 hover:bg-blue-100 rounded-md"
                  title="Copy reference number"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Date: {activeWaybillShipment.bookingDate} • {activeWaybillShipment.serviceType}
              </div>
            </div>

            {/* Simulated Vector Barcode */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 h-10 px-3 bg-white rounded-lg border border-slate-200">
                {[3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2].map((w, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900 h-full"
                    style={{ width: `${w * 1.5}px` }}
                  />
                ))}
              </div>
              <div className="text-[10px] font-mono font-bold tracking-widest text-slate-500 mt-1">
                *{activeWaybillShipment.trackingNumber.replace('#', '')}*
              </div>
            </div>
          </div>

          {/* Consignor & Consignee 2-Column Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border border-slate-200 rounded-2xl p-4 bg-slate-50/40">
            <div className="space-y-1.5 sm:border-r sm:border-slate-200 sm:pr-4">
              <div className="text-[10px] uppercase font-black text-blue-600 tracking-wider">
                Consignor (Sender)
              </div>
              <div className="font-bold text-sm text-slate-900">{activeWaybillShipment.senderName}</div>
              <div className="text-slate-600">Phone: {activeWaybillShipment.senderPhone}</div>
              <div className="text-slate-600">Origin Depot: <strong className="text-slate-800">{activeWaybillShipment.senderStation}</strong></div>
              <div className="text-slate-500 text-[11px]">{activeWaybillShipment.pickupLocation}</div>
            </div>

            <div className="space-y-1.5 sm:pl-2">
              <div className="text-[10px] uppercase font-black text-blue-600 tracking-wider">
                Consignee (Receiver)
              </div>
              <div className="font-bold text-sm text-slate-900">{activeWaybillShipment.receiverName}</div>
              <div className="text-slate-600">Phone: {activeWaybillShipment.receiverPhone}</div>
              <div className="text-slate-600">Destination Depot: <strong className="text-slate-800">{activeWaybillShipment.receiverStation}</strong></div>
              <div className="text-slate-500 text-[11px]">{activeWaybillShipment.deliveryLocation}</div>
            </div>
          </div>

          {/* Commodity & Freight Specs */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-[10px] font-bold uppercase text-slate-500">
                <tr>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Weight</th>
                  <th className="p-2.5">Declared Value</th>
                  <th className="p-2.5">Carrier Bus Fleet</th>
                  <th className="p-2.5 text-right">Freight Charges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">{activeWaybillShipment.category}</td>
                  <td className="p-2.5">{activeWaybillShipment.weightKg} kg</td>
                  <td className="p-2.5">₹{activeWaybillShipment.declaredValue.toLocaleString()}</td>
                  <td className="p-2.5 text-blue-600 font-semibold">{activeWaybillShipment.busNumber || 'Pending loading'}</td>
                  <td className="p-2.5 text-right font-black text-sm text-slate-900">
                    ₹{activeWaybillShipment.totalFreight} <span className="text-[10px] text-emerald-600 font-bold">(PAID)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signatures & Seal */}
          <div className="flex items-center justify-between pt-4 text-center text-[10px] text-slate-400">
            <div>
              <div className="w-32 border-b border-slate-300 pb-1 font-bold text-slate-600">
                Auto-Verified
              </div>
              <span className="mt-1 block">Booking Station Officer</span>
            </div>

            <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-400/80 flex flex-col items-center justify-center p-1 rotate-[-6deg] text-blue-700">
              <span className="text-[8px] font-black uppercase">KSRTC LOGISTICS</span>
              <span className="text-[7px] font-bold">SECURITY SEAL</span>
              <span className="text-[8px] font-black">PASSED</span>
            </div>

            <div>
              <div className="w-32 border-b border-slate-300 pb-1 font-bold text-slate-600">
                Receiver Signature
              </div>
              <span className="mt-1 block">Receiving Consignee</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Controls */}
        <div className="p-4 border-t border-sky-100/70 flex items-center justify-end gap-3 bg-white/40">
          <button
            type="button"
            onClick={() => setActiveWaybillShipment(null)}
            className="px-5 py-2.5 rounded-xl liquid-glass-pill text-slate-800 hover:text-blue-700 text-xs font-bold transition-all shadow-xs"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
  );
};
