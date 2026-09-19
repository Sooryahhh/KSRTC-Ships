// Real geographic coordinates and highway corridors for KSRTC Logistics in Kerala & interstate routes

export interface GeoPoint {
  lat: number;
  lng: number;
  name?: string;
  isStation?: boolean;
  stationCode?: string;
}

// Key Kerala & Interstate KSRTC transit depots with exact real-world coordinates
export const KNOWN_DEPOT_COORDS: Record<string, GeoPoint> = {
  'Thiruvananthapuram': { lat: 8.4875, lng: 76.9525, name: 'Thiruvananthapuram Central (Tampanoor)', stationCode: 'TVM-01', isStation: true },
  'Trivandrum': { lat: 8.4875, lng: 76.9525, name: 'Thiruvananthapuram Central (Tampanoor)', stationCode: 'TVM-01', isStation: true },
  'Kollam': { lat: 8.8932, lng: 76.6141, name: 'Kollam KSRTC Bus Station', stationCode: 'QLN-02', isStation: true },
  'Alappuzha': { lat: 9.4981, lng: 76.3388, name: 'Alappuzha KSRTC Depot', stationCode: 'ALP-03', isStation: true },
  'Kochi': { lat: 9.9816, lng: 76.2999, name: 'Ernakulam Central Hub (Kochi)', stationCode: 'EKM-04', isStation: true },
  'Ernakulam': { lat: 9.9816, lng: 76.2999, name: 'Ernakulam Central Hub (Kochi)', stationCode: 'EKM-04', isStation: true },
  'Thrissur': { lat: 10.5276, lng: 76.2144, name: 'Thrissur Round Hub', stationCode: 'TSR-05', isStation: true },
  'Palakkad': { lat: 10.7867, lng: 76.6548, name: 'Palakkad KSRTC Stand', stationCode: 'PKD-06', isStation: true },
  'Malappuram': { lat: 11.0732, lng: 76.0740, name: 'Malappuram Depot', stationCode: 'MLP-07', isStation: true },
  'Kozhikode': { lat: 11.2588, lng: 75.7804, name: 'Kozhikode Terminal (Mavoor Rd)', stationCode: 'CLT-08', isStation: true },
  'Calicut': { lat: 11.2588, lng: 75.7804, name: 'Kozhikode Terminal (Mavoor Rd)', stationCode: 'CLT-08', isStation: true },
  'Kannur': { lat: 11.8745, lng: 75.3704, name: 'Kannur Bus Terminal', stationCode: 'KNR-09', isStation: true },
  'Kasaragod': { lat: 12.5102, lng: 74.9852, name: 'Kasaragod KSRTC Stand', stationCode: 'KSD-10', isStation: true },
  'Bengaluru': { lat: 12.9569, lng: 77.5956, name: 'Bengaluru Shanthinagar Hub', stationCode: 'BLR-11', isStation: true },
  'Coimbatore': { lat: 11.0168, lng: 76.9558, name: 'Coimbatore Gandhipuram Hub', stationCode: 'CBE-12', isStation: true },
};

// Detailed highway waypoints along Kerala NH 66 Coastal Corridor (Trivandrum -> Kollam -> Alappuzha -> Kochi)
const TVM_TO_EKM_CORRIDOR: GeoPoint[] = [
  { lat: 8.4875, lng: 76.9525, name: 'TVM Central Tampanoor', isStation: true, stationCode: 'TVM-01' },
  { lat: 8.5241, lng: 76.9366, name: 'Pattom Transit Junction' },
  { lat: 8.6012, lng: 76.8845, name: 'Mangalapuram Toll Gate' },
  { lat: 8.6965, lng: 76.8142, name: 'Attingal KSRTC Station', isStation: true, stationCode: 'ATT-14' },
  { lat: 8.7753, lng: 76.7321, name: 'Chathannoor Checkpost' },
  { lat: 8.8932, lng: 76.6141, name: 'Kollam KSRTC Stand', isStation: true, stationCode: 'QLN-02' },
  { lat: 9.0041, lng: 76.5492, name: 'Karunagappalli Terminal' },
  { lat: 9.1724, lng: 76.5015, name: 'Kayamkulam Highway Junction' },
  { lat: 9.2882, lng: 76.4608, name: 'Haripad KSRTC Depot', isStation: true, stationCode: 'HPD-15' },
  { lat: 9.3800, lng: 76.3550, name: 'Ambalappuzha Bypass' },
  { lat: 9.4981, lng: 76.3388, name: 'Alappuzha KSRTC Depot', isStation: true, stationCode: 'ALP-03' },
  { lat: 9.6844, lng: 76.3323, name: 'Cherthala KSRTC Stand', isStation: true, stationCode: 'CTL-16' },
  { lat: 9.8732, lng: 76.3045, name: 'Aroor Bridge Toll Plaza' },
  { lat: 9.9312, lng: 76.2673, name: 'Vyttila Mobility Hub', isStation: true, stationCode: 'VMH-17' },
  { lat: 9.9816, lng: 76.2999, name: 'Ernakulam Central Hub (Kochi)', isStation: true, stationCode: 'EKM-04' },
];

// Kochi -> Thrissur -> Kozhikode Corridor
const EKM_TO_CLT_CORRIDOR: GeoPoint[] = [
  { lat: 9.9816, lng: 76.2999, name: 'Ernakulam Central Hub', isStation: true, stationCode: 'EKM-04' },
  { lat: 10.1076, lng: 76.3516, name: 'Aluva KSRTC Stand', isStation: true, stationCode: 'ALV-18' },
  { lat: 10.1960, lng: 76.3860, name: 'Angamaly South Gateway' },
  { lat: 10.3069, lng: 76.3330, name: 'Chalakudy Depot' },
  { lat: 10.5276, lng: 76.2144, name: 'Thrissur Round Hub', isStation: true, stationCode: 'TSR-05' },
  { lat: 10.6200, lng: 76.0700, name: 'Kunnamkulam Junction' },
  { lat: 10.8800, lng: 76.0100, name: 'Valanchery Highway Hub' },
  { lat: 11.0000, lng: 75.9900, name: 'Kottakkal Bypass' },
  { lat: 11.1680, lng: 75.8640, name: 'Ramanattukara Bypass' },
  { lat: 11.2588, lng: 75.7804, name: 'Kozhikode Terminal (Mavoor Rd)', isStation: true, stationCode: 'CLT-08' },
];

// Kochi -> Palakkad -> Bengaluru Corridor
const EKM_TO_BLR_CORRIDOR: GeoPoint[] = [
  { lat: 9.9816, lng: 76.2999, name: 'Ernakulam Central Hub', isStation: true, stationCode: 'EKM-04' },
  { lat: 10.5276, lng: 76.2144, name: 'Thrissur Round Hub', isStation: true, stationCode: 'TSR-05' },
  { lat: 10.6380, lng: 76.4380, name: 'Vadakkencherry Highway' },
  { lat: 10.7867, lng: 76.6548, name: 'Palakkad KSRTC Stand', isStation: true, stationCode: 'PKD-06' },
  { lat: 10.8500, lng: 76.8800, name: 'Walayar Interstate Border' },
  { lat: 11.0168, lng: 76.9558, name: 'Coimbatore Gandhipuram Hub', isStation: true, stationCode: 'CBE-12' },
  { lat: 11.6643, lng: 78.1460, name: 'Salem Junction' },
  { lat: 12.5200, lng: 78.2100, name: 'Dharmapuri Corridor' },
  { lat: 12.7409, lng: 77.8253, name: 'Hosur Border Checkpost' },
  { lat: 12.8452, lng: 77.6602, name: 'Electronic City Toll Plaza' },
  { lat: 12.9569, lng: 77.5956, name: 'Bengaluru Shanthinagar Hub', isStation: true, stationCode: 'BLR-11' },
];

// Helper: Calculate distance between two points in km (Haversine formula)
function haversineDistance(p1: GeoPoint, p2: GeoPoint): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate bearing in degrees between two points
export function calculateBearing(start: GeoPoint, end: GeoPoint): number {
  const startLat = (start.lat * Math.PI) / 180;
  const startLng = (start.lng * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const endLng = (end.lng * Math.PI) / 180;

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

// Resolve best corridor route for any shipment given its sender and receiver city/station
export function getCorridorRoute(senderCity: string, receiverCity: string): GeoPoint[] {
  const s = senderCity.toLowerCase();
  const r = receiverCity.toLowerCase();

  if (
    (s.includes('thiruvananthapuram') || s.includes('trivandrum')) &&
    (r.includes('kochi') || r.includes('ernakulam') || r.includes('marine'))
  ) {
    return TVM_TO_EKM_CORRIDOR;
  }

  if (
    (s.includes('kochi') || s.includes('ernakulam')) &&
    (r.includes('thiruvananthapuram') || r.includes('trivandrum'))
  ) {
    return [...TVM_TO_EKM_CORRIDOR].reverse();
  }

  if (
    (s.includes('kochi') || s.includes('ernakulam')) &&
    (r.includes('kozhikode') || r.includes('calicut') || r.includes('kannur'))
  ) {
    return EKM_TO_CLT_CORRIDOR;
  }

  if (
    (s.includes('kochi') || s.includes('ernakulam')) &&
    (r.includes('bengaluru') || r.includes('bangalore') || r.includes('coimbatore'))
  ) {
    return EKM_TO_BLR_CORRIDOR;
  }

  // Fallback: Generate smooth intermediate points between detected depots
  const originCoord = findDepotCoord(senderCity) || { lat: 8.4875, lng: 76.9525, name: senderCity };
  const destCoord = findDepotCoord(receiverCity) || { lat: 9.9816, lng: 76.2999, name: receiverCity };

  // Create 6 smooth bezier-like waypoints with slight realistic coastal curve
  const steps = 8;
  const points: GeoPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Slight curve offset towards coast
    const curveOffset = Math.sin(t * Math.PI) * 0.08;
    const lat = originCoord.lat + (destCoord.lat - originCoord.lat) * t;
    const lng = originCoord.lng + (destCoord.lng - originCoord.lng) * t - curveOffset;
    points.push({
      lat,
      lng,
      name: i === 0 ? originCoord.name : i === steps ? destCoord.name : `Corridor Waypoint ${i}`,
      isStation: i === 0 || i === steps || i === Math.floor(steps / 2),
    });
  }
  return points;
}

export function findDepotCoord(locationName: string): GeoPoint | null {
  const norm = locationName.toLowerCase();
  for (const [key, value] of Object.entries(KNOWN_DEPOT_COORDS)) {
    if (norm.includes(key.toLowerCase())) {
      return value;
    }
  }
  return null;
}

// Calculate interpolated position along route for progress (0 to 100)
export function getInterpolatedVehiclePosition(
  route: GeoPoint[],
  progressPercent: number
): {
  position: [number, number];
  bearing: number;
  currentLegDistanceKm: number;
  totalRouteDistanceKm: number;
  nearbyWaypointName: string;
} {
  const clampedProgress = Math.min(100, Math.max(0, progressPercent)) / 100;
  if (route.length === 0) {
    return {
      position: [8.4875, 76.9525],
      bearing: 0,
      currentLegDistanceKm: 0,
      totalRouteDistanceKm: 220,
      nearbyWaypointName: 'Trivandrum Central',
    };
  }
  if (route.length === 1) {
    return {
      position: [route[0].lat, route[0].lng],
      bearing: 0,
      currentLegDistanceKm: 0,
      totalRouteDistanceKm: 0,
      nearbyWaypointName: route[0].name || 'Transit Depot',
    };
  }

  // Calculate cumulative segment distances
  const segmentDistances: number[] = [];
  let totalDistance = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const d = haversineDistance(route[i], route[i + 1]);
    segmentDistances.push(d);
    totalDistance += d;
  }

  const targetDistance = clampedProgress * totalDistance;
  let accumulated = 0;

  for (let i = 0; i < segmentDistances.length; i++) {
    const legDist = segmentDistances[i];
    if (accumulated + legDist >= targetDistance || i === segmentDistances.length - 1) {
      const segFraction = legDist > 0 ? (targetDistance - accumulated) / legDist : 0;
      const p1 = route[i];
      const p2 = route[i + 1];

      const lat = p1.lat + (p2.lat - p1.lat) * segFraction;
      const lng = p1.lng + (p2.lng - p1.lng) * segFraction;
      const bearing = calculateBearing(p1, p2);

      const nearby = segFraction < 0.5 ? p1.name : p2.name;

      return {
        position: [lat, lng],
        bearing,
        currentLegDistanceKm: targetDistance,
        totalRouteDistanceKm: totalDistance,
        nearbyWaypointName: nearby || 'Transit Corridor',
      };
    }
    accumulated += legDist;
  }

  const last = route[route.length - 1];
  return {
    position: [last.lat, last.lng],
    bearing: 0,
    currentLegDistanceKm: totalDistance,
    totalRouteDistanceKm: totalDistance,
    nearbyWaypointName: last.name || 'Destination Terminal',
  };
}
