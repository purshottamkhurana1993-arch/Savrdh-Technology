import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Building2, 
  BarChart3, 
  Database, 
  Lock, 
  MapPin, 
  Clock, 
  Layers, 
  Key, 
  TrendingUp, 
  Receipt, 
  Globe, 
  FileSpreadsheet, 
  Sparkles, 
  ArrowLeft,
  ChevronRight,
  Info,
  ExternalLink,
  Battery,
  Navigation
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FieldSureLogo } from '../common/FieldSureLogo';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const SaaSMockupPdfDossier: React.FC = () => {
  const { setViewMode, currentTenant, showToast } = useApp();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<'all' | 'cover' | 'kpi' | 'admin' | 'pwa' | 'superadmin' | 'architecture'>('all');
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Download directly as multi-page PDF using jsPDF + html2canvas
  const handleDownloadJsPDF = async () => {
    if (!printAreaRef.current) return;
    setIsGeneratingPdf(true);
    setPdfProgress(10);
    showToast('📄 Generating high-resolution FieldSure SaaS Mockup PDF...');

    try {
      const element = printAreaRef.current;
      setPdfProgress(25);

      const canvas = await html2canvas(element, {
        scale: 1.8,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200
      });

      setPdfProgress(60);
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // PDF in A4 proportions
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // First Page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Subsequent Pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      setPdfProgress(90);
      pdf.save(`FieldSure_SaaS_All_Mockups_Savrdh_${new Date().toISOString().slice(0, 10)}.pdf`);
      setPdfProgress(100);
      showToast('✅ FieldSure PDF Mockups downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('⚠️ Direct PDF export encountered an issue. Opening Print-to-PDF dialog.');
      window.print();
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress(0);
    }
  };

  // Browser Native High-DPI Print to PDF
  const handleBrowserPrint = () => {
    showToast('Opening Print to PDF dialog... Select "Save as PDF" for vector resolution.');
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Action & Navigation Toolbar (Hidden in Print) */}
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-20 z-30 backdrop-blur-md bg-white/95">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('visualizer')}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              title="Back to App"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">FieldSure Complete SaaS Mockups & Architectural PDF Dossier</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase">
              All 6 Modules
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Single comprehensive PDF containing full-stack mockups, mobile PWA viewports, admin telemetry, and database specifications.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleBrowserPrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print / Save as PDF</span>
          </button>

          <button
            onClick={handleDownloadJsPDF}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? `Generating (${pdfProgress}%)...` : 'Download Single PDF File'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar when generating */}
      {isGeneratingPdf && (
        <div className="no-print bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 space-y-1.5 animate-in fade-in">
          <div className="flex items-center justify-between font-bold">
            <span>Rendering high-resolution canvas & compiling multi-page PDF...</span>
            <span>{pdfProgress}%</span>
          </div>
          <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${pdfProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Printable Multi-Page Container */}
      <div 
        ref={printAreaRef}
        id="fieldsure-pdf-dossier" 
        className="pdf-page-container bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto text-slate-900"
      >
        
        {/* =========================================================================
            PAGE 1: EXECUTIVE COVER & TITLE PAGE
            ========================================================================= */}
        <div className="page-break-after p-12 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white min-h-[960px] flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Accent Orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header & Brand */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center font-black text-white text-2xl shadow-lg ring-4 ring-emerald-500/20">
                  F✓
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white">FieldSure™</h1>
                  <p className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">Enterprise Workforce Management SaaS</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono text-slate-400 block">DOCUMENT REF: FS-MOCKUP-2026</span>
                <span className="text-xs font-bold text-slate-300">Confidential SaaS Specification</span>
              </div>
            </div>

            {/* Title Hero */}
            <div className="pt-10 space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" /> ISO 27001 & India DPDP Act 2023 Compliant Platform
              </div>

              <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
                Complete SaaS Product Mockup Suite & Technical Architecture Dossier
              </h2>

              <p className="text-base text-slate-300 leading-relaxed">
                Integrated multi-tenant enterprise field-force management system engineered for transparent, consent-driven employee telemetry, client geofencing, multi-tier performance scoring, and automated subscription governance.
              </p>
            </div>
          </div>

          {/* Center Blueprint Summary Cards */}
          <div className="relative z-10 grid grid-cols-3 gap-4 my-8">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Employee Android PWA</h3>
              <p className="text-xs text-slate-400">
                1-tap GPS verified duty punch-in, active shift geotracking, photo-proof client visits, and IndexedDB offline cache.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Company Admin Console</h3>
              <p className="text-xs text-slate-400">
                Google Maps live telemetry, route playback, attendance regularizations, expense approvals & CSV payroll engine.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Savrdh Super-Admin</h3>
              <p className="text-xs text-slate-400">
                Multi-tenant billing, GST invoicing, tenant provisioning, and audited 30-minute support impersonation.
              </p>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="relative z-10 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              <span>Designed & Operated by: </span>
              <strong className="text-white">Savrdh Technologies Pvt Ltd</strong>
            </div>
            <div className="flex items-center gap-6 font-mono text-[11px]">
              <span>RELEASE: August 2026</span>
              <span>•</span>
              <span>SECURITY: End-to-End Tenant Isolation</span>
            </div>
          </div>
        </div>


        {/* =========================================================================
            PAGE 2: EXECUTIVE KPI & REAL-TIME OPERATIONAL VISUALIZER MOCKUP
            ========================================================================= */}
        <div className="page-break-after p-10 bg-slate-50 min-h-[960px] space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 tracking-wider uppercase">Mockup Screen #01</span>
              <h2 className="text-xl font-bold text-slate-900">Executive KPI & Operational Health Visualizer</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              Live Real-Time Telemetry
            </span>
          </div>

          {/* Mockup Frame Container */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-6">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs text-slate-500 font-medium">Total Onboarded</span>
                <p className="text-2xl font-black text-slate-900 mt-1">118</p>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                  ↑ 100% Verified Seats
                </span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
                <span className="text-xs text-emerald-800 font-medium">Active Duty Today</span>
                <p className="text-2xl font-black text-emerald-900 mt-1">86</p>
                <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                  72.8% Field Coverage
                </span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80">
                <span className="text-xs text-blue-800 font-medium">Client Visits Logged</span>
                <p className="text-2xl font-black text-blue-900 mt-1">68</p>
                <span className="text-[11px] text-blue-700 font-semibold mt-1 block">
                  94.1% Verified GPS
                </span>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200/80">
                <span className="text-xs text-purple-800 font-medium">System Health Score</span>
                <p className="text-2xl font-black text-purple-900 mt-1">96.4/100</p>
                <span className="text-[11px] text-purple-700 font-semibold mt-1 block">
                  Optimal Field Performance
                </span>
              </div>
            </div>

            {/* Attendance & Shift Breakdown Visualizer */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Attendance Distribution Today</h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Present & On-Field (86)</span>
                      <span className="text-emerald-700">72.8%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '72.8%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Late Punch-Ins (6)</span>
                      <span className="text-amber-700">5.1%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '5.1%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Approved Casual/Sick Leaves (4)</span>
                      <span className="text-blue-700">3.4%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '3.4%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Expense Reimbursements Pipeline</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px]">Total Claimed (Aug 2026)</span>
                    <p className="text-base font-bold text-slate-900">₹42,800</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="text-emerald-800 text-[10px]">Approved & Processed</span>
                    <p className="text-base font-bold text-emerald-900">₹28,400</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <span className="text-amber-800 text-[10px]">Pending HR Audit</span>
                    <p className="text-base font-bold text-amber-900">₹14,400</p>
                  </div>
                  <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                    <span className="text-slate-600 text-[10px]">Avg Claim per Officer</span>
                    <p className="text-base font-bold text-slate-800">₹1,120</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <span className="font-semibold">Key Architectural Note:</span>
            <span>Real-time aggregation queries run asynchronously across multi-tenant shards with sub-50ms render latency.</span>
          </div>
        </div>


        {/* =========================================================================
            PAGE 3: COMPANY ADMIN DASHBOARD & GOOGLE MAPS TELEMETRY MOCKUP
            ========================================================================= */}
        <div className="page-break-after p-10 bg-slate-50 min-h-[960px] space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 tracking-wider uppercase">Mockup Screen #02</span>
              <h2 className="text-xl font-bold text-slate-900">Company Admin Console — Google Maps Live Telemetry Grid</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Field Operations Control
            </span>
          </div>

          {/* Mockup Frame Container */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-5">
            {/* Top Admin Bar */}
            <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-bold">AKBS Poultry Pvt Ltd — Delhi-NCR Live Field Grid</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-emerald-400 font-medium">● 4 Officers Live On-Duty</span>
                <span className="text-slate-400">GPS Rate: 5s Stream</span>
              </div>
            </div>

            {/* Map Visualizer Mockup */}
            <div className="grid grid-cols-3 gap-4">
              {/* Map Canvas */}
              <div className="col-span-2 bg-slate-950 rounded-xl p-4 border border-slate-800 relative h-72 flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full absolute inset-0 opacity-40">
                  <pattern id="grid-doc" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" strokeWidth="0.5" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid-doc)" />
                  <path d="M 40 140 Q 150 90 320 150 T 550 110" fill="none" stroke="#475569" strokeWidth="3" />
                  <path d="M 180 20 L 200 260" fill="none" stroke="#475569" strokeWidth="2" />
                  <path d="M 90 200 L 190 160 L 300 130 L 380 110" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
                </svg>

                {/* Markers */}
                <div className="absolute top-[35%] left-[60%] -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white text-white text-xs font-bold flex items-center justify-center shadow-lg mx-auto">
                    RS
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white text-[9px] font-bold shadow-xs whitespace-nowrap mt-1 block">
                    Rahul Sharma (CP Outlet • 18km/h)
                  </span>
                </div>

                <div className="absolute top-[55%] left-[30%] -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white text-white text-xs font-bold flex items-center justify-center shadow-lg mx-auto">
                    PV
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white text-[9px] font-semibold shadow-xs whitespace-nowrap mt-1 block">
                    Priya Verma (Cyber Hub)
                  </span>
                </div>

                <div className="absolute top-[70%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="w-7 h-7 rounded-full bg-amber-600 border-2 border-white text-white text-xs font-bold flex items-center justify-center shadow-lg mx-auto">
                    AK
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white text-[9px] font-semibold shadow-xs whitespace-nowrap mt-1 block">
                    Amit Kumar (On Break)
                  </span>
                </div>
              </div>

              {/* Officer Details Sidebar */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h4 className="font-bold text-slate-900">Rahul Sharma</h4>
                    <span className="text-[10px] text-slate-500 font-mono">AKBS-FLD-102</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                    ON DUTY
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <p className="text-slate-600"><strong>Shift:</strong> General Field (09:00 - 18:00)</p>
                  <p className="text-slate-600"><strong>Punch-In:</strong> 08:54 AM (Sector 18 Noida)</p>
                  <p className="text-slate-600 flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5 text-emerald-600" />
                    <span><strong>Battery:</strong> 74% • ±3.8m Accuracy</span>
                  </p>
                  <p className="text-slate-600"><strong>Assigned:</strong> Connaught Place Farm Outlet</p>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Today's Breadcrumb Trace</span>
                  <div className="text-[10px] text-slate-600 space-y-1 mt-1">
                    <div>• 08:54 AM - Sector 18 Market Punch In</div>
                    <div>• 11:30 AM - Lodhi Colony Fresh Mart</div>
                    <div>• 03:45 PM - Connaught Place Hub</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance & Tasks Matrix */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">Attendance & Shift Corrections</span>
                <p className="text-[11px] text-slate-500">Manager can approve duty hours and regularize traffic delays with a single click.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">Automated Payroll CSV Engine</span>
                <p className="text-[11px] text-slate-500">Exports present days, overtime hours, and verified allowances ready for direct payroll processing.</p>
              </div>
            </div>
          </div>
        </div>


        {/* =========================================================================
            PAGE 4: EMPLOYEE ANDROID-FIRST PROGRESSIVE WEB APP MOCKUPS
            ========================================================================= */}
        <div className="page-break-after p-10 bg-slate-50 min-h-[960px] space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 tracking-wider uppercase">Mockup Screen #03</span>
              <h2 className="text-xl font-bold text-slate-900">Employee Android-First PWA Mobile Mockup Suite</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Mobile Viewport Designs
            </span>
          </div>

          {/* 3 Mobile Device Frames Side-by-Side */}
          <div className="grid grid-cols-3 gap-5">
            
            {/* Screen 1: Duty Punch-In & Active Tracking */}
            <div className="bg-slate-900 p-2.5 rounded-3xl shadow-xl border-4 border-slate-800 text-slate-900">
              <div className="bg-slate-50 rounded-2xl p-3.5 space-y-3 min-h-[440px] flex flex-col justify-between text-xs">
                <div>
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 border-b border-slate-200">
                    <span>09:41</span>
                    <span>FieldSure PWA • 4G</span>
                  </div>

                  {/* Header */}
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Rahul Sharma</h4>
                      <span className="text-[10px] text-slate-500">AKBS-FLD-102</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                      ON DUTY
                    </span>
                  </div>

                  {/* Permanent Location Active Banner */}
                  <div className="mt-2.5 p-2 rounded-xl bg-emerald-600 text-white text-[10px] flex items-center gap-1.5 shadow-xs">
                    <Navigation className="w-3 h-3 animate-pulse" />
                    <span>Location Tracking Active (Consent Verified)</span>
                  </div>

                  {/* Shift timer */}
                  <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Duty Time Elapsed</span>
                    <p className="text-xl font-black text-slate-900 font-mono">06h : 22m : 14s</p>
                    <span className="text-[10px] text-slate-500">Punched in at 08:54 AM</span>
                  </div>
                </div>

                {/* Punch Out CTA */}
                <div className="space-y-1.5">
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-900">
                    ⏸️ Take Official Rest / Lunch Break
                  </div>
                  <button className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-xs">
                    🛑 Punch-Out (End Duty Tracking)
                  </button>
                </div>
              </div>
            </div>

            {/* Screen 2: Field Tasks & Client Geofence Visit */}
            <div className="bg-slate-900 p-2.5 rounded-3xl shadow-xl border-4 border-slate-800 text-slate-900">
              <div className="bg-slate-50 rounded-2xl p-3.5 space-y-3 min-h-[440px] flex flex-col justify-between text-xs">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 border-b border-slate-200">
                    <span>09:41</span>
                    <span>Client Geofence Check</span>
                  </div>

                  <h4 className="font-bold text-slate-900 mt-2">Assigned Field Visits</h4>
                  
                  {/* Visit 1: Verified Check-in */}
                  <div className="mt-2 p-2.5 bg-white rounded-xl border border-emerald-200 shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-[11px]">Nature Fresh Mart</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">✓ CHECKED IN</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Connaught Place Inner Circle</p>
                    <div className="text-[9px] text-emerald-700 font-medium">GPS Match: 8.5m Accuracy Verified</div>
                  </div>

                  {/* Visit 2: Next scheduled */}
                  <div className="mt-2 p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-[11px]">Le Meridien Kitchen</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">SCHEDULED</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Bulk poultry contract verification</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <button className="w-full py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs">
                    📸 Upload Client Photo Proof
                  </button>
                </div>
              </div>
            </div>

            {/* Screen 3: Expense Claim & Offline Queue */}
            <div className="bg-slate-900 p-2.5 rounded-3xl shadow-xl border-4 border-slate-800 text-slate-900">
              <div className="bg-slate-50 rounded-2xl p-3.5 space-y-3 min-h-[440px] flex flex-col justify-between text-xs">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 border-b border-slate-200">
                    <span>09:41</span>
                    <span>1-Tap Expense Claims</span>
                  </div>

                  <h4 className="font-bold text-slate-900 mt-2">Submit Fuel & Travel</h4>

                  <div className="mt-2 space-y-2">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-400">Claim Amount</span>
                      <p className="text-base font-bold text-slate-900">₹680.00</p>
                      <span className="text-[9px] text-slate-500">CNG Fuel Refill • South Delhi (28.4km)</span>
                    </div>

                    <div className="p-2 bg-slate-100 rounded-lg text-[10px] text-slate-600">
                      📴 <strong>Offline Engine:</strong> Cached in local IndexedDB. Automatically uploads upon 4G reconnect.
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <button className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs">
                    🧾 Submit Claim with Receipt
                  </button>
                </div>
              </div>
            </div>

          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
            <span className="font-semibold">DPDP 2023 Privacy Guarantee:</span>
            <span>Zero personal SMS, WhatsApp, browsing history, or background tracking outside active duty sessions.</span>
          </div>
        </div>


        {/* =========================================================================
            PAGE 5: SAVRDH SUPER-ADMIN SAAS GOVERNANCE & MULTI-TENANT BILLING
            ========================================================================= */}
        <div className="page-break-after p-10 bg-slate-50 min-h-[960px] space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-[11px] font-bold text-purple-700 tracking-wider uppercase">Mockup Screen #04</span>
              <h2 className="text-xl font-bold text-slate-900">Savrdh Super-Admin SaaS Governance & Multi-Tenant Billing</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
              Platform Master Console
            </span>
          </div>

          {/* Super-Admin Mockup Content */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-5">
            {/* Global Metric Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200">
                <span className="text-xs text-purple-800 font-medium">Monthly SaaS MRR</span>
                <p className="text-2xl font-black text-purple-950 mt-1">₹63,423</p>
                <span className="text-[11px] text-purple-700 font-semibold">+18% vs last month</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Active Tenants</span>
                <p className="text-2xl font-black text-slate-900 mt-1">3 Companies</p>
                <span className="text-[11px] text-slate-600">191 Active Field Seats</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs text-emerald-800 font-medium">Platform Uptime</span>
                <p className="text-2xl font-black text-emerald-950 mt-1">99.98%</p>
                <span className="text-[11px] text-emerald-700 font-semibold">Zero GPS Outages</span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-xs text-blue-800 font-medium">GST Invoices</span>
                <p className="text-2xl font-black text-blue-950 mt-1">100% Paid</p>
                <span className="text-[11px] text-blue-700 font-semibold">Razorpay & Cashfree</span>
              </div>
            </div>

            {/* Tenant Companies Table Mockup */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Tenant Provisioning Ledger</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Company Name</th>
                      <th className="p-2.5">Plan Tier</th>
                      <th className="p-2.5">Active Seats</th>
                      <th className="p-2.5">Monthly Billing</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">AKBS Poultry Pvt Ltd</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">Enterprise</span></td>
                      <td className="p-2.5">118 / 150</td>
                      <td className="p-2.5 font-mono">₹42,480 (incl. GST)</td>
                      <td className="p-2.5"><span className="text-emerald-700 font-bold">● Active</span></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">NCR Field Services Ltd</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">Growth</span></td>
                      <td className="p-2.5">54 / 80</td>
                      <td className="p-2.5 font-mono">₹16,225 (incl. GST)</td>
                      <td className="p-2.5"><span className="text-emerald-700 font-bold">● Active</span></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">Bright Retail Network</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-[10px]">Starter</span></td>
                      <td className="p-2.5">19 / 30</td>
                      <td className="p-2.5 font-mono">₹4,718 (incl. GST)</td>
                      <td className="p-2.5"><span className="text-amber-700 font-bold">● 14-Day Trial</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Audited Impersonation Security */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                  <Lock className="w-4 h-4" /> Cryptographically Audited Super-Admin Impersonation
                </span>
                <span className="font-mono text-[10px] text-slate-400">30-Min Auto-Expiring Session</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Every support login into a client company generates an immutable audit record with actor IP, reason for access, and timestamp in compliance with enterprise ISO 27001 data-access protocols.
              </p>
            </div>
          </div>
        </div>


        {/* =========================================================================
            PAGE 6: ENTERPRISE FIRESTORE SCHEMA & DPDP PRIVACY ARCHITECTURE
            ========================================================================= */}
        <div className="p-10 bg-slate-50 min-h-[960px] space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-[11px] font-bold text-slate-700 tracking-wider uppercase">Technical Architecture #05</span>
              <h2 className="text-xl font-bold text-slate-900">Database Schema & India DPDP Act 2023 Security Rules</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white">
              Data Governance
            </span>
          </div>

          {/* Architecture Content */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-5">
            {/* Hierarchical Collections Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Multi-Tenant Firestore Collection Hierarchy</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
                  <span className="text-emerald-700 font-bold">/tenants/{'{tenantId}'}</span>
                  <p className="text-slate-600 font-sans text-[10px]">Company metadata, plan, GST details & data retention quota.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
                  <span className="text-blue-700 font-bold">/tenants/{'{tenantId}'}/dutySessions</span>
                  <p className="text-slate-600 font-sans text-[10px]">Punch-in timestamps, GPS breadcrumbs, breaks & accuracy logs.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
                  <span className="text-purple-700 font-bold">/tenants/{'{tenantId}'}/fieldVisits</span>
                  <p className="text-slate-600 font-sans text-[10px]">Client geofences, verified check-in coordinates & photo proofs.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
                  <span className="text-amber-700 font-bold">/tenants/{'{tenantId}'}/auditLogs</span>
                  <p className="text-slate-600 font-sans text-[10px]">Immutable write-only audit stream with actor ID, IP & action.</p>
                </div>
              </div>
            </div>

            {/* Firestore Rules Spec Code Snippet */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Tenant Isolation Security Rules (firestore.rules)</h4>
              <div className="p-3.5 bg-slate-950 text-slate-200 rounded-xl font-mono text-[10.5px] leading-relaxed overflow-x-auto border border-slate-800">
                <pre>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSuperAdmin() {
      return request.auth.token.role == 'super_admin';
    }
    function isTenantUser(tenantId) {
      return request.auth.token.tenantId == tenantId;
    }
    match /tenants/{tenantId}/{document=**} {
      allow read, write: if isSuperAdmin() || isTenantUser(tenantId);
    }
  }
}`}</pre>
              </div>
            </div>

            {/* DPDP Compliance Matrix */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
              <span className="font-bold block">Digital Personal Data Protection (DPDP) Act 2023 Compliance Matrix:</span>
              <ul className="grid grid-cols-2 gap-2 text-[11px] list-disc pl-4 text-emerald-900">
                <li>Consent recorded with cryptographic timestamp before GPS activation</li>
                <li>Tracking automatically terminates upon punch-out</li>
                <li>Zero access to employee personal WhatsApp, SMS, or media</li>
                <li>Automated 30/60/90-day GPS purge according to tenant subscription tier</li>
              </ul>
            </div>
          </div>

          {/* End of Dossier Sign-Off */}
          <div className="text-center pt-4 border-t border-slate-200 text-xs text-slate-500">
            FieldSure™ SaaS System Specification & Mockup Dossier • © 2026 Savrdh Technologies Pvt Ltd • All Rights Reserved.
          </div>
        </div>

      </div>
    </div>
  );
};
