import React, { useState, useMemo } from "react";
import { ProfitRecord, Language } from "../types";
import { TRANSLATIONS } from "../data";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  HelpCircle, 
  Plus, 
  Calculator, 
  Scale, 
  Percent,
  Check, 
  ChevronRight,
  TrendingUp as TrendUp,
  Award,
  Sparkles,
  RefreshCw,
  FolderPlus,
  Clock
} from "lucide-react";

interface ProfitTrackerTabProps {
  language: Language;
  profitRecords: ProfitRecord[];
  onAddNewRecord: (record: ProfitRecord) => void;
}

export default function ProfitTrackerTab({
  language,
  profitRecords,
  onAddNewRecord,
}: ProfitTrackerTabProps) {
  const t = TRANSLATIONS[language];

  // Calculator inputs states
  const [fishCount, setFishCount] = useState<number>(1000); // Purchased fingerlings
  const [sellingPrice, setSellingPrice] = useState<number>(6.5); // RM/kg
  const [operatingCost, setOperatingCost] = useState<number>(450); // feed, probiotics, energy
  const [survivalRatePercent, setSurvivalRatePercent] = useState<number>(85); // standard survival rate in biofloc
  const [avgHarvestWeightG, setAvgHarvestWeightG] = useState<number>(600); // average weight per fish (grams)

  // Success indicator for calculator saving log
  const [loggedSuccess, setLoggedSuccess] = useState(false);

  // Calculate stats based on logs list
  const recordStats = useMemo(() => {
    const revenue = profitRecords.reduce((sum, curr) => sum + curr.revenue, 0);
    const profit = profitRecords.reduce((sum, curr) => sum + curr.profit, 0);
    const soldWeight = profitRecords.reduce((sum, curr) => sum + curr.weightKg, 0);
    const avgRoi = profitRecords.length > 0 
      ? profitRecords.reduce((sum, curr) => sum + curr.roi, 0) / profitRecords.length 
      : 0;
    return { revenue, profit, soldWeight, avgRoi };
  }, [profitRecords]);

  // Calculator direct projections math
  const calculatorProjections = useMemo(() => {
    const survivalCount = fishCount * (survivalRatePercent / 100);
    const totalHarvestKg = (survivalCount * avgHarvestWeightG) / 1000;
    const estRevenue = totalHarvestKg * sellingPrice;
    const estProfit = estRevenue - operatingCost;
    const estRoiValue = operatingCost > 0 ? (estProfit / operatingCost) * 100 : 0;
    return {
      survivalCount,
      totalHarvestKg,
      estRevenue,
      estProfit,
      estRoiValue,
    };
  }, [fishCount, sellingPrice, operatingCost, survivalRatePercent, avgHarvestWeightG]);

  // Handle saving the projected calculation directly into the historical transactions logs!
  const handleLogProjectedSale = () => {
    const newRecord: ProfitRecord = {
      id: `p-calc-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      fishName: "Projected Harvest Log",
      weightKg: Math.round(calculatorProjections.totalHarvestKg),
      purchaseCost: operatingCost,
      sellingPrice: sellingPrice,
      revenue: Math.round(calculatorProjections.estRevenue),
      profit: Math.round(calculatorProjections.estProfit),
      roi: Math.round(calculatorProjections.estRoiValue),
    };

    onAddNewRecord(newRecord);
    setLoggedSuccess(true);
    setTimeout(() => {
      setLoggedSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-24 animate-scale-up">
      {/* Tab intro */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 font-display flex items-center justify-between">
          <span>{t.profitTracker}</span>
        </h2>
        <p className="text-xs text-slate-500">
          {language === Language.EN ? "Analyze your aquaculture revenue, margins, and projected fish production." : "Pantau hasil jualan, keuntungan bersih, dan draf pelaburan tangki anda."}
        </p>
      </div>

      {/* Stats Cards Display */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total revenue earned summary */}
        <div className="bg-white p-4 border border-slate-100 rounded-2xl shadow-sm space-y-1 relative overflow-hidden">
          <div className="absolute right-2 top-2 bg-sky-50 text-ocean w-7 h-7 rounded-full flex items-center justify-center text-xs">
            💰
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.totalRevenue}</p>
          <p className="text-lg font-black text-slate-800 font-mono">
            RM{recordStats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[9px] text-emerald-600 block font-bold">
            📈 {language === Language.EN ? "100% Secure" : "100% Telus"}
          </span>
        </div>

        {/* Total net profits */}
        <div className="bg-white p-4 border border-slate-100 rounded-2xl shadow-sm space-y-1 relative overflow-hidden">
          <div className="absolute right-2 top-2 bg-emerald-50 text-emerald-500 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">
            ✓
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.totalProfit}</p>
          <p className="text-lg font-black text-emerald-600 font-mono flex items-baseline">
            RM{recordStats.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[9px] text-slate-450 block font-semibold leading-relaxed">
            ROI: {recordStats.avgRoi.toFixed(0)}% avg
          </span>
        </div>

        {/* Monthly Income Target indicator */}
        <div className="bg-[#2ECC71] rounded-[32px] p-5 text-white shadow-lg space-y-3.5 col-span-2 relative overflow-hidden">
          {/* Decorative Aqua Graphic overlay */}
          <div className="absolute right-[-15px] bottom-[-20px] text-white opacity-10 w-24 h-24 rotate-12 pointer-events-none">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM11 19v-2h2v2h-2zm1-16c3.87 0 7 3.13 7 7s-3.13 7-7 7-7-3.13-7-7 3.13-7 7-7zm-1 5h2v6h-2V8z" />
            </svg>
          </div>

          <div className="flex justify-between items-start">
            <h4 className="font-bold text-sm tracking-tight font-display text-white uppercase">
              {language === Language.EN ? "Your Goal" : "Sasaran Anda"}
            </h4>
            <span className="bg-white/20 px-2 py-1 rounded text-[8px] font-black tracking-widest uppercase text-white border border-white/10">
              {language === Language.EN ? "Active" : "Aktif"}
            </span>
          </div>

          <p className="text-xs font-semibold opacity-95 text-white leading-relaxed">
            {language === Language.EN ? (
              <>You're on track to earn <span className="font-black underline underline-offset-4">RM{recordStats.profit.toFixed(0)}</span> this month.</>
            ) : (
              <>Anda berada di landasan tepat dengan keuntungan <span className="font-black underline underline-offset-4">RM{recordStats.profit.toFixed(0)}</span> bulan ini.</>
            )}
          </p>

          <div className="space-y-1.5 pt-0.5">
            <div className="w-full bg-black/10 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-700" 
                style={{ width: `${Math.min((recordStats.profit / 1000) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[8px] font-mono font-black text-white/95">
              <span>RM 0</span>
              <span>{Math.min(Math.round((recordStats.profit / 1000) * 100), 100)}% ACHIEVED</span>
              <span>RM 1,000</span>
            </div>
          </div>

          <p className="text-[10px] text-white/90 font-bold italic pt-1 border-t border-white/10 leading-relaxed">
            🌿 {t.motivationalPrompt} &bull; {language === Language.EN ? "Keep maintaining standard feeding cycles!" : "Kejayaan bermula dengan dedikasi kolam cergas!"}
          </p>
        </div>
      </div>

      {/* Visual Charts section using custom SVGs */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 font-display flex items-center gap-1">
            <TrendUp className="w-4 h-4 text-ocean" />
            {language === Language.EN ? "Yearly Profit Progression" : "Kemajuan Pendapatan Bulanan"}
          </h3>
          <p className="text-[9px] font-mono text-slate-400 font-bold uppercase">RM Net Profit per Harvest cycle</p>
        </div>

        {/* Custom Bar Chart representing profitRecords values */}
        <div className="h-32 flex items-end justify-between px-3 pt-4 bg-slate-50 border border-slate-100 rounded-2xl relative">
          
          {/* Custom Grid Horizontal Markers */}
          <div className="absolute left-0 right-0 top-6 border-t border-dashed border-slate-150 z-0 pointer-events-none" />
          <div className="absolute left-0 right-0 top-16 border-t border-dashed border-slate-150 z-0 pointer-events-none" />

          {profitRecords.map((rec, i) => (
            <div key={rec.id} className="flex flex-col items-center space-y-2 z-10 w-1/4">
              <span className="text-[9px] font-extrabold text-ocean font-mono bg-white px-1.5 py-0.5 rounded border border-slate-100 shadow-xs scale-90">
                RM{rec.profit}
              </span>
              {/* Dynamic bar heights based on value ratios */}
              <div 
                style={{ height: `${Math.max((rec.profit / 800) * 80, 20)}px` }}
                className="w-8 bg-gradient-to-t from-ocean to-aqua rounded-t-lg transition-all hover:opacity-90 relative group cursor-pointer"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded text-[8px] font-bold py-1 px-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow">
                  Weight: {rec.weightKg}kg &bull; ROI: {rec.roi}%
                </div>
              </div>
              <span className="text-[8px] text-slate-400 font-bold lowercase tracking-wider truncate max-w-full">
                {rec.date.split("-")[2] || rec.date} Jun
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Profit Calculator */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-50 pb-2">
          <div className="flex items-center gap-1.5">
            <Calculator className="w-4.5 h-4.5 text-ocean" />
            <h3 className="text-sm font-bold text-slate-800 font-display">
              {t.profitCalc}
            </h3>
          </div>
          <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 uppercase tracking-wider">
            <Sparkles className="w-2.5 h-2.5 animate-pulse-subtle" /> Smart Biofloc Mode
          </span>
        </div>

        <div className="space-y-3">
          
          {/* Purchased Fingerlings Stock Input Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-slate-600">
              <span className="flex items-center gap-1">🐟 {language === Language.EN ? "Fingerling Fry Stocked" : "Bil. Anak Ikan Dilepaskan"}</span>
              <span className="font-bold underline">{fishCount} pcs</span>
            </div>
            <input 
              type="range"
              min="500"
              max="5000"
              step="100"
              value={fishCount}
              onChange={(e) => setFishCount(Number(e.target.value))}
              className="w-full accent-ocean bg-slate-100 h-1 rounded-full cursor-pointer"
              id="calc-slider-fish-count"
            />
            <div className="flex justify-between text-[8px] text-slate-400 font-mono tracking-widest leading-none">
              <span>MIN: 500</span>
              <span>MAX: 5000</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            
            {/* Purchase operating cost input */}
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {t.purchaseCost} (RM)
              </label>
              <input
                type="number"
                value={operatingCost}
                onChange={(e) => setOperatingCost(Number(e.target.value))}
                min="50"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-mono text-slate-700"
                id="calc-input-operating-cost"
              />
            </div>

            {/* Price estimate choice */}
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {t.sellingPriceLabel} (RM/kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                min="1"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-mono text-slate-700"
                id="calc-input-selling-price"
              />
            </div>
          </div>

          {/* Survival Rate slider preset info */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-50 pt-3">
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Survival Rate % (Biofloc)
              </label>
              <select
                value={survivalRatePercent}
                onChange={(e) => setSurvivalRatePercent(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-700 focus:outline-none"
                id="calc-select-survival"
              >
                <option value="95">Excellent (95%)</option>
                <option value="85">Recommended Standard (85%)</option>
                <option value="70">Normal (70%)</option>
                <option value="50">Low Water Quality (50%)</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Avg Weight per Fish
              </label>
              <select
                value={avgHarvestWeightG}
                onChange={(e) => setAvgHarvestWeightG(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-700 focus:outline-none"
                id="calc-select-weight"
              >
                <option value="800">Grade A High (800g)</option>
                <option value="600">Standard Matured (600g)</option>
                <option value="450">B2B Small Stall (450g)</option>
              </select>
            </div>
          </div>

          {/* Calculator Output Projections Block */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 space-y-3 pt-3">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none border-b border-slate-200/50 pb-2 flex items-center gap-1">
              📈 Projections output based on {survivalRatePercent}% survival
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">{language === Language.EN ? "Est. Harvest Volume" : "Anggaran Kuantiti Tuai"}</span>
                <span className="font-bold text-slate-800 font-mono text-sm">
                  {Math.round(calculatorProjections.totalHarvestKg)} {t.kg}
                </span>
                <span className="text-[8px] text-slate-400 block">({Math.round(calculatorProjections.survivalCount)} fish survived)</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">{t.estRevenue}</span>
                <span className="font-bold text-slate-800 font-mono text-sm text-ocean">
                  RM{Math.round(calculatorProjections.estRevenue).toLocaleString('en-US')}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">{t.estProfit}</span>
                <span className="font-bold text-emerald-600 font-mono text-sm">
                  RM{Math.round(calculatorProjections.estProfit).toLocaleString('en-US')}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">{t.estRoi}</span>
                <span className="font-black text-slate-800 font-mono text-sm flex items-center gap-1">
                  💡 {Math.round(calculatorProjections.estRoiValue)}% ROI
                </span>
              </div>
            </div>

            {/* Direct Integration: Log estimated calculations directly into History */}
            <div className="pt-2 border-t border-slate-150/40">
              {loggedSuccess ? (
                <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-2.5 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5 animate-pulse-subtle">
                  ✓ {t.successLog}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLogProjectedSale}
                  className="w-full bg-[#0077B6]/5 hover:bg-[#0077B6] hover:text-white border border-[#0077B6]/10 text-ocean text-[10px] font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  id="calc-log-sale-btn"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {language === Language.EN ? "Save this Projection to Logs List" : "Simpan Anggaran ini ke Log Jualan"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Ledger List */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
          📋 {language === Language.EN ? "Historical Ledger Logs" : "Arkib Rekod Penjualan"}
        </h3>

        <div className="space-y-2.5">
          {profitRecords.map((rec) => (
            <div 
              key={rec.id} 
              className="bg-white border border-slate-50 p-4 rounded-2xl shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 truncate">
                <span className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 text-sm flex items-center justify-center font-bold">
                  ✓
                </span>
                <div className="truncate space-y-0.5">
                  <h4 className="font-bold text-xs text-slate-700 leading-tight">
                    {rec.fishName}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono leading-none">
                    Log: {rec.weightKg} {t.kg} &bull; Sold @ RM{rec.sellingPrice.toFixed(2)}/kg
                  </p>
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <span className="text-xs font-black text-emerald-600 font-mono block">
                  +RM{rec.profit}
                </span>
                <span className="text-[8px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-1.5 rounded-md">
                  {rec.roi}% ROI
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
