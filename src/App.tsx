/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useMemo } from "react";
import { Language, MarketplaceItem, UserListing, ProfitRecord, NotificationItem } from "./types";
import { 
  MOCK_MARKETPLACE_LISTINGS, 
  INITIAL_USER_LISTINGS, 
  INITIAL_PROFIT_RECORDS, 
  MOCK_NOTIFICATIONS, 
  TRANSLATIONS 
} from "./data";

// Core View Tabs
import HomeTab from "./components/HomeTab";
import MarketplaceTab from "./components/MarketplaceTab";
import SellFishTab from "./components/SellFishTab";
import ProfitTrackerTab from "./components/ProfitTrackerTab";
import ProfileTab from "./components/ProfileTab";

// Auxiliary overlays
import { 
  BuyerDiscoveryOverlay, 
  FarmingGuideOverlay, 
  NotificationsOverlay 
} from "./components/AuxiliaryOverlays";

// Lucide icon imports
import { 
  Home, 
  ShoppingBag, 
  PlusCircle, 
  TrendingUp, 
  User, 
  Bell, 
  Globe, 
  ShieldCheck, 
  Info,
  Smartphone,
  CheckCircle,
  Wifi,
  Battery,
  Settings,
  RefreshCw
} from "lucide-react";

export default function App() {
  // Mobile app simulator States
  const [activeTab, setActiveTab] = useState<string>("home");
  const [language, setLanguage] = useState<Language>(Language.MS); // Defaulting to Bahasa Melayu for B40 context
  
  // Storage synced lists (Mock persistence using standard state)
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceItem[]>(MOCK_MARKETPLACE_LISTINGS);
  const [userListings, setUserListings] = useState<UserListing[]>(INITIAL_USER_LISTINGS);
  const [profitRecords, setProfitRecords] = useState<ProfitRecord[]>(INITIAL_PROFIT_RECORDS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // Filter communication
  const [preSelectedFishFilter, setPreSelectedFishFilter] = useState<string>("all");

  // Overlays selectors
  const [buyersOverlayOpen, setBuyersOverlayOpen] = useState(false);
  const [guideOverlayOpen, setGuideOverlayOpen] = useState(false);
  const [notificationsOverlayOpen, setNotificationsOverlayOpen] = useState(false);

  // Micro-interaction pull-to-refresh spinner simulation
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize total earnings from active records sync
  const totalEarnings = useMemo(() => {
    return profitRecords.reduce((sum, curr) => sum + curr.profit, 0);
  }, [profitRecords]);

  // Unread alerts count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  // Handle a new marketplace product registration from "Sell Fish"
  const handleAddNewListing = (newMarketItem: MarketplaceItem, newUserListing: UserListing) => {
    setMarketplaceListings(prev => [newMarketItem, ...prev]);
    setUserListings(prev => [newUserListing, ...prev]);

    // Send a real-time auto notification simulation!
    const newAlert: NotificationItem = {
      id: `n-auto-${Date.now()}`,
      type: "marketplace",
      titleEn: "Listing Published Successfully!",
      titleMs: "Iklan Baru Berjaya Disiarkan!",
      bodyEn: `Your ${newMarketItem.fishName} has been distributed to 3 local wholesalers.`,
      bodyMs: `Iklan ${newMarketItem.fishMalayName} anda kini dipaparkan di pasaran borong.`,
      time: "Just now",
      isRead: false
    };
    setNotifications(prev => [newAlert, ...prev]);
  };

  // Convert an active harvest listing to "Sold" state
  const handleModifyListingStatus = (listingId: string, newStatus: "active" | "sold") => {
    // 1. Update list inside user lists
    const targetListing = userListings.find(l => l.id === listingId);
    if (!targetListing) return;

    setUserListings(prev => prev.map(l => {
      if (l.id === listingId) {
        return { ...l, status: newStatus };
      }
      return l;
    }));

    // 2. Clear item from Public Marketplace list
    setMarketplaceListings(prev => prev.filter(item => item.id !== listingId));

    // 3. If transitioning to Sold, automatically log as an EARNING transaction inside Profit Tracker records!
    if (newStatus === "sold") {
      const purchaseEstCost = Math.round(targetListing.weightKg * targetListing.pricePerKg * 0.4); // typical 40% margin cost
      const calculatedRevenue = targetListing.weightKg * targetListing.pricePerKg;
      const calculatedProfit = calculatedRevenue - purchaseEstCost;
      const calculatedRoi = Math.round((calculatedProfit / purchaseEstCost) * 100);

      const earningRecord: ProfitRecord = {
        id: `p-auto-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        fishName: `${targetListing.fishName} (Hasil Jualan)`,
        weightKg: targetListing.weightKg,
        purchaseCost: purchaseEstCost,
        sellingPrice: targetListing.pricePerKg,
        revenue: calculatedRevenue,
        profit: calculatedProfit,
        roi: calculatedRoi
      };

      setProfitRecords(prev => [earningRecord, ...prev]);

      // Trigger automatic completion alert!
      const finalAlert: NotificationItem = {
        id: `n-sold-${Date.now()}`,
        type: "earnings",
        titleEn: "Sale Payout Completed!",
        titleMs: "Jualan Selesai & Disalurkan!",
        bodyEn: `RM${calculatedProfit.toFixed(2)} net profit was logged into Profit Tracker!`,
        bodyMs: `RM${calculatedProfit.toFixed(2)} untung bersih dimasukkan ke Penjejak Untung!`,
        time: "Just now",
        isRead: false
      };
      setNotifications(prev => [finalAlert, ...prev]);
    }
  };

  // Mark all or specific notifications as read
  const handleMarkNotifRead = (id: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) return { ...n, isRead: true };
      return n;
    }));
  };

  const handleAddNewRecord = (newRecord: ProfitRecord) => {
    setProfitRecords(prev => [newRecord, ...prev]);
  };

  // Pull-to-refresh effect simulator
  const handleTriggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Simulate price alerts fluctuation or new notification push!
      const randomNotif: NotificationItem = {
        id: `n-refresh-${Date.now()}`,
        type: "tips",
        titleEn: "Matures Forecast Stability",
        titleMs: "Ramalan Harga Air Stabil",
        bodyEn: "Regional fish demand increased. Optimal conditions to list Siakap (Sea Bass).",
        bodyMs: "Permintaan pasaran zon Terengganu meningkat bagi Ikan Siakap.",
        time: "Just now",
        isRead: false
      };
      setNotifications(prev => [randomNotif, ...prev]);
    }, 1500);
  };

  // Helper translations object
  const t = TRANSLATIONS[language];

  // Simulated Time Clock
  const [deviceTime, setDeviceTime] = useState("09:41");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const strHours = hours < 10 ? `0${hours}` : hours;
      const strMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setDeviceTime(`${strHours}:${strMinutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen py-8 px-4 flex flex-col items-center justify-center font-sans space-y-6">
      
      {/* Outer Page Hero Header Console */}
      <div className="text-center space-y-1.5 max-w-lg z-10 select-none">
        <div className="flex items-center justify-center gap-2">
          {/* Circular logo representation */}
          <div className="w-10 h-10 bg-ocean rounded-2xl flex items-center justify-center text-white border-2 border-white shadow-lg">
            🐟
          </div>
          <h1 className="text-3xl font-black text-[#0077B6] font-display tracking-tight flex items-baseline">
            AquaHub
          </h1>
        </div>
        <p className="text-[#00B4D8] text-sm font-bold tracking-widest uppercase font-display italic">
          "{t.tagline}"
        </p>
        <p className="text-xs text-slate-500 font-semibold">
          Empowering Malaysia's B40 Aquaculture Entrepreneurs | Zon Timur Regional Portal
        </p>
      </div>

      {/* Main Core Container: Column layouts presenting phone frame side by side with instructions card */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 w-full max-w-5xl z-10">
        
        {/* LEFT COLUMN: Educational Dashboard Help Board */}
        <div className="w-full max-w-sm space-y-4 order-2 lg:order-1">
          
          {/* Quick Access Sidebar Info Panel */}
          <div className="bg-white text-slate-700 rounded-[32px] p-6 border border-sky-100 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-[#0077B6] font-display flex items-center gap-1.5 border-b border-sky-100 pb-2">
              <Info className="w-4.5 h-4.5 text-[#00B4D8]" />
              Interactive Prototype Guide
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed font-semibold">
              <p>
                Welcome to <strong>AquaHub</strong>, built to demonstrate high-value socioeconomic development for small fish farmers. You can interact with all aspects of the application:
              </p>

              <div className="space-y-2 border-l-2 border-[#00B4D8] pl-3.5 py-0.5">
                <p>
                  🟢 <strong>Language Switcher:</strong> Switch entire app contents instantly between <span className="text-[#0077B6]">Bahasa Melayu</span> and <span className="text-[#0077B6]">English</span> inside the <em>Profile Settings</em> or top header.
                </p>
                <p>
                  🥬 <strong>Listing Creation:</strong> Form-fill your tank stock under <span className="text-[#0077B6]">Sell Fish</span> and hit publish. It instantly appends to the live <span className="text-[#0077B6]">Market</span> tab!
                </p>
                <p>
                  📊 <strong>Earning Simulation:</strong> Flag any active harvest listing as "Sold" inside the dashboard. It instantly transfers to the <span className="text-[#0077B6]">Profit Tracker</span>, recalculating cumulative ROI totals and monthly quotas!
                </p>
              </div>

              <div className="bg-sky-50 p-3 rounded-xl border border-sky-100 space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-[#0077B6] font-black block">App Sandbox Stats:</span>
                <div className="flex justify-between font-mono text-[10px] text-slate-500">
                  <span>Total Users: <strong className="text-slate-800">142 Farmers</strong></span>
                  <span>Active Ponds: <strong className="text-slate-800">385 Tanks</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Badges Certifications list */}
          <div className="bg-[#2ECC71] text-white rounded-2xl p-4 shadow-md flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                💚
              </div>
              <div>
                <h4 className="font-bold text-white leading-tight">JAKIM Halal Standards</h4>
                <p className="text-[10px] text-white/80">Audit approved & organic fish pellet logs</p>
              </div>
            </div>
            <span className="bg-white/20 text-white font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest">
              Pass
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: The Interactive iOS Smartphone Device Notch Frame Layout */}
        <div className="w-full max-w-sm order-1 lg:order-2 shrink-0">
          
          {/* iOS Device Outer Frame Wrapper Container */}
          <div className="relative mx-auto w-[385px] h-[780px] bg-[#0c1322] rounded-[52px] border-[11px] border-slate-750 p-2 shadow-2xl overflow-hidden ring-4 ring-slate-800 flex flex-col justify-between">
            
            {/* iOS Top Speaker Screen Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0c1322] rounded-full z-50 flex items-center justify-center p-1">
              {/* Camera dot & sensor lines */}
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-8 border border-slate-800" />
              <div className="w-8 h-1 bg-slate-800 rounded-full" />
            </div>

            {/* Smartphone Inner Window Canvas Screen */}
            <div className="w-full h-full bg-light-bg rounded-[42px] overflow-hidden relative flex flex-col justify-between">
              
              {/* Mobile Device Status Bar */}
              <div className="h-11 bg-white px-6 pt-3 flex justify-between items-end shrink-0 z-30 select-none">
                {/* Clock indicator */}
                <span className="text-xs font-bold font-mono text-slate-800">
                  {deviceTime}
                </span>

                {/* Right utility status icons (Wi-fi, battery count) */}
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase font-mono tracking-widest leading-none">5G</span>
                  <Battery className="w-4.5 h-4.5 text-slate-800" />
                </div>
              </div>

              {/* Mobile Application Title Header Navigation Bar */}
              <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-2">
                  <img
                    src="/src/assets/images/aquahub_logo_1781256129969.jpg"
                    alt="Logo"
                    className="w-10 h-10 object-cover rounded-xl border border-slate-100 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h1 className="text-base font-black text-slate-800 font-display tracking-tight leading-none uppercase">
                      AquaHub
                    </h1>
                    <p className="text-[8px] text-slate-400 font-bold tracking-widest mt-0.5">
                      {language === Language.EN ? "EAST COAST REGIONAL" : "ZON PANTAI TIMUR"}
                    </p>
                  </div>
                </div>

                {/* Notifications ring CTA icon indicator */}
                <div className="flex items-center gap-2">
                  
                  {/* Pull to refresh toggle button */}
                  <button
                    onClick={handleTriggerRefresh}
                    disabled={isRefreshing}
                    className={`w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 transition-all active:scale-95 hover:bg-slate-100 cursor-pointer ${isRefreshing ? 'animate-spin' : ''}`}
                    title="Pull-to-Refresh"
                    id="trigger-pull-to-refresh"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <button
                    onClick={() => setNotificationsOverlayOpen(true)}
                    className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 relative transition-all active:scale-95 hover:bg-slate-100"
                    id="topbar-bell-btn"
                  >
                    <Bell className="w-4 h-4 text-slate-500" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-500 border border-white text-white font-extrabold text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Main mobile screen scrollable view holder */}
              <div className="flex-1 overflow-y-auto px-4 py-4 app-screen-scrollbar relative">
                
                {/* Pull-to-refresh simulated loading spinner */}
                {isRefreshing && (
                  <div className="bg-sky-50 py-2 border-b border-sky-100 text-center text-[10px] font-bold text-sky-800 flex items-center justify-center gap-1.5 animate-pulse rounded-xl mb-4">
                    <RefreshCw className="w-3 h-3 animate-spin text-sky-600" />
                    <span>{language === Language.EN ? "Refreshing harvest grids..." : "Mempertingkatkan data stok..."}</span>
                  </div>
                )}

                {/* Tab view Orchestration renderer */}
                {activeTab === "home" && (
                  <HomeTab
                    language={language}
                    onNavigate={(tab) => {
                      setActiveTab(tab);
                      setPreSelectedFishFilter("all"); // clear special selections
                    }}
                    onOpenBuyers={() => setBuyersOverlayOpen(true)}
                    onOpenGuide={() => setGuideOverlayOpen(true)}
                    onSelectFishFilter={(id) => setPreSelectedFishFilter(id)}
                    totalEarnings={totalEarnings}
                  />
                )}

                {activeTab === "marketplace" && (
                  <MarketplaceTab
                    language={language}
                    listings={marketplaceListings}
                    preSelectedFishFilter={preSelectedFishFilter === "all" ? undefined : preSelectedFishFilter}
                    onClearFilter={() => setPreSelectedFishFilter("all")}
                    onAddEarningsSimulator={(amt) => handleAddNewListing({} as any, {} as any)} // Handlers
                  />
                )}

                {activeTab === "sell" && (
                  <SellFishTab
                    language={language}
                    userListings={userListings}
                    onAddNewListing={handleAddNewListing}
                    onModifyListingStatus={handleModifyListingStatus}
                  />
                )}

                {activeTab === "tracker" && (
                  <ProfitTrackerTab
                    language={language}
                    profitRecords={profitRecords}
                    onAddNewRecord={handleAddNewRecord}
                  />
                )}

                {activeTab === "profile" && (
                  <ProfileTab
                    language={language}
                    onLanguageChange={(lang) => setLanguage(lang)}
                    totalEarnings={totalEarnings}
                  />
                )}
              </div>

              {/* Mobile bottom Navigation Tab bar (5 Tabs) */}
              <div className="bg-white border-t border-slate-100 h-18 px-3 flex justify-between items-center shrink-0 z-30 pb-2">
                
                {/* Tab: Home */}
                <button
                  onClick={() => setActiveTab("home")}
                  className={`flex flex-col items-center justify-center flex-1 transition-colors relative ${
                    activeTab === "home" ? "text-ocean" : "text-slate-400"
                  }`}
                  id="nav-tab-home"
                >
                  <Home className="w-5.2 h-5.2 stroke-[2.2px]" />
                  <span className="text-[9px] font-extrabold mt-1">{t.home}</span>
                  {activeTab === "home" && (
                    <span className="absolute bottom-[-6px] w-4 h-1 bg-ocean rounded-full" />
                  )}
                </button>

                {/* Tab: Marketplace */}
                <button
                  onClick={() => setActiveTab("marketplace")}
                  className={`flex flex-col items-center justify-center flex-1 transition-colors relative ${
                    activeTab === "marketplace" ? "text-ocean" : "text-slate-400"
                  }`}
                  id="nav-tab-marketplace"
                >
                  <ShoppingBag className="w-5.2 h-5.2 stroke-[2.2px]" />
                  <span className="text-[9px] font-extrabold mt-1">{t.marketplace}</span>
                  {activeTab === "marketplace" && (
                    <span className="absolute bottom-[-6px] w-4 h-1 bg-ocean rounded-full" />
                  )}
                </button>

                {/* Tab: Sell Fish */}
                <button
                  onClick={() => setActiveTab("sell")}
                  className={`flex flex-col items-center justify-center flex-1 transition-colors relative ${
                    activeTab === "sell" ? "text-ocean" : "text-slate-400"
                  }`}
                  id="nav-tab-sell"
                >
                  <PlusCircle className="w-5.2 h-5.2 stroke-[2.2px]" />
                  <span className="text-[9px] font-extrabold mt-1">{t.sellTab}</span>
                  {activeTab === "sell" && (
                    <span className="absolute bottom-[-6px] w-4 h-1 bg-ocean rounded-full" />
                  )}
                </button>

                {/* Tab: Profit Tracker */}
                <button
                  onClick={() => setActiveTab("tracker")}
                  className={`flex flex-col items-center justify-center flex-1 transition-colors relative ${
                    activeTab === "tracker" ? "text-ocean" : "text-slate-400"
                  }`}
                  id="nav-tab-tracker"
                >
                  <TrendingUp className="w-5.2 h-5.2 stroke-[2.2px]" />
                  <span className="text-[9px] font-extrabold mt-1">{t.trackerTab}</span>
                  {activeTab === "tracker" && (
                    <span className="absolute bottom-[-6px] w-4 h-1 bg-ocean rounded-full" />
                  )}
                </button>

                {/* Tab: Profile */}
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex flex-col items-center justify-center flex-1 transition-colors relative ${
                    activeTab === "profile" ? "text-ocean" : "text-slate-400"
                  }`}
                  id="nav-tab-profile"
                >
                  <User className="w-5.2 h-5.2 stroke-[2.2px]" />
                  <span className="text-[9px] font-extrabold mt-1">{t.profile}</span>
                  {activeTab === "profile" && (
                    <span className="absolute bottom-[-6px] w-4 h-1 bg-ocean rounded-full" />
                  )}
                </button>

              </div>

            </div>

            {/* Smart Phone Shell: Home indicator bottom line indicator bar */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-700 rounded-full z-40" />

          </div>

        </div>

      </div>

      {/* Auxiliary Popups Overlays */}
      <FarmingGuideOverlay
        language={language}
        isOpen={guideOverlayOpen}
        onClose={() => setGuideOverlayOpen(false)}
      />

      <BuyerDiscoveryOverlay
        language={language}
        isOpen={buyersOverlayOpen}
        onClose={() => setBuyersOverlayOpen(false)}
      />

      <NotificationsOverlay
        language={language}
        isOpen={notificationsOverlayOpen}
        onClose={() => setNotificationsOverlayOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotifRead}
      />

    </div>
  );
}
