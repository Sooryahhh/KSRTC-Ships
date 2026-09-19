import React, { createContext, useContext, useState, useEffect } from 'react';
import { Shipment, ShipmentStatus, Station, StationLog, DiscountCoupon, TransitEstimate } from '../types';
import { INITIAL_SHIPMENTS, INITIAL_STATIONS, INITIAL_COUPONS } from '../data/mockShipments';
import { calculateEstimatedDeliveryTime, calculateStationDistance } from '../utils/transitCalculator';

export type ActiveTab = 'Home' | 'Track' | 'Shipments' | 'History' | 'Station View' | 'Discount';

export interface UserProfile {
  name: string;
  role: string;
  depot: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

interface BookingData {
  senderName: string;
  senderPhone: string;
  senderCity: string;
  senderStation: string;
  receiverName: string;
  receiverPhone: string;
  receiverCity: string;
  receiverStation: string;
  category: Shipment['category'];
  weightKg: number;
  declaredValue: number;
  serviceType: Shipment['serviceType'];
  notes?: string;
  couponCode?: string;
}

interface ShipmentContextType {
  shipments: Shipment[];
  activeShipment: Shipment;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  setActiveShipment: (shipment: Shipment) => void;
  stations: Station[];
  coupons: DiscountCoupon[];
  appliedCoupon: DiscountCoupon | null;
  setAppliedCoupon: (coupon: DiscountCoupon | null) => void;
  stationLogs: StationLog[];
  activeStationId: string;
  setActiveStationId: (id: string) => void;
  trackQuery: string;
  setTrackQuery: (query: string) => void;
  searchShipment: (query: string) => Shipment | null;
  bookShipment: (data: BookingData) => Shipment;
  updateShipmentStatus: (
    trackingNumber: string,
    newStatus: ShipmentStatus,
    stationName?: string,
    operatorNotes?: string
  ) => void;
  // Estimated Delivery Time Logic Handler
  calculateEstimatedDelivery: (
    sourceStation: string,
    destStation: string,
    serviceType?: Shipment['serviceType']
  ) => TransitEstimate;
  // User Profile
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  // Mobile Nav Drawer (Liquid Glass)
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  // Modals
  activeWaybillShipment: Shipment | null;
  setActiveWaybillShipment: (shipment: Shipment | null) => void;
  isCallModalOpen: boolean;
  setIsCallModalOpen: (open: boolean) => void;
  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;
  callPartnerShipment: Shipment | null;
  setCallPartnerShipment: (shipment: Shipment | null) => void;
  notificationCount: number;
  resetNotifications: () => void;
}

const STORAGE_KEY = 'ksrtc_logistics_shipments_v1';
const LOGS_STORAGE_KEY = 'ksrtc_logistics_station_logs_v1';

const ShipmentContext = createContext<ShipmentContextType | undefined>(undefined);

export const ShipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shipments, setShipments] = useState<Shipment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_SHIPMENTS;
  });

  const [activeShipmentId, setActiveShipmentId] = useState<string>(INITIAL_SHIPMENTS[0].id);
  const [activeTab, setActiveTab] = useState<ActiveTab>('Home');
  const [trackQuery, setTrackQuery] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCoupon | null>(null);
  const [activeStationId, setActiveStationId] = useState<string>(INITIAL_STATIONS[1].id); // Ernakulam Hub
  const [notificationCount, setNotificationCount] = useState<number>(3);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // User Profile: Default Malayali Hindu Name
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Harikrishnan Nair',
    role: 'Senior Station Consignor & Depot Officer',
    depot: 'Ernakulam Central Hub (Kochi)',
    email: 'harikrishnan.nair@ksrtc.kerala.gov.in',
    phone: '+91 94471 88201',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  });

  // Estimated delivery time logic handler based on station distance and historical transit speeds
  const calculateEstimatedDelivery = (
    sourceStation: string,
    destStation: string,
    serviceType?: Shipment['serviceType']
  ): TransitEstimate => {
    return calculateEstimatedDeliveryTime(
      sourceStation,
      destStation,
      serviceType || 'Express Cargo (Fastest Bus)',
      INITIAL_STATIONS
    );
  };

  // Modals state
  const [activeWaybillShipment, setActiveWaybillShipment] = useState<Shipment | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState<boolean>(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);
  const [callPartnerShipment, setCallPartnerShipment] = useState<Shipment | null>(null);

  const [stationLogs, setStationLogs] = useState<StationLog[]>(() => {
    try {
      const saved = localStorage.getItem(LOGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'log-1',
        trackingNumber: '#ABIKR8532489388361',
        action: 'Dispatched to Highway Corridor',
        stationName: 'Thiruvananthapuram Central (Trivandrum)',
        timestamp: '28 July 2025, 11:15 AM',
        operator: 'Inspector K. Gopinath (Bay 4)',
        details: 'Loaded on KL-15-A-4820 with seals intact.'
      },
      {
        id: 'log-2',
        trackingNumber: 'KSR-48213',
        action: 'Marked Arrived',
        stationName: 'Thrissur Round Hub',
        timestamp: '30 July 2025, 11:45 AM',
        operator: 'Station Master V. Krishnan',
        details: 'Received from bus KL-15-A-9411, stored at Bay 1 Counter.'
      }
    ];
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shipments));
    } catch {
      // ignore
    }
  }, [shipments]);

  useEffect(() => {
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(stationLogs));
    } catch {
      // ignore
    }
  }, [stationLogs]);

  const activeShipment =
    shipments.find((s) => s.id === activeShipmentId) || shipments[0] || INITIAL_SHIPMENTS[0];

  const setActiveShipment = (shipment: Shipment) => {
    setActiveShipmentId(shipment.id);
  };

  const searchShipment = (query: string): Shipment | null => {
    const clean = query.trim().toUpperCase().replace('#', '');
    if (!clean) return null;
    return (
      shipments.find(
        (s) =>
          s.trackingNumber.toUpperCase().replace('#', '') === clean ||
          s.trackingNumber.toUpperCase().includes(clean) ||
          s.receiverPhone.includes(clean) ||
          s.senderPhone.includes(clean)
      ) || null
    );
  };

  const bookShipment = (data: BookingData): Shipment => {
    // Generate clean KSRTC reference number
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const trackingNumber = `KSR-${randomSuffix}`;

    // Base fare calculation
    const baseRatePerKg = data.serviceType.includes('Express') ? 60 : 35;
    const baseFare = Math.max(120, Math.round(data.weightKg * baseRatePerKg));
    const handlingFee = 40;
    const gst = Math.round((baseFare + handlingFee) * 0.18);
    let total = baseFare + handlingFee + gst;

    if (appliedCoupon) {
      const discount = Math.round((total * appliedCoupon.discountPercentage) / 100);
      total = Math.max(50, total - discount);
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    // Dynamic ETA calculation based on station distance & historical transit times
    const transitEstimate = calculateEstimatedDelivery(
      data.senderStation,
      data.receiverStation,
      data.serviceType
    );

    const newShipment: Shipment = {
      id: `ship-${Date.now()}`,
      trackingNumber,
      senderName: data.senderName,
      senderPhone: data.senderPhone,
      senderCity: data.senderCity,
      senderStation: data.senderStation,
      receiverName: data.receiverName,
      receiverPhone: data.receiverPhone,
      receiverCity: data.receiverCity,
      receiverStation: data.receiverStation,
      pickupLocation: `${data.senderStation} Cargo Counter`,
      deliveryLocation: `${data.receiverStation} Receiving Dock`,
      currentLocation: data.senderStation,
      status: 'Booked',
      progressPercent: 15,
      bookingDate: formattedDate,
      estimatedDelivery: transitEstimate.estimatedDeliveryDate,
      etaMinutes: transitEstimate.etaMinutes,
      weightKg: data.weightKg,
      category: data.category,
      declaredValue: data.declaredValue,
      serviceType: data.serviceType,
      totalFreight: total,
      checkpoints: [
        {
          id: `cp-${Date.now()}-1`,
          title: 'Consignment Registered & Security Checked',
          location: data.senderStation,
          timestamp: `${formattedDate}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          status: 'Booked',
          completed: true,
          notes: `Parcel accepted at booking bay. Estimated transit: ${transitEstimate.formattedDuration} via ${transitEstimate.corridorDescription}.`
        },
        {
          id: `cp-${Date.now()}-2`,
          title: 'Bus Dispatch & Conductor Handover',
          location: 'Station Outward Platform',
          timestamp: 'Scheduled upon bus loading',
          status: 'Dispatched',
          completed: false,
          notes: 'Awaiting bus assignment by station master.'
        },
        {
          id: `cp-${Date.now()}-3`,
          title: 'In Transit on Route Corridor',
          location: 'Highway Transit Network',
          timestamp: 'Pending Dispatch',
          status: 'In Transit',
          completed: false
        },
        {
          id: `cp-${Date.now()}-4`,
          title: 'Destination Station Arrival',
          location: data.receiverStation,
          timestamp: 'Expected within 18-24 hrs',
          status: 'Arrived',
          completed: false,
          notes: 'Receiving station staff will mark arrival.'
        },
        {
          id: `cp-${Date.now()}-5`,
          title: 'Consignment Delivered to Recipient',
          location: data.receiverStation,
          timestamp: 'Awaiting Destination Arrival',
          status: 'Delivered',
          completed: false
        }
      ],
      notes: data.notes
    };

    setShipments((prev) => [newShipment, ...prev]);
    setActiveShipmentId(newShipment.id);
    setActiveWaybillShipment(newShipment);
    setNotificationCount((c) => c + 1);

    // Add initial log
    const initialLog: StationLog = {
      id: `log-${Date.now()}`,
      trackingNumber,
      action: 'Consignment Booked & Waybill Issued',
      stationName: data.senderStation,
      timestamp: `${formattedDate}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      operator: 'Counter Officer (Self/Online Booking)',
      details: `Booked for ${data.receiverName}. Freight: ₹${total}.`
    };
    setStationLogs((prev) => [initialLog, ...prev]);

    return newShipment;
  };

  const updateShipmentStatus = (
    trackingNumber: string,
    newStatus: ShipmentStatus,
    stationName?: string,
    operatorNotes?: string
  ) => {
    const now = new Date();
    const timeStr = `${now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setShipments((prev) =>
      prev.map((ship) => {
        if (
          ship.trackingNumber.toUpperCase().replace('#', '') !==
          trackingNumber.toUpperCase().replace('#', '')
        ) {
          return ship;
        }

        let updatedProgress = ship.progressPercent;
        let busNum = ship.busNumber;
        let busRoute = ship.busRouteName;
        let condName = ship.conductorName;
        let condBadge = ship.conductorBadge;
        let condPhone = ship.conductorPhone;
        let curLoc = ship.currentLocation;

        if (newStatus === 'Dispatched') {
          updatedProgress = 40;
          busNum = busNum || `KL-15-A-${Math.floor(1000 + Math.random() * 9000)} (Super Fast)`;
          busRoute = busRoute || `${ship.senderStation.split(' ')[0]} - ${ship.receiverStation.split(' ')[0]} Express Corridor`;
          condName = condName || 'S. Rajeev';
          condBadge = condBadge || `KSR-${Math.floor(3000 + Math.random() * 6000)}`;
          condPhone = condPhone || '+91 94472 10892';
          curLoc = 'En Route Highway Depot';
        } else if (newStatus === 'In Transit') {
          updatedProgress = 65;
          curLoc = 'National Highway Corridor / En Route';
        } else if (newStatus === 'Arrived') {
          updatedProgress = 90;
          curLoc = stationName || ship.receiverStation;
        } else if (newStatus === 'Delivered') {
          updatedProgress = 100;
          curLoc = stationName || ship.receiverStation;
        }

        // Update checkpoints
        const updatedCheckpoints = ship.checkpoints.map((cp) => {
          if (cp.status === newStatus) {
            return {
              ...cp,
              completed: true,
              timestamp: timeStr,
              location: stationName || cp.location,
              notes: operatorNotes || cp.notes || `Status advanced to ${newStatus}`
            };
          }
          return cp;
        });

        return {
          ...ship,
          status: newStatus,
          progressPercent: updatedProgress,
          currentLocation: curLoc,
          busNumber: busNum,
          busRouteName: busRoute,
          conductorName: condName,
          conductorBadge: condBadge,
          conductorPhone: condPhone,
          checkpoints: updatedCheckpoints
        };
      })
    );

    // Log the station action
    const newLog: StationLog = {
      id: `log-${Date.now()}`,
      trackingNumber,
      action: `Status Updated: ${newStatus}`,
      stationName: stationName || 'Receiving Station Hub',
      timestamp: timeStr,
      operator: 'Station Yard Operations',
      details: operatorNotes || `Shipment ${trackingNumber} marked as ${newStatus}.`
    };
    setStationLogs((prev) => [newLog, ...prev]);
    setNotificationCount((c) => c + 1);
  };

  const resetNotifications = () => {
    setNotificationCount(0);
  };

  return (
    <ShipmentContext.Provider
      value={{
        shipments,
        activeShipment,
        activeTab,
        setActiveTab,
        setActiveShipment,
        stations: INITIAL_STATIONS,
        coupons: INITIAL_COUPONS,
        appliedCoupon,
        setAppliedCoupon,
        stationLogs,
        activeStationId,
        setActiveStationId,
        trackQuery,
        setTrackQuery,
        searchShipment,
        bookShipment,
        updateShipmentStatus,
        activeWaybillShipment,
        setActiveWaybillShipment,
        isCallModalOpen,
        setIsCallModalOpen,
        isSupportModalOpen,
        setIsSupportModalOpen,
        callPartnerShipment,
        setCallPartnerShipment,
        notificationCount,
        resetNotifications,
        calculateEstimatedDelivery,
        userProfile,
        setUserProfile,
        isMobileMenuOpen,
        setIsMobileMenuOpen
      }}
    >
      {children}
    </ShipmentContext.Provider>
  );
};

export const useShipment = () => {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipment must be used within a ShipmentProvider');
  }
  return context;
};
