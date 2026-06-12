import React, { useState } from "react";
import { FishItem, Language, MarketplaceItem } from "../types";
import { MOCK_FISH_SPECIES, TRANSLATIONS } from "../data";
import { 
  TrendingUp, 
  BookOpen, 
  Briefcase, 
  ArrowRight, 
  Award, 
  MapPin, 
  CheckCircle, 
  Flame,
  ChevronRight,
  Sparkles,
  Layers,
  Waves
} from "lucide-react";

interface HomeTabProps {
  language: Language;
  onNavigate: (tab: string) => void;
  onOpenBuyers: () => void;
  onOpenGuide: () => void;
  onSelectFishFilter: (fishId: string) => void;
  totalEarnings: number;
}

export default function HomeTab({
  language,
  onNavigate,
  onOpenBuyers,
  onOpenGuide,
  onSelectFishFilter,
  totalEarnings,
}: HomeTabProps) {
  const t = TRANSLATIONS[language];
  const [selectedSpecieIndex, setSelectedSpecieIndex] = useState(0);

  // Active species for the price trend visual dashboard
  const activeSpecie = MOCK_FISH_SPECIES[selectedSpecieIndex];
  const spreadPrice = activeSpecie.marketPrice - activeSpecie.farmPrice;
  const spreadPercent = Math.round((spreadPrice / activeSpecie.farmPrice) * 100);

  // Simple sparkline points for each species
  const getSparklinePoints = (id: string) => {
    const charts: Record<string, string> = {
      tilapia: "M 0,25 Q 15,10 30,22 T 60,8 T 90,15 T 120,4",
      catfish: "M 0,28 Q 15,18 30,20 T 60,11 T 90,8 T 120,2",
      seabass: "M 0,20 Q 15,30 30,15 T 60,18 T 90,5 T 120,5",
      snapper: "M 0,25 Q 15,5 30,18 T 60,12 T 90,10 T 120,3",
    };
    return charts[id] || "M 0,20 Q 15,20 30,20 T 60,20 T 90,20 T 120,20";
  };

  return (
    <div className="space-y-6 pb-24 animate-scale-up">
      {/* Welcome Section */}
      <div className="flex items-center justify-between bg-gradient-to-r from-ocean to-aqua text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
        {/* Decorative bubble backgrounds */}
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-24 h-24 bg-white/15 rounded-full blur-lg pointer-events-none" />

        <div className="space-y-1">
          <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">{t.welcomeBack}</p>
          <h2 className="text-xl font-bold tracking-tight font-display flex items-center gap-1">
            Encik Roslan <span className="text-emerald-accent animate-pulse-subtle">👋</span>
          </h2>
          <div className="pt-2">
            <p className="text-white/70 text-xs">{t.todayEarnings}</p>
            <p className="text-2xl font-black font-mono tracking-tight text-white flex items-baseline gap-1">
              {t.currency}<span className="text-3xl font-display">{totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          {/* Avatar frame */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Farmer Profile"
              className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-inner"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-accent border-2 border-white rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </span>
          </div>

          {/* Level badge */}
          <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border border-white/10">
            🥇 {language === Language.EN ? "Elite Farmer" : "Tani Elit"}
          </span>
        </div>
      </div>

      {/* Income Opportunity Card */}
      <div className="bg-gradient-to-br from-[#0077B6] to-[#00B4D8] rounded-[32px] p-6 text-white relative overflow-hidden shadow-xl group hover:shadow-2xl transition-all">
        {/* Decorative Wave Graphic Accent */}
        <div className="absolute -right-6 -top-6 text-white opacity-10 pointer-events-none select-none">
          <svg className="w-32 h-32 rotate-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="space-y-1">
            <span className="bg-white/20 backdrop-blur-xs text-white border border-white/35 font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1 animate-pulse-subtle">
              {t.b40IncentiveTitle || "B40 INCENTIVE"}
            </span>
            <h3 className="text-xl font-bold font-display leading-tight text-white">
              {language === Language.EN ? (
                <>Earn RM500–RM1,000/month <br/><span className="text-sky-200">through fish farming</span></>
              ) : (
                <>Jana RM500–RM1,000/sebulan <br/><span className="text-sky-150 font-medium">dengan ternakan ikan</span></>
              )}
            </h3>
            <p className="text-xs text-sky-50 opacity-90 leading-relaxed font-semibold">
              {language === Language.EN ? "Start your sustainable aquaculture journey today with expert guidance." : "Mulakan langkah keusahawanan akuakultur mampan anda dengan panduan pakar."}
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={onOpenGuide}
              className="flex-1 bg-white text-[#0077B6] font-extrabold py-3 px-4 rounded-xl text-xs hover:bg-sky-50 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              id="home-btn-start-farming"
            >
              <Waves className="w-4 h-4 text-[#0077B6]" />
              {t.startFarming}
            </button>
            <button
              onClick={onOpenGuide}
              className="flex-1 bg-white/10 text-white border border-white/20 font-bold py-3 px-4 rounded-xl text-xs hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
              id="home-btn-learn-more"
            >
              <BookOpen className="w-4 h-4 text-white" />
              {t.learnMore}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5 font-display px-1">
          <span className="w-2 h-2 rounded-full bg-ocean" />
          {t.quickActions}
        </h3>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => onNavigate("marketplace")}
            className="bg-white hover:bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 transition-all group active:scale-95 shadow-sm"
            id="action-buy-fish"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-ocean flex items-center justify-center group-hover:scale-110 transition-transform">
              🐟
            </div>
            <span className="text-[10px] font-bold text-slate-700 leading-tight">
              {t.buyFish}
            </span>
          </button>

          <button
            onClick={onOpenBuyers}
            className="bg-white hover:bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 transition-all group active:scale-95 shadow-sm"
            id="action-find-buyers"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-accent flex items-center justify-center group-hover:scale-110 transition-transform">
              🏪
            </div>
            <span className="text-[10px] font-bold text-slate-700 leading-tight">
              {t.findBuyers}
            </span>
          </button>

          <button
            onClick={() => onNavigate("tracker")}
            className="bg-white hover:bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 transition-all group active:scale-95 shadow-sm"
            id="action-profit-tracker"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              📈
            </div>
            <span className="text-[10px] font-bold text-slate-700 leading-tight">
              {t.profitTracker}
            </span>
          </button>

          <button
            onClick={onOpenGuide}
            className="bg-white hover:bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 transition-all group active:scale-95 shadow-sm"
            id="action-farming-guide"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              📚
            </div>
            <span className="text-[10px] font-bold text-slate-700 leading-tight">
              {t.farmingGuide}
            </span>
          </button>
        </div>
      </div>

      {/* Fish Price Dashboard */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-800 font-display flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-ocean" />
              {t.farmDashboard}
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">Zone: East Coast Malaysia (Zon Timur)</p>
          </div>
          {/* Select fish to display dynamic price metric details */}
          <div className="flex items-center gap-1 bg-slate-50 p-0.5 border border-slate-100 rounded-lg">
            {MOCK_FISH_SPECIES.map((spec, i) => (
              <button
                key={spec.id}
                onClick={() => setSelectedSpecieIndex(i)}
                className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all ${
                  selectedSpecieIndex === i 
                  ? "bg-ocean text-white shadow-sm" 
                  : "text-slate-600 hover:bg-slate-100"
                }`}
                id={`dash-spec-${spec.id}`}
              >
                {language === Language.EN ? spec.name.split(" ")[0] : spec.malayName.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Comparison Presentation Row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Farm Gate Price */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 relative">
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{t.farmPrice}</p>
            <p className="text-base font-black text-slate-800 font-mono">
              RM{activeSpecie.farmPrice.toFixed(2)}<span className="text-[10px] font-normal text-slate-500">/{t.kg}</span>
            </p>
            <span className="absolute top-2 right-2 text-sky-500 bg-sky-50 text-[8px] font-bold px-1 rounded-md">
              -RM0.20
            </span>
          </div>

          {/* Market Retail Price */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 relative">
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{t.marketPrice}</p>
            <p className="text-base font-black text-slate-800 font-mono">
              RM{activeSpecie.marketPrice.toFixed(2)}<span className="text-[10px] font-normal text-slate-500">/{t.kg}</span>
            </p>
            <span className="absolute top-2 right-2 text-rose-500 bg-rose-50 text-[8px] font-bold px-1 rounded-md">
              +RM0.45
            </span>
          </div>

          {/* Spread Potential */}
          <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 space-y-1 relative">
            <p className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 text-emerald-600 animate-pulse-subtle" />
              {language === Language.EN ? "Spread" : "Margin"}
            </p>
            <p className="text-base font-black text-emerald-700 font-mono">
              +RM{spreadPrice.toFixed(2)}<span className="text-[10px] font-normal text-emerald-600">/{t.kg}</span>
            </p>
            <span className="absolute top-2 right-2 text-emerald-700 bg-emerald-100 text-[8px] font-black px-1.5 py-0.5 rounded-full scale-95">
              +{spreadPercent}%
            </span>
          </div>
        </div>

        {/* Custom High Fidelity Trend Chart Mock */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col justify-between h-28 relative overflow-hidden">
          <div className="flex justify-between items-center z-10">
            <div>
              <p className="text-[10px] font-bold text-slate-700">
                {language === Language.EN ? "Weekly Price Trend: " : "Trend Harga Mingguan: "}
                <span className="text-ocean">{language === Language.EN ? activeSpecie.name : activeSpecie.malayName}</span>
              </p>
              <p className="text-[8px] text-slate-400 font-bold">12-Week Historical Spread Forecast</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[8px] font-bold text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> {t.farmPrice}
              </span>
              <span className="flex items-center gap-1 text-[8px] font-bold text-ocean">
                <span className="w-1.5 h-1.5 rounded-full bg-ocean" /> {t.marketPrice}
              </span>
            </div>
          </div>

          {/* SVG Animated chart lines */}
          <div className="relative h-14 w-full mt-2">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="10" x2="100%" y2="10" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="3" />
              <line x1="0" y1="28" x2="100%" y2="28" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="3" />
              <line x1="0" y1="46" x2="100%" y2="46" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="3" />

              {/* Farm Price line (flat/stable) */}
              <path 
                d="M 0,40 Q 15,38 30,42 T 60,39 T 90,41 T 120,40 T 150,38 T 180,41 T 210,39 T 240,41 T 270,38 T 300,40 T 330,37" 
                fill="none" 
                stroke="#94A3B8" 
                strokeWidth="1.5" 
                strokeDasharray="2" 
              />
              
              {/* Market price line (growing/active) */}
              <path 
                d={getSparklinePoints(activeSpecie.id)} 
                fill="none" 
                stroke="#0077B6" 
                strokeWidth="2.5" 
                className="transition-all duration-500" 
              />

              {/* Data point dot on final position */}
              <circle cx="100%" cy="10" r="3" fill="#2ECC71" className="animate-ping" />
              <circle cx="100%" cy="10" r="2" fill="#0077B6" />
            </svg>
          </div>

          <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider font-mono px-1">
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun (Today)</span>
          </div>
        </div>

        {/* Potential profit alert tag */}
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed bg-[#0077B6]/5 p-2.5 rounded-xl border border-[#0077B6]/10 flex items-center gap-1.5">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-ocean/10 flex items-center justify-center text-xs">💡</span>
          <span>{t.potentialProfit} <strong>RM{spreadPrice.toFixed(2)}/kg</strong>. {language === Language.EN ? "Direct buyers bypass Middlemen payouts, empowering your family income!" : "Hubungan terus dengan pembeli mengelakkan potongan orang tengah!"}</span>
        </p>
      </div>

      {/* Available Fish Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5 font-display">
            <span className="w-2 h-2 rounded-full bg-emerald-accent" />
            {t.availableFish}
          </h3>
          <button
            onClick={() => onNavigate("marketplace")}
            className="text-xs font-bold text-ocean hover:text-ocean/85 flex items-center gap-0.5"
            id="home-btn-view-all-stock"
          >
            {language === Language.EN ? "View Marketplace" : "Lihat Semua Hasil"}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {MOCK_FISH_SPECIES.map((spec) => (
            <div 
              key={spec.id} 
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all relative"
            >
              <div className="relative h-28 overflow-hidden bg-slate-100">
                <img
                  src={spec.image}
                  alt={spec.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Category tag */}
                <span className="absolute top-2 left-2 bg-slate-900/40 backdrop-blur-md text-white font-bold text-[8px] px-1.5 py-0.5 rounded-md">
                  {spec.category}
                </span>

                {/* Difficulty color indicator */}
                <span className={`absolute top-2 right-2 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                  spec.difficulty === "Easy" ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-850"
                }`}>
                  <Flame className="w-2.5 h-2.5" />
                  {spec.difficulty}
                </span>
              </div>

              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-800 leading-tight">
                    {language === Language.EN ? spec.name : spec.malayName}
                  </h4>
                  <p className="text-[10px] text-slate-405 italic leading-tight font-mono">{spec.scientificName}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-1">
                    <span className="text-slate-400 font-medium">{t.farmPrice}:</span>
                    <span className="font-bold text-slate-700 font-mono text-xs">RM{spec.farmPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-medium">{t.marketPrice}:</span>
                    <span className="font-bold text-emerald-600 font-mono text-xs">RM{spec.marketPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Trust mini icons */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="bg-emerald-50 text-[8px] text-emerald-700 font-black px-1 rounded flex items-center gap-0.5">
                    <CheckCircle className="w-2 h-2" /> JAKIM
                  </span>
                  <span className="bg-sky-50 text-[8px] text-sky-700 font-black px-1 rounded flex items-center gap-0.5">
                    <Award className="w-2 h-2" /> Gred A
                  </span>
                </div>

                <button
                  onClick={() => {
                    onSelectFishFilter(spec.id);
                    onNavigate("marketplace");
                  }}
                  className="w-full bg-[#0077B6]/5 hover:bg-[#0077B6] hover:text-white text-ocean text-[10px] font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 border border-ocean/10 hover:border-transparent mt-2"
                  id={`home-buy-btn-${spec.id}`}
                >
                  {t.buyFish}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
