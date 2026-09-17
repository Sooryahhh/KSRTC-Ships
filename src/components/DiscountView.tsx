import React from 'react';
import { Percent, Tag, Check, ArrowRight, Sparkles, Gift } from 'lucide-react';
import { useShipment } from '../context/ShipmentContext';
import { DiscountCoupon } from '../types';

export const DiscountView: React.FC = () => {
  const { coupons, appliedCoupon, setAppliedCoupon, setActiveTab } = useShipment();

  const handleApplyCoupon = (coupon: DiscountCoupon) => {
    setAppliedCoupon(coupon);
    setActiveTab('Shipments');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <Percent className="w-3.5 h-3.5" />
            Depot Courier Tariffs & Concessions
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Special Freight Concessions & Promo Codes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Apply active government depot promo codes for student documents, commercial volume freight, and corridor discounts.
          </p>
        </div>

        {appliedCoupon && (
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Active: {appliedCoupon.code} ({appliedCoupon.discountPercentage}% off)</span>
          </div>
        )}
      </div>

      {/* Grid of Coupons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {coupons.map((coupon) => {
          const isSelected = appliedCoupon?.code === coupon.code;
          return (
            <div
              key={coupon.code}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'border-emerald-400 ring-2 ring-emerald-400/20 shadow-md'
                  : 'border-sky-100 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold text-xs">
                  {coupon.badge}
                </span>
                <span className="text-xs text-slate-400 font-medium">Valid until {coupon.validUntil}</span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-blue-600 tracking-tight">
                    {coupon.discountPercentage}% OFF
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 uppercase font-mono">
                    {coupon.code}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-800 mt-2">
                  {coupon.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {coupon.description}
                </p>

                <div className="mt-3 text-[11px] text-slate-400">
                  Minimum parcel weight requirement: <strong className="text-slate-700">{coupon.minWeightKg} kg</strong>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleApplyCoupon(coupon)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Applied • Go to Booking Form</span>
                    </>
                  ) : (
                    <>
                      <Tag className="w-4 h-4" />
                      <span>Apply Code & Book Parcel</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
