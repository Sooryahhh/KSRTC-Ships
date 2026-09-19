import React, { useState } from 'react';
import {
  Building2,
  Search,
  CheckCircle2,
  Truck,
  Bus,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  PackageCheck,
  RotateCcw,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useShipment } from '../context/ShipmentContext';
import { Shipment, ShipmentStatus } from '../types';

export const StationView: React.FC = () => {
  const {
    stations,
    activeStationId,
    setActiveStationId,
    shipments,
    updateShipmentStatus,
    stationLogs,
    setActiveShipment,
    setActiveTab
  } = useShipment();

  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'All' | 'Inward' | 'Outward'>('All');
  const [operatorNotes, setOperatorNotes] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const currentStation =
    stations.find((s) => s.id === activeStationId) || stations[1]; // default Ernakulam

  // Filter shipments for this station
  const stationShipments = shipments.filter((s) => {
    const isDestination = s.receiverStation.toLowerCase().includes(currentStation.city.toLowerCase()) ||
      s.receiverStation.toLowerCase().includes(currentStation.name.toLowerCase().split(' ')[0]);
    const isOrigin = s.senderStation.toLowerCase().includes(currentStation.city.toLowerCase()) ||
      s.senderStation.toLowerCase().includes(currentStation.name.toLowerCase().split(' ')[0]);

    if (filterType === 'Inward') return isDestination;
    if (filterType === 'Outward') return isOrigin;
    return isDestination || isOrigin || true; // Show all or filtered
  });

  const activeFocusShipment = selectedShipment || stationShipments[0] || shipments[0];

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    const clean = lookupQuery.trim().toUpperCase().replace('#', '');
    const found = shipments.find(
      (s) => s.trackingNumber.toUpperCase().replace('#', '') === clean
    );
    if (found) {
      setSelectedShipment(found);
      setLookupQuery('');
      setLookupError(null);
    } else {
      setLookupError(`Consignment "${lookupQuery}" not found in depot manifest.`);
      setTimeout(() => setLookupError(null), 4000);
    }
  };

  const handleAdvanceStatus = (shipment: Shipment, targetStatus: ShipmentStatus) => {
    updateShipmentStatus(
      shipment.trackingNumber,
      targetStatus,
      currentStation.name,
      operatorNotes || `Marked ${targetStatus} at ${currentStation.name} (Bay 3 Inspection)`
    );
    setOperatorNotes('');
    // Refresh selected shipment
    const updated = shipments.find((s) => s.id === shipment.id);
    if (updated) setSelectedShipment({ ...updated, status: targetStatus });
  };

  return (
    <div className="space-y-6">
      {/* Station Header & Station Switcher */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            SC-02 Receiving & Transit Station Master Console
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Station Arrival & Yard Dispatch Desk
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Receiving station staff inspect incoming buses, mark arrived consignments, and dispatch outward parcels.
          </p>
        </div>

        {/* Station Selector Dropdown */}
        <div className="flex items-center gap-3 bg-sky-50/80 p-2 rounded-2xl border border-sky-100">
          <Building2 className="w-5 h-5 text-blue-600 ml-2" />
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-slate-400">Current Station Duty</div>
            <select
              value={activeStationId}
              onChange={(e) => setActiveStationId(e.target.value)}
              className="bg-transparent font-extrabold text-sm text-slate-800 focus:outline-none cursor-pointer pr-3"
            >
              {stations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column Interface: Lookup & Advance on Left, Depot Manifest on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Quick Look-up & Lifecycle Status Action Box (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Quick Lookup Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center justify-between">
              <span>Scan or Look Up Consignment Reference</span>
              <span className="text-xs text-blue-600 font-semibold">Barcode / Waybill</span>
            </h3>

            <form onSubmit={handleLookup} className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={lookupQuery}
                onChange={(e) => {
                  setLookupQuery(e.target.value);
                  if (lookupError) setLookupError(null);
                }}
                placeholder="Enter Reference (e.g. KSR-48213)"
                className="w-full pl-11 pr-24 py-3 bg-slate-50 text-xs font-bold rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 uppercase"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
              >
                Inspect
              </button>
            </form>

            {lookupError && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{lookupError}</span>
              </div>
            )}

            {/* Quick barcode simulation chips for quick mobile tap */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <span className="text-slate-400 font-bold shrink-0">Depot Parcels:</span>
              {shipments.slice(0, 4).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedShipment(s);
                    setLookupError(null);
                  }}
                  className={`px-2.5 py-1 rounded-full font-bold shrink-0 transition-colors ${
                    activeFocusShipment?.id === s.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-sky-50 text-blue-700 hover:bg-sky-100 border border-sky-100'
                  }`}
                >
                  {s.trackingNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Active Consignment Action Console */}
          {activeFocusShipment && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Inspected Waybill</div>
                  <div className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 mt-0.5">
                    <span>{activeFocusShipment.trackingNumber}</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600">
                      {activeFocusShipment.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Route: <strong className="text-slate-700">{activeFocusShipment.senderStation}</strong> →{' '}
                    <strong className="text-slate-700">{activeFocusShipment.receiverStation}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full bg-blue-600 text-white font-extrabold text-xs shadow-xs">
                    {activeFocusShipment.status}
                  </span>
                </div>
              </div>

              {/* Conductor & Bus Details */}
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 text-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Bus Fleet & Conductor</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {activeFocusShipment.busNumber || 'Unassigned (Awaiting Bay Dispatch)'}
                  </div>
                  {activeFocusShipment.conductorName && (
                    <div className="text-slate-500 text-[11px]">
                      Conductor: {activeFocusShipment.conductorName} ({activeFocusShipment.conductorBadge})
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Weight</div>
                  <div className="font-bold text-slate-800">{activeFocusShipment.weightKg} kg</div>
                </div>
              </div>

              {/* Station Flow Status Advance Buttons */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Advance Shipment Lifecycle (Station Operations):
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Action 1: Dispatch */}
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus(activeFocusShipment, 'Dispatched')}
                    disabled={activeFocusShipment.status === 'Dispatched' || activeFocusShipment.status === 'In Transit' || activeFocusShipment.status === 'Arrived' || activeFocusShipment.status === 'Delivered'}
                    className="p-3 rounded-2xl border text-left flex flex-col justify-between transition-all disabled:opacity-40 disabled:cursor-not-allowed border-sky-200 bg-sky-50/50 hover:bg-sky-100/70"
                  >
                    <div className="flex items-center justify-between">
                      <Bus className="w-4 h-4 text-blue-600" />
                      <span className="text-[10px] font-bold text-blue-600">Step 1</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-bold text-slate-800">Dispatch to Bus</div>
                      <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                        Auto-assigns bus & conductor
                      </div>
                    </div>
                  </button>

                  {/* Action 2: In Transit */}
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus(activeFocusShipment, 'In Transit')}
                    disabled={activeFocusShipment.status === 'In Transit' || activeFocusShipment.status === 'Arrived' || activeFocusShipment.status === 'Delivered'}
                    className="p-3 rounded-2xl border text-left flex flex-col justify-between transition-all disabled:opacity-40 disabled:cursor-not-allowed border-blue-200 bg-blue-50/50 hover:bg-blue-100/70"
                  >
                    <div className="flex items-center justify-between">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span className="text-[10px] font-bold text-blue-600">Step 2</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-bold text-slate-800">Mark In Transit</div>
                      <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                        Departed depot onto highway
                      </div>
                    </div>
                  </button>

                  {/* Action 3: Arrived (SC-02 Key Two-Sided Step) */}
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus(activeFocusShipment, 'Arrived')}
                    disabled={activeFocusShipment.status === 'Arrived' || activeFocusShipment.status === 'Delivered'}
                    className="p-3 rounded-2xl border text-left flex flex-col justify-between transition-all disabled:opacity-40 disabled:cursor-not-allowed border-purple-200 bg-purple-50/70 hover:bg-purple-100 ring-2 ring-purple-400/30"
                  >
                    <div className="flex items-center justify-between">
                      <PackageCheck className="w-4 h-4 text-purple-600" />
                      <span className="text-[10px] font-bold text-purple-600">SC-02 Key Step</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-bold text-purple-900">Mark "Arrived" at Station</div>
                      <div className="text-[10px] text-purple-700 leading-tight mt-0.5">
                        Destination marks arrived & unloaded
                      </div>
                    </div>
                  </button>

                  {/* Action 4: Delivered */}
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus(activeFocusShipment, 'Delivered')}
                    disabled={activeFocusShipment.status === 'Delivered'}
                    className="p-3 rounded-2xl border text-left flex flex-col justify-between transition-all disabled:opacity-40 disabled:cursor-not-allowed border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70"
                  >
                    <div className="flex items-center justify-between">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-[10px] font-bold text-emerald-600">Final Step</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-bold text-slate-800">Mark Delivered</div>
                      <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                        Consignee collected / OTP verified
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Station Yard Remarks */}
              <div className="pt-2">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Station Yard Remarks / Inspection Note (Optional)
                </label>
                <input
                  type="text"
                  value={operatorNotes}
                  onChange={(e) => setOperatorNotes(e.target.value)}
                  placeholder="e.g. Unloaded safely at Bay 3, seal verified by duty officer"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Station Inward Manifest & Live Yard Audit Log (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Station Manifest Table */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>Depot Manifest</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  {stationShipments.length} parcels
                </span>
              </h3>

              {/* Tabs for Inward / Outward */}
              <div className="flex items-center gap-1 text-xs">
                {(['All', 'Inward', 'Outward'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFilterType(t)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                      filterType === t
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100 mt-2 max-h-80 overflow-y-auto">
              {stationShipments.map((ship) => (
                <div
                  key={ship.id}
                  onClick={() => setSelectedShipment(ship)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                    activeFocusShipment?.id === ship.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-800">
                        {ship.trackingNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                        {ship.weightKg} kg
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[200px]">
                      {ship.senderCity} → {ship.receiverCity} ({ship.receiverName})
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-blue-700">
                      {ship.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">Tap to advance</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Station Operations Audit Log */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100">
            <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Station Operations Audit Trail</span>
              <span className="text-xs text-slate-400 font-semibold">Live Feed</span>
            </h3>

            <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto text-xs">
              {stationLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{log.trackingNumber}</span>
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <div className="text-blue-600 font-bold mt-0.5">{log.action}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{log.details}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Officer: {log.operator} • {log.stationName}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
