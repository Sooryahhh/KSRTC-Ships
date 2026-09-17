export type ShipmentStatus = 'Booked' | 'Dispatched' | 'In Transit' | 'Arrived' | 'Delivered';

export type ParcelCategory = 'Documents' | 'Electronics' | 'Textiles & Garments' | 'Spare Parts' | 'Perishables' | 'General Cargo';

export type ServiceType = 'Express Cargo (Fastest Bus)' | 'Standard KSRTC Freight';

export interface Checkpoint {
  id: string;
  title: string;
  location: string;
  timestamp: string;
  status: ShipmentStatus;
  completed: boolean;
  notes?: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string; // e.g., #ABIKR8532489388361 or KSR-48213
  senderName: string;
  senderPhone: string;
  senderCity: string;
  senderStation: string;
  receiverName: string;
  receiverPhone: string;
  receiverCity: string;
  receiverStation: string;
  pickupLocation: string;
  deliveryLocation: string;
  currentLocation: string;
  status: ShipmentStatus;
  progressPercent: number; // 0 - 100
  bookingDate: string;
  estimatedDelivery: string;
  etaMinutes?: number;
  weightKg: number;
  category: ParcelCategory;
  declaredValue: number;
  serviceType: ServiceType;
  totalFreight: number;
  busNumber?: string;
  busRouteName?: string;
  conductorName?: string;
  conductorBadge?: string;
  conductorPhone?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  checkpoints: Checkpoint[];
  coordinates?: {
    origin: [number, number];
    current: [number, number];
    destination: [number, number];
  };
  notes?: string;
}

export interface Station {
  id: string;
  name: string;
  code: string;
  city: string;
  district: string;
  phone: string;
}

export interface StationLog {
  id: string;
  trackingNumber: string;
  action: string;
  stationName: string;
  timestamp: string;
  operator: string;
  details: string;
}

export interface DiscountCoupon {
  code: string;
  title: string;
  discountPercentage: number;
  description: string;
  minWeightKg: number;
  validUntil: string;
  badge: string;
}
