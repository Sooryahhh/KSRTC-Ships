import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  LocateFixed,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Layers,
  Truck,
  Building2,
  MapPin,
  Radio,
  Gauge,
  Compass,
  X
} from 'lucide-react';
import { Shipment } from '../types';
import { getCorridorRoute, getInterpolatedVehiclePosition, GeoPoint } from '../utils/geoRoutes';

interface InteractiveMapProps {
  shipment: Shipment;
  heightClassName?: string;
  isExpandedInitial?: boolean;
}

type MapLayerType = 'street' | 'satellite' | 'logistics';

const TILE_LAYERS: Record<MapLayerType, { url: string; attribution: string; maxZoom: number }> = {
  street: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Earthstar Geographics',
    maxZoom: 18,
  },
  logistics: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  shipment,
  heightClassName = 'h-[230px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const modalMapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const modalMapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const modalTileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapLayerType>('street');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Compute realistic route and interpolated vehicle location along Kerala highways
  const routePoints: GeoPoint[] = getCorridorRoute(
    shipment.senderCity || shipment.senderStation,
    shipment.receiverCity || shipment.receiverStation
  );

  const vehicleTelemetry = getInterpolatedVehiclePosition(
    routePoints,
    shipment.progressPercent
  );

  const originPoint = routePoints[0];
  const destPoint = routePoints[routePoints.length - 1];

  // Helper to construct custom HTML markers for Leaflet
  const setupMapContent = (map: L.Map) => {
    // Clear existing map layers other than base tiles
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    const latLngs = routePoints.map((p) => [p.lat, p.lng] as [number, number]);

    // 1. Outer glow polyline
    L.polyline(latLngs, {
      color: '#0052cc',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // 2. Traversed Route (Emerald Green)
    const progressIndex = Math.floor((shipment.progressPercent / 100) * (latLngs.length - 1));
    const completedLatLngs = latLngs.slice(0, progressIndex + 1);
    completedLatLngs.push(vehicleTelemetry.position);

    if (completedLatLngs.length > 1) {
      L.polyline(completedLatLngs, {
        color: '#10b981',
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
      }).addTo(map);
    }

    // 3. Remaining Route (Vivid Highway Blue)
    const remainingLatLngs = [vehicleTelemetry.position, ...latLngs.slice(progressIndex + 1)];
    if (remainingLatLngs.length > 1) {
      L.polyline(remainingLatLngs, {
        color: '#0066ff',
        weight: 4.5,
        dashArray: '6, 8',
        opacity: 0.85,
        lineCap: 'round',
      }).addTo(map);
    }

    // 4. Origin Station Marker
    const originIcon = L.divIcon({
      className: 'custom-station-icon',
      html: `
        <div style="position: relative; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center;">
          <div style="background: #10b981; border: 2.5px solid #ffffff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.25);">
            <div style="width: 8px; height: 8px; background: white; border-radius: 2px;"></div>
          </div>
          <div style="margin-top: 2px; background: rgba(15, 23, 42, 0.85); color: white; padding: 1px 6px; border-radius: 9999px; font-size: 9px; font-weight: 800; white-space: nowrap; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            ${originPoint.stationCode || 'ORIGIN'}
          </div>
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });

    const originMarker = L.marker([originPoint.lat, originPoint.lng], { icon: originIcon }).addTo(map);
    originMarker.bindPopup(`
      <div style="padding: 10px 14px; min-width: 170px;">
        <div style="font-size: 10px; font-weight: 700; color: #10b981; text-transform: uppercase;">Origin Station</div>
        <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 2px;">${originPoint.name}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Dispatched: ${shipment.bookingDate}</div>
      </div>
    `, { className: 'custom-station-popup' });

    // 5. Destination Station Marker
    const destIcon = L.divIcon({
      className: 'custom-dest-icon',
      html: `
        <div style="position: relative; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center;">
          <div style="background: #0066ff; border: 2.5px solid #ffffff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.25);">
            <div style="width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-bottom: 7px solid white;"></div>
          </div>
          <div style="margin-top: 2px; background: rgba(15, 23, 42, 0.85); color: white; padding: 1px 6px; border-radius: 9999px; font-size: 9px; font-weight: 800; white-space: nowrap; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            ${destPoint.stationCode || 'DEST'}
          </div>
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });

    const destMarker = L.marker([destPoint.lat, destPoint.lng], { icon: destIcon }).addTo(map);
    destMarker.bindPopup(`
      <div style="padding: 10px 14px; min-width: 170px;">
        <div style="font-size: 10px; font-weight: 700; color: #0066ff; text-transform: uppercase;">Destination Terminal</div>
        <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 2px;">${destPoint.name}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Estimated: ${shipment.estimatedDelivery}</div>
      </div>
    `, { className: 'custom-station-popup' });

    // 6. Intermediate Station waypoints
    routePoints.slice(1, -1).forEach((pt) => {
      if (pt.isStation) {
        const stationDot = L.divIcon({
          className: 'custom-mid-station',
          html: `
            <div style="width: 10px; height: 10px; background: #ffffff; border: 2.5px solid #3b82f6; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.2);"></div>
          `,
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });
        const midMarker = L.marker([pt.lat, pt.lng], { icon: stationDot }).addTo(map);
        midMarker.bindPopup(`
          <div style="padding: 8px 12px; min-width: 140px;">
            <div style="font-size: 9px; font-weight: 700; color: #3b82f6; text-transform: uppercase;">Transit Depot</div>
            <div style="font-size: 12px; font-weight: 700; color: #0f172a;">${pt.name}</div>
          </div>
        `, { className: 'custom-station-popup' });
      }
    });

    // 7. Live KSRTC Express Bus Marker with Radar Wave and Directional Heading
    const busIcon = L.divIcon({
      className: 'custom-bus-marker',
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <!-- Radar Wave Pulse -->
          <div class="map-radar-pulse" style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(0, 102, 255, 0.4); pointer-events: none;"></div>
          
          <!-- Outer Badge with Heading Arrow & Bus -->
          <div style="position: relative; z-index: 2; width: 34px; height: 34px; border-radius: 50%; background: #002d72; border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(0, 45, 114, 0.45); transform: rotate(${vehicleTelemetry.bearing - 90}deg); transition: transform 0.4s ease;">
            <!-- Heading notch -->
            <div style="position: absolute; top: -4px; width: 6px; height: 6px; background: #38bdf8; clip-path: polygon(50% 0%, 0% 100%, 100% 100%);"></div>
            <!-- Bus Silhouette -->
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 6v6"></path>
              <path d="M16 6v6"></path>
              <path d="M4 6h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path>
              <circle cx="7" cy="17" r="2"></circle>
              <circle cx="17" cy="17" r="2"></circle>
            </svg>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const vehicleMarker = L.marker(vehicleTelemetry.position, { icon: busIcon, zIndexOffset: 1000 }).addTo(map);

    vehicleMarker.bindTooltip(
      `
      <div style="display: flex; flex-direction: column; gap: 2px;">
        <div style="display: flex; items-center; gap: 6px;">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10b981;"></span>
          <span style="font-weight: 800; color: #ffffff;">${shipment.busNumber?.split(' ')[0] || 'KSRTC Express'}</span>
        </div>
        <div style="font-size: 10px; color: #93c5fd; font-weight: 600;">58 km/h • ${shipment.currentLocation}</div>
      </div>
      `,
      {
        permanent: false,
        direction: 'top',
        className: 'custom-leaflet-tooltip',
        offset: [0, -18],
      }
    );
  };

  // Initialize Map in default container
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: vehicleTelemetry.position,
        zoom: 9,
        zoomControl: false,
        attributionControl: true,
      });

      const tileConfig = TILE_LAYERS[activeLayer];
      const tiles = L.tileLayer(tileConfig.url, {
        attribution: tileConfig.attribution,
        maxZoom: tileConfig.maxZoom,
      }).addTo(map);

      tileLayerRef.current = tiles;
      mapRef.current = map;

      setupMapContent(map);

      // Fit bounds to show route initially
      const bounds = L.latLngBounds(routePoints.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [30, 30] });
    } else {
      setupMapContent(mapRef.current);
    }

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      mapRef.current?.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [shipment.id, shipment.progressPercent]);

  // Handle tile layer change on inline map
  useEffect(() => {
    if (mapRef.current && tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
      const tileConfig = TILE_LAYERS[activeLayer];
      const newTiles = L.tileLayer(tileConfig.url, {
        attribution: tileConfig.attribution,
        maxZoom: tileConfig.maxZoom,
      }).addTo(mapRef.current);
      tileLayerRef.current = newTiles;
    }
  }, [activeLayer]);

  // Handle Fullscreen Modal Map
  useEffect(() => {
    if (!isFullscreen || !modalMapContainerRef.current) return;

    // Small delay to ensure modal DOM is mounted
    const timer = setTimeout(() => {
      if (!modalMapContainerRef.current) return;
      if (modalMapRef.current) {
        modalMapRef.current.remove();
        modalMapRef.current = null;
      }

      const modalMap = L.map(modalMapContainerRef.current, {
        center: vehicleTelemetry.position,
        zoom: 10,
        zoomControl: false,
        attributionControl: true,
      });

      const tileConfig = TILE_LAYERS[activeLayer];
      const tiles = L.tileLayer(tileConfig.url, {
        attribution: tileConfig.attribution,
        maxZoom: tileConfig.maxZoom,
      }).addTo(modalMap);

      modalTileLayerRef.current = tiles;
      modalMapRef.current = modalMap;

      setupMapContent(modalMap);

      const bounds = L.latLngBounds(routePoints.map((p) => [p.lat, p.lng]));
      modalMap.fitBounds(bounds, { padding: [50, 50] });
      modalMap.invalidateSize();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (modalMapRef.current) {
        modalMapRef.current.remove();
        modalMapRef.current = null;
      }
    };
  }, [isFullscreen]);

  // Handle tile layer change on modal map
  useEffect(() => {
    if (modalMapRef.current && modalTileLayerRef.current) {
      modalMapRef.current.removeLayer(modalTileLayerRef.current);
      const tileConfig = TILE_LAYERS[activeLayer];
      const newTiles = L.tileLayer(tileConfig.url, {
        attribution: tileConfig.attribution,
        maxZoom: tileConfig.maxZoom,
      }).addTo(modalMapRef.current);
      modalTileLayerRef.current = newTiles;
    }
  }, [activeLayer, isFullscreen]);

  // Map action buttons
  const handleRecenter = (targetMap: L.Map | null) => {
    if (!targetMap) return;
    targetMap.flyTo(vehicleTelemetry.position, 11, { duration: 1.2 });
  };

  const handleFitRoute = (targetMap: L.Map | null) => {
    if (!targetMap) return;
    const bounds = L.latLngBounds(routePoints.map((p) => [p.lat, p.lng]));
    targetMap.fitBounds(bounds, { padding: [35, 35] });
  };

  const handleZoom = (targetMap: L.Map | null, delta: number) => {
    if (!targetMap) return;
    targetMap.setZoom(targetMap.getZoom() + delta);
  };

  return (
    <>
      <div className={`relative w-full ${heightClassName} rounded-3xl overflow-hidden bg-slate-900 border border-sky-100 shadow-sm select-none`}>
        {/* Leaflet Map DOM container */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Top-Left: Live GPS Telemetry Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-[10.5px] font-extrabold text-white flex items-center gap-2 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="tracking-wide">Real GPS • NH 66 Corridor</span>
          </div>

          {/* Layer Selector Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="px-2.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 text-[11px] font-bold shadow-md flex items-center gap-1.5 border border-slate-200 transition-transform active:scale-95"
              title="Change Map Style"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span className="capitalize">{activeLayer}</span>
            </button>

            {showLayerMenu && (
              <div className="absolute top-9 left-0 w-32 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 flex flex-col gap-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setActiveLayer('street');
                    setShowLayerMenu(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-left text-xs font-bold transition-colors ${
                    activeLayer === 'street' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  🗺️ Street
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveLayer('satellite');
                    setShowLayerMenu(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-left text-xs font-bold transition-colors ${
                    activeLayer === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  🛰️ Satellite
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveLayer('logistics');
                    setShowLayerMenu(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-left text-xs font-bold transition-colors ${
                    activeLayer === 'logistics' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  🏢 Logistics
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Top-Right: Quick Action Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 pointer-events-auto">
          {/* Recenter / Focus Bus */}
          <button
            type="button"
            onClick={() => handleRecenter(mapRef.current)}
            className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center transition-transform active:scale-90"
            title="Focus On Bus"
          >
            <LocateFixed className="w-4 h-4 text-blue-600" />
          </button>

          {/* Fit Corridor */}
          <button
            type="button"
            onClick={() => handleFitRoute(mapRef.current)}
            className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center transition-transform active:scale-90"
            title="Fit Entire Corridor"
          >
            <Compass className="w-4 h-4 text-slate-600" />
          </button>

          {/* Zoom In & Out */}
          <button
            type="button"
            onClick={() => handleZoom(mapRef.current, 1)}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm border border-slate-200 flex items-center justify-center text-xs font-bold"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5 text-slate-600" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(mapRef.current, -1)}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm border border-slate-200 flex items-center justify-center text-xs font-bold"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5 text-slate-600" />
          </button>

          {/* Expand / Fullscreen Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center transition-transform active:scale-90"
            title="Expand Realistic Map"
          >
            <Maximize2 className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* Bottom Route & Telemetry Banner */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-md text-xs pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-extrabold text-slate-800 text-[11px] leading-tight flex items-center gap-1.5">
                <span>{shipment.currentLocation}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-700 font-bold">58 km/h</span>
              </div>
              <div className="text-[9.5px] font-semibold text-slate-400">
                Lat: {vehicleTelemetry.position[0].toFixed(4)}°N, Lng: {vehicleTelemetry.position[1].toFixed(4)}°E
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Progress</div>
              <div className="text-xs font-black text-blue-600">{shipment.progressPercent}%</div>
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center gap-1 transition-colors"
            >
              <span>Inspect</span>
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FULLSCREEN REALISTIC MAP MODAL
          ========================================================================= */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-6xl h-[88vh] bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col">
            
            {/* Modal Top Bar */}
            <div className="relative z-20 px-3 sm:px-5 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between text-white gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm sm:text-base font-black text-white tracking-tight truncate">
                      GPS Route Navigator
                    </h3>
                    <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[9px] sm:text-[10px] font-extrabold flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Feed
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">
                    Consignment <span className="text-white font-bold">{shipment.trackingNumber}</span> ({shipment.currentLocation})
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 ml-auto">
                {/* Layer Selector */}
                <div className="flex bg-slate-800 p-0.5 sm:p-1 rounded-xl border border-slate-700 text-[10px] sm:text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveLayer('street')}
                    className={`px-2 sm:px-3 py-1 rounded-lg transition-all ${
                      activeLayer === 'street' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Street
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLayer('satellite')}
                    className={`px-2 sm:px-3 py-1 rounded-lg transition-all ${
                      activeLayer === 'satellite' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Satellite
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLayer('logistics')}
                    className={`px-2 sm:px-3 py-1 rounded-lg transition-all ${
                      activeLayer === 'logistics' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Light
                  </button>
                </div>

                {/* Close modal */}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors active:scale-95"
                  title="Close Map View"
                  aria-label="Close Map View"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Modal Map Canvas */}
            <div className="relative flex-1 w-full h-full overflow-hidden bg-slate-950">
              <div ref={modalMapContainerRef} className="w-full h-full" />

              {/* Floating Map Navigation Tools */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleRecenter(modalMapRef.current)}
                  className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-white text-slate-800 shadow-xl flex items-center justify-center border border-slate-200 transition-transform active:scale-95"
                  title="Focus On Bus"
                >
                  <LocateFixed className="w-5 h-5 text-blue-600" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFitRoute(modalMapRef.current)}
                  className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-white text-slate-800 shadow-xl flex items-center justify-center border border-slate-200 transition-transform active:scale-95"
                  title="Fit Entire Route"
                >
                  <Compass className="w-5 h-5 text-slate-700" />
                </button>
                <button
                  type="button"
                  onClick={() => handleZoom(modalMapRef.current, 1)}
                  className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-white text-slate-800 shadow-xl flex items-center justify-center font-bold text-sm"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5 text-slate-700" />
                </button>
                <button
                  type="button"
                  onClick={() => handleZoom(modalMapRef.current, -1)}
                  className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-white text-slate-800 shadow-xl flex items-center justify-center font-bold text-sm"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              {/* Detailed Real-Time Fleet Telemetry Floating Card */}
              <div className="absolute bottom-5 left-5 right-5 z-20 pointer-events-none">
                <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl text-white grid grid-cols-2 sm:grid-cols-4 gap-4 pointer-events-auto">
                  
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Point</div>
                    <div className="font-extrabold text-sm text-white truncate mt-0.5">{shipment.currentLocation}</div>
                    <div className="text-[10px] text-blue-400 font-mono mt-0.5">
                      {vehicleTelemetry.position[0].toFixed(4)}°N, {vehicleTelemetry.position[1].toFixed(4)}°E
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Fleet</div>
                    <div className="font-extrabold text-sm text-white truncate mt-0.5">{shipment.busNumber || 'KSRTC Express'}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Speed: 58 km/h • On Schedule</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Arrival</div>
                    <div className="font-extrabold text-sm text-white truncate mt-0.5">{shipment.estimatedDelivery}</div>
                    <div className="text-[10px] text-sky-300 font-semibold mt-0.5">ETA: ~{shipment.etaMinutes || 25} mins remaining</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transit Progress</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 rounded-full bg-slate-700 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500" style={{ width: `${shipment.progressPercent}%` }} />
                      </div>
                      <span className="text-xs font-black text-blue-400">{shipment.progressPercent}%</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Destination: {shipment.receiverCity}
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
