import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Truck,
  Sparkles,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useShipment } from '../context/ShipmentContext';

import ksrtcBusHeroImg from '../assets/images/ksrtc_bus_hero_1789639274972.jpg';
import ksrtcCargoDispatchImg from '../assets/images/ksrtc_cargo_dispatch_1789791289989.jpg';
import keralaHighwayTransitImg from '../assets/images/kerala_highway_transit_1789791305240.jpg';
import logisticsSortingHubImg from '../assets/images/logistics_sorting_hub_1789791317662.jpg';

export interface SlideData {
  id: string;
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  accentText: string;
  tagColor: string;
  stats: string;
}

export const PICTURE_SLIDES: SlideData[] = [
  {
    id: 'slide-1',
    image: ksrtcBusHeroImg,
    badge: 'Depot Fleet Connected',
    title: 'Effortless Shipping,\nSmarter Business',
    subtitle: 'KSRTC Swift Express Logistics',
    description:
      'Ship faster and smarter with next-bus guaranteed cargo dispatch. Connecting 93 KSRTC depots across all 14 districts in Kerala.',
    accentText: 'Overnight Delivery Guaranteed',
    tagColor: 'bg-emerald-400',
    stats: '93 Depots • 14 Districts',
  },
  {
    id: 'slide-2',
    image: ksrtcCargoDispatchImg,
    badge: 'Belly-Hold Freight Cargo',
    title: 'High-Capacity Bays,\nNext-Bus Dispatch',
    subtitle: 'Depot Cargo Loading & Seal',
    description:
      'Priority luggage bay allocation on SuperFast and Swift fleets with tamper-evident security seals and live manifest verification.',
    accentText: 'Up to 500 kg per Bus Fleet',
    tagColor: 'bg-sky-400',
    stats: 'Heavy Cargo • 24/7 Loading',
  },
  {
    id: 'slide-3',
    image: keralaHighwayTransitImg,
    badge: 'NH 66 & MC Road Corridors',
    title: 'Real-Time Telematics,\nLive Highway GPS',
    subtitle: 'Corridor Transit Speed 60 km/h',
    description:
      'Continuous satellite GPS tracking along Kerala’s iconic coastal highway and hill routes with automated milestone updates.',
    accentText: 'Live GPS Satellite Tracking',
    tagColor: 'bg-amber-400',
    stats: 'Live 5G GPS • Zero Delay',
  },
  {
    id: 'slide-4',
    image: logisticsSortingHubImg,
    badge: 'Smart Waybill & Barcode Hub',
    title: 'Instant Electronic Weighing\n& SMS Delivery OTP',
    subtitle: 'Quick Counter Consignments',
    description:
      'Swift drop-offs with electronic weight validation, printed thermal waybill stickers, and confidential SMS delivery PIN protection.',
    accentText: 'Zero-Loss Guarantee',
    tagColor: 'bg-indigo-400',
    stats: 'Instant Waybill • OTP Security',
  },
  {
    id: 'slide-5',
    image:
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
    badge: 'Interstate Freight Corridor',
    title: 'Connecting Kerala to\nBengaluru & Mysore',
    subtitle: 'Interstate Express Cargo Route',
    description:
      'Daily scheduled overnight transit connecting Trivandrum and Kochi directly to Bengaluru Shanthinagar and Coimbatore hubs.',
    accentText: 'Interstate Hub Network',
    tagColor: 'bg-teal-400',
    stats: 'Daily Departures • Multi-State',
  },
];

interface PictureSlideshowProps {
  intervalMs?: number;
  className?: string;
}

export const PictureSlideshow: React.FC<PictureSlideshowProps> = ({
  intervalMs = 4500,
  className = '',
}) => {
  const { setActiveTab } = useShipment();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = PICTURE_SLIDES.length;
  const currentSlide = PICTURE_SLIDES[currentIndex];

  // Advance to next slide
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setProgress(0);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  // Timer loop for interval rotation and smooth progress bar
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    setProgress(0);
    const tickInterval = 50; // update progress every 50ms
    const step = (tickInterval / intervalMs) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + step;
      });
    }, tickInterval);

    timerRef.current = setInterval(() => {
      nextSlide();
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isPlaying, intervalMs]);

  return (
    <div
      className={`flex flex-col h-full rounded-[26px] overflow-hidden bg-gradient-to-b from-[#1875eb] to-[#0d59c2] text-white shadow-xl shadow-blue-900/10 border border-blue-400/20 relative group select-none ${className}`}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Visual Image Banner with Slides Animation */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Deep Gradient Overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1875eb] via-black/20 to-black/50 pointer-events-none" />

        {/* Top Floating Badge with live pulse */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white flex items-center gap-1.5 shadow-lg">
            <span className={`w-2 h-2 rounded-full ${currentSlide.tagColor} animate-pulse`} />
            <span>{currentSlide.badge}</span>
          </div>
        </div>

        {/* Top Right Controls (Slide Counter & Play/Pause) */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-xs transition-colors"
            title={isPlaying ? 'Pause Slideshow' : 'Resume Auto-Play'}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
          </button>
          <div className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[10.5px] font-mono font-bold text-white/90">
            0{currentIndex + 1} / 0{totalSlides}
          </div>
        </div>

        {/* Left & Right Arrow Navigation (Visible on hover) */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 active:scale-95"
          title="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 active:scale-95"
          title="Next Slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Stats Pill on bottom of image */}
        <div className="absolute bottom-3 left-4 z-10 text-[11px] font-extrabold text-white/90 drop-shadow-md flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{currentSlide.stats}</span>
        </div>
      </div>

      {/* Slide Content Area below Image */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Carousel Indicators with Time Progress Filling */}
          <div className="flex items-center gap-2 mb-4">
            {PICTURE_SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className="relative h-2 rounded-full overflow-hidden transition-all duration-300 focus:outline-none"
                  style={{ width: isActive ? '38px' : '10px' }}
                  title={`Go to slide ${idx + 1}`}
                >
                  <div className="absolute inset-0 bg-white/30 rounded-full" />
                  {isActive ? (
                    <motion.div
                      className="absolute inset-0 bg-white rounded-full"
                      style={{
                        width: `${progress}%`,
                        transition: isPlaying ? 'width 0.05s linear' : 'none',
                      }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Large Dynamic Headline with Fade Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-200 mb-1">
                {currentSlide.subtitle}
              </div>
              <h2 className="text-2xl sm:text-[25px] font-black leading-tight tracking-tight text-white mb-2.5 whitespace-pre-line">
                {currentSlide.title}
              </h2>
              <p className="text-sm text-sky-100/90 leading-relaxed font-normal">
                {currentSlide.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Large Rounded Get Started CTA Button */}
        <div className="mt-7">
          <button
            type="button"
            onClick={() => setActiveTab('BookParcel')}
            className="w-full py-3.5 px-4 bg-white hover:bg-sky-50 active:scale-[0.99] text-[#0052cc] rounded-full font-extrabold text-sm shadow-lg shadow-blue-950/20 flex items-center justify-between transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0052cc] text-white flex items-center justify-center shadow-xs">
                <Truck className="w-4 h-4" />
              </div>
              <span className="tracking-wide">Book Consignment Now</span>
            </div>
            <div className="text-blue-600 font-bold tracking-tighter text-base pr-1">
              &gt;&gt;&gt;
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
