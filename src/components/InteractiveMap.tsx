import React, { useState } from 'react';
import { LocateFixed, ZoomIn, ZoomOut, Truck, Home as HomeIcon, Building2, Navigation } from 'lucide-react';
import { Shipment } from '../types';

interface InteractiveMapProps {
  shipment: Shipment;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ shipment }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showSatellite, setShowSatellite] = useState<boolean>(false);

  // Map route points calculations
  // Origin (x: 55, y: 55) -> Point 2 (x: 265, y: 70) -> Point 3 (x: 268, y: 195)
  // Vehicle position calculated along route depending on progressPercent
  const progress = Math.min(100, Math.max(10, shipment.progressPercent));
  
  // Segment 1: from (55, 55) to (265, 70), length approx 210
  // Segment 2: from (265, 70) to (268, 195), length approx 125
  // Total length = 335
  const seg1Share = 210 / 335; // ~0.627
  let vehicleX = 55;
  let vehicleY = 55;
  const t = progress / 100;

  if (t <= seg1Share) {
    const subT = t / seg1Share;
    vehicleX = 55 + (265 - 55) * subT;
    vehicleY = 55 + (70 - 55) * subT;
  } else {
    const subT = (t - seg1Share) / (1 - seg1Share);
    vehicleX = 265 + (268 - 265) * subT;
    vehicleY = 70 + (195 - 70) * subT;
  }

  return (
    <div className="relative w-full h-[220px] rounded-3xl overflow-hidden bg-[#e8f1f8] border border-sky-100 shadow-sm select-none">
      {/* Map Graphic Canvas / Vector Rendering */}
      <svg
        className="w-full h-full"
        viewBox="0 0 340 220"
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.3s ease' }}
      >
        <defs>
          {/* Subtle Grid pattern for city blocks */}
          <pattern id="streetGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#eef5fb" />
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#dce8f3" strokeWidth="1" />
          </pattern>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0066ff" />
            <stop offset="100%" stopColor="#0052cc" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0066ff" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Base background with city blocks */}
        <rect width="100%" height="100%" fill="url(#streetGrid)" />

        {/* City Blocks (subtle rectangular shapes) */}
        <rect x="15" y="10" width="80" height="30" rx="4" fill="#f4f9fd" />
        <rect x="110" y="10" width="130" height="30" rx="4" fill="#f4f9fd" />
        <rect x="15" y="75" width="70" height="120" rx="4" fill="#f4f9fd" />
        <rect x="100" y="90" width="135" height="45" rx="4" fill="#f4f9fd" />
        <rect x="100" y="150" width="135" height="50" rx="4" fill="#f4f9fd" />
        <rect x="250" y="10" width="75" height="40" rx="4" fill="#f4f9fd" />
        <rect x="285" y="70" width="45" height="130" rx="4" fill="#f4f9fd" />

        {/* Secondary Street outlines (white bands) */}
        <path d="M 0 55 Q 160 60 340 70" fill="none" stroke="#ffffff" strokeWidth="14" />
        <path d="M 268 0 L 268 220" fill="none" stroke="#ffffff" strokeWidth="14" />
        <path d="M 95 60 L 95 220" fill="none" stroke="#ffffff" strokeWidth="10" />
        <path d="M 0 145 L 268 145" fill="none" stroke="#ffffff" strokeWidth="10" />

        {/* Street Names (matching screenshot exact labels) */}
        <text x="175" y="48" fill="#8c9fb3" fontSize="8.5" fontWeight="600" textAnchor="middle">
          Goomes Street
        </text>
        <text x="50" y="140" fill="#8c9fb3" fontSize="8" fontWeight="500" transform="rotate(-90, 50, 140)">
          Bakar Street
        </text>
        <text x="90" y="140" fill="#8c9fb3" fontSize="8" fontWeight="500" transform="rotate(-90, 90, 140)">
          Francis Joagph Street
        </text>
        <text x="180" y="138" fill="#8c9fb3" fontSize="8" fontWeight="500" textAnchor="middle">
          Bagyam Inn
        </text>
        <text x="268" y="212" fill="#8c9fb3" fontSize="8.5" fontWeight="600" textAnchor="middle">
          Dara Road
        </text>

        {/* Blue Main Route Path (bold blue line) */}
        <path
          d="M 55 55 L 265 70 L 268 195"
          fill="none"
          stroke="#0066ff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#softGlow)"
        />

        {/* Origin Station Marker (matching the building glyph inside circle in screenshot) */}
        <g transform="translate(55, 55)">
          <circle r="12" fill="#ffffff" stroke="#004bb5" strokeWidth="2.5" />
          <circle r="7" fill="#0f3b82" />
          {/* Building pill icon */}
          <rect x="-3" y="-3" width="6" height="6" fill="#ffffff" rx="1" />
        </g>

        {/* Destination Station Marker (home/terminal icon in circle) */}
        <g transform="translate(268, 195)">
          <circle r="12" fill="#ffffff" stroke="#004bb5" strokeWidth="2.5" />
          <circle r="7" fill="#0066ff" />
          <path d="M -3 1 L 0 -3 L 3 1 Z" fill="#ffffff" />
          <rect x="-2" y="1" width="4" height="3" fill="#ffffff" />
        </g>

        {/* Vehicle Location Marker (dark blue circle with delivery truck icon, exact as screenshot) */}
        <g transform={`translate(${vehicleX}, ${vehicleY})`} className="cursor-pointer">
          {/* Subtle radar pulse */}
          <circle r="16" fill="#0066ff" opacity="0.2" className="animate-ping" />
          <circle r="12" fill="#002d72" stroke="#ffffff" strokeWidth="2" filter="url(#softGlow)" />
          {/* Tiny truck shape */}
          <g transform="translate(-5, -5) scale(0.4)" fill="#ffffff">
            <path d="M2 3h14v10H2zm14 3h4l3 4v3h-7zm-9 9a2 2 0 100 4 2 2 0 000-4zm11 0a2 2 0 100 4 2 2 0 000-4z" />
          </g>
        </g>
      </svg>

      {/* Top Right Map Control Button (Locate / Crosshair button as in screenshot) */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        <button
          type="button"
          onClick={() => {
            setZoomLevel(1);
            setShowSatellite(!showSatellite);
          }}
          className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center transition-transform active:scale-95"
          title="Recenter Route Focus"
        >
          <LocateFixed className="w-4 h-4 text-blue-600" />
        </button>

        {/* Small Zoom Controls */}
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm border border-slate-200 flex items-center justify-center text-xs font-bold"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5 text-slate-600" />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm border border-slate-200 flex items-center justify-center text-xs font-bold"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5 text-slate-600" />
        </button>
      </div>

      {/* Bottom Route pill banner */}
      <div className="absolute bottom-2 left-2 z-10 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-sky-100 shadow-xs flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>KSRTC Transit Corridor • Live GPS</span>
      </div>
    </div>
  );
};
