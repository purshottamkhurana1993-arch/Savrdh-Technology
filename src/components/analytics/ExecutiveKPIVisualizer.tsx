import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Smartphone, 
  Building2, 
  AlertCircle,
  FileSpreadsheet,
  Layers,
  Activity,
  ArrowUpRight,
  BatteryCharging,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExecutiveKPIVisualizer: React.FC = () => {
  const { 
    currentTenant, 
    attendanceRecords, 
    tasks, 
    fieldVisits, 
    expenses, 
    performanceScores, 
    invoices, 
    setViewMode,
    setCurrentUser,
    users,
    language 
  } = useApp();

  const [selectedTimeRange, setSelectedTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Computed metrics
  const totalEmployees = 118;
  const presentCount = attendanceRecords.filter(a => a.status === 'present' || a.status === 'on_field').length + 86;
  const onFieldCount = attendanceRecords.filter(a => a.status === 'on_field').length + 48;
  const lateCount = attendanceRecords.filter(a => a.status === 'late').length + 6;
  const onLeaveCount = attendanceRecords.filter(a => a.status === 'on_leave').length + 4;
  const attendanceRate = ((presentCount / totalEmployees) * 100).toFixed(1);

  const completedTasks = tasks.filter(t => t.status === 'completed').length + 38;
  const totalTasks = tasks.length + 42;
  const taskCompletionRate = Math.round((completedTasks / totalTasks) * 100);

  const completedVisits = fieldVisits.filter(v => v.status === 'completed').length + 62;
  const totalVisits = fieldVisits.length + 68;
  const visitCompletionRate = Math.round((completedVisits / totalVisits) * 100);

  const totalExpenseClaimed = expenses.reduce((acc, curr) => acc + curr.amount, 0) + 48200;
  const mrrAmount = 845000;
  const arrAmount = 10140000;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Platform Insights & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle background tech grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Real-Time SaaS Workforce Analytics Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              FieldSure Operational & Financial Telemetry
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Monitoring active field workforce, duty sessions, verified visit proofs, explainable performance algorithms, and tenant SaaS MRR across all enterprise operations.
            </p>
          </div>

          {/* Quick System Mockup Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setViewMode('employee_pwa');
                const emp = users.find(u => u.role === 'employee') || users[3];
                setCurrentUser(emp);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all hover:scale-[1.02]"
            >
              <Smartphone className="w-4 h-4" />
              <span>Launch Employee PWA</span>
            </button>

            <button
              onClick={() => {
                setViewMode('company_admin');
                const admin = users.find(u => u.role === 'company_owner') || users[1];
                setCurrentUser(admin);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all hover:scale-[1.02]"
            >
              <Building2 className="w-4 h-4" />
              <span>Open Company Admin</span>
            </button>

            <button
              onClick={() => {
                setViewMode('super_admin');
                const superAdmin = users.find(u => u.role === 'super_admin') || users[0];
                setCurrentUser(superAdmin);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all hover:scale-[1.02]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Savrdh Super Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: High-Level KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance KPI */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance Rate</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{attendanceRate}%</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +2.4% vs last wk
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <strong>{presentCount}</strong> present of {totalEmployees} active seats
            </p>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${attendanceRate}%` }}></div>
          </div>
        </div>

        {/* Live On-Field Officers */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Currently On Field</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{onFieldCount}</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 animate-pulse">
                LIVE GPS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Avg GPS ping latency: <strong>2.8s</strong> (4.2m precision)
            </p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(onFieldCount / presentCount) * 100}%` }}></div>
          </div>
        </div>

        {/* Field Tasks & Visits SLA */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Field Visit SLA</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{visitCompletionRate}%</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> 98.2% on-time
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <strong>{completedVisits}</strong> checked-in & verified proofs
            </p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${visitCompletionRate}%` }}></div>
          </div>
        </div>

        {/* SaaS Platform MRR */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Savrdh SaaS MRR</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">₹{(mrrAmount / 100000).toFixed(2)} L</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18% MoM
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              ARR Run Rate: <strong>₹{(arrAmount / 10000000).toFixed(2)} Cr</strong> (18% GST compliant)
            </p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '82%' }}></div>
          </div>
        </div>
      </div>

      {/* Row 2: Operational Charts & Visual Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-Time Attendance Breakdown & Shift Adherence (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Today's Workforce Attendance & Field Distribution</h2>
              <p className="text-xs text-slate-500">Live operational status across all departments for {currentTenant.name}</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
              <button 
                onClick={() => setSelectedTimeRange('today')}
                className={`px-2.5 py-1 rounded-md transition-colors ${selectedTimeRange === 'today' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'}`}
              >
                Today
              </button>
              <button 
                onClick={() => setSelectedTimeRange('week')}
                className={`px-2.5 py-1 rounded-md transition-colors ${selectedTimeRange === 'week' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'}`}
              >
                This Week
              </button>
              <button 
                onClick={() => setSelectedTimeRange('month')}
                className={`px-2.5 py-1 rounded-md transition-colors ${selectedTimeRange === 'month' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'}`}
              >
                Month (Payroll)
              </button>
            </div>
          </div>

          {/* Status Metric Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase">Present & On Field</span>
              <p className="text-2xl font-extrabold text-emerald-950 mt-1">{presentCount}</p>
              <span className="text-[11px] text-emerald-700 font-medium">83.9% active duty</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60">
              <span className="text-[11px] font-semibold text-amber-800 uppercase">Late Punch-In</span>
              <p className="text-2xl font-extrabold text-amber-950 mt-1">{lateCount}</p>
              <span className="text-[11px] text-amber-700 font-medium">Grace &gt;10m</span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/60">
              <span className="text-[11px] font-semibold text-blue-800 uppercase">Approved Leave</span>
              <p className="text-2xl font-extrabold text-blue-950 mt-1">{onLeaveCount}</p>
              <span className="text-[11px] text-blue-700 font-medium">Casual / Medical</span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/60">
              <span className="text-[11px] font-semibold text-rose-800 uppercase">Unexcused Absent</span>
              <p className="text-2xl font-extrabold text-rose-950 mt-1">{totalEmployees - presentCount - onLeaveCount}</p>
              <span className="text-[11px] text-rose-700 font-medium">No punch-in recorded</span>
            </div>
          </div>

          {/* Department Breakdown Visual Bar Chart */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Department Attendance & Field Activity</span>
              <span>Present / Allocated</span>
            </div>

            {[
              { name: 'North Region Distribution & Farms', present: 46, total: 50, color: 'bg-emerald-500' },
              { name: 'Field Quality Assurance & Inspection', present: 28, total: 30, color: 'bg-blue-500' },
              { name: 'Cold-Chain Delivery & Reefer Fleet', present: 22, total: 25, color: 'bg-indigo-500' },
              { name: 'Wholesale Sales & Merchandising', present: 12, total: 13, color: 'bg-purple-500' },
            ].map((dept, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium text-slate-900">{dept.name}</span>
                  <span className="font-mono font-semibold">{dept.present} / {dept.total} ({Math.round((dept.present / dept.total) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    className={`${dept.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${(dept.present / dept.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Legal Compliance Notice */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span><strong>Privacy Assurance:</strong> GPS coordinates are exclusively recorded during duty sessions with active employee consent.</span>
            </div>
            <button 
              onClick={() => setViewMode('company_admin')}
              className="text-blue-600 hover:text-blue-800 font-semibold text-xs whitespace-nowrap"
            >
              Open Live Map →
            </button>
          </div>
        </div>

        {/* Explainable Performance Scoring Engine KPI */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Explainable Performance</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold uppercase">
                Weight Configured
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Composite operational indicator calculated with transparent, configurable category weights.
            </p>

            {/* Performance Distribution */}
            <div className="mt-4 space-y-3">
              {performanceScores.map((score, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">{score.employeeName}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {score.overallScore} / 100
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>{score.department}</span>
                    <span className="font-medium">Rating: {score.managerRating}★</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${score.overallScore}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            ⚠️ <em>Legal Notice:</em> Performance scores are operational indicators only and never used as the sole automated basis for employment decisions.
          </div>
        </div>

      </div>

      {/* Row 3: Field Verification, Telemetry & SaaS Billing Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Verified Field Visits & Geofence Logs */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Field Visits & Geofence Logs</h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">GPS Verified</span>
          </div>

          <div className="space-y-3">
            {fieldVisits.map((visit) => (
              <div key={visit.id} className="p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{visit.clientName}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    visit.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    visit.status === 'checked_in' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {visit.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 truncate">{visit.address}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Officer: <strong>{visit.employeeName}</strong></span>
                  <span>Accuracy: <strong>{visit.verifiedGpsDistanceMeters || 8.5}m</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Reimbursement Telemetry */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Expense Audits & Claims</h2>
            <span className="text-xs font-bold text-slate-700">₹{totalExpenseClaimed.toLocaleString('en-IN')} Total</span>
          </div>

          <div className="space-y-2.5">
            {expenses.map((exp) => (
              <div key={exp.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[200px]">
                  <span className="text-xs font-bold text-slate-900 block truncate">{exp.employeeName}</span>
                  <span className="text-[11px] text-slate-500">{exp.category} • {exp.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-900">₹{exp.amount.toLocaleString('en-IN')}</span>
                  <div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      exp.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      exp.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {exp.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setViewMode('company_admin')}
            className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            Review All Receipts & Approvals →
          </button>
        </div>

        {/* Multi-Tenant SaaS Subscriptions & Billing Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Savrdh SaaS Multi-Tenancy</h2>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Super-Admin</span>
          </div>

          <div className="space-y-3">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{inv.tenantName}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {inv.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{inv.plan} Plan ({inv.seats} Seats)</span>
                  <span className="font-bold text-slate-900">₹{inv.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>GST: ₹{inv.gstAmount.toLocaleString('en-IN')} (18%)</span>
                  <span>Gateway: {inv.paymentGateway}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setViewMode('super_admin')}
            className="w-full py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-semibold border border-purple-200 transition-colors"
          >
            Open SaaS Subscription Console →
          </button>
        </div>

      </div>
    </div>
  );
};
