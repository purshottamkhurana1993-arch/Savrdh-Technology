import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { ExecutiveKPIVisualizer } from './components/analytics/ExecutiveKPIVisualizer';
import { CompanyDashboard } from './components/company/CompanyDashboard';
import { EmployeePWA } from './components/employee/EmployeePWA';
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard';
import { SchemaAndSecurityViewer } from './components/architecture/SchemaAndSecurityViewer';
import { SaaSMockupPdfDossier } from './components/mockups/SaaSMockupPdfDossier';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { viewMode, currentTenant, language } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header */}
      <Header />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'visualizer' && <ExecutiveKPIVisualizer />}
        {viewMode === 'company_admin' && <CompanyDashboard />}
        {viewMode === 'employee_pwa' && <EmployeePWA />}
        {viewMode === 'super_admin' && <SuperAdminDashboard />}
        {viewMode === 'architecture' && <SchemaAndSecurityViewer />}
        {viewMode === 'mockups_pdf' && <SaaSMockupPdfDossier />}
      </main>

      {/* Enterprise SaaS Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">FieldSure SaaS Platform</span>
            <span>• Owned and operated by <strong>Savrdh Technologies Pvt Ltd</strong></span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> ISO 27001 & DPDP 2023 Compliant
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
