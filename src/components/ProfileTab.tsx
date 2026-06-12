import React, { useState } from "react";
import { Language } from "../types";
import { TRANSLATIONS } from "../data";
import { 
  User, 
  MapPin, 
  Award, 
  Settings, 
  CheckCircle, 
  HelpCircle, 
  LogOut, 
  Smartphone, 
  Globe, 
  FileCheck,
  Shield,
  Layers,
  Phone,
  Droplet
} from "lucide-react";

interface ProfileTabProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  totalEarnings: number;
}

export default function ProfileTab({
  language,
  onLanguageChange,
  totalEarnings,
}: ProfileTabProps) {
  const t = TRANSLATIONS[language];
  const [showSupport, setShowSupport] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [resolvedSupport, setResolvedSupport] = useState(false);

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    setResolvedSupport(true);
    setTimeout(() => {
      setResolvedSupport(false);
      setShowSupport(false);
      setSupportMessage("");
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-24 animate-scale-up">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-105 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Roslan Farmer"
              className="w-16 h-16 rounded-full border-2 border-ocean object-cover shadow-sm bg-slate-105"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-accent w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-extrabold border-2 border-white shadow-xs">
              M
            </span>
          </div>

          <div className="space-y-0.5">
            <h3 className="font-bold text-base text-slate-800 leading-tight">Encik Roslan Ahmad</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-ocean" /> Kuala Terengganu, Terengganu
            </p>
            <p className="text-[9px] text-[#0077B6] font-extrabold bg-[#0077B6]/5 px-2 py-0.5 rounded-full inline-block mt-1">
              {t.membershipLevel}: 🥇 {language === Language.EN ? "Elite Biofloc Partner" : "Rakan Strategik Bioflok"}
            </p>
          </div>
        </div>

        {/* Aggregate cumulative value box */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 border border-slate-100 rounded-2xl">
          <div>
            <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block">Joined Since</span>
            <span className="text-slate-800 font-bold text-xs block font-mono">August 2025</span>
          </div>
          <div>
            <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block">{t.totalRevenueEarned}</span>
            <span className="text-emerald-600 font-black text-xs block font-mono">RM{totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Quality Certification segment ("QUALITY & HALAL SCREEN") */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
          <Award className="w-4.5 h-4.5 text-emerald-accent" />
          <h3 className="text-sm font-bold text-slate-800 font-display">
            {t.qualityHalalStatus}
          </h3>
        </div>

        <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
          {language === Language.EN 
            ? "AquaHub coordinates with federal inspectors to certify smallholder biofloc ponds, matching corporate hospitality standards." 
            : "AquaHub menyelaraskan pemeriksaan kolam bersepadu bagi melayakkan penternak kecil memegang sijil standard katering."}
        </p>

        {/* Certification Cards */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Halal certi box */}
          <div className="bg-emerald-50/40 p-3 rounded-2xl border border-emerald-100/60 flex flex-col justify-between space-y-2 relative overflow-hidden">
            <span className="text-2xl opacity-15 absolute right-2 bottom-1">💚</span>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[9px] font-black text-emerald-800 tracking-wide uppercase">JAKIM Halal</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-700 leading-tight">ID: JAKIM-701A-B40</p>
              <p className="text-[8px] text-slate-400 font-medium">Valid: 2027 Dec &bull; Organic Feed</p>
            </div>
          </div>

          {/* Health check certi box */}
          <div className="bg-sky-50/40 p-3 rounded-2xl border border-sky-100/60 flex flex-col justify-between space-y-2 relative overflow-hidden">
            <span className="text-2xl opacity-15 absolute right-2 bottom-1">💎</span>
            <div className="flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-[9px] font-black text-sky-800 tracking-wide uppercase">Grade A Audited</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-700 leading-tight">Score: 98% Freshness</p>
              <p className="text-[8px] text-slate-400 font-medium">Last inspected: 2026-06-02</p>
            </div>
          </div>

        </div>

        {/* Inspection History details */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs">
          <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest block">Inspection Audit log</span>
          
          <div className="space-y-1.5 font-mono text-[9px] text-slate-500">
            <div className="flex justify-between items-center border-b border-slate-150/40 pb-1">
              <span>Ammonia Water Quality Checks:</span>
              <span className="font-bold text-emerald-600">&lt;0.05 mg/L (PASS)</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-150/40 pb-1">
              <span>pH Stability Level Range:</span>
              <span className="font-bold text-emerald-600">7.26 (PASS)</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Pathogen Free Biological Cert:</span>
              <span className="font-bold text-emerald-600">100% CLEAR (PASS)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Farm details specification list ("My Farm") */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-800 font-display flex items-center gap-1.5">
          <Droplet className="w-4.5 h-4.5 text-ocean" />
          {t.myFarm}
        </h3>
        
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 font-medium pt-1">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Tank System</p>
            <p className="font-semibold text-[11px]">3x Circular Biofloc HDPE</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Water Source</p>
            <p className="font-semibold text-[11px]">Filtered Borehole well</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Pond Depth</p>
            <p className="font-semibold text-[11px]">1.2 meters stable</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Backup Generator</p>
            <p className="font-semibold text-[11px]">Automatic Diesel Genset</p>
          </div>
        </div>
      </div>

      {/* Settings section with App Language switcher */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2 text-slate-800">
          <Settings className="w-4.5 h-4.5 text-slate-400" />
          <h3 className="text-sm font-bold font-display">{t.settings}</h3>
        </div>

        {/* Language Toggler Row */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Globe className="w-4.5 h-4.5 text-sky-500" />
              {t.languageLabel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200/50 p-1 rounded-xl">
            <button
              onClick={() => onLanguageChange(Language.EN)}
              className={`py-2 px-4 rounded-lg font-bold text-xs transition-all ${
                language === Language.EN 
                ? "bg-ocean text-white shadow" 
                : "text-slate-650 hover:bg-slate-100"
              }`}
              id="switch-lang-en"
            >
              🇺🇸 English (US)
            </button>
            <button
              onClick={() => onLanguageChange(Language.MS)}
              className={`py-2 px-4 rounded-lg font-bold text-xs transition-all ${
                language === Language.MS 
                ? "bg-ocean text-white shadow" 
                : "text-slate-650 hover:bg-slate-100"
              }`}
              id="switch-lang-ms"
            >
              🇲🇾 Bahasa Melayu
            </button>
          </div>
        </div>

        {/* Settings Links */}
        <div className="space-y-1.5 pt-1">
          <button
            onClick={() => alert("Redirecting to your active order draft ledger...")}
            className="w-full flex items-center justify-between text-xs text-slate-750 font-bold p-2.5 rounded-xl hover:bg-slate-50/80 text-left border border-transparent hover:border-slate-100"
            id="profile-lnk-orders"
          >
            <span>📦 {t.myOrders}</span>
            <span className="bg-sky-50 text-ocean text-[10px] font-black px-2 py-0.5 rounded-full">3 active</span>
          </button>

          <button
            onClick={() => setShowSupport(true)}
            className="w-full flex items-center justify-between text-xs text-slate-750 font-bold p-2.5 rounded-xl hover:bg-slate-50/80 text-left border border-transparent hover:border-slate-100"
            id="profile-lnk-support"
          >
            <span>💬 {t.support}</span>
            <span className="text-slate-400">➔</span>
          </button>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={() => alert("Simulation session refresh. All sample data restructures safely.")}
        className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 border border-rose-100"
        id="profile-logout-btn"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        {t.logout}
      </button>

      {/* Support Center Popup Modal */}
      {showSupport && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 p-5 space-y-4 animate-scale-up">
            
            <div className="flex justify-between items-center border-b border-slate-150 pb-2">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-ocean" />
                {t.support} (B40 Desk)
              </h3>
              <button 
                onClick={() => setShowSupport(false)}
                className="text-slate-450 font-bold text-xs"
                id="close-support-btn"
              >
                ✕
              </button>
            </div>

            {resolvedSupport ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg mx-auto">
                  ✓
                </div>
                <h4 className="text-xs font-bold text-slate-800">Inquiry Received</h4>
                <p className="text-[10px] text-slate-500 max-w-[80%] mx-auto">
                  Our regional aquaculture agents in Terengganu will handle this within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendSupport} className="space-y-3">
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                  Facing pond filter, water pH deviations, or buyer communication hiccups? Write down description below:
                </p>

                <textarea
                  required
                  rows={3}
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="e.g., My Tilapia pond pH rose to 8.5 after the heavy rainfall. Need advice."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-ocean placeholder:text-slate-400 font-semibold"
                  id="support-textarea"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSupport(false)}
                    className="flex-1 bg-slate-100 border border-slate-200 text-slate-655 font-bold py-2.5 rounded-xl text-[10px]"
                    id="support-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-ocean hover:bg-[#005F92] text-white font-bold py-2.5 rounded-xl text-[10px] shadow"
                    id="support-submit"
                  >
                    Send Ticket
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
