import React, { useState } from 'react';
import {
  Clock,
  Search,
  MapPin,
  Truck,
  Printer,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Package,
  Calendar
} from 'lucide-react';
import { useShipment } from '../context/ShipmentContext';
import { ShipmentStatus } from '../types';

export const HistoryView: React.FC = () => {
  const {
    shipments,
    setActiveShipment,
    setActiveTab,
    setActiveWaybillShipment
  } = useShipment();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShipments = shipments.filter((s) => {
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesQuery =
      !searchQuery ||
      s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.receiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.senderCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.receiverCity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const getStatusBadgeClass = (status: ShipmentStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Arrived':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Dispatched':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Booked':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <Clock className="w-3.5 h-3.5" />
            Session Manifest & History Records
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Booking & Consignment History
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            All parcels booked during this session, with live status markers and 1-click tracking jumps.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('Shipments')}
          className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
        >
          <Package className="w-4 h-4" />
          <span>Book New Parcel</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Booked', 'Dispatched', 'In Transit', 'Arrived', 'Delivered'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search inside history */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search consignment or name..."
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Consignments List Table / Cards */}
      <div className="space-y-3">
        {filteredShipments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-sky-100">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <div className="text-base font-bold text-slate-700">No matching bookings found</div>
            <p className="text-xs text-slate-400 mt-1">Try changing the status filter or create a new parcel booking.</p>
          </div>
        ) : (
          filteredShipments.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-sky-100 hover:border-blue-300 hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 group"
            >
              {/* Left Column: Reference & Route */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Truck className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-extrabold text-slate-900 tracking-tight">
                      {s.trackingNumber}
                    </span>
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(s.status)}`}>
                      {s.status}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                      • {s.category} ({s.weightKg} kg)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{s.senderStation}</span>
                    </div>
                    <span className="text-slate-300">→</span>
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{s.receiverStation}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                    <span>Booked on: {s.bookingDate}</span>
                    <span>•</span>
                    <span>Recipient: <strong className="text-slate-600">{s.receiverName}</strong></span>
                    {s.busNumber && (
                      <>
                        <span>•</span>
                        <span className="text-blue-600 font-medium">Bus: {s.busNumber}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Amount & Actions */}
              <div className="flex items-center gap-3 self-end lg:self-center">
                <div className="text-right pr-2">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Freight</div>
                  <div className="text-base font-black text-slate-800">₹{s.totalFreight}</div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveWaybillShipment(s)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  title="Print Waybill Receipt"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveShipment(s);
                    setActiveTab('Track');
                  }}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <span>Track Live</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
