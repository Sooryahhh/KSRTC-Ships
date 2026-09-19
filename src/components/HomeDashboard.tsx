import React, { useState } from 'react';
import {
  Search,
  Phone,
  MessageSquare,
  MapPin,
  ChevronRight,
  Truck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building2,
  Package,
  Percent
} from 'lucide-react';
import { useShipment } from '../context/ShipmentContext';
import { InteractiveMap } from './InteractiveMap';
import { PictureSlideshow } from './PictureSlideshow';
import parcelBoxImg from '../assets/images/parcel_box_3d_1789639288534.jpg';

export const HomeDashboard: React.FC = () => {
  const {
    shipments,
    activeShipment,
    setActiveShipment,
    setActiveTab,
    setIsCallModalOpen,
    setCallPartnerShipment,
    setIsSupportModalOpen,
    userProfile,
    calculateEstimatedDelivery
  } = useShipment();

  const [innerSearchQuery, setInnerSearchQuery] = useState('');

  // Secondary shipment (e.g. #BHTSR9453248933457 or other shipment in recent list)
  const secondaryShipment =
    shipments.find((s) => s.id !== activeShipment.id) || shipments[1] || activeShipment;

  const handleInnerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!innerSearchQuery.trim()) return;
    const found = shipments.find((s) =>
      s.trackingNumber.toLowerCase().includes(innerSearchQuery.toLowerCase())
    );
    if (found) {
      setActiveShipment(found);
    }
  };

  return (
    <div className="space-y-5">
      {/* Mobile Quick Action Ribbon (Visible on Mobile only) */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-1 -mt-1 select-none no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('Shipments')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-blue-600 active:bg-blue-700 text-white font-bold text-xs shrink-0 shadow-sm shadow-blue-600/25 transition-transform active:scale-95"
        >
          <Package className="w-3.5 h-3.5" />
          <span>Book Parcel</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('Track')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white active:bg-sky-50 text-slate-700 font-bold text-xs shrink-0 border border-sky-100 shadow-xs transition-transform active:scale-95"
        >
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Live GPS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('Station View')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white active:bg-sky-50 text-slate-700 font-bold text-xs shrink-0 border border-sky-100 shadow-xs transition-transform active:scale-95"
        >
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Depot Bay</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('Discount')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white active:bg-sky-50 text-slate-700 font-bold text-xs shrink-0 border border-sky-100 shadow-xs transition-transform active:scale-95"
        >
          <Percent className="w-3.5 h-3.5 text-emerald-600" />
          <span>Offers</span>
        </button>
      </div>

      {/* 3-Column Main Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-start">
        
        {/* =========================================================================
            COLUMN 1: Dynamic Picture Slideshow Carousel (Left, spanning 4 cols on lg)
           ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <PictureSlideshow intervalMs={4500} className="w-full h-full" />
        </div>

        {/* =========================================================================
            COLUMN 2: Tracking + Recent Shipments (Center, spanning 4 cols on lg)
           ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Card 1: Current Tracking Panel (Dual-tone sky/cerulean gradient) */}
          <div className="rounded-[26px] overflow-hidden bg-gradient-to-b from-[#3ba2f7] to-[#1677f2] p-5 text-white shadow-lg shadow-blue-500/10 border border-sky-300/30">
            {/* User row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/60 bg-white/20">
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="font-bold text-sm text-white leading-tight">
                    {userProfile.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-sky-100 font-medium">
                    <MapPin className="w-3 h-3 text-sky-200" />
                    <span>{activeShipment.senderCity || 'Kochi'}</span>
                  </div>
                </div>
              </div>

              {/* Bell notification button */}
              <button
                type="button"
                onClick={() => setIsSupportModalOpen(true)}
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-blue-600 flex items-center justify-center shadow-xs"
                title="Consignment Support"
              >
                <div className="w-2 h-2 rounded-full bg-blue-600" />
              </button>
            </div>

            {/* Shipment search field inside card as in screenshot */}
            <form onSubmit={handleInnerSearch} className="mb-4">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-blue-400 pointer-events-none" />
                <input
                  type="text"
                  value={innerSearchQuery}
                  onChange={(e) => setInnerSearchQuery(e.target.value)}
                  placeholder="Search Shipping"
                  className="w-full pl-10 pr-4 py-2.5 bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-xs"
                />
              </div>
            </form>

            {/* Inner Darker Blue Tracking Subcard */}
            <div className="rounded-2xl bg-[#0e63d8] p-4 text-white relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                    Current Tracking
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-white mt-0.5 tracking-tight">
                    {activeShipment.trackingNumber}
                  </div>
                </div>

                {/* Contact button */}
                <button
                  type="button"
                  onClick={() => {
                    setCallPartnerShipment(activeShipment);
                    setIsCallModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs text-xs font-bold text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact</span>
                </button>
              </div>

              {/* Location & Status + 3D Boxes illustration */}
              <div className="flex items-center justify-between mt-3">
                <div className="space-y-2">
                  <div>
                    <div className="text-[10px] text-sky-200 font-semibold uppercase">
                      Current Location
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-white uppercase tracking-wider">
                      <MapPin className="w-3 h-3 text-sky-300" />
                      <span>{activeShipment.currentLocation}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-sky-200 font-semibold uppercase">
                      Current Status
                    </div>
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {activeShipment.status}
                    </div>
                  </div>
                </div>

                {/* 3D Parcel Box illustration */}
                <div className="w-20 h-20 shrink-0 relative drop-shadow-md">
                  <img
                    src={parcelBoxImg}
                    alt="KSRTC Parcel"
                    className="w-full h-full object-contain filter drop-shadow-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Horizontal Shipment Progress Indicator with Vehicle Icon */}
              <div className="mt-4 pt-2">
                <div className="relative w-full h-2 rounded-full bg-white/25 overflow-visible">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${activeShipment.progressPercent}%` }}
                  />
                  {/* Vehicle icon sliding on progress line */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#003d99] text-white flex items-center justify-center ring-2 ring-white shadow-md transition-all duration-500 cursor-pointer"
                    style={{ left: `${activeShipment.progressPercent}%` }}
                    title={`Progress: ${activeShipment.progressPercent}%`}
                  >
                    <Truck className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Recent Shipments (White Card) */}
          <div className="rounded-[26px] bg-white p-5 shadow-md shadow-blue-900/5 border border-sky-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-800">
                  Recent Shipments
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('History')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                >
                  View All
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/90 text-blue-700 text-xs font-extrabold mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                {secondaryShipment.status}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">
                    Current Tracking
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveShipment(secondaryShipment)}
                    className="text-sm font-extrabold text-slate-800 hover:text-blue-600 transition-colors text-left"
                  >
                    {secondaryShipment.trackingNumber}
                  </button>

                  <div className="text-[10px] font-semibold text-slate-400 uppercase mt-2">
                    Current Location
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <MapPin className="w-3 h-3 text-blue-500" />
                    <span>{secondaryShipment.currentLocation}</span>
                  </div>
                </div>

                {/* 3D Box in Recent Shipments */}
                <div className="w-16 h-16 shrink-0">
                  <img
                    src={parcelBoxImg}
                    alt="Parcel Box"
                    className="w-full h-full object-contain filter drop-shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Progress Bar in Recent Shipments */}
            <div className="mt-4 pt-2">
              <div className="relative w-full h-2 rounded-full bg-sky-100 overflow-visible">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${secondaryShipment.progressPercent}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-white shadow-xs"
                  style={{ left: `${secondaryShipment.progressPercent}%` }}
                >
                  <Truck className="w-2.5 h-2.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            COLUMN 3: Interactive Map + Delivery Partner Card (Right, 4 cols on lg)
           ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Card 1: Realistic Interactive Map */}
          <div className="rounded-[26px] bg-white p-3.5 shadow-md shadow-blue-900/5 border border-sky-100">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Live Fleet Radar & Route
                </h3>
              </div>
              <span className="text-[11px] font-bold text-blue-600">
                {activeShipment.trackingNumber}
              </span>
            </div>
            <InteractiveMap shipment={activeShipment} heightClassName="h-[240px]" />
          </div>

          {/* Card 2: Delivery Partner Card */}
          <div className="rounded-[26px] bg-white p-5 shadow-md shadow-blue-900/5 border border-sky-100 flex flex-col justify-between">
            <div>
              {/* Partner Profile Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-100 bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80"
                      alt="Delivery Partner"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-800 leading-tight">
                      {activeShipment.deliveryPartnerName || 'Pradeep Kumar Panicker'}
                    </div>
                    <div className="text-xs text-slate-400 font-semibold">
                      KSRTC Swift Express Pilot
                    </div>
                  </div>
                </div>

                {/* Message Icon */}
                <button
                  type="button"
                  onClick={() => {
                    setCallPartnerShipment(activeShipment);
                    setIsCallModalOpen(true);
                  }}
                  className="w-8 h-8 rounded-full bg-sky-50 hover:bg-sky-100 text-blue-600 flex items-center justify-center transition-colors shadow-xs"
                  title="Direct Message"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>

              {/* Status Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500 text-white text-xs font-bold mb-3 shadow-xs">
                <span>Will deliver in {activeShipment.etaMinutes || 25} mins</span>
              </div>

              {/* Date & Tracking */}
              <div className="text-xs font-semibold text-slate-400">
                {activeShipment.bookingDate}
              </div>
              <div className="text-sm font-extrabold text-slate-800 tracking-tight">
                {activeShipment.trackingNumber}
              </div>

              {/* Pickup & Delivery Locations */}
              <div className="flex items-center justify-between mt-3">
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">
                      Pickup Location
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate max-w-[150px]">{activeShipment.pickupLocation}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">
                      Delivery Location
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate max-w-[150px]">{activeShipment.deliveryLocation}</span>
                    </div>
                  </div>
                </div>

                {/* 3D Box graphic */}
                <div className="w-16 h-16 shrink-0">
                  <img
                    src={parcelBoxImg}
                    alt="Shipment"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Call Delivery Partner CTA */}
            <div className="mt-5">
              <button
                type="button"
                onClick={() => {
                  setCallPartnerShipment(activeShipment);
                  setIsCallModalOpen(true);
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0066ff] to-[#0052cc] hover:from-[#0052cc] hover:to-[#0040a8] active:scale-[0.99] text-white rounded-full font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white text-blue-600 flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>Call Delivery Partner</span>
                </div>
                <div className="font-black text-sm tracking-tighter text-white pr-1">
                  &gt;&gt;&gt;
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Footer bar matching screenshot exactly */}
      <footer className="pt-6 pb-2 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <div>
          © 2025 KSRTC Logistics. All rights reserved.
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <button type="button" onClick={() => setIsSupportModalOpen(true)} className="hover:text-blue-600">Privacy Policy</button>
          <span>|</span>
          <button type="button" onClick={() => setIsSupportModalOpen(true)} className="hover:text-blue-600">Terms of Service</button>
          <span>|</span>
          <button type="button" onClick={() => setIsSupportModalOpen(true)} className="hover:text-blue-600">Contact</button>
        </div>
      </footer>
    </div>
  );
};
