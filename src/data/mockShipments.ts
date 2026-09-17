import { Shipment, Station, DiscountCoupon } from '../types';

export const INITIAL_STATIONS: Station[] = [
  { id: 'st-tvm', name: 'Thiruvananthapuram Central (Trivandrum)', code: 'TVM-01', city: 'Thiruvananthapuram', district: 'Thiruvananthapuram', phone: '+91 471 2323835' },
  { id: 'st-ekm', name: 'Ernakulam Central Hub (Kochi)', code: 'EKM-02', city: 'Kochi', district: 'Ernakulam', phone: '+91 484 2372033' },
  { id: 'st-clt', name: 'Kozhikode Terminal (Calicut)', code: 'CLT-03', city: 'Kozhikode', district: 'Kozhikode', phone: '+91 495 2723796' },
  { id: 'st-tsr', name: 'Thrissur Round Hub', code: 'TSR-04', city: 'Thrissur', district: 'Thrissur', phone: '+91 487 2421150' },
  { id: 'st-pkd', name: 'Palakkad Main Depot', code: 'PKD-05', city: 'Palakkad', district: 'Palakkad', phone: '+91 491 2520098' },
  { id: 'st-knr', name: 'Kannur Bus Station', code: 'KNR-06', city: 'Kannur', district: 'Kannur', phone: '+91 497 2707777' },
  { id: 'st-blr', name: 'Bengaluru Shanthinagar Hub', code: 'BLR-07', city: 'Bengaluru', district: 'Bengaluru Urban', phone: '+91 80 22221321' },
  { id: 'st-cbe', name: 'Coimbatore Gandhipuram Hub', code: 'CBE-08', city: 'Coimbatore', district: 'Coimbatore', phone: '+91 422 2521100' }
];

export const INITIAL_COUPONS: DiscountCoupon[] = [
  {
    code: 'KSRTC25',
    title: 'First Booking Special',
    discountPercentage: 25,
    description: 'Flat 25% off on express parcel consignment booking across all depot routes.',
    minWeightKg: 1,
    validUntil: '31 Dec 2026',
    badge: 'Popular'
  },
  {
    code: 'BULKFREIGHT',
    title: 'Commercial Volume Discount',
    discountPercentage: 20,
    description: 'Save 20% on consignments above 15kg sent via SuperFast freight corridor.',
    minWeightKg: 15,
    validUntil: '15 Nov 2026',
    badge: 'Heavy Cargo'
  },
  {
    code: 'STUDENTDOCS',
    title: 'Student & Academic Courier',
    discountPercentage: 30,
    description: 'Exclusive 30% concession for certificates, marksheets, and project folders.',
    minWeightKg: 0.5,
    validUntil: 'Ongoing 2026',
    badge: 'Verified Edu'
  },
  {
    code: 'INTERCITY',
    title: 'Weekend Inter-City Saver',
    discountPercentage: 15,
    description: '15% discount for Thiruvananthapuram - Ernakulam - Kozhikode corridor packages.',
    minWeightKg: 2,
    validUntil: '30 Oct 2026',
    badge: 'Depot Promo'
  }
];

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'ship-001',
    trackingNumber: '#ABIKR8532489388361',
    senderName: 'Ronald Richards',
    senderPhone: '+1 213 555 0192',
    senderCity: 'Los Angeles',
    senderStation: 'Thiruvananthapuram Central (Trivandrum)',
    receiverName: 'Sanjay Nair',
    receiverPhone: '+91 98471 22910',
    receiverCity: 'Shanghai Hub / Ernakulam',
    receiverStation: 'Ernakulam Central Hub (Kochi)',
    pickupLocation: 'Besant Nile Logistics Terminal',
    deliveryLocation: 'Ernakulam City Gateway Hub',
    currentLocation: 'SHANGHAI',
    status: 'In Transit',
    progressPercent: 62,
    bookingDate: '28 July, 2025',
    estimatedDelivery: '30 July, 2025, 04:30 PM',
    etaMinutes: 25,
    weightKg: 3.8,
    category: 'Electronics',
    declaredValue: 14500,
    serviceType: 'Express Cargo (Fastest Bus)',
    totalFreight: 480,
    busNumber: 'KL-15-A-4820 (Super Fast)',
    busRouteName: 'Trivandrum - Kochi Express Way',
    conductorName: 'M. Suresh',
    conductorBadge: 'KSR-7842',
    conductorPhone: '+91 94470 18234',
    deliveryPartnerName: 'Ronald Richards',
    deliveryPartnerPhone: '+91 98950 44219',
    checkpoints: [
      {
        id: 'cp-1',
        title: 'Booking Confirmed & Parcel Weighed',
        location: 'Trivandrum Central Depot (Bay 4)',
        timestamp: '28 July 2025, 08:30 AM',
        status: 'Booked',
        completed: true,
        notes: 'Barcode generated and security stamped.'
      },
      {
        id: 'cp-2',
        title: 'Loaded on SuperFast Bus',
        location: 'KSRTC Fleet KL-15-A-4820',
        timestamp: '28 July 2025, 11:15 AM',
        status: 'Dispatched',
        completed: true,
        notes: 'Assigned to Conductor M. Suresh (Badge #7842).'
      },
      {
        id: 'cp-3',
        title: 'In Transit - Highway Checkpoint',
        location: 'Shanghai Transit Corridor / Alappuzha Bypass',
        timestamp: '29 July 2025, 02:45 PM',
        status: 'In Transit',
        completed: true,
        notes: 'Approaching destination interchange at 68 km/h.'
      },
      {
        id: 'cp-4',
        title: 'Destination Station Arrival',
        location: 'Ernakulam Central Hub (Bay 2)',
        timestamp: 'Estimated: 30 July 2025, 03:30 PM',
        status: 'Arrived',
        completed: false,
        notes: 'Destination station staff will confirm parcel arrival.'
      },
      {
        id: 'cp-5',
        title: 'Handover & Delivery Confirmation',
        location: 'Ernakulam City Gateway Hub',
        timestamp: 'Estimated: 30 July 2025, 04:30 PM',
        status: 'Delivered',
        completed: false,
        notes: 'SMS OTP required upon receiver collection.'
      }
    ]
  },
  {
    id: 'ship-002',
    trackingNumber: '#BHTSR9453248933457',
    senderName: 'Besant Logistics Corp',
    senderPhone: '+1 603 555 0144',
    senderCity: 'Besant Nile, New Hampshire',
    senderStation: 'Thiruvananthapuram Central (Trivandrum)',
    receiverName: 'Stockton Wholesale Traders',
    receiverPhone: '+1 603 555 0199',
    receiverCity: 'Stockton, New Hampshire',
    receiverStation: 'Ernakulam Central Hub (Kochi)',
    pickupLocation: 'Besant Nile, New Hampshire',
    deliveryLocation: 'Stockton, New Hampshire',
    currentLocation: 'Stockton, New Hampshire',
    status: 'In Transit',
    progressPercent: 78,
    bookingDate: '30 July, 2025',
    estimatedDelivery: '30 July, 2025, 06:15 PM',
    etaMinutes: 25,
    weightKg: 6.2,
    category: 'General Cargo',
    declaredValue: 8900,
    serviceType: 'Express Cargo (Fastest Bus)',
    totalFreight: 360,
    busNumber: 'KL-15-A-3180 (Fast Passenger)',
    busRouteName: 'Besant Corridor Interstate Line',
    conductorName: 'K. V. Ramanan',
    conductorBadge: 'KSR-5519',
    conductorPhone: '+91 94472 90114',
    deliveryPartnerName: 'Ronald Richards',
    deliveryPartnerPhone: '+1 603 555 0188',
    checkpoints: [
      {
        id: 'cp-201',
        title: 'Consignment Registered',
        location: 'Besant Nile Hub',
        timestamp: '30 July 2025, 07:45 AM',
        status: 'Booked',
        completed: true
      },
      {
        id: 'cp-202',
        title: 'Manifested & Dispatched',
        location: 'Interstate Freight Bay 7',
        timestamp: '30 July 2025, 10:20 AM',
        status: 'Dispatched',
        completed: true
      },
      {
        id: 'cp-203',
        title: 'In Transit to Stockton Station',
        location: 'Stockton Highway Corridor',
        timestamp: '30 July 2025, 01:10 PM',
        status: 'In Transit',
        completed: true,
        notes: 'Delivery Partner assigned: Ronald Richards.'
      },
      {
        id: 'cp-204',
        title: 'Arrival at Stockton Receiving Dock',
        location: 'Stockton, New Hampshire Terminal',
        timestamp: 'Pending Arrival',
        status: 'Arrived',
        completed: false
      },
      {
        id: 'cp-205',
        title: 'Delivered to Recipient',
        location: 'Stockton, New Hampshire',
        timestamp: 'Pending',
        status: 'Delivered',
        completed: false
      }
    ]
  },
  {
    id: 'ship-003',
    trackingNumber: 'KSR-48213',
    senderName: 'Dr. Ananya Menon',
    senderPhone: '+91 94471 00213',
    senderCity: 'Kozhikode',
    senderStation: 'Kozhikode Terminal (Calicut)',
    receiverName: 'Apex Medical Supplies',
    receiverPhone: '+91 94473 88120',
    receiverCity: 'Thrissur',
    receiverStation: 'Thrissur Round Hub',
    pickupLocation: 'Calicut Medical College Depot',
    deliveryLocation: 'Thrissur Round Hub Cargo Office',
    currentLocation: 'Thrissur Round Hub',
    status: 'Arrived',
    progressPercent: 90,
    bookingDate: '30 July, 2025',
    estimatedDelivery: '30 July, 2025, 02:00 PM',
    etaMinutes: 0,
    weightKg: 2.1,
    category: 'Documents',
    declaredValue: 5000,
    serviceType: 'Express Cargo (Fastest Bus)',
    totalFreight: 220,
    busNumber: 'KL-15-A-9411 (Minnal Deluxe)',
    busRouteName: 'Malabar Night Rider',
    conductorName: 'P. Jayachandran',
    conductorBadge: 'KSR-4409',
    conductorPhone: '+91 94478 12345',
    deliveryPartnerName: 'Ratheesh K.',
    deliveryPartnerPhone: '+91 98462 77123',
    checkpoints: [
      {
        id: 'cp-301',
        title: 'Express Parcel Booked',
        location: 'Kozhikode Depot',
        timestamp: '30 July 2025, 06:15 AM',
        status: 'Booked',
        completed: true
      },
      {
        id: 'cp-302',
        title: 'Loaded on Minnal Express',
        location: 'Bay 12, Calicut',
        timestamp: '30 July 2025, 07:00 AM',
        status: 'Dispatched',
        completed: true
      },
      {
        id: 'cp-303',
        title: 'Highway Speed Corridor',
        location: 'Kuttippuram Bridge',
        timestamp: '30 July 2025, 09:30 AM',
        status: 'In Transit',
        completed: true
      },
      {
        id: 'cp-304',
        title: 'Arrived at Destination Station',
        location: 'Thrissur Round Hub',
        timestamp: '30 July 2025, 11:45 AM',
        status: 'Arrived',
        completed: true,
        notes: 'Unloaded and verified by Receiving Station Master.'
      },
      {
        id: 'cp-305',
        title: 'Ready for Counter Collection',
        location: 'Thrissur Cargo Counter 1',
        timestamp: 'Awaiting Receiver Pickup',
        status: 'Delivered',
        completed: false
      }
    ]
  }
];
