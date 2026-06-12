import React, { useState, useMemo } from "react";
import { Language, BuyerProfile, NotificationItem } from "../types";
import { TRANSLATIONS, MOCK_BUYERS, DECAL_GUIDE_STEPS } from "../data";
import { 
  X, 
  MapPin, 
  Star, 
  PhoneCall, 
  BookOpen, 
  Bell, 
  CheckCircle, 
  Layers, 
  Waves, 
  Sparkles, 
  TrendingUp,
  MessageSquare,
  Bookmark,
  DollarSign,
  AlertCircle
} from "lucide-react";

/* ==========================================================================
   1. BUYER DISCOVERY OVERLAY
   ========================================================================== */
interface BuyersOverlayProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export function BuyerDiscoveryOverlay({ language, isOpen, onClose }: BuyersOverlayProps) {
  const t = TRANSLATIONS[language];
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Restaurant", "Wholesaler", "Retail Buyer"];

  const filteredBuyers = useMemo(() => {
    if (activeCategory === "All") return MOCK_BUYERS;
    return MOCK_BUYERS.filter(b => b.tag === activeCategory);
  }, [activeCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs flex items-end justify-center">
      <div className="bg-slate-50 w-full max-w-md h-[88vh] rounded-t-[32px] overflow-hidden shadow-2xl flex flex-col animate-scale-up border-t border-slate-250">
        
        {/* Header bar */}
        <div className="bg-gradient-to-r from-ocean to-aqua text-white px-5 py-4 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5 font-display">
              🏪 {t.buyerDiscovery}
            </h3>
            <p className="text-[10px] text-white/80">{t.buyerDiscoveryDesc}</p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all text-white font-bold"
            id="close-buyers-overlay"
          >
            ✕
          </button>
        </div>

        {/* Category switcher */}
        <div className="bg-white px-4 py-2.5 border-b border-slate-100 flex gap-1.5 overflow-x-auto shrink-0 app-screen-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-[10px] font-black rounded-full transition-all whitespace-nowrap ${
                activeCategory === cat 
                ? "bg-ocean text-white shadow-sm" 
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-250/20"
              }`}
              id={`buyer-cat-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 app-screen-scrollbar pb-24">
          {filteredBuyers.map((buyer) => (
            <div 
              key={buyer.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full inline-block ${
                    buyer.tag === "Restaurant" 
                    ? "bg-emerald-50 text-emerald-700" 
                    : buyer.tag === "Wholesaler" 
                    ? "bg-sky-50 text-sky-700" 
                    : "bg-purple-50 text-purple-700"
                  }`}>
                    {buyer.tag}
                  </span>
                  <h4 className="font-bold text-xs text-slate-800 font-display mt-1">{buyer.name}</h4>
                  <p className="text-[9px] text-slate-450 flex items-center gap-0.5 leading-none">
                    <MapPin className="w-3 h-3 shrink-0 text-slate-350" />
                    {buyer.location}
                  </p>
                </div>

                <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                  <Star className="w-3 h-3 fill-amber-500 text-transparent" /> {buyer.rating.toFixed(1)}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium text-[10px] text-slate-600 space-y-1">
                <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider">{t.preferredSpecies}</span>
                <p className="font-bold text-slate-850 leading-tight">
                  {buyer.preferredFish.join(", ")}
                </p>
                <p className="text-[9px] leading-relaxed pt-0.5 italic border-t border-slate-150/40 mt-1">
                  Demand: "{buyer.demandDescription}"
                </p>
              </div>

              {/* Demand weight, Action calling row */}
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-50">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-bold text-slate-400 uppercase block leading-none">{t.weeklyDemand}</span>
                  <span className="font-black text-slate-800 font-mono text-xs">{buyer.weeklyDemandKg} kg/{language === Language.EN ? "wk" : "mgguu"}</span>
                </div>

                <a
                  href={`https://wa.me/${buyer.contactNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    // Alert simulation instead of crashing or leaving
                    alert(`Simulating phone link to WhatsApp line ${buyer.contactNumber}. Connecting smallholder with Restaurant Buyer...`);
                  }}
                  className="bg-emerald-accent/15 hover:bg-emerald-accent hover:text-white px-3.5 py-2 rounded-xl text-[10px] font-extrabold text-slate-900 transition-all flex items-center gap-1 shrink-0 border border-emerald-accent/25"
                  id={`buyer-contact-${buyer.id}`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {t.contactBuyer}
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ==========================================================================
   2. BIOFLOC FARMING GUIDE OVERLAY
   ========================================================================== */
interface GuideOverlayProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export function FarmingGuideOverlay({ language, isOpen, onClose }: GuideOverlayProps) {
  const t = TRANSLATIONS[language];
  const [activeStepId, setActiveStepId] = useState<string>("g1");

  if (!isOpen) return null;

  const currentStep = DECAL_GUIDE_STEPS.find(s => s.id === activeStepId) || DECAL_GUIDE_STEPS[0];

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case "Layers": return <Layers className="w-6 h-6 text-ocean" />;
      case "Waves": return <Waves className="w-6 h-6 text-ocean" />;
      case "Sparkles": return <Sparkles className="w-6 h-6 text-ocean" />;
      case "TrendingUp": return <TrendingUp className="w-6 h-6 text-ocean" />;
      default: return <BookOpen className="w-6 h-6 text-ocean" />;
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs flex items-end justify-center">
      <div className="bg-slate-50 w-full max-w-md h-[88vh] rounded-t-[32px] overflow-hidden shadow-2xl flex flex-col animate-scale-up border-t border-slate-250">
        
        {/* Header bar */}
        <div className="bg-gradient-to-r from-ocean to-aqua text-white px-5 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-accent" />
            <div>
              <h3 className="font-bold text-sm tracking-tight font-display">
                AquaHub {t.farmingGuide}
              </h3>
              <p className="text-[10px] text-white/80">Biofloc Technology Home Setup Manual</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all text-white font-bold"
            id="close-guide-overlay"
          >
            ✕
          </button>
        </div>

        {/* Horizontal step indicator bar */}
        <div className="bg-white p-4 border-b border-slate-100 flex justify-between shrink-0">
          {DECAL_GUIDE_STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStepId(step.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs font-mono transition-all border ${
                activeStepId === step.id 
                ? "bg-ocean text-white shadow-md border-transparent scale-110" 
                : "bg-slate-50 text-slate-500 border-slate-205"
              }`}
              id={`guide-step-${step.id}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Step description detail card */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 app-screen-scrollbar pb-24">
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center">
                {getStepIcon(currentStep.icon)}
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-800 font-display">
                  {language === Language.EN ? currentStep.titleEn : currentStep.titleMs}
                </h4>
                <p className="text-[8px] font-black text-ocean tracking-widest uppercase">STAGE {currentStep.id.toUpperCase()}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              {language === Language.EN ? currentStep.descriptionEn : currentStep.descriptionMs}
            </p>

            {/* Practical instructions details specific to steps */}
            {currentStep.id === "g1" && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-[10px] text-slate-500 space-y-1">
                <span className="font-black uppercase text-slate-700 block tracking-wide">📐 Tank Specs Recommendation</span>
                <p>&bull; Target: 2-meter diameter circular canvas tank.</p>
                <p>&bull; Depth: 1.0 meter optimum water holds 3000L safe volume.</p>
                <p>&bull; Electrical: constant aerator required (minimum 80W continuous flow).</p>
              </div>
            )}

            {currentStep.id === "g2" && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-[10px] text-slate-500 space-y-1">
                <span className="font-black uppercase text-slate-700 block tracking-wide">🐠 Stocking Density Rules</span>
                <p>&bull; Red Tilapia stocking: maximum 100-150 fingerlings per 1000L water.</p>
                <p>&bull; Only release fry when water pH values stabilize around 7.2.</p>
                <p>&bull; Salinity: Maintain water at 3-5 ppt for sea bass barramundi fingerlings.</p>
              </div>
            )}

            {currentStep.id === "g3" && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-[10px] text-slate-500 space-y-1">
                <span className="font-black uppercase text-slate-700 block tracking-wide">🧪 Water pH & Biofloc Floc Ratio</span>
                <p>&bull; Floc Volume: Keep floc settle volume (FVI) at 15-25 mL/L using Imhoff cone.</p>
                <p>&bull; Carbon source: Add brown sugar (sugar molasses) weekly to feed biofloc community.</p>
                <p>&bull; Emergency: If pH falls below 6.5, add agricultural agricultural lime (calcium carbonate).</p>
              </div>
            )}

            {currentStep.id === "g4" && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-[10px] text-slate-500 space-y-1">
                <span className="font-black uppercase text-slate-700 block tracking-wide">📊 Fast Harvest Sales Advantage</span>
                <p>&bull; List your matured stocks 2 weeks early on the AquaHub marketplace.</p>
                <p>&bull; High purity: Purge fish in fresh clean water tanks for 24h prior to pickup to clean flavor.</p>
                <p>&bull; Deliver live inside aerated bins to restaurants for maximum premium price payouts.</p>
              </div>
            )}

          </div>

          {/* Educational notice banner */}
          <div className="bg-sky-50 p-4 border border-sky-100/60 rounded-3xl flex items-start gap-2.5">
            <span className="text-base shrink-0">💡</span>
            <p className="text-[10px] font-medium text-sky-800 leading-relaxed">
              <strong>Need emergency advice?</strong> Click "Help & Support" inside Profile tab to send pictures of water colors directly to government extension veterinarians.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ==========================================================================
   3. NOTIFICATIONS OVERLAY
   ========================================================================== */
interface NotifOverlayProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
}

export function NotificationsOverlay({ language, isOpen, onClose, notifications, onMarkRead }: NotifOverlayProps) {
  const t = TRANSLATIONS[language];

  const [activeCategory, setActiveCategory] = useState<string>("all");

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifs = useMemo(() => {
    if (activeCategory === "all") return notifications;
    return notifications.filter(n => n.type === activeCategory);
  }, [activeCategory, notifications]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs flex items-end justify-center">
      <div className="bg-slate-50 w-full max-w-md h-[88vh] rounded-t-[32px] overflow-hidden shadow-2xl flex flex-col animate-scale-up border-t border-slate-250">
        
        {/* Header bar */}
        <div className="bg-gradient-to-r from-ocean to-aqua text-white px-5 py-4 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5 font-display">
              <Bell className="w-4.5 h-4.5 text-yellow-300" />
              {t.notifTitle}
            </h3>
            <p className="text-[10px] text-white/80">You have {unreadCount} new alerts that request action</p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all text-white font-bold"
            id="close-notifications-overlay"
          >
            ✕
          </button>
        </div>

        {/* Category togglers */}
        <div className="bg-white px-4 py-2 border-b border-slate-100 flex gap-1 scrollbar-none shrink-0 overflow-x-auto app-screen-scrollbar">
          {["all", "marketplace", "earnings", "orders", "tips"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
                activeCategory === cat 
                ? "bg-slate-100 text-slate-900 border-slate-300" 
                : "bg-white text-slate-500 border-transparent hover:bg-slate-50"
              }`}
              id={`notif-tab-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Clear List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 app-screen-scrollbar pb-24">
          {filteredNotifs.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center space-y-1.5">
              <AlertCircle className="w-7 h-7 text-slate-300 mx-auto" />
              <p className="text-slate-700 font-bold text-xs">No active alerts</p>
              <p className="text-[10px] text-slate-400">All notifications of this category matches are caught up.</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => onMarkRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 relative ${
                  notif.isRead 
                  ? "bg-white border-slate-100/70 opacity-75" 
                  : "bg-sky-50/20 border-sky-100/70 shadow-sm hover:bg-sky-50/40"
                }`}
              >
                {/* Unread circle tag */}
                {!notif.isRead && (
                  <span className="absolute top-4 right-4 w-2 h-2 bg-ocean rounded-full animate-pulse" />
                )}

                {/* Category Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.type === "earnings" 
                  ? "bg-emerald-50 text-emerald-600" 
                  : notif.type === "orders" 
                  ? "bg-orange-50 text-orange-500" 
                  : notif.type === "tips" 
                  ? "bg-purple-50 text-purple-600" 
                  : "bg-sky-50 text-ocean"
                }`}>
                  {notif.type === "earnings" ? "💰" : notif.type === "orders" ? "📦" : notif.type === "tips" ? "📚" : "🔔"}
                </div>

                <div className="space-y-1 select-none flex-1">
                  <h4 className="font-bold text-xs text-slate-850 leading-tight">
                    {language === Language.EN ? notif.titleEn : notif.titleMs}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                    {language === Language.EN ? notif.bodyEn : notif.bodyMs}
                  </p>
                  <span className="text-[8px] font-mono text-slate-400 font-bold block">{notif.time}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
