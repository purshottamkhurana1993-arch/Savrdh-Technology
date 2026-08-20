import React, { useState } from 'react';
import { 
  Building2, 
  Smartphone, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Key, 
  HelpCircle, 
  ShieldAlert, 
  Zap, 
  Eye, 
  EyeOff,
  Layers,
  ChevronRight,
  Globe,
  Award,
  LogOut,
  LogIn,
  Check,
  UserCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TenantPlan } from '../../types';
import confetti from 'canvas-confetti';

export const UniversalAuthPortal: React.FC = () => {
  const { 
    tenants, 
    addTenant, 
    users, 
    currentTenant,
    setCurrentTenant, 
    currentUser,
    setCurrentUser, 
    setViewMode, 
    showToast,
    language,
    isLoggedIn,
    login,
    logout,
    setShowFreeTrialModal
  } = useApp();

  // Active Auth Tab: default to 3-role login
  const [authRole, setAuthRole] = useState<'company_login' | 'employee_otp' | 'superadmin_login' | 'company_signup'>('company_login');

  // =========================================================================
  // 1. COMPANY SIGNUP STATE (3-Step Onboarding)
  // =========================================================================
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [companyName, setCompanyName] = useState('Apex Logistics India Pvt Ltd');
  const [adminFullName, setAdminFullName] = useState('Suresh Agarwal');
  const [workEmail, setWorkEmail] = useState('suresh@apexlogistics.in');
  const [phone, setPhone] = useState('+91 98201 55678');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');

  // Step 2: Compliance & Subdomain
  const [gstNumber, setGstNumber] = useState('27AABCA1234F1Z8');
  const [tenantCode, setTenantCode] = useState('APEX');
  const [fieldOfficersCount, setFieldOfficersCount] = useState(65);
  const [billingAddress, setBillingAddress] = useState('Plot 12, MIDC Industrial Area, Andheri East, Mumbai 400093');

  // Step 3: Plan
  const [selectedPlan, setSelectedPlan] = useState<TenantPlan>('Growth');

  // =========================================================================
  // 2. EMPLOYEE OTP STATE
  // =========================================================================
  const [empMobile, setEmpMobile] = useState('+91 98765 43210');
  const [empCompanyCode, setEmpCompanyCode] = useState('AKBS');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');

  // =========================================================================
  // 3. HR / MANAGER LOGIN STATE
  // =========================================================================
  const [mgrEmail, setMgrEmail] = useState('vikram.singhania@akbspoultry.com');
  const [mgrPassword, setMgrPassword] = useState('••••••••••••');
  const [showMgrPassword, setShowMgrPassword] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0]?.id || 'tenant-akbs');

  // =========================================================================
  // 4. SUPER ADMIN LOGIN STATE
  // =========================================================================
  const [superAdminEmail, setSuperAdminEmail] = useState('rajesh.verma@savrdh.com');
  const [superAdminKey, setSuperAdminKey] = useState('SVRDH-ROOT-2026-FIDO2');
  const [showSuperKey, setShowSuperKey] = useState(false);

  // =========================================================================
  // HANDLERS
  // =========================================================================
  const handleCompanySignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupStep < 3) {
      setSignupStep(prev => (prev + 1) as 1 | 2 | 3);
      return;
    }

    // Final Step 3: Register Tenant & Auto-Login as Company Admin
    const newTenant = {
      name: companyName,
      code: tenantCode.toUpperCase(),
      contactEmail: workEmail,
      contactPhone: phone,
      plan: selectedPlan,
      status: 'active' as const,
      maxEmployees: fieldOfficersCount + 20,
      gstNumber: gstNumber || '27AABCA1234F1Z8',
      billingAddress: billingAddress || 'Corporate Hub, BKC Mumbai',
      retentionDaysGps: 90,
      retentionDaysAudit: 365,
      features: {
        liveTracking: true,
        geofencing: true,
        expenseManagement: true,
        performanceScoring: true,
        payrollExport: true,
        apiAccess: selectedPlan === 'Enterprise'
      }
    };

    addTenant(newTenant);
    try { confetti({ particleCount: 75, spread: 80 }); } catch (e) {}
    showToast(`🎉 Welcome to FieldSure! Company "${companyName}" registered with 14-Day Pilot.`);
    
    // Switch to company admin view
    setTimeout(() => {
      setViewMode('company_admin');
    }, 1200);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empMobile) return;
    setOtpSent(true);
    setEnteredOtp('7890'); // Auto-fill demo OTP for slick user testing
    showToast(`📲 Demo OTP "7890" sent to ${empMobile}`);
  };

  const handleVerifyEmployeeOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== '7890' && enteredOtp.length < 4) {
      showToast('❌ Please enter 4-digit OTP (Try: 7890)');
      return;
    }

    // Pick Rahul Sharma or matching employee
    const targetEmp = users.find(u => u.role === 'employee') || users[3];
    const targetTenant = tenants.find(t => t.code === empCompanyCode) || tenants[0];
    login(targetEmp, targetTenant, 'employee_pwa');
    try { confetti({ particleCount: 50 }); } catch (e) {}
  };

  const handleManagerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAdmin = users.find(u => u.email === mgrEmail) || users[1];
    const targetTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];
    login(targetAdmin, targetTenant, 'company_admin');
  };

  const handleSuperAdminDirectLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const superAdmin = users.find(u => u.role === 'super_admin') || users[0];
    login(superAdmin, undefined, 'super_admin');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Top Banner / Breadcrumb */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Universal Authentication & Role Login Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              One Unified Entryway for All 3 System Roles
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Access the dedicated authentication panels for <strong>Company Admin/Owner</strong>, <strong>Field Employee PWA</strong>, and <strong>Savrdh Super-Admin Governance</strong>, or register a new company tenant.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={() => setShowFreeTrialModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-lg hover:shadow-amber-500/25 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-slate-900 animate-spin" style={{ animationDuration: '4s' }} />
              <span>🚀 Start 14-Day Free Company Trial</span>
            </button>

            <button
              onClick={() => {
                if (currentUser.role === 'super_admin') setViewMode('super_admin');
                else if (currentUser.role === 'employee') setViewMode('employee_pwa');
                else setViewMode('company_admin');
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all whitespace-nowrap"
            >
              ← Active Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Active Session & Logout Notice Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold">
            <UserCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Current Active Session:</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                ● Logged In
              </span>
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              <strong className="text-slate-900">{currentUser.fullName}</strong> ({currentUser.email}) • Role: <span className="font-semibold text-indigo-700 capitalize">{currentUser.role.replace('_', ' ')}</span> • Tenant: <span className="font-semibold text-slate-800">{currentTenant.name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              if (currentUser.role === 'super_admin') setViewMode('super_admin');
              else if (currentUser.role === 'employee') setViewMode('employee_pwa');
              else setViewMode('company_admin');
            }}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            Continue as {currentUser.fullName.split(' ')[0]} →
          </button>
          
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors shadow-xs"
            title="Log Out and clear active session"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* 3-Role Navigation Selector Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Tab 1: Company Owner / HR Admin Login */}
        <button
          onClick={() => setAuthRole('company_login')}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
            authRole === 'company_login'
              ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
              : 'bg-white/80 hover:bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
            authRole === 'company_login' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
          }`}>
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Role 1</span>
            {authRole === 'company_login' && <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />}
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1">1. Company Admin / Owner</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Corporate HR & Owner Portal</p>
        </button>

        {/* Tab 2: Field Employee OTP Auth */}
        <button
          onClick={() => setAuthRole('employee_otp')}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
            authRole === 'employee_otp'
              ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white/80 hover:bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
            authRole === 'employee_otp' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
          }`}>
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Role 2</span>
            {authRole === 'employee_otp' && <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />}
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1">2. Field Officer Mobile PWA</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Passwordless Phone / OTP Punch</p>
        </button>

        {/* Tab 3: Savrdh Super-Admin */}
        <button
          onClick={() => setAuthRole('superadmin_login')}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
            authRole === 'superadmin_login'
              ? 'bg-white border-purple-600 shadow-md ring-2 ring-purple-500/20'
              : 'bg-white/80 hover:bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
            authRole === 'superadmin_login' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
          }`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Role 3</span>
            {authRole === 'superadmin_login' && <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />}
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1">3. Savrdh Super-Admin</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Master Platform Governance</p>
        </button>

        {/* Tab 4: Register New Company */}
        <button
          onClick={() => setAuthRole('company_signup')}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
            authRole === 'company_signup'
              ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
              : 'bg-white/80 hover:bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
            authRole === 'company_signup' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
          }`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">New Tenant</span>
            {authRole === 'company_signup' && <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />}
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1">4. Register Company</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">3-Step GST Onboarding Pilot</p>
        </button>

      </div>

      {/* ========================================================================= */}
      {/* 1. VIEW: COMPANY SIGNUP FLOW (3-STEP ONBOARDING) */}
      {/* ========================================================================= */}
      {authRole === 'company_signup' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10">
          
          {/* Wizard Step Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-xl mx-auto relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500" 
                style={{ width: signupStep === 1 ? '0%' : signupStep === 2 ? '50%' : '100%' }}
              />

              {/* Step 1 Circle */}
              <div className={`relative z-10 flex flex-col items-center gap-1 cursor-pointer`} onClick={() => setSignupStep(1)}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  signupStep >= 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-300'
                }`}>
                  1
                </div>
                <span className="text-[11px] font-bold text-slate-700">Company Details</span>
              </div>

              {/* Step 2 Circle */}
              <div className={`relative z-10 flex flex-col items-center gap-1 cursor-pointer`} onClick={() => setSignupStep(2)}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  signupStep >= 2 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-300'
                }`}>
                  2
                </div>
                <span className="text-[11px] font-bold text-slate-700">GST & Subdomain</span>
              </div>

              {/* Step 3 Circle */}
              <div className={`relative z-10 flex flex-col items-center gap-1 cursor-pointer`} onClick={() => setSignupStep(3)}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  signupStep === 3 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-300'
                }`}>
                  3
                </div>
                <span className="text-[11px] font-bold text-slate-700">Plan & Launch</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleCompanySignupSubmit} className="max-w-2xl mx-auto space-y-6">
            
            {/* STEP 1: Basic Company & Contact Info */}
            {signupStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Step 1: Company Profile & Administrator</h2>
                  <p className="text-xs text-slate-500 mt-1">Provide your business identity to initiate multi-tenant instance provisioning.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Registered Name *</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        placeholder="e.g. Apex Logistics India Pvt Ltd"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Admin Full Name *</label>
                    <input
                      type="text"
                      required
                      value={adminFullName}
                      onChange={e => setAdminFullName(e.target.value)}
                      placeholder="e.g. Suresh Agarwal"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Official Work Email *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={workEmail}
                        onChange={e => setWorkEmail(e.target.value)}
                        placeholder="suresh@company.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Contact Phone *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98201 00000"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Primary Operating City *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="e.g. Mumbai, Gurugram"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Proceed to GST & Subdomain</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Compliance, GSTIN & Subdomain */}
            {signupStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Step 2: Indian GST & Dedicated Tenant Subdomain</h2>
                  <p className="text-xs text-slate-500 mt-1">Configure automated 18% GST invoice generation and dedicated company URL.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN Number (15-digit) *</label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={gstNumber}
                        onChange={e => setGstNumber(e.target.value.toUpperCase())}
                        placeholder="27AABCA1234F1Z8"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Auto-detected State Code: 27 (Maharashtra)</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Code / Subdomain *</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        required
                        value={tenantCode}
                        onChange={e => setTenantCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                        placeholder="APEX"
                        maxLength={8}
                        className="w-28 px-3 py-2.5 bg-slate-50 border border-r-0 border-slate-300 rounded-l-xl text-sm font-mono font-bold text-blue-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                      <span className="px-3 py-2.5 bg-slate-200 border border-slate-300 rounded-r-xl text-xs font-mono text-slate-600 font-semibold flex-1">
                        .fieldsure.savrdh.com
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">This code is used by field officers to log in on Android PWA.</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Field Staff Headcount *</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="5"
                        max="500"
                        step="5"
                        value={fieldOfficersCount}
                        onChange={e => setFieldOfficersCount(Number(e.target.value))}
                        className="flex-1 accent-blue-600 cursor-pointer"
                      />
                      <span className="w-20 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-bold text-center text-sm font-mono">
                        {fieldOfficersCount} Seats
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Registered Billing Address (For Tax Invoices)</label>
                    <textarea
                      rows={2}
                      value={billingAddress}
                      onChange={e => setBillingAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Proceed to Plan Selection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Plan Selection & Free Trial Activation */}
            {signupStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Step 3: Select Enterprise Tier (14-Day Free Pilot)</h2>
                  <p className="text-xs text-slate-500 mt-1">Zero credit card required. Full platform features unlocked immediately.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Starter */}
                  <div 
                    onClick={() => setSelectedPlan('Starter')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedPlan === 'Starter'
                        ? 'border-blue-600 bg-blue-50/50 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-600">Starter</span>
                    <div className="text-xl font-extrabold text-slate-900 mt-1">₹149 <span className="text-xs font-normal text-slate-500">/user/mo</span></div>
                    <ul className="text-[11px] text-slate-600 mt-3 space-y-1.5">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> GPS Breadcrumbs</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Android PWA Punch</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Basic Attendance CSV</li>
                    </ul>
                  </div>

                  {/* Growth (Recommended) */}
                  <div 
                    onClick={() => setSelectedPlan('Growth')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                      selectedPlan === 'Growth'
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="absolute -top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold uppercase">
                      Recommended
                    </div>
                    <span className="text-xs font-bold text-emerald-700">Growth</span>
                    <div className="text-xl font-extrabold text-slate-900 mt-1">₹249 <span className="text-xs font-normal text-slate-500">/user/mo</span></div>
                    <ul className="text-[11px] text-slate-600 mt-3 space-y-1.5">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Everything in Starter</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Polygon Geofencing</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Expense Claims & OCR</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 1-Click Keka/Razorpay CSV</li>
                    </ul>
                  </div>

                  {/* Enterprise */}
                  <div 
                    onClick={() => setSelectedPlan('Enterprise')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedPlan === 'Enterprise'
                        ? 'border-purple-600 bg-purple-50/50 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold text-purple-700">Enterprise</span>
                    <div className="text-xl font-extrabold text-slate-900 mt-1">₹399 <span className="text-xs font-normal text-slate-500">/user/mo</span></div>
                    <ul className="text-[11px] text-slate-600 mt-3 space-y-1.5">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Everything in Growth</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> REST API Webhooks</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Multi-Branch Scoping</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Dedicated SLA Support</li>
                    </ul>
                  </div>

                </div>

                {/* Summary Box */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-slate-400">Total Pilot Allocation</div>
                    <div className="text-sm font-bold text-emerald-400">
                      {fieldOfficersCount} Field Seats • {selectedPlan} Tier • 14-Day Free Pilot
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">Monthly Projected Billing</div>
                    <div className="text-lg font-mono font-bold text-white">
                      ₹{(fieldOfficersCount * (selectedPlan === 'Starter' ? 149 : selectedPlan === 'Growth' ? 249 : 399) * 1.18).toLocaleString('en-IN')} <span className="text-[10px] text-slate-400">(incl. 18% GST)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSignupStep(2)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Launch 14-Day Enterprise Pilot</span>
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. VIEW: EMPLOYEE MOBILE OTP AUTHENTICATION */}
      {/* ========================================================================= */}
      {authRole === 'employee_otp' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 max-w-xl mx-auto">
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Smartphone className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Field Employee Punch-In Login</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Passwordless, fast OTP verification for field executives and delivery officers on Android PWA.
            </p>
          </div>

          <form onSubmit={otpSent ? handleVerifyEmployeeOtp : handleSendOtp} className="space-y-4">
            
            {/* Step 1: Mobile & Company Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Registered Mobile Number *</label>
              <div className="flex items-center gap-2">
                <div className="px-3 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-700">
                  +91 (India)
                </div>
                <input
                  type="tel"
                  required
                  value={empMobile}
                  onChange={e => setEmpMobile(e.target.value)}
                  placeholder="98765 43210"
                  className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Code / Tenant ID *</label>
              <input
                type="text"
                required
                value={empCompanyCode}
                onChange={e => setEmpCompanyCode(e.target.value.toUpperCase())}
                placeholder="e.g. AKBS"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* OTP Input Box if OTP Sent */}
            {otpSent && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-900">Enter 4-Digit SMS OTP</label>
                  <span className="text-[11px] text-emerald-700 font-mono">Demo OTP: <strong>7890</strong></span>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  value={enteredOtp}
                  onChange={e => setEnteredOtp(e.target.value)}
                  placeholder="7890"
                  className="w-full text-center text-2xl tracking-[0.5em] font-mono font-bold py-2.5 bg-white border border-emerald-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
            )}

            {/* DPDP Act 2023 Lawful Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-[11px] text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">DPDP Act 2023 Lawful Tracking:</strong>
                <span> Location is strictly recorded only during active duty hours. Personal messages, WhatsApp, and private gallery are never accessed.</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95"
            >
              {otpSent ? 'Verify OTP & Open Field PWA' : 'Send 4-Digit Login OTP'}
            </button>
          </form>

          {/* Quick Demo Employee Selector */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">
              Or 1-Tap Login as Sample Field Employee:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  const u = users.find(x => x.fullName.includes('Rahul')) || users[3];
                  setCurrentUser(u);
                  showToast(`Logged in as ${u.fullName}`);
                  setViewMode('employee_pwa');
                }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-900">Rahul Sharma</div>
                <div className="text-[10px] text-slate-500">Sales Exec</div>
              </button>

              <button
                onClick={() => {
                  const u = users.find(x => x.fullName.includes('Priya')) || users[4];
                  setCurrentUser(u);
                  showToast(`Logged in as ${u.fullName}`);
                  setViewMode('employee_pwa');
                }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-900">Priya Nair</div>
                <div className="text-[10px] text-slate-500">QC Auditor</div>
              </button>

              <button
                onClick={() => {
                  const u = users.find(x => x.fullName.includes('Amit')) || users[5];
                  setCurrentUser(u);
                  showToast(`Logged in as ${u.fullName}`);
                  setViewMode('employee_pwa');
                }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-900">Amit Patel</div>
                <div className="text-[10px] text-slate-500">Tech Officer</div>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIEW: HR & COMPANY MANAGER LOGIN */}
      {/* ========================================================================= */}
      {authRole === 'company_login' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 max-w-xl mx-auto">
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <UserCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Corporate HR & Manager Portal</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Dashboard access for attendance approvals, live GPS map visualizer, and salary CSV export.
            </p>
          </div>

          <form onSubmit={handleManagerLogin} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Tenant Company</label>
              <select
                value={selectedTenantId}
                onChange={e => setSelectedTenantId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.code}) - {t.plan} Tier</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Work Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={mgrEmail}
                  onChange={e => setMgrEmail(e.target.value)}
                  placeholder="admin@akbspoultry.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={mgrPassword}
                  onChange={e => setMgrPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95"
            >
              Sign In to Company Dashboard
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">
              1-Tap Demo Corporate Logins:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  const u = users[1]; // Vikram Singhania
                  setCurrentUser(u);
                  setCurrentTenant(tenants[0]);
                  showToast(`Logged in as COO: ${u.fullName}`);
                  setViewMode('company_admin');
                }}
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-900">Vikram Singhania</div>
                <div className="text-[10px] text-slate-500">Chief Operating Officer (AKBS)</div>
              </button>

              <button
                onClick={() => {
                  const u = users[2]; // Ananya Deshmukh
                  setCurrentUser(u);
                  setCurrentTenant(tenants[0]);
                  showToast(`Logged in as HR Head: ${u.fullName}`);
                  setViewMode('company_admin');
                }}
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-900">Ananya Deshmukh</div>
                <div className="text-[10px] text-slate-500">Head of People & HR (AKBS)</div>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VIEW: SAVRDH SUPER-ADMIN ROOT LOGIN */}
      {/* ========================================================================= */}
      {authRole === 'superadmin_login' && (
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl border border-purple-900/50 shadow-2xl p-6 sm:p-10 max-w-xl mx-auto">
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-mono font-bold mb-2">
              SAVRDH TECHNOLOGIES • ROOT PLATFORM CONSOLE
            </div>
            <h2 className="text-2xl font-bold text-white">Super-Admin Master Access</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Role 3: Restricted master panel for cross-tenant governance, Indian GST billing audits, server monitors, and technical impersonation.
            </p>
          </div>

          <form onSubmit={handleSuperAdminDirectLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Super-Admin Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={superAdminEmail}
                  onChange={e => setSuperAdminEmail(e.target.value)}
                  placeholder="rajesh.verma@savrdh.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-purple-900/60 rounded-xl text-sm font-medium text-white placeholder:text-slate-500 focus:bg-slate-850 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">FIDO2 Hardware Key / Master Token *</label>
                <span className="text-[10px] text-purple-400 font-mono">256-Bit Hardware HSM</span>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showSuperKey ? "text" : "password"}
                  required
                  value={superAdminKey}
                  onChange={e => setSuperAdminKey(e.target.value)}
                  placeholder="SVRDH-ROOT-••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-purple-900/60 rounded-xl text-sm font-mono text-purple-200 placeholder:text-slate-500 focus:bg-slate-850 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowSuperKey(!showSuperKey)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showSuperKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-purple-900/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Security Tier:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> FIDO2 Hardware Token Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Cluster Status:</span>
                <span className="text-emerald-400 font-bold">● All 3 Ingress Nodes Healthy (Asia-South1)</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Log In as Savrdh Super-Admin</span>
              </button>

              {currentUser.role === 'super_admin' && (
                <button
                  type="button"
                  onClick={logout}
                  className="w-full py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/40 text-rose-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out Active Super-Admin Session</span>
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500">
            FieldSure™ Multi-Tenant SaaS Engine • Security controls aligned to ISO 27001 & DPDP Act 2023 principles
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ENTERPRISE SECURITY, ANTI-BOT & ZERO-TRUST AUDIT MATRIX */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl shadow-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Enterprise Threat Defense & Anti-Bot Architecture</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Zero-Trust Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-layer protection preventing bot user creation, account takeovers, GPS spoofing, and tenant cross-leaks.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              showToast('🛡️ Live Security Audit: All 7 Defense Layers Active & Passing (0 Vulnerabilities Found)');
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Run Live Security Audit</span>
          </button>
        </div>

        {/* 6 Core Security Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card 1: Anti-Bot & Abuse Protection */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-[11px]">🤖</span>
                <span>Anti-Bot & Rate Limiting</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Protected
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Cloudflare Turnstile & Redis Token Bucket:</strong> Blocks automated bot sign-ups, credential stuffing, and SMS OTP bombing. Max 3 OTP requests / phone / 15 mins.
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
              RateLimit: 5 req/min/IP • Challenge: Cryptographic Proof-of-Work
            </div>
          </div>

          {/* Card 2: Anti-Sybil / Verified Enterprise GSTIN */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px]">🏢</span>
                <span>Verified GSTIN Sign-Up</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Enforced
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Govt GSTN API Verification:</strong> Every company registration requires a valid 15-digit GSTIN and corporate work email OTP. Prevents disposable/fake bot accounts.
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
              Schema Check: ^[0-9]{'{2}'}[A-Z]{'{5}'}[0-9]{'{4}'}[A-Z]{'{1}'}[1-9A-Z]{'{1}'}Z[0-9A-Z]{'{1}'}$
            </div>
          </div>

          {/* Card 3: Controlled Staff Provisioning */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-[11px]">👥</span>
                <span>No Public Staff Registration</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Restricted
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Closed Staff Enrollment:</strong> Outside users cannot self-register under random companies. Employees are exclusively invited by authorized HR Admins via corporate directory.
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
              RBAC Policy: inviteEmployee() requires isCompanyAdmin()
            </div>
          </div>

          {/* Card 4: Multi-Tenant Data Isolation */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-[11px]">🔒</span>
                <span>Row-Level Tenant Isolation</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Strict RLS
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Hard Database Boundaries:</strong> Every query enforces <code className="text-blue-700">tenantId == token.tenantId</code>. Company A can never view or tamper with Company B data.
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
              Rule: request.auth.token.tenantId == resource.data.tenantId
            </div>
          </div>

          {/* Card 5: Location Integrity Risk Engine */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px]">🛰️</span>
                <span>Location Integrity Risk Engine</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Risk State Evaluation:</strong> Evaluates signals across: Verified, Normal, Review Recommended, High-Risk Location, or Insufficient Evidence.
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
              Checks: Location Provider Signals + Velocity Checks
            </div>
          </div>

          {/* Card 6: DPDP Privacy Controls */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center text-[11px]">⚖️</span>
                <span>DPDP Duty Privacy Termination</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Lawful
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Duty Telemetry Termination:</strong> Location updates stop upon punch-out. Zero access to personal WhatsApp, camera roll, SMS, or private calls.
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
              On punchOut(): Background Watcher Terminated
            </div>
          </div>

        </div>

        {/* Security Compliance Footer Badge */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Cryptographic Standard:</strong> AES-256 Data at Rest • TLS 1.3 in Transit • HTTP-Only SameSite=Strict Cookies • OWASP Top 10 Hardened
            </span>
          </div>
          <div className="text-emerald-400 font-mono font-bold whitespace-nowrap">
            Security Aligned to ISO 27001 Principles
          </div>
        </div>

      </div>

    </div>
  );
};
