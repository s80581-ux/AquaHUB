import React, { useState } from "react";
import { UserListing, Language, FishGrade, MarketplaceItem } from "../types";
import { TRANSLATIONS } from "../data";
import { 
  Plus, 
  Tag, 
  Trash2, 
  FileEdit, 
  CheckCircle, 
  TrendingUp, 
  Store, 
  MessageSquare, 
  Package, 
  Camera, 
  Eye, 
  MapPin, 
  Sparkles,
  HelpCircle,
  Clock
} from "lucide-react";

interface SellFishTabProps {
  language: Language;
  userListings: UserListing[];
  onAddNewListing: (newListing: MarketplaceItem, draftListing: UserListing) => void;
  onModifyListingStatus: (listingId: string, newStatus: "active" | "sold") => void;
}

export default function SellFishTab({
  language,
  userListings,
  onAddNewListing,
  onModifyListingStatus,
}: SellFishTabProps) {
  const t = TRANSLATIONS[language];

  // Component form state toggler
  const [showForm, setShowForm] = useState(false);
  const [successPosted, setSuccessPosted] = useState(false);
  
  // New Listing Form state
  const [fishType, setFishType] = useState("tilapia");
  const [customFishName, setCustomFishName] = useState("Red Tilapia Grade A");
  const [weightKg, setWeightKg] = useState<number>(100);
  const [pricePerKg, setPricePerKg] = useState<number>(6.5);
  const [location, setLocation] = useState("Kuala Terengganu, Terengganu");
  const [description, setDescription] = useState("Freshly harvested from biological organic biofloc tanks. Highly active and premium quality.");
  const [selectedGrade, setSelectedGrade] = useState<FishGrade>(FishGrade.A);
  const [isHalal, setIsHalal] = useState(true);

  // File Upload State Mock
  const [dragOver, setDragOver] = useState(false);
  const [mockPhotoName, setMockPhotoName] = useState<string | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>("https://images.unsplash.com/photo-1534080391025-a77af6eb21a7?auto=format&fit=crop&q=80&w=600");

  // Filter listings memo
  const activeListings = userListings.filter(l => l.status === "active");
  const soldListings = userListings.filter(l => l.status === "sold");

  // Sum calculations
  const totals = React.useMemo(() => {
    const activeWeight = activeListings.reduce((sum, current) => sum + current.weightKg, 0);
    const totalSalesVolume = soldListings.reduce((sum, current) => sum + (current.weightKg * current.pricePerKg), 0);
    const totalInquiries = activeListings.reduce((sum, current) => sum + current.buyerInquiries, 0);
    return { activeWeight, totalSalesVolume, totalInquiries };
  }, [userListings]);

  // Form handle submit
  const handlePostListing = (e: React.FormEvent) => {
    e.preventDefault();

    // Mapping new item to display in Marketplace
    const marketplaceItem: MarketplaceItem = {
      id: `m-user-${Date.now()}`,
      fishId: fishType,
      fishName: customFishName || (fishType === "tilapia" ? "Red Tilapia Premium" : "Fresh African Catfish"),
      fishMalayName: fishType === "tilapia" ? "Tilapia Merah Gred A" : "Ikan Keli Segar",
      farmName: "My Home Biofloc Pond",
      farmerName: "Encik Roslan",
      location: location,
      pricePerKg: Number(pricePerKg),
      availableKg: Number(weightKg),
      grade: selectedGrade,
      isHalal: isHalal,
      image: selectedFileUrl,
      rating: 5.0,
      description: description,
      dateListed: "Today"
    };

    // User's private seller dashboard record
    const userDashboardListing: UserListing = {
      id: marketplaceItem.id,
      fishName: marketplaceItem.fishName,
      weightKg: marketplaceItem.availableKg,
      pricePerKg: marketplaceItem.pricePerKg,
      status: "active",
      datePosted: "Today",
      location: location,
      description: description,
      buyerInquiries: 0,
      image: selectedFileUrl,
    };

    // Callback to global state
    onAddNewListing(marketplaceItem, userDashboardListing);

    // Visual Success trigger
    setSuccessPosted(true);
    setTimeout(() => {
      setSuccessPosted(false);
      setShowForm(false);
      // Reset form variables
      setMockPhotoName(null);
    }, 2500);
  };

  // Drag states for touch-friendly container uploads
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setMockPhotoName(file.name);
      
      // Auto assign standard beautiful image mock if it matches species
      if (fishType === "catfish" || file.name.toLowerCase().includes("keli")) {
        setSelectedFileUrl("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600");
      } else {
        setSelectedFileUrl("https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=600");
      }
    }
  };

  const triggerMockInput = () => {
    const speciesPics: Record<string, string> = {
      tilapia: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=600",
      catfish: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600",
      seabass: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600",
      snapper: "https://images.unsplash.com/photo-1611171711810-bd896b55a475?auto=format&fit=crop&q=80&w=600"
    };

    setMockPhotoName(`capture_${fishType}_live.jpg`);
    setSelectedFileUrl(speciesPics[fishType] || speciesPics.tilapia);
  };

  const handleUpdateSpecies = (species: string) => {
    setFishType(species);
    const defaults: Record<string, {name: string, price: number, desc: string}> = {
      tilapia: { name: "Red Tilapia Grade A", price: 6.50, desc: "Grown in high-aeration backyard biofloc tanks. Sourced with organic pellet feed." },
      catfish: { name: "Ikan Keli Matured", price: 5.00, desc: "Large African Keli, sweet flavor, no muddy smell. Highly rich in protein." },
      seabass: { name: "Premium Siakap / Sea Bass", price: 12.00, desc: "Matured Barramundi harvested under standard salinity. Perfect restaurant size." },
      snapper: { name: "Red Snapper Fresh Bait", price: 16.00, desc: "Deep marine Red Snapper. High freshness grade, packed in ice upon order." }
    };
    if (defaults[species]) {
      setCustomFishName(defaults[species].name);
      setPricePerKg(defaults[species].price);
      setDescription(defaults[species].desc);
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-scale-up">
      {/* Visual Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display">
            {t.sellerDashboard}
          </h2>
          <p className="text-xs text-slate-500">
            {language === Language.EN ? "Monitor, advertise and resolve orders for your biofloc ponds" : "Urus pengiklanan hasil kolam dan pantau pesanan terus pembeli"}
          </p>
        </div>

        {/* Floating action style header button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-ocean text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1 hover:bg-[#005F92] transition-colors active:scale-95 shadow-md"
            id="seller-add-listing-fab"
          >
            <Plus className="w-4 h-4" />
            {language === Language.EN ? "Sell Harvest" : "Jual Hasil"}
          </button>
        )}
      </div>

      {/* Aggregate Counters Grid */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white p-3 border border-slate-100 rounded-2xl shadow-sm text-center">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Active</span>
          <span className="text-sm font-black text-slate-800 font-mono block mt-1">{activeListings.length}</span>
          <span className="text-[8px] text-slate-450 leading-none block font-semibold mt-0.5">{totals.activeWeight}kg {language === Language.EN ? "left" : "baki"}</span>
        </div>

        <div className="bg-white p-3 border border-slate-100 rounded-2xl shadow-sm text-center">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Sold</span>
          <span className="text-sm font-black text-emerald-600 font-mono block mt-1">{soldListings.length}</span>
          <span className="text-[8px] text-slate-450 leading-none block font-semibold mt-0.5">{language === Language.EN ? "Matured" : "Selesai"}</span>
        </div>

        <div className="bg-white p-3 border border-slate-100 rounded-2xl shadow-sm text-center">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Sales Volume</span>
          <span className="text-xs font-black text-slate-800 font-mono block mt-1.5">
            RM{totals.totalSalesVolume.toFixed(0)}
          </span>
          <span className="text-[8px] text-slate-450 leading-none block font-semibold mt-0.5">{language === Language.EN ? "Earned" : "Diterima"}</span>
        </div>

        <div className="bg-white p-3 border border-slate-100 rounded-2xl shadow-sm text-center relative">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Inquiries</span>
          <span className="text-sm font-black text-orange-500 font-mono block mt-1">{totals.totalInquiries}</span>
          {totals.totalInquiries > 0 && (
            <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
          )}
          <span className="text-[8px] text-slate-450 leading-none block font-semibold mt-0.5">{language === Language.EN ? "Hot Lead" : "Prospek"}</span>
        </div>
      </div>

      {/* Main Container: Switch between form and dashboards active lists */}
      {showForm ? (
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-5 animate-scale-up relative">
          
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1">
              <Store className="w-4.5 h-4.5 text-ocean" />
              {t.createListing}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-slate-400 hover:text-slate-650 flex items-center font-bold"
              id="cancel-form-btn"
            >
              ✕ {language === Language.EN ? "Cancel" : "Batal"}
            </button>
          </div>

          {/* Success Check Banner */}
          {successPosted ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl animate-bounce">
                ✓
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{t.successPost}</p>
                <p className="text-[10px] text-slate-500 mt-1">Connecting B40 yield grids with local kitchens</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePostListing} className="space-y-4">
              
              {/* Photo Upload area with Drag n Drop mock */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t.uploadPrompt}
                </label>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerMockInput}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5 ${
                    dragOver 
                    ? "border-ocean bg-sky-50/50" 
                    : mockPhotoName 
                    ? "border-emerald-300 bg-emerald-50/20" 
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                  id="touch-photo-upload-container"
                >
                  {mockPhotoName ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-emerald-500 animate-pulse-subtle" />
                      <p className="text-[10px] font-bold text-emerald-800">{mockPhotoName}</p>
                      <p className="text-[8px] text-slate-400 font-bold uppercase">{language === Language.EN ? "Tap to retake" : "Ketik untuk ambil semula"}</p>
                    </>
                  ) : (
                    <>
                      <Camera className="w-6 h-6 text-slate-400" />
                      <p className="text-[10px] font-bold text-slate-700">
                        {language === Language.EN ? "Drag & Drop or Click to Snap Photo" : "Lepaskan Gambar atau Tangkap Terus"}
                      </p>
                      <p className="text-[8px] text-slate-400">Supports live phone camera upload</p>
                    </>
                  )}
                </div>
              </div>

              {/* Form entries row */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* Species Dropdown */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {language === Language.EN ? "Fish Species" : "Spesies Ikan"}
                  </label>
                  <select
                    value={fishType}
                    onChange={(e) => handleUpdateSpecies(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700"
                    id="form-fish-species"
                  >
                    <option value="tilapia">Red Tilapia (Tilapia Merah)</option>
                    <option value="catfish">Catfish (Ikan Keli)</option>
                    <option value="seabass">Siakap (Sea Bass)</option>
                    <option value="snapper">Merah (Red Snapper)</option>
                  </select>
                </div>

                {/* Grade and Certification Choice */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {language === Language.EN ? "Grade Selection" : "Pilihan Gred"}
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value as FishGrade)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700"
                    id="form-gred"
                  >
                    <option value={FishGrade.A}>Gred A (Premium Size)</option>
                    <option value={FishGrade.B}>Gred B (Standard Size)</option>
                    <option value={FishGrade.C}>Gred C (Smaller Size)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic text name change */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Listing Title (English/BM)
                </label>
                <input
                  type="text"
                  value={customFishName}
                  onChange={(e) => setCustomFishName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700"
                  required
                  id="form-custom-title"
                />
              </div>

              {/* Weight & Price Numbers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {t.weightAvailable}
                  </label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    min="1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold font-mono text-slate-700"
                    required
                    id="form-weight-kg"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {t.pricePerKg}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(Number(e.target.value))}
                    min="0.1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold font-mono text-slate-700"
                    required
                    id="form-price-per-kg"
                  />
                </div>
              </div>

              {/* Location Input */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Farm Location (Zone)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700"
                  required
                  id="form-location"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {t.description}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-semibold"
                  id="form-desc"
                />
              </div>

              {/* Live Preview Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5">
                <span className="text-[8px] font-black uppercase text-ocean tracking-wider flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-ocean" />
                  {t.previewListing}
                </span>

                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/50 shadow-inner">
                  <img
                    src={selectedFileUrl}
                    alt="Preview Harvest"
                    className="w-12 h-12 rounded-lg object-cover text-xs shrink-0 bg-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-0.5 truncate flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-emerald-50 text-[7px] text-emerald-700 font-bold px-1 rounded">✓ Halal</span>
                      <span className="bg-sky-50 text-[7px] text-sky-700 font-bold px-1 rounded">🏅 {selectedGrade}</span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-800 truncate">{customFishName}</h5>
                    <p className="text-[9px] text-slate-400 font-mono">
                      RM{pricePerKg.toFixed(2)}/kg • {weightKg}kg total
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-slate-100 border border-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl text-xs hover:bg-slate-200 transition-colors"
                  id="form-discard-btn"
                >
                  {language === Language.EN ? "Discard Draft" : "Batal"}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-ocean hover:bg-[#005F92] text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1"
                  id="form-submit-btn"
                >
                  <Sparkles className="w-4 h-4 text-emerald-accent" />
                  {t.submitListing}
                </button>
              </div>

            </form>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Active Listings List */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
              {t.activeListings} ({activeListings.length})
            </h3>

            {activeListings.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-450 text-xs">
                {language === Language.EN ? "No active listings. Hit 'Sell Harvest' to start!" : "Tiada iklan aktiv. Ketik 'Jual Hasil' di atas!"}
              </div>
            ) : (
              activeListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 group hover:shadow transition-all"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-11 h-11 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-lg shadow-inner shrink-0 leading-none">
                      🐟
                    </div>
                    <div className="truncate space-y-0.5">
                      <h4 className="font-bold text-xs text-slate-800 truncate">
                        {listing.fishName}
                      </h4>
                      <p className="text-[10px] text-slate-405 leading-none font-mono">
                        {listing.weightKg} {t.kg} @ RM{listing.pricePerKg.toFixed(2)}/kg
                      </p>
                      
                      {/* Active Inquiry badges list click overlays */}
                      <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[8px] font-bold">
                        <MessageSquare className="w-2.5 h-2.5 shrink-0" />
                        {listing.buyerInquiries} {t.buyerInquiries}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Mark Sold action mock */}
                    <button
                      onClick={() => onModifyListingStatus(listing.id, "sold")}
                      className="bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200/60 text-emerald-700 font-bold text-[10px] py-1.5 px-3 rounded-lg transition-all"
                      id={`mark-sold-${listing.id}`}
                    >
                      {language === Language.EN ? "Mark Sold" : "Selesai Tuai"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sold Listings History */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
              🏆 {t.soldListings} ({soldListings.length})
            </h3>

            {soldListings.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-100 rounded-2xl p-4 text-center text-slate-400 text-[10px]">
                No successfully sold items recorded in last 30 days.
              </div>
            ) : (
              soldListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-emerald-50/25 border border-emerald-100 rounded-2xl p-4 shadow-sm flex items-center justify-between opacity-80"
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-sm font-bold shrink-0">
                      ✓
                    </span>
                    <div className="truncate space-y-0.5">
                      <h4 className="font-bold text-xs text-slate-700 truncate line-through">
                        {listing.fishName}
                      </h4>
                      <p className="text-[10px] text-slate-455 font-mono leading-none">
                        Sold {listing.weightKg}kg &bull; Total RM{(listing.weightKg * listing.pricePerKg).toFixed(2)}
                      </p>
                      <p className="text-[8px] text-emerald-600 font-semibold uppercase font-mono tracking-widest flex items-center gap-0.5">
                        <Clock className="w-2 h-2" /> DISBURSED TODAY
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}
