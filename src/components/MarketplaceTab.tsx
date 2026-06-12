import React, { useState, useMemo } from "react";
import { MarketplaceItem, Language, FishGrade } from "../types";
import { TRANSLATIONS } from "../data";
import { 
  Search, 
  MapPin, 
  Tag, 
  Award, 
  ShieldCheck, 
  ShoppingBag, 
  Check, 
  Undo2, 
  AlertCircle,
  Filter,
  CheckCircle,
  Clock
} from "lucide-react";

interface MarketplaceTabProps {
  language: Language;
  listings: MarketplaceItem[];
  preSelectedFishFilter?: string;
  onClearFilter: () => void;
  onAddEarningsSimulator: (amount: number) => void;
}

export default function MarketplaceTab({
  language,
  listings,
  preSelectedFishFilter,
  onClearFilter,
  onAddEarningsSimulator,
}: MarketplaceTabProps) {
  const t = TRANSLATIONS[language];

  // Component search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFishType, setSelectedFishType] = useState<string>(preSelectedFishFilter || "all");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  
  // Checkout Modal State
  const [activeCheckoutItem, setActiveCheckoutItem] = useState<MarketplaceItem | null>(null);
  const [purchaseWeight, setPurchaseWeight] = useState<number>(10); // Default with discount
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Auto sync internal selection and allow resetting
  React.useEffect(() => {
    if (preSelectedFishFilter) {
      setSelectedFishType(preSelectedFishFilter);
    }
  }, [preSelectedFishFilter]);

  // Unique listings locations and types for filters
  const locations = useMemo(() => {
    const list = listings.map(l => l.location.split(",")[1]?.trim() || l.location);
    return Array.from(new Set(list)).filter(Boolean);
  }, [listings]);

  const fishTypes = useMemo(() => {
    return Array.from(new Set(listings.map(l => l.fishId)));
  }, [listings]);

  // Filter listings memo
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      const matchSearch = 
        item.fishName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.fishMalayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.farmerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = selectedFishType === "all" || item.fishId === selectedFishType;
      const matchGrade = selectedGrade === "all" || item.grade === selectedGrade;
      
      const itemLoc = item.location.split(",")[1]?.trim() || item.location;
      const matchLoc = selectedLocation === "all" || itemLoc === selectedLocation;

      return matchSearch && matchType && matchGrade && matchLoc;
    });
  }, [listings, searchTerm, selectedFishType, selectedGrade, selectedLocation]);

  // Cost estimates
  const checkoutMath = useMemo(() => {
    if (!activeCheckoutItem) return { subtotal: 0, discount: 0, total: 0 };
    const price = activeCheckoutItem.pricePerKg;
    const subtotal = price * purchaseWeight;
    const earnsDiscount = purchaseWeight >= 10;
    const discount = earnsDiscount ? subtotal * 0.1 : 0;
    const total = subtotal - discount;
    return { subtotal, discount, total };
  }, [activeCheckoutItem, purchaseWeight]);

  const handlePlaceOrder = () => {
    if (!activeCheckoutItem) return;
    setOrderCompleted(true);
    
    // Auto reset after visual timer
    setTimeout(() => {
      setOrderCompleted(false);
      setActiveCheckoutItem(null);
      setPurchaseWeight(10);
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-24 animate-scale-up">
      {/* Header section */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 font-display flex items-center justify-between">
          <span>{language === Language.EN ? "Wholesale Marketplace" : "Market Borong"}</span>
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          {language === Language.EN 
            ? "Connect with smallholders and B40 farmers directly to access farm fresh price advantages." 
            : "Hubungi usahawan tani B40 secara terus untuk mendapatkan ikan segar gred tinggi di harga kolam."}
        </p>
      </div>

      {/* Special promotion banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-white shadow-md relative overflow-hidden flex items-center justify-between">
        {/* Decorative elements */}
        <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-md" />
        <div className="space-y-1 z-10 max-w-[75%]">
          <span className="bg-white/20 text-white border border-white/30 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {language === Language.EN ? "Bulk Promo" : "Diskaun Rakan Niaga"}
          </span>
          <h4 className="text-sm font-bold font-display leading-tight">{t.halfDiscountBanner}</h4>
          <p className="text-[10px] text-white/90">
            {language === Language.EN 
              ? "Support our B40 fish breeding network and claim maximum savings." 
              : "Sokong komuniti B40 kami dan nikmati pulangan terbaik."}
          </p>
        </div>
        <span className="text-3xl z-10 animate-float">🏷️</span>
      </div>

      {/* Quick visual active filter tag */}
      {preSelectedFishFilter && (
        <div className="bg-sky-50 border border-sky-100 p-2.5 rounded-xl flex items-center justify-between text-xs text-sky-800">
          <span className="font-medium">
            {language === Language.EN ? "Showing results for: " : "Menunjukkan hasil untuk: "} 
            <strong className="capitalize">{preSelectedFishFilter}</strong>
          </span>
          <button 
            type="button" 
            onClick={onClearFilter} 
            className="text-[10px] font-black text-rose-600 underline"
            id="clear-preselected-filter-btn"
          >
            {language === Language.EN ? "Reset Filter" : "Kosongkan"}
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-ocean placeholder-slate-400 font-semibold"
            id="marketplace-search-input"
          />
        </div>

        {/* Filters Group */}
        <div className="grid grid-cols-3 gap-2">
          {/* Fish species filter */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {t.fishType}
            </label>
            <select
              value={selectedFishType}
              onChange={(e) => setSelectedFishType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-bold text-slate-700 focus:outline-none focus:border-ocean"
              id="filter-fish-type"
            >
              <option value="all">{t.allTypes}</option>
              {fishTypes.map(f => (
                <option key={f} value={f} className="capitalize">{f}</option>
              ))}
            </select>
          </div>

          {/* Grade filter */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Gred
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-bold text-slate-700 focus:outline-none focus:border-ocean"
              id="filter-fish-grade"
            >
              <option value="all">Siri Gred</option>
              <option value={FishGrade.A}>Gred A</option>
              <option value={FishGrade.B}>Gred B</option>
              <option value={FishGrade.C}>Gred C</option>
            </select>
          </div>

          {/* Location filter */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {t.location}
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-bold text-slate-700 focus:outline-none focus:border-ocean"
              id="filter-location"
            >
              <option value="all">{t.allLocations}</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Listings */}
      <div className="space-y-4">
        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-350 mx-auto" />
            <p className="text-slate-700 font-bold text-xs">
              {language === Language.EN ? "No matches found" : "Tiada hasil padanan ditemui"}
            </p>
            <p className="text-[10px] text-slate-500">
              {language === Language.EN ? "Try altering search terms or filters" : "Cuba longgarkan penapis di atas"}
            </p>
          </div>
        ) : (
          filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row group hover:shadow-md transition-all h-auto"
            >
              {/* Product Picture */}
              <div className="relative w-full h-36 bg-slate-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.fishName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual certifications inside photo overlay */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className="bg-emerald-500 text-white font-bold text-[8px] px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                    💚 {t.certifiedHalal}
                  </span>
                  <span className="bg-sky-600 text-white font-bold text-[8px] px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                    💎 Gred {item.grade}
                  </span>
                </div>

                {/* Rating display */}
                <div className="absolute bottom-2 right-2 bg-slate-900/40 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-bold text-yellow-350 flex items-center gap-0.5">
                  ⭐ {item.rating.toFixed(1)}
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-ocean flex items-center gap-1">
                      🏫 {item.farmName}
                    </p>
                    <p className="text-[8px] font-mono text-slate-400">Date: {item.dateListed}</p>
                  </div>
                  
                  <h4 className="font-black text-sm text-slate-800 tracking-tight leading-tight">
                    {language === Language.EN ? item.fishName : item.fishMalayName}
                  </h4>

                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                {/* Technical stats container */}
                <div className="grid grid-cols-2 gap-3 border-t border-b border-dashed border-slate-100 py-2">
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider">{language === Language.EN ? "Price" : "Harga"}</span>
                    <span className="text-sm font-black text-slate-800 font-mono">
                      RM{item.pricePerKg.toFixed(2)}<span className="text-[9px] font-normal text-slate-500">/{t.kg}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider">{language === Language.EN ? "Stock Available" : "Stok Tersedia"}</span>
                    <span className="text-sm font-black text-orange-500 font-mono">
                      {item.availableKg} {t.kg}
                    </span>
                  </div>
                </div>

                {/* Location + Ordering CTA Row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-bold text-slate-500 flex items-center gap-0.5 max-w-[55%] truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {item.location}
                  </span>

                  <button
                    onClick={() => {
                      setActiveCheckoutItem(item);
                      setOrderCompleted(false);
                    }}
                    className="bg-ocean text-white font-bold py-2 px-3.5 rounded-xl text-[10px] shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center gap-1 shrink-0"
                    id={`order-btn-${item.id}`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {t.buyNow}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Interactive Checkout Modal backdrop shadow popup */}
      {activeCheckoutItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 animate-scale-up">
            
            {/* Modal cover picture */}
            <div className="relative h-20 bg-ocean text-white p-4 flex flex-col justify-end">
              <button 
                onClick={() => setActiveCheckoutItem(null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white text-[10px] font-bold hover:bg-black/35"
                id="close-checkout-modal-btn"
              >
                ✕
              </button>
              <h4 className="text-xs font-bold text-white/80 uppercase tracking-widest leading-none">ORDER DRAFT SUMMARY</h4>
              <h3 className="text-base font-black tracking-tight mt-1 truncate">
                {language === Language.EN ? activeCheckoutItem.fishName : activeCheckoutItem.fishMalayName}
              </h3>
            </div>

            {/* Modal Body form input */}
            <div className="p-5 space-y-4">
              {orderCompleted ? (
                <div className="py-6 flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl animate-bounce scale-110">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {language === Language.EN ? "Order Created!" : "Pesanan Selesai!"}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-[80%] mx-auto leading-relaxed">
                      {language === Language.EN 
                        ? `A text draft is synchronized. Farmer ${activeCheckoutItem.farmerName} has been alerted.` 
                        : `Notifikasi dihantar ke ${activeCheckoutItem.farmerName}. Stok sedia diambil.`}
                    </p>
                  </div>
                  <span className="text-[8px] font-mono text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <Clock className="w-3 h-3" /> Auto closing in 3s...
                  </span>
                </div>
              ) : (
                <>
                  {/* Select amount/kg slider counter */}
                  <div className="space-y-2 bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.weightAvailable}</label>
                      <span className="text-xs font-black text-slate-700 font-mono">{purchaseWeight} kg</span>
                    </div>

                    <input 
                      type="range"
                      min="1"
                      max={Math.min(activeCheckoutItem.availableKg, 100)} // Caps list for easy range
                      value={purchaseWeight}
                      onChange={(e) => setPurchaseWeight(Number(e.target.value))}
                      className="w-full accent-ocean bg-slate-200 h-1 rounded-full cursor-pointer"
                      id="checkout-weight-range"
                    />

                    <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                      <span>1 kg</span>
                      <span>50 kg</span>
                      <span>100 kg</span>
                    </div>
                  </div>

                  {/* Pricing Breakdown Math Box */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Subtotal ({purchaseWeight}kg × RM{activeCheckoutItem.pricePerKg.toFixed(2)})</span>
                      <span className="font-mono">RM{checkoutMath.subtotal.toFixed(2)}</span>
                    </div>

                    {purchaseWeight >= 10 ? (
                      <div className="flex justify-between text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-150">
                        <span className="flex items-center gap-1">🎉 Bulk discount applied (-10%):</span>
                        <span className="font-mono">-RM{checkoutMath.discount.toFixed(2)}</span>
                      </div>
                    ) : (
                      <div className="text-[9px] text-orange-600 font-bold leading-relaxed flex items-center gap-1 bg-orange-50 p-2 rounded-lg border border-orange-100">
                        <AlertCircle className="w-3 w-3 shrink-0" />
                        <span>Order at least 10kg to unlock 10% partner discount!</span>
                      </div>
                    )}

                    <div className="border-t border-slate-100 pt-3 flex justify-between text-slate-900 font-black text-sm">
                      <span>{language === Language.EN ? "Payable to Farmer" : "Harga Perlu Bayar"}</span>
                      <span className="text-ocean font-mono text-base">RM{checkoutMath.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* CTA Checkout Trigger */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveCheckoutItem(null)}
                      className="flex-1 bg-slate-100 border border-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl text-xs hover:bg-slate-200 active:scale-95 transition-all text-center"
                      id="cancel-checkout-btn"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      className="flex-1 bg-ocean hover:bg-[#005F92] text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md active:scale-95 transition-all text-center"
                      id="confirm-checkout-btn"
                    >
                      Confirm Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
