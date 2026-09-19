import React from 'react';
import { ShipmentProvider, useShipment } from './context/ShipmentContext';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { HomeDashboard } from './components/HomeDashboard';
import { TrackView } from './components/TrackView';
import { BookParcelView } from './components/BookParcelView';
import { HistoryView } from './components/HistoryView';
import { StationView } from './components/StationView';
import { DiscountView } from './components/DiscountView';
import { WaybillModal } from './components/WaybillModal';
import { CallPartnerModal } from './components/CallPartnerModal';
import { SupportModal } from './components/SupportModal';
import { MobileLiquidGlassMenu } from './components/MobileLiquidGlassMenu';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CloudShader } from './components/ui/cloud-shader';

const DashboardContent: React.FC = () => {
  const { activeTab } = useShipment();

  return (
    <div className="w-full flex-1">
      {activeTab === 'Home' && <HomeDashboard />}
      {activeTab === 'Track' && <TrackView />}
      {activeTab === 'Shipments' && <BookParcelView />}
      {activeTab === 'History' && <HistoryView />}
      {activeTab === 'Station View' && <StationView />}
      {activeTab === 'Discount' && <DiscountView />}
    </div>
  );
};

export default function App() {
  return (
    <ShipmentProvider>
      {/* Outer viewport with dynamic WebGL Cloud Shader background */}
      <div className="relative min-h-screen flex items-center justify-center p-2.5 sm:p-5 lg:p-7 xl:p-9 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
        
        {/* Dynamic Cloud Shader Canvas Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <CloudShader
            className="w-full h-full min-h-screen"
            speed={0.8}
            count={5}
            cloudColor="#ffffff"
            skyTopColor="#2d6ea8"
            skyBottomColor="#9fc8e8"
          />
        </div>

        {/* Ambient atmospheric overlay */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-sky-900/10 backdrop-blur-[1px]" />

        {/* Centered Large Application Window with liquid glass finish and subtle border */}
        <div className="relative w-full max-w-[1360px] bg-[#edf4fb]/92 backdrop-blur-xl rounded-[24px] sm:rounded-[36px] p-2.5 sm:p-5 lg:p-6 pb-24 md:pb-6 border border-white/80 shadow-2xl shadow-blue-950/20 flex flex-col transition-all z-10">
          
          {/* 1. Top Navigation spanning the full dashboard */}
          <TopNav />

          {/* Body: Left Sidebar (desktop) + Main Workspace */}
          <div className="flex flex-col md:flex-row gap-4 lg:gap-5 pt-2 flex-1 items-stretch">
            {/* 2. Left Sidebar (persistent on desktop, hidden on mobile) */}
            <Sidebar />

            {/* Main Workspace */}
            <main className="flex-1 min-w-0">
              <DashboardContent />
            </main>
          </div>
        </div>

        {/* Persistent Floating Mobile Liquid-Glass Dock */}
        <MobileBottomNav />

        {/* Mobile Liquid Glass Slide-In/Pop-Up Menu */}
        <MobileLiquidGlassMenu />

        {/* Global Action Modals with Liquid Glass Effect */}
        <WaybillModal />
        <CallPartnerModal />
        <SupportModal />
      </div>
    </ShipmentProvider>
  );
}

