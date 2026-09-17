import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Bus,
  User,
  Shield,
  FileText,
  AlertCircle,
  Truck,
  ArrowRight,
  Printer,
  ChevronRight
} from 'lucide-react';
import { useShipment } from '../context/ShipmentContext';
import { InteractiveMap } from './InteractiveMap';

export const TrackView: React.FC = () => {
  const {
    shipments,
    activeShipment,
    setActiveShipment,
    trackQuery,
    setTrackQuery,
    searchShipment,
    setActiveWaybillShipment,
    setIsCallModalOpen,
    setCallPartnerShipment
  } = useShipment();

  const [inputQuery, setInputQuery] = useState(trackQuery || activeShipment.trackingNumber);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!inputQuery.trim()) return;

    const found = searchShipment(inputQuery);
    if (found) {
      setActiveShipment(found);
      setTrackQuery(found.trackingNumber);
    } else {
      setErrorMessage(`No consignment found with tracking or phone "${inputQuery}". Try one of the quick samples below.`);
    }
  };

  const handleQuickSample = (trackingNumber: string) => {
    setInputQuery(trackingNumber);
    setTrackQuery(trackingNumber);
    const found = searchShipment(trackingNumber);
    if (found) {
      setActiveShipment(found);
      setErrorMessage('');
    }
  };

  const current = activeShipment;

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" />
            Public Consignment Tracker • No Login Required
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Live KSRTC Waybill & Bus Cargo Tracking
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track real-time bus locations, cargo depot transfers, conductor assignments, and delivery milestones.
          </p>

          {/* Large Search Input */}
          <form onSubmit={handleSearch} className="mt-5 relative">
            <div className="flex items-center relative shadow-sm rounded-full overflow-hidden border-2 border-blue-200 focus-within:border-blue-500 transition-colors">
              <Search className="absolute left-4 w-5 h-5 text-blue-500 pointer-events-none" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => {
                  setInputQuery(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Enter Reference / Tracking No. (e.g. KSR-48213, #ABIKR...)"
                className="w-full pl-12 pr-32 py-3.5 bg-slate-50 hover:bg-white focus:bg-white text-sm font-semibold text-slate-800 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-5 py-2.5 bg-[#0066ff] hover:bg-[#0052cc] text-white font-bold text-xs sm:text-sm rounded-full shadow-sm transition-all"
              >
                Track Now
              </button>
            </div>
          </form>

          {errorMessage && (
            <div className="mt-3 p-3 rounded-2xl bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick sample chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Quick Search:</span>
            {shipments.slice(0, 4).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleQuickSample(s.trackingNumber)}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  s.trackingNumber === current.trackingNumber
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-sky-50 hover:bg-sky-100 text-blue-700 border border-sky-100'
                }`}
              >
                {s.trackingNumber} ({s.status})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tracking Details 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Milestones Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Active Consignment Overview Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Consignment Note
                </div>
                <div className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <span>{current.trackingNumber}</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {current.serviceType}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveWaybillShipment(current)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Waybill Slip</span>
                </button>

                <div className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-extrabold shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>{current.status}</span>
                </div>
              </div>
            </div>

            {/* Route & Key Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-100 text-xs">
              <div>
                <div className="text-slate-400 font-semibold uppercase text-[10px]">Origin Station</div>
                <div className="font-bold text-slate-800 truncate mt-0.5" title={current.senderStation}>
                  {current.senderStation}
                </div>
                <div className="text-[11px] text-slate-500">{current.senderCity}</div>
              </div>

              <div>
                <div className="text-slate-400 font-semibold uppercase text-[10px]">Destination</div>
                <div className="font-bold text-slate-800 truncate mt-0.5" title={current.receiverStation}>
                  {current.receiverStation}
                </div>
                <div className="text-[11px] text-slate-500">{current.receiverCity}</div>
              </div>

              <div>
                <div className="text-slate-400 font-semibold uppercase text-[10px]">Weight & Type</div>
                <div className="font-bold text-slate-800 mt-0.5">{current.weightKg} kg</div>
                <div className="text-[11px] text-slate-500">{current.category}</div>
              </div>

              <div>
                <div className="text-slate-400 font-semibold uppercase text-[10px]">Est. Arrival</div>
                <div className="font-bold text-blue-600 mt-0.5">{current.estimatedDelivery}</div>
                <div className="text-[11px] text-slate-500">Fast Passenger Corridor</div>
              </div>
            </div>

            {/* Assigned Bus Fleet & Conductor Details */}
            <div className="mt-4 p-4 rounded-2xl bg-sky-50/80 border border-sky-100 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-blue-600">Assigned Carrier Bus</div>
                  <div className="font-extrabold text-slate-800 text-sm">{current.busNumber || 'Pending Assignment at Depot'}</div>
                  <div className="text-slate-500 text-[11px]">{current.busRouteName || 'Main Trunk Highway'}</div>
                </div>
              </div>

              {current.conductorName && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-sky-200 text-slate-700 flex items-center justify-center font-bold">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Cargo Conductor</div>
                    <div className="font-bold text-slate-800">{current.conductorName} ({current.conductorBadge})</div>
                    <div className="text-blue-600 font-semibold text-[11px] cursor-pointer" onClick={() => {
                      setCallPartnerShipment(current);
                      setIsCallModalOpen(true);
                    }}>
                      {current.conductorPhone} • Tap to call
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step-by-Step Status Milestones */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100">
            <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Full Status Journey & Checkpoints</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {current.checkpoints.map((cp, idx) => {
                const isDone = cp.completed;
                const isCurrent = cp.status === current.status;

                return (
                  <div key={cp.id} className="relative group">
                    {/* Circle marker on timeline */}
                    <div
                      className={`absolute -left-6 top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isDone
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : isCurrent
                          ? 'bg-amber-500 border-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                          : 'bg-white border-slate-300 text-transparent'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <div className="pl-3">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <h4 className={`text-sm font-bold ${isDone || isCurrent ? 'text-slate-800' : 'text-slate-400'}`}>
                          {cp.title}
                        </h4>
                        <span className="text-xs font-semibold text-slate-400">
                          {cp.timestamp}
                        </span>
                      </div>

                      <div className="text-xs text-blue-600 font-medium mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{cp.location}</span>
                      </div>

                      {cp.notes && (
                        <p className="text-xs text-slate-500 mt-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          {cp.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Interactive Route Map & Delivery Details (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-sky-100">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-bold text-slate-700">Live Route Map</span>
              <span className="text-[11px] text-blue-600 font-semibold">{current.currentLocation}</span>
            </div>
            <InteractiveMap shipment={current} />
          </div>

          {/* Delivery & Consignee Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 space-y-4">
            <h4 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
              Consignee & Contact Information
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Recipient:</span>
                <span className="font-bold text-slate-800">{current.receiverName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Phone:</span>
                <span className="font-bold text-slate-800">{current.receiverPhone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Declared Value:</span>
                <span className="font-bold text-slate-800">₹{current.declaredValue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Freight Paid:</span>
                <span className="font-bold text-emerald-600">₹{current.totalFreight} (PAID)</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setCallPartnerShipment(current);
                  setIsCallModalOpen(true);
                }}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <User className="w-4 h-4" />
                <span>Contact Station / Delivery Officer</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
