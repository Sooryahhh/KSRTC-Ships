import React, { useState } from 'react';
import {
  Package,
  Send,
  User,
  Phone,
  MapPin,
  Scale,
  Shield,
  Tag,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Bus,
  AlertCircle
} from 'lucide-react';
import { useShipment } from '../context/ShipmentContext';
import { ParcelCategory, ServiceType } from '../types';

export const BookParcelView: React.FC = () => {
  const {
    stations,
    coupons,
    appliedCoupon,
    setAppliedCoupon,
    bookShipment,
    setActiveTab,
    setActiveWaybillShipment
  } = useShipment();

  // Form states
  const [senderName, setSenderName] = useState('Ronald Richards');
  const [senderPhone, setSenderPhone] = useState('+91 94471 88201');
  const [senderCity, setSenderCity] = useState('Thiruvananthapuram');
  const [senderStation, setSenderStation] = useState(stations[0].name);

  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverCity, setReceiverCity] = useState('Kochi');
  const [receiverStation, setReceiverStation] = useState(stations[1].name);

  const [category, setCategory] = useState<ParcelCategory>('Electronics');
  const [weightKg, setWeightKg] = useState<number>(3.5);
  const [declaredValue, setDeclaredValue] = useState<number>(5000);
  const [serviceType, setServiceType] = useState<ServiceType>('Express Cargo (Fastest Bus)');
  const [notes, setNotes] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; success: boolean } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<any | null>(null);

  // Price math
  const ratePerKg = serviceType.includes('Express') ? 60 : 35;
  const baseFreight = Math.max(120, Math.round(weightKg * ratePerKg));
  const handlingFee = 40;
  const subtotal = baseFreight + handlingFee;
  const gst = Math.round(subtotal * 0.18);
  const grossTotal = subtotal + gst;

  const discountAmount = appliedCoupon
    ? Math.round((grossTotal * appliedCoupon.discountPercentage) / 100)
    : 0;
  const finalTotal = Math.max(50, grossTotal - discountAmount);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const match = coupons.find((c) => c.code === code);
    if (match) {
      if (weightKg < match.minWeightKg) {
        setCouponMsg({
          text: `Coupon requires minimum weight of ${match.minWeightKg} kg.`,
          success: false
        });
        return;
      }
      setAppliedCoupon(match);
      setCouponMsg({
        text: `Success! ${match.discountPercentage}% discount applied (${match.title}).`,
        success: true
      });
    } else {
      setCouponMsg({ text: 'Invalid coupon code. Try KSRTC25 or BULKFREIGHT.', success: false });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverName.trim() || !receiverPhone.trim()) {
      alert('Please fill in the Receiver Name and Phone number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const booked = bookShipment({
        senderName,
        senderPhone,
        senderCity,
        senderStation,
        receiverName,
        receiverPhone,
        receiverCity,
        receiverStation,
        category,
        weightKg,
        declaredValue,
        serviceType,
        notes,
        couponCode: appliedCoupon?.code
      });

      setSuccessBooking(booked);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <Bus className="w-3.5 h-3.5" />
            Official KSRTC Bus Cargo & Courier Booking
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Book a New Bus Parcel
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fill the consignment details to immediately issue an official AWB Reference Number with automated depot bay routing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('Discount')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-sky-50 hover:bg-sky-100 text-blue-700 font-bold text-xs border border-sky-200 transition-colors"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>View Promo Coupons</span>
          </button>
        </div>
      </div>

      {/* Success Confirmation Modal / Banner if just booked */}
      {successBooking && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs uppercase font-bold tracking-wider text-emerald-100">
                  Consignment Note Issued Successfully
                </div>
                <div className="text-2xl font-black tracking-tight mt-0.5">
                  Reference: {successBooking.trackingNumber}
                </div>
                <div className="text-xs text-emerald-50 mt-1">
                  Saved to Home dashboard, History, and Station Manifest!
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveWaybillShipment(successBooking)}
                className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 shadow-sm transition-all"
              >
                Print Waybill
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('Track')}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all flex items-center gap-1"
              >
                <span>Track Live</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setSuccessBooking(null)}
                className="text-xs text-emerald-100 hover:text-white underline pl-2"
              >
                Book Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form + Live Tariff Summary Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form Inputs (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Sender Details */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-800 font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                1
              </div>
              <span>Origin & Sender Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Sender Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium"
                    placeholder="e.g. Ronald Richards"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium"
                    placeholder="+91 94471 00000"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Sender City / Town</label>
                <input
                  type="text"
                  required
                  value={senderCity}
                  onChange={(e) => setSenderCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none font-medium"
                  placeholder="e.g. Thiruvananthapuram"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Origin KSRTC Station Depot</label>
                <select
                  value={senderStation}
                  onChange={(e) => setSenderStation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none font-medium bg-white"
                >
                  {stations.map((st) => (
                    <option key={st.id} value={st.name}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Receiver Details */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-800 font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                2
              </div>
              <span>Destination & Consignee Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Recipient Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium"
                    placeholder="e.g. Anjali Nair / Apex Motors"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Recipient Mobile (for Arrival SMS OTP)</label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium"
                    placeholder="+91 98471 00000"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Destination City / Town</label>
                <input
                  type="text"
                  required
                  value={receiverCity}
                  onChange={(e) => setReceiverCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none font-medium"
                  placeholder="e.g. Kochi / Calicut"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Destination Receiving Depot</label>
                <select
                  value={receiverStation}
                  onChange={(e) => setReceiverStation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none font-medium bg-white"
                >
                  {stations.map((st) => (
                    <option key={st.id} value={st.name}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Parcel Specs & Delivery Tier */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-800 font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                3
              </div>
              <span>Consignment Specifications & Service Speed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Cargo Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ParcelCategory)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none font-medium bg-white"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Documents">Legal Documents</option>
                  <option value="Textiles & Garments">Textiles & Garments</option>
                  <option value="Spare Parts">Spare Parts & Hardware</option>
                  <option value="Perishables">Perishables (Agri / Food)</option>
                  <option value="General Cargo">General Cargo</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Weight (in kg)</label>
                <div className="relative flex items-center">
                  <Scale className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min="0.2"
                    max="100"
                    step="0.1"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0.5)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Declared Value (₹)</label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  required
                  value={declaredValue}
                  onChange={(e) => setDeclaredValue(parseInt(e.target.value) || 1000)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Service Speed Selector */}
            <div className="pt-2">
              <label className="font-bold text-slate-700 block mb-2 text-xs">KSRTC Service Priority</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setServiceType('Express Cargo (Fastest Bus)')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all ${
                    serviceType.includes('Express')
                      ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Express SuperFast Bus Cargo</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Loaded on the very next departing SuperFast/Minnal bus. 6-12 hr delivery.
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600">₹60/kg</span>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceType('Standard KSRTC Freight')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all ${
                    !serviceType.includes('Express')
                      ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-slate-800">
                      Standard Depot Cargo
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Transferred via regular daily service schedule. Economical 24-36 hr delivery.
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-600">₹35/kg</span>
                </button>
              </div>
            </div>

            {/* Handling Notes */}
            <div className="pt-2">
              <label className="font-bold text-slate-700 block mb-1 text-xs">
                Special Handling Instructions (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Fragile glass, keep upright, destination depot call on arrival"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Right Tariff Calculator & Confirmation (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 sticky top-4">
            <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Waybill Freight Calculation</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                Official Tariff
              </span>
            </h3>

            {/* Price breakdown rows */}
            <div className="py-4 space-y-2.5 text-xs border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Base Weight Rate ({weightKg} kg @ ₹{ratePerKg}/kg):</span>
                <span className="font-bold text-slate-800">₹{baseFreight}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Depot Loading & Bay Handling:</span>
                <span className="font-bold text-slate-800">₹{handlingFee}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">GST (18% Transport Services):</span>
                <span className="font-bold text-slate-800">₹{gst}</span>
              </div>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-emerald-600 font-bold bg-emerald-50 p-2 rounded-xl">
                  <span>Coupon ({appliedCoupon.code} - {appliedCoupon.discountPercentage}% off):</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-sm font-black text-slate-900 border-t border-dashed border-slate-200">
                <span>Total Consignment Amount:</span>
                <span className="text-xl text-blue-600">₹{finalTotal}</span>
              </div>
            </div>

            {/* Apply Discount Coupon */}
            <div className="py-3">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Have a Freight Promo Coupon?
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. KSRTC25"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 uppercase font-bold focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </div>

              {couponMsg && (
                <div
                  className={`mt-2 text-xs font-semibold ${
                    couponMsg.success ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {couponMsg.text}
                </div>
              )}
            </div>

            {/* Final Booking Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 bg-gradient-to-r from-[#0066ff] to-[#0052cc] hover:from-[#0052cc] hover:to-[#0040a8] active:scale-[0.99] text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Issue Waybill & Confirm Booking</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>Includes KSRTC State Transit Cargo Guarantee</span>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
