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
      {/* Outer viewport with generous whitespace & ice-blue ambient background */}
      <div className="min-h-screen bg-[#dce9f5] flex items-center justify-center p-3 sm:p-6 lg:p-8 xl:p-10 font-sans selection:bg-blue-500 selection:text-white">
        
        {/* Centered Large Application Window with rounded container & subtle shadow */}
        <div className="w-full max-w-[1360px] bg-[#edf4fb] rounded-[32px] sm:rounded-[36px] p-4 sm:p-6 lg:p-7 border border-sky-200/80 shadow-2xl shadow-blue-900/10 flex flex-col transition-all">
          
          {/* 1. Top Navigation spanning the full dashboard */}
          <TopNav />

          {/* Body: Left Sidebar + Main Workspace */}
          <div className="flex flex-col md:flex-row gap-5 pt-2 flex-1 items-stretch">
            {/* 2. Left Sidebar (persistent) */}
            <Sidebar />

            {/* Main Workspace */}
            <main className="flex-1 min-w-0">
              <DashboardContent />
            </main>
          </div>
        </div>

        {/* Global Action Modals */}
        <WaybillModal />
        <CallPartnerModal />
        <SupportModal />
      </div>
    </ShipmentProvider>
  );
}
