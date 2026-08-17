import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Users, 
  CreditCard, 
  LifeBuoy, 
  HardDrive, 
  Lock, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Clock, 
  Eye, 
  Key, 
  Layers,
  FileText,
  Activity,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Tenant, TenantPlan } from '../../types';
import confetti from 'canvas-confetti';

export const SuperAdminDashboard: React.FC = () => {
  const { 
    tenants, 
    addTenant, 
    updateTenantPlan, 
    updateTenantStatus, 
    invoices, 
    supportTickets, 
    updateTicketStatus, 
    auditLogs, 
    addAuditLog, 
    setCurrentTenant, 
    setViewMode, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'billing' | 'support' | 'security'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Tenant onboarding form
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantCode, setNewTenantCode] = useState('');
  const [newTenantEmail, setNewTenantEmail] = useState('');
  const [newTenantPhone, setNewTenantPhone] = useState('');
  const [newTenantPlan, setNewTenantPlan] = useState<TenantPlan>('Growth');
  const [newTenantMaxEmp, setNewTenantMaxEmp] = useState(100);
  const [newTenantGst, setNewTenantGst] = useState('');
  const [newTenantAddress, setNewTenantAddress] = useState('');

  // Audited Impersonation Modal
  const [impersonateTenantId, setImpersonateTenantId] = useState<string | null>(null);
  const [impersonateReason, setImpersonateReason] = useState('');

  const totalSeats = tenants.reduce((a, b) => a + b.activeEmployees, 0);
  const totalMRR = 845000;
  const totalARR = 10140000;

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName || !newTenantCode) return;
    
    addTenant({
      name: newTenantName,
      code: newTenantCode.toUpperCase(),
      contactEmail: newTenantEmail,
      contactPhone: newTenantPhone,
      plan: newTenantPlan,
      status: 'active',
      maxEmployees: newTenantMaxEmp,
      gstNumber: newTenantGst || '07AABCU1234Z1ZQ',
      billingAddress: newTenantAddress || 'DLF Cyber City, Gurugram',
      retentionDaysGps: 90,
      retentionDaysAudit: 365,
      features: {
        liveTracking: true,
        geofencing: true,
        expenseManagement: true,
        performanceScoring: true,
        payrollExport: true,
        apiAccess: newTenantPlan === 'Enterprise'
      }
    });

    setNewTenantName('');
    setNewTenantCode('');
    setNewTenantEmail('');
    setNewTenantPhone('');
    setShowOnboardModal(false);
    try { confetti({ particleCount: 50 }); } catch (e) {}
  };

  const handleExecuteImpersonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!impersonateReason.trim() || !impersonateTenantId) return;

    const targetTenant = tenants.find(t => t.id === impersonateTenantId);
    if (!targetTenant) return;

    addAuditLog(
      'AUDITED_SUPPORT_IMPERSONATION',
      'Tenant',
      targetTenant.id,
      impersonateReason,
      `Super-Admin granted 30-min audited support session for ${targetTenant.name}`
    );

    setCurrentTenant(targetTenant);
    setImpersonateTenantId(null);
    setImpersonateReason('');
    setViewMode('company_admin');
    showToast(`🔑 Audited Support Access active for: ${targetTenant.name}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Super Admin Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Savrdh Technologies • SaaS Master Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              FieldSure SaaS Governance & Multi-Tenant Control
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl">
              Subscription billing, Indian GST ledger synchronization, tenant seat governance, support escalation, and audited access controls.
            </p>
          </div>

          <button
            onClick={() => setShowOnboardModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Onboard New Tenant Company
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'overview' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> SaaS Overview & MRR
        </button>

        <button
          onClick={() => setActiveTab('tenants')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'tenants' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Tenant Companies ({tenants.length})
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'billing' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" /> Billing & GST Invoices
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'support' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LifeBuoy className="w-3.5 h-3.5" /> Support Tickets ({supportTickets.length})
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'security' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lock className="w-3.5 h-3.5" /> Security & Audited Support Access
        </button>
      </div>

      {/* ===================== TAB 1: OVERVIEW ===================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 4 SaaS Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Recurring Revenue</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">₹{(totalMRR / 100000).toFixed(2)} Lakhs</p>
              <span className="text-xs font-semibold text-emerald-600 flex items-center mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% this quarter
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Annual Run Rate (ARR)</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">₹{(totalARR / 10000000).toFixed(2)} Crore</p>
              <span className="text-xs text-slate-500 mt-1 block">Net of 18% GST</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Active Seats</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">{totalSeats} / 260 Seats</p>
              <span className="text-xs text-emerald-600 font-semibold mt-1 block">73.4% capacity utilization</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform Health</span>
              <p className="text-2xl font-extrabold text-emerald-700 mt-2">99.98% Uptime</p>
              <span className="text-xs text-slate-500 mt-1 block">Cloud Run Asia-South1</span>
            </div>
          </div>

          {/* Tenant distribution breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">Tenant Subscription Breakdown</h2>
              
              <div className="space-y-3">
                {tenants.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{t.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-purple-100 text-purple-800">
                          {t.plan}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">[{t.code}]</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{t.billingAddress}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800">{t.activeEmployees} / {t.maxEmployees} Seats</span>
                      <div className="w-28 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-purple-600 h-full rounded-full" style={{ width: `${(t.activeEmployees / t.maxEmployees) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick platform actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">Platform Storage & Telemetry</h2>
              
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-slate-700 font-semibold">
                    <span>Firestore Document Storage</span>
                    <span>1.2 GB / 50 GB</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[12%]"></div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-slate-700 font-semibold">
                    <span>Cloud Storage (Receipts & Proofs)</span>
                    <span>18.4 GB / 250 GB</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-[24%]"></div>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-purple-900 space-y-1">
                  <span className="font-bold block">Payment Webhook Verification</span>
                  <p className="text-[11px] text-purple-700">Razorpay & Cashfree signature listeners active and synchronized.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: TENANTS ===================== */}
      {activeTab === 'tenants' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Registered Tenant Companies</h2>
              <p className="text-xs text-slate-500">Manage subscription quotas, status, and tenant configuration</p>
            </div>

            <button
              onClick={() => setShowOnboardModal(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Onboard Tenant
            </button>
          </div>

          <div className="space-y-3">
            {tenants.map((t) => (
              <div key={t.id} className="p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{t.name}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      CODE: {t.code}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      t.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Contact: {t.contactEmail} • {t.contactPhone} • GST: {t.gstNumber}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900">{t.plan} Plan</span>
                    <span className="text-[11px] text-slate-500 block">{t.activeEmployees} / {t.maxEmployees} Seats</span>
                  </div>

                  {/* Audited Impersonation Button */}
                  <button
                    onClick={() => setImpersonateTenantId(t.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-400" /> Audited Login
                  </button>

                  <select
                    value={t.plan}
                    onChange={(e) => updateTenantPlan(t.id, e.target.value as any, e.target.value === 'Enterprise' ? 200 : e.target.value === 'Growth' ? 100 : 50)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800"
                  >
                    <option value="Starter">Starter (50)</option>
                    <option value="Growth">Growth (100)</option>
                    <option value="Enterprise">Enterprise (200)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: BILLING & GST INVOICES ===================== */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">SaaS Billing & Indian GST Invoices</h2>
              <p className="text-xs text-slate-500">18% GST compliant B2B tax invoices with Razorpay / Cashfree integration</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              HSN/SAC: 998313 (IT Software SaaS)
            </span>
          </div>

          <div className="space-y-3">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 font-mono">{inv.invoiceNumber}</span>
                    <span className="text-xs font-semibold text-slate-700">• {inv.tenantName}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{inv.billingMonth} • {inv.seats} Seats ({inv.plan} Tier)</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900">₹{inv.totalAmount.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-400 block">Base: ₹{inv.baseAmount} + 18% GST (₹{inv.gstAmount})</span>
                  </div>

                  <button
                    onClick={() => showToast(`Downloading Tax Invoice ${inv.invoiceNumber} (PDF)...`)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 4: SUPPORT TICKETS ===================== */}
      {activeTab === 'support' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Customer Support & Grievance Desk</h2>
              <p className="text-xs text-slate-500">Tenant escalations, permissions assistance, and billing inquiries</p>
            </div>
          </div>

          <div className="space-y-3">
            {supportTickets.map((tkt) => (
              <div key={tkt.id} className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-purple-700">{tkt.ticketNumber}</span>
                      <span className="text-xs font-bold text-slate-900">{tkt.subject}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{tkt.description}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    tkt.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {tkt.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>Tenant: <strong>{tkt.tenantName}</strong> • Reporter: {tkt.reportedBy}</span>
                  <div className="flex items-center gap-2">
                    {tkt.status !== 'resolved' && (
                      <button
                        onClick={() => updateTicketStatus(tkt.id, 'resolved')}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                      >
                        Mark Resolved ✓
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 5: SECURITY & AUDITED ACCESS ===================== */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Lock className="w-5 h-5 text-purple-700" />
              <span>Audited Support Access & Zero-Casual-Peeking Policy</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Super-Admins do not possess casual access to tenant employee sensitive data. All cross-tenant support sessions require an explicit ticket reference, a mandatory stated business reason, are time-limited to 30 minutes, and write an immutable cryptographic log entry.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Platform Security & Audit Trail</h3>
            
            <div className="space-y-2.5">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <p className="text-slate-600 text-[11px]">{log.details}</p>
                    <span className="text-[10px] text-slate-400">{log.timestamp} • By {log.actorName} ({log.ipAddress})</span>
                  </div>
                  {log.reason && (
                    <span className="text-[10px] bg-purple-50 text-purple-800 font-semibold px-2 py-1 rounded border border-purple-100">
                      Reason: {log.reason}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tenant Onboarding Modal */}
      {showOnboardModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleOnboardSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Onboard New Tenant Enterprise</h3>
              <button type="button" onClick={() => setShowOnboardModal(false)} className="text-slate-400 text-xs">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Haryana Cold Agro Ltd"
                    value={newTenantName}
                    onChange={(e) => setNewTenantName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Company Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HCAL"
                    value={newTenantCode}
                    onChange={(e) => setNewTenantCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@hcal.com"
                    value={newTenantEmail}
                    onChange={(e) => setNewTenantEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98110 99887"
                    value={newTenantPhone}
                    onChange={(e) => setNewTenantPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Subscription Plan</label>
                  <select
                    value={newTenantPlan}
                    onChange={(e) => setNewTenantPlan(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  >
                    <option value="Starter">Starter (Up to 50 employees)</option>
                    <option value="Growth">Growth (Up to 150 employees)</option>
                    <option value="Enterprise">Enterprise (Custom limits)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Employee Seats Quota</label>
                  <input
                    type="number"
                    value={newTenantMaxEmp}
                    onChange={(e) => setNewTenantMaxEmp(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">GSTIN Number (15-digit)</label>
                <input
                  type="text"
                  placeholder="06AABCH9912K1Z9"
                  value={newTenantGst}
                  onChange={(e) => setNewTenantGst(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 uppercase font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowOnboardModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
              >
                Complete Onboarding
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Audited Impersonation Modal */}
      {impersonateTenantId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleExecuteImpersonation} className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Key className="w-5 h-5 text-amber-500" />
              <span>Audited Tenant Support Session</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold block">Mandatory Security Protocol:</span>
              <p>You are about to access tenant operational data. You must provide a valid support ticket ID and customer-requested troubleshooting purpose.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Troubleshooting Purpose / Ticket #</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Investigating Support Ticket #SUP-8819 GSTIN ledger sync issue requested by HR Head Ananya..."
                  value={impersonateReason}
                  onChange={(e) => setImpersonateReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setImpersonateTenantId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                Grant & Log Session (30m)
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
