import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { ExecutiveKPIVisualizer } from './components/analytics/ExecutiveKPIVisualizer';
import { CompanyDashboard } from './components/company/CompanyDashboard';
import { EmployeePWA } from './components/employee/EmployeePWA';
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard';
import { SchemaAndSecurityViewer } from './components/architecture/SchemaAndSecurityViewer';
import { SaaSMockupPdfDossier } from './components/mockups/SaaSMockupPdfDossier';
import { ComingSoonPoster } from './components/poster/ComingSoonPoster';
import { UniversalAuthPortal } from './components/auth/UniversalAuthPortal';
import { MultiScreenMapCommandCenter } from './components/company/MultiScreenMapCommandCenter';
import { ProductManualAndWorkingModel } from './components/guide/ProductManualAndWorkingModel';
import { ShieldCheck, Lock, CheckCircle2, FileText, Download, Eye, Sparkles, Rocket, KeyRound, Monitor, MapPin, BookOpen } from 'lucide-react';
import { generateAndDownloadFieldSurePdf } from './utils/generateVectorPdf';

const MainLayout: React.FC = () => {
  const { viewMode, setViewMode, currentTenant, language, showToast } = useApp();

  const handleInstantDownload = () => {
    try {
      showToast('📥 Generating and downloading FieldSure 6-page Vector PDF...');
      generateAndDownloadFieldSurePdf();
      showToast('✅ FieldSure PDF downloaded to your device!');
    } catch (e) {
      console.error(e);
      showToast('⚠️ Opening printable mockup view...');
      setViewMode('mockups_pdf');
    }
  };

  // If user opens or switches to full-screen multi-monitor command center
  if (viewMode === 'map_command_center') {
    return <MultiScreenMapCommandCenter />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header */}
      <Header />

      {/* Prominent Quick Access PDF & Poster Bar */}
      {viewMode !== 'mockups_pdf' && viewMode !== 'coming_soon_poster' && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white border-b border-slate-700 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-2">
                  <span>FieldSure™ Enterprise SaaS Launch Suite (Savrdh Technologies)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-semibold uppercase">
                    Launch Q4 2026
                  </span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Full multi-tenant architecture, Android-first PWA, Google Maps telemetry & official launch poster ready.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <button
                onClick={() => setViewMode('product_manual')}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>📖 User Manual & Working Model</span>
              </button>

              <button
                onClick={() => setViewMode('map_command_center')}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>🖥️ Multi-Screen Live Map</span>
              </button>

              <button
                onClick={() => setViewMode('auth_portal')}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>🔐 Sign Up / Login Screen</span>
              </button>

              <button
                onClick={() => setViewMode('coming_soon_poster')}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>🚀 Coming Soon Poster</span>
              </button>

              <button
                onClick={handleInstantDownload}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Download PDF Dossier</span>
              </button>

              <button
                onClick={() => setViewMode('mockups_pdf')}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-600 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View 6 Mockup Pages</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'visualizer' && <ExecutiveKPIVisualizer />}
        {viewMode === 'company_admin' && <CompanyDashboard />}
        {viewMode === 'employee_pwa' && <EmployeePWA />}
        {viewMode === 'super_admin' && <SuperAdminDashboard />}
        {viewMode === 'architecture' && <SchemaAndSecurityViewer />}
        {viewMode === 'mockups_pdf' && <SaaSMockupPdfDossier />}
        {viewMode === 'coming_soon_poster' && <ComingSoonPoster />}
        {viewMode === 'auth_portal' && <UniversalAuthPortal />}
        {viewMode === 'product_manual' && <ProductManualAndWorkingModel />}
      </main>

      {/* Enterprise SaaS Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">FieldSure SaaS Platform</span>
            <span>• Owned and operated by <strong>Savrdh Technologies</strong></span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Security controls aligned to ISO 27001 & DPDP 2023 principles
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-600">
              <Lock className="w-3 h-3" /> End-to-End Tenant Isolation
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
