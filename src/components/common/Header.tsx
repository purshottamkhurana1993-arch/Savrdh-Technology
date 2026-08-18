import React, { useState } from 'react';
import { 
  BarChart3, 
  Building2, 
  Smartphone, 
  ShieldCheck, 
  Database, 
  Globe, 
  WifiOff, 
  Wifi, 
  MapPin, 
  UserCircle2, 
  ChevronDown, 
  Bell, 
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FieldSureLogo } from './FieldSureLogo';

export const Header: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    language, 
    setLanguage, 
    isOffline, 
    setIsOffline,
    offlineQueueCount,
    tenants, 
    currentTenant, 
    setCurrentTenant,
    users, 
    currentUser, 
    setCurrentUser,
    currentDutySession,
    notificationToast
  } = useApp();

  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isTrackingActive = currentDutySession && currentDutySession.status === 'active';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Toast Notification */}
      {notificationToast && (
        <div className="bg-emerald-600 text-white text-xs font-medium py-1.5 px-4 text-center transition-all duration-300 animate-in fade-in slide-in-from-top flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Main Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Tenant Badge */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setViewMode('visualizer')}
              className="text-left focus:outline-hidden"
            >
              <FieldSureLogo size="md" />
            </button>

            {/* Tenant Selector Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => {
                  setShowTenantMenu(!showTenantMenu);
                  setShowUserMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="max-w-[140px] truncate">{currentTenant.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold uppercase">
                  {currentTenant.plan}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showTenantMenu && (
                <div className="absolute left-0 mt-1.5 w-64 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Tenant Company
                  </div>
                  {tenants.map(tenant => (
                    <button
                      key={tenant.id}
                      onClick={() => {
                        setCurrentTenant(tenant);
                        setShowTenantMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${tenant.id === currentTenant.id ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700'}`}
                    >
                      <div className="flex flex-col">
                        <span className="truncate">{tenant.name}</span>
                        <span className="text-[10px] text-slate-500">{tenant.activeEmployees} active employees</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${tenant.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {tenant.plan}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation View Switcher (Tabs) */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 overflow-x-auto max-w-full">
            <button
              onClick={() => setViewMode('visualizer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                viewMode === 'visualizer'
                  ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'KPI Visualizer' : 'डैशबोर्ड एनालिटिक्स'}</span>
            </button>

            <button
              onClick={() => {
                setViewMode('company_admin');
                const admin = users.find(u => u.role === 'company_owner' || u.role === 'company_hr') || users[1];
                setCurrentUser(admin);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                viewMode === 'company_admin'
                  ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Company Admin' : 'कंपनी एडमिन'}</span>
            </button>

            <button
              onClick={() => {
                setViewMode('employee_pwa');
                const emp = users.find(u => u.role === 'employee') || users[3];
                setCurrentUser(emp);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                viewMode === 'employee_pwa'
                  ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Employee PWA' : 'कर्मचारी ऍप'}</span>
            </button>

            <button
              onClick={() => {
                setViewMode('super_admin');
                const superAdmin = users.find(u => u.role === 'super_admin') || users[0];
                setCurrentUser(superAdmin);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                viewMode === 'super_admin'
                  ? 'bg-white text-purple-700 shadow-xs ring-1 ring-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Savrdh Super-Admin' : 'सर्वर्ध सुपर एडमिन'}</span>
            </button>

            <button
              onClick={() => setViewMode('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                viewMode === 'architecture'
                  ? 'bg-white text-slate-800 shadow-xs ring-1 ring-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'DB & Schema' : 'डेटाबेस स्कीमा'}</span>
            </button>

            <button
              onClick={() => setViewMode('mockups_pdf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                viewMode === 'mockups_pdf'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'en' ? '📄 Export All Mockups PDF' : '📄 सभी मॉकअप PDF'}</span>
            </button>
          </nav>

          {/* Right Action Tools: Language, Offline toggle, User Role Switcher */}
          <div className="flex items-center gap-2.5">
            
            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="Toggle English / Hindi"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold">{language === 'en' ? 'हिन्दी' : 'ENG'}</span>
            </button>

            {/* Simulated Offline Toggle */}
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isOffline 
                  ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold animate-pulse'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Simulate Mobile Network Connectivity"
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5 text-rose-600" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
              <span className="hidden lg:inline">{isOffline ? 'Offline' : 'Online'}</span>
              {offlineQueueCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-1 rounded-full">{offlineQueueCount}</span>
              )}
            </button>

            {/* Active User Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowTenantMenu(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <UserCircle2 className="w-4 h-4 text-emerald-400" />
                <div className="flex flex-col text-left leading-tight hidden sm:flex">
                  <span className="font-semibold text-[11px] max-w-[110px] truncate">{currentUser.fullName}</span>
                  <span className="text-[9px] text-slate-300 capitalize">{currentUser.role.replace('_', ' ')}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-1.5 w-72 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Test User Role
                  </div>
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setShowUserMenu(false);
                        if (u.role === 'employee') setViewMode('employee_pwa');
                        else if (u.role === 'super_admin') setViewMode('super_admin');
                        else setViewMode('company_admin');
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${u.id === currentUser.id ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700'}`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{u.fullName}</span>
                        <span className="text-[10px] text-slate-500">{u.designation || u.department}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                        {u.role}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mandatory Privacy Notice: Permanent Location Tracking Status Banner */}
      <div className={`px-4 py-1 text-xs border-t flex items-center justify-between transition-colors ${
        isTrackingActive 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {isTrackingActive ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
              )}
            </span>
            <span className="font-semibold">
              {isTrackingActive ? '🟢 Duty Location Tracking Active (Consent Verified)' : '⚪ Duty Session Inactive (Location Tracking Stopped)'}
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-500">
              {isTrackingActive 
                ? `Active employee: ${currentDutySession?.employeeName} • Punch-In: ${currentDutySession?.punchInTime}` 
                : 'Zero tracking outside active work hours'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 hidden md:inline">
              ISO 27001 & DPDP 2023 Compliant • Tenant: <strong className="text-slate-700">{currentTenant.name}</strong>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium bg-emerald-100/80 px-2 py-0.5 rounded">
              <Lock className="w-2.5 h-2.5" /> Immutable Audit On
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
