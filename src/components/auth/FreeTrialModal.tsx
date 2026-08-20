import React, { useState } from 'react';
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Compass,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FreeTrialModal: React.FC = () => {
  const { 
    showFreeTrialModal, 
    setShowFreeTrialModal, 
    startCompanyTrial 
  } = useApp();

  const [companyName, setCompanyName] = useState<string>('Delhive Logistics & Couriers');
  const [ownerName, setOwnerName] = useState<string>('Amit Singhania');
  const [email, setEmail] = useState<string>('amit.singhania@delhivelogistics.in');
  const [phone, setPhone] = useState<string>('+91 98100 45678');
  const [industry, setIndustry] = useState<string>('Logistics & Courier Delivery');
  const [teamSize, setTeamSize] = useState<number>(25);
  const [prefillSampleData, setPrefillSampleData] = useState<boolean>(true);

  if (!showFreeTrialModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !ownerName.trim()) return;

    startCompanyTrial({
      companyName: companyName.trim(),
      ownerName: ownerName.trim(),
      email: email.trim() || 'demo.owner@fieldsure.in',
      phone: phone.trim() || '+91 98000 00000',
      industry,
      maxEmployees: teamSize,
      prefillSampleData
    });
  };

  const industries = [
    'Logistics & Courier Delivery',
    'FMCG & Food Distribution',
    'Field Sales & Retail Marketing',
    'Facility Management & Security',
    'Telecom & Infrastructure Service',
    'Pharma & Healthcare Distribution'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-6 text-white relative">
          <button
            onClick={() => setShowFreeTrialModal(false)}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" /> 14-Day Free Trial Sandbox
            </span>
            <span className="text-[11px] text-emerald-100 font-medium">Zero Credit Card Required</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">
            Create Your Live Company Demo & Trial
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1">
            Test live GPS duty tracking, real-time geofence task verification, and employee dispatch immediately.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Company & Owner Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Company / Organization Name *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Express Logistics"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Your Full Name (Company Owner) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Singhania"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="owner@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Industry & Team Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Industry Vertical
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              >
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Field Team Size Limit
              </label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value={10}>10 Field Employees (Starter)</option>
                <option value={25}>25 Field Employees (Growth Trial)</option>
                <option value={50}>50 Field Employees (Scale)</option>
                <option value={100}>100+ Field Employees (Enterprise)</option>
              </select>
            </div>
          </div>

          {/* Prefill Option Box */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-3">
            <input
              type="checkbox"
              id="prefillData"
              checked={prefillSampleData}
              onChange={(e) => setPrefillSampleData(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
            />
            <label htmlFor="prefillData" className="text-xs text-slate-200 cursor-pointer">
              <strong className="text-emerald-300 block font-bold mb-0.5">
                ⚡ Include Pre-configured Interactive Demo Field Team & GPS Tasks
              </strong>
              Automatically populates 2 active field agents with live GPS duty pins, scheduled client inspection visits, and sample geofence tasks so you can test all features right away.
            </label>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Live GPS Pins</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <Compass className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Geofence Proof</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Live 2-Way Chat</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowFreeTrialModal(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
            >
              <span>Launch 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
