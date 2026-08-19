import React, { useState } from 'react';
import { 
  Building2, 
  Smartphone, 
  ShieldCheck, 
  MapPin, 
  FileSpreadsheet, 
  Clock, 
  Camera, 
  DollarSign, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Monitor, 
  HelpCircle, 
  TrendingUp, 
  Shield, 
  Radio, 
  ExternalLink, 
  BookOpen, 
  Download, 
  ChevronRight, 
  Sparkles, 
  Users, 
  Layers, 
  Cpu, 
  Check,
  AlertTriangle,
  Zap,
  Award,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateAndDownloadFieldSurePdf } from '../../utils/generateVectorPdf';

export const ProductManualAndWorkingModel: React.FC = () => {
  const { setViewMode, showToast, language } = useApp();
  const [activeRoleTab, setActiveRoleTab] = useState<'manager' | 'employee' | 'superadmin' | 'business_model'>('manager');

  const handleDownloadPdf = () => {
    try {
      showToast('📥 Downloading official 8-page FieldSure Master Manual PDF...');
      generateAndDownloadFieldSurePdf();
      showToast('✅ 8-Page PDF Master Manual downloaded successfully!');
    } catch (e) {
      setViewMode('mockups_pdf');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: PRODUCT MANUAL & WORKING MODEL */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
                Complete FieldSure™ Operating Guide & Blueprint
              </span>
              <span className="text-xs text-slate-400">v2.4 Enterprise</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              FieldSure™ SaaS — Features, Architecture & Working Model
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Designed with privacy controls aligned to DPDP Act 2023 and DPDP Rules 2025 principles by <strong>Savrdh Technologies</strong>. Security controls designed with reference to ISO 27001 principles.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => setViewMode('map_command_center')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Monitor className="w-4 h-4" />
              <span>Launch Live Map Wall</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download 8-Page Master PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ROLE-BASED "KYA KAISE KARNA HAI" INTERACTIVE GUIDE */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Step-by-Step User Guides (Kis User Ko Kya Karna Hai)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Select your role to view operational workflows, action buttons, and policy rules.
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
            <button
              onClick={() => setActiveRoleTab('manager')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeRoleTab === 'manager'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>1. Company Owner / Manager</span>
            </button>

            <button
              onClick={() => setActiveRoleTab('employee')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeRoleTab === 'employee'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>2. Field Officer</span>
            </button>

            <button
              onClick={() => setActiveRoleTab('superadmin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeRoleTab === 'superadmin'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>3. Savrdh Super-Admin</span>
            </button>

            <button
              onClick={() => setActiveRoleTab('business_model')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeRoleTab === 'business_model'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>4. ROI & Value Model</span>
            </button>
          </div>
        </div>

        {/* TAB 1: COMPANY OWNER / MANAGER GUIDE */}
        {activeRoleTab === 'manager' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">1</span>
                  <h3>Staff Onboarding & Shift Geofencing</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>"Company Admin"</strong> tab mein jayein. Employees add karein aur unke shift timings set karein. <strong>"Assign Field Task"</strong> par click karke exact client street address aur geofence radius (e.g. 300m) set karein.
                </p>
                <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                  ⚡ <strong>Auto-Rule:</strong> Client perimeter mein pahunchne par visit auto-verify ho jati hai.
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">2</span>
                  <h3>Adaptive Near-Real-Time NOC Map (Dual-Screen)</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>"🖥️ Popout Map (Dual-Screen)"</strong> par click karein. Map ko apne second monitor par drag karein. Adaptive location updates: Moving (15–30s), Stationary (2–5m), Punch-in/out & visits (immediate high-accuracy).
                </p>
                <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                  🖥️ <strong>Dual Monitor:</strong> Screen 1 par CRM aur Screen 2 par Live Map Wall ek sath run hoti hai.
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">3</span>
                  <h3>Expense Verification & Route Audit</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>"Expense Approvals"</strong> tab mein fuel claims aur restaurant bills audit karein. System GPS travel distance se match karke claim verification support provide karta hai.
                </p>
                <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                  ⛽ <strong>Audit Control:</strong> Unsupported claims ko reject ya approve karne ka direct button.
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">4</span>
                  <h3>1-Click Automated Payroll CSV Export</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Month-end par <strong>"Export Payroll (CSV)"</strong> click karein. Verified duty hours, attendance deductions, approved expenses aur incentives Tally / Keka / GreytHR format mein download ho jate hain.
                </p>
                <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                  📊 <strong>Zero Manual Work:</strong> HR teams ka monthly reconciliation time reduce hota hai.
                </div>
              </div>

            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-blue-900">Direct Action: Switch to Company Admin Workspace</p>
                  <p className="text-blue-700">Assign tasks, audit expenses, configure geofences, and manage staff rosters.</p>
                </div>
              </div>
              <button
                onClick={() => setViewMode('company_admin')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 transition-colors"
              >
                Open Company Admin →
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: FIELD OFFICER MOBILE GUIDE */}
        {activeRoleTab === 'employee' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-900 font-medium">
              📱 <strong>FieldSure Android Employee App</strong> with foreground duty-location service. <em>(Limited browser PWA version: continuous background location is not guaranteed).</em>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl border border-slate-200 bg-emerald-50/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">1</span>
                  <h3>Morning Punch-In & DPDP Consent</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mobile app open karke green <strong>"Punch In for Duty"</strong> button dabayein. GPS location lock hoti hai aur duty session start ho jata hai.
                </p>
                <div className="text-[11px] text-emerald-800 bg-emerald-100/50 p-2.5 rounded-xl border border-emerald-200">
                  🔒 <strong>Privacy Aligned:</strong> Tracking strictly active duty hours mein hi hoti hai.
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-emerald-50/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">2</span>
                  <h3>Client Site Check-In & Photo Audit</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Client location par pahunchte hi <strong>"Check-in at Site"</strong> dabayein. Camera photo capture karein aur visit checklist submit karein.
                </p>
                <div className="text-[11px] text-emerald-800 bg-emerald-100/50 p-2.5 rounded-xl border border-emerald-200">
                  📶 <strong>Offline Storage:</strong> Basement mein network na hone par bhi IndexedDB record save rakhta hai.
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-emerald-50/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">3</span>
                  <h3>Fuel & Expense Bill Upload</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fuel station ya restaurant bill ki photo kheenche aur claim amount enter karein. Location stamp attach ho jata hai reimbursement ke liye.
                </p>
                <div className="text-[11px] text-emerald-800 bg-emerald-100/50 p-2.5 rounded-xl border border-emerald-200">
                  📸 <strong>Fast Approval:</strong> Photo attachment se manager verification asaan ho jata hai.
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-emerald-50/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">4</span>
                  <h3>Evening Punch-Out & Privacy Termination</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Duty khatam hone par <strong>"Punch Out from Duty"</strong> press karein. Background location updates turant terminate ho jate hain.
                </p>
                <div className="text-[11px] text-emerald-800 bg-emerald-100/50 p-2.5 rounded-xl border border-emerald-200">
                  🛡️ <strong>Zero Off-Duty Tracking:</strong> Personal time mein complete privacy.
                </div>
              </div>

            </div>

            <div className="p-4 rounded-2xl bg-emerald-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-white">Direct Action: Switch to Field Employee Mobile Experience</p>
                  <p className="text-emerald-300">Test punching in, site visits, offline sync, and expense uploads on mobile viewport.</p>
                </div>
              </div>
              <button
                onClick={() => setViewMode('employee_pwa')}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shrink-0 transition-colors"
              >
                Open Employee App →
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SAVRDH SUPER-ADMIN GUIDE */}
        {activeRoleTab === 'superadmin' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl border border-slate-200 bg-purple-50/40 space-y-3">
                <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs">1</span>
                  <h3>Multi-Tenant Onboarding & Seat Allocation</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Nayi enterprise company ko onboard karein, Starter, Growth ya Enterprise tier plan assign karein aur active seats limit define karein.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-purple-50/40 space-y-3">
                <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs">2</span>
                  <h3>Automated 18% GST Invoicing & MRR</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Monthly subscription cycle par automated GST invoices generate karein with CGST, SGST, IGST tax breakdown and payment tracking.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-purple-50/40 space-y-3">
                <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs">3</span>
                  <h3>Secure 30-Min Support Impersonation</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Client issue resolve karne ke liye time-boxed access lein with customer OTP and mandatory audit logging.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-purple-50/40 space-y-3">
                <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs">4</span>
                  <h3>Append-only, Access-Controlled Audit Trail</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Audit trail monitor karein. Har admin login, data export, aur permission change securely log hota hai compliance review ke liye.
                </p>
              </div>

            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-purple-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-white">Direct Action: Switch to Savrdh Super-Admin Suite</p>
                  <p className="text-slate-400">View MRR analytics, manage enterprise licenses, and handle support tickets.</p>
                </div>
              </div>
              <button
                onClick={() => setViewMode('super_admin')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 transition-colors"
              >
                Open Super-Admin →
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: ROI & BUSINESS MODEL */}
        {activeRoleTab === 'business_model' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Attendance Integrity</span>
                <h4 className="text-base font-bold text-emerald-950">Leakage Reduction</h4>
                <p className="text-xs text-emerald-800">
                  Potential savings vary by workforce size, policies and existing operational leakage.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">Travel Claims</span>
                <h4 className="text-base font-bold text-blue-950">Claim Verification</h4>
                <p className="text-xs text-blue-800">
                  Supports verification and potential reduction of unsupported travel claims. Customer results vary.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide">Field Dispatch</span>
                <h4 className="text-base font-bold text-indigo-950">Optimized Routing</h4>
                <p className="text-xs text-indigo-800">
                  Assists managers in assigning nearby officers to urgent customer service tickets.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Privacy Alignment</span>
                <h4 className="text-base font-bold text-amber-950">DPDP Controls</h4>
                <p className="text-xs text-amber-800">
                  Designed with privacy controls aligned to DPDP Act 2023 and DPDP Rules 2025 principles.
                </p>
              </div>

            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Subscription Pricing Packages:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800 text-sm">Starter Plan</div>
                  <div className="text-lg font-black text-emerald-600 my-1">₹99 <span className="text-xs text-slate-500 font-normal">/user/mo</span></div>
                  <ul className="text-slate-600 space-y-1 text-[11px]">
                    <li>• GPS Attendance & Shifts</li>
                    <li>• Basic Visit Logging</li>
                    <li>• Up to 25 Staff</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-xl border-2 border-blue-600 shadow-sm relative">
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">POPULAR</span>
                  <div className="font-bold text-slate-800 text-sm">Growth Plan</div>
                  <div className="text-lg font-black text-blue-600 my-1">₹149 <span className="text-xs text-slate-500 font-normal">/user/mo</span></div>
                  <ul className="text-slate-600 space-y-1 text-[11px]">
                    <li>• Adaptive Location Updates</li>
                    <li>• Client Geofencing & Photo Audits</li>
                    <li>• Expense & Fuel Audit Engine</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800 text-sm">Enterprise Plan</div>
                  <div className="text-lg font-black text-purple-600 my-1">₹249 <span className="text-xs text-slate-500 font-normal">/user/mo</span></div>
                  <ul className="text-slate-600 space-y-1 text-[11px]">
                    <li>• Multi-Screen NOC Command Wall</li>
                    <li>• AI Performance Weighting Engine</li>
                    <li>• Tally/ERP API Integration</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. WORKING MODEL ARCHITECTURE & COMPONENT FLOW */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <span>FieldSure™ Technical Working Model (How Data Flows)</span>
          </h2>
          <p className="text-xs text-slate-500">
            End-to-end data pipeline from physical smartphone sensors to enterprise video wall.
          </p>
        </div>

        {/* Visual pipeline steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-slate-950 text-white space-y-2 relative">
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">1. Edge Capture</span>
            <h4 className="text-sm font-bold text-white">Employee Device</h4>
            <p className="text-xs text-slate-400">
              HTML5 Geolocation API, Network state, and local audit storage.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2 relative">
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold uppercase">2. Security Gate</span>
            <h4 className="text-sm font-bold text-white">Location Integrity Risk Engine</h4>
            <p className="text-xs text-slate-400">
              Evaluates risk states: Verified, Normal, Review Recommended, High-Risk Location, or Insufficient Evidence.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2 relative">
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold uppercase">3. Real-Time Engine</span>
            <h4 className="text-sm font-bold text-white">Adaptive Telemetry Engine</h4>
            <p className="text-xs text-slate-400">
              Moving: 15–30s, Stationary: 2–5 min, immediate on punch-in/out and visit check-ins.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 text-white space-y-2 relative">
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">4. Output Wall</span>
            <h4 className="text-sm font-bold text-white">Multi-Screen NOC Wall</h4>
            <p className="text-xs text-slate-400">
              Popout browser window, Leaflet/Google vector tiles, audio alert broadcasts.
            </p>
          </div>

        </div>

        {/* Security & DPDP Compliance Highlights */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-slate-900">Tenant-Isolated Architecture</h5>
              <p className="text-slate-500 mt-0.5">Every tenant has strictly isolated schema row security. No cross-company data leakage.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-slate-900">DPDP Lawful Duty Alignment</h5>
              <p className="text-slate-500 mt-0.5">Tracking occurs ONLY during verified shift hours. Zero off-duty telemetry collection.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-slate-900">Battery Status Support</h5>
              <p className="text-slate-500 mt-0.5">Battery status displayed only where supported and permitted by the device.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
