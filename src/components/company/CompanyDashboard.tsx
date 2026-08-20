import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  Receipt, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  Settings, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  Check, 
  X, 
  Sliders, 
  Layers, 
  Navigation,
  Lock,
  Battery,
  AlertCircle,
  HelpCircle,
  Monitor,
  LogOut,
  UserPlus,
  UserCheck,
  Radio,
  Sparkles,
  Compass,
  Smartphone,
  CheckCheck,
  Coffee,
  CalendarCheck,
  CalendarX,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { LiveDutyGoogleMap } from './LiveDutyGoogleMap';
import { EmployeeRosterView } from './EmployeeRosterView';
import { LiveChatDispatchView } from './LiveChatDispatchView';
import { FieldTask, LeaveRequest } from '../../types';
import { evaluateEnRouteTelemetry, evaluateTerritoryRange, formatDistance } from '../../utils/geoTracking';
import { LiveTaskRadarModal } from '../common/LiveTaskRadarModal';

export const CompanyDashboard: React.FC = () => {
  const { 
    currentTenant, 
    currentUser, 
    attendanceRecords, 
    approveAttendanceCorrection, 
    tasks, 
    updateTaskStatus,
    updateTaskEnRouteTelemetry,
    addTask, 
    fieldVisits, 
    expenses, 
    approveExpense, 
    rejectExpense, 
    leaves, 
    approveLeave,
    rejectLeave,
    performanceWeights, 
    setPerformanceWeights, 
    performanceScores, 
    auditLogs, 
    routePoints, 
    shiftPolicy,
    setShiftPolicy,
    users,
    sendMessage,
    showToast,
    setViewMode,
    setCurrentUser,
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState<'live_map' | 'employees' | 'attendance' | 'leaves_approvals' | 'tasks_visits' | 'chat_dispatch' | 'expenses' | 'performance' | 'payroll' | 'audit_privacy'>('live_map');
  const [selectedEmployeeForMap, setSelectedEmployeeForMap] = useState<string>('emp-rahul-sharma');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedReceiptModal, setSelectedReceiptModal] = useState<string | null>(null);
  const [selectedTaskForProof, setSelectedTaskForProof] = useState<FieldTask | null>(null);
  const [selectedTaskForRadar, setSelectedTaskForRadar] = useState<FieldTask | null>(null);
  
  // Leave management state
  const [leaveStatusFilter, setLeaveStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [leaveSearchTerm, setLeaveSearchTerm] = useState('');
  const [rejectingLeave, setRejectingLeave] = useState<LeaveRequest | null>(null);
  const [rejectionRemarks, setRejectionRemarks] = useState('');

  // Strict Tenant Isolation: Only filter records belonging to this company tenant
  const companyUsers = users.filter(u => u.tenantId === currentTenant.id);
  const companyEmployees = companyUsers.filter(u => u.role === 'employee');
  const companyAttendance = attendanceRecords.filter(a => a.tenantId === currentTenant.id || !a.tenantId);
  const companyTasks = tasks.filter(t => t.tenantId === currentTenant.id || !t.tenantId);
  const companyVisits = fieldVisits.filter(v => v.tenantId === currentTenant.id || !v.tenantId);
  const companyExpenses = expenses.filter(e => e.tenantId === currentTenant.id || !e.tenantId);
  const companyLeaves = leaves.filter(l => l.tenantId === currentTenant.id || !l.tenantId);
  const companyScores = performanceScores.filter(s => s.tenantId === currentTenant.id || !s.tenantId);
  const companyAuditLogs = auditLogs.filter(a => a.tenantId === currentTenant.id || !a.tenantId);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskClient, setNewTaskClient] = useState('');
  const [newTaskAddress, setNewTaskAddress] = useState('Connaught Place Outer Circle, New Delhi');
  const [newTaskLat, setNewTaskLat] = useState<number>(28.6315);
  const [newTaskLng, setNewTaskLng] = useState<number>(77.2167);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState(companyEmployees[0]?.id || 'emp-rahul-sharma');
  const [newTaskIsEnRoute, setNewTaskIsEnRoute] = useState(false);

  // Attendance & Break metrics
  const totalEmployees = companyUsers.length;
  const presentEmployees = companyAttendance.filter(a => a.status === 'present' || a.status === 'on_field' || a.status === 'on_break').length;
  const onFieldEmployees = companyAttendance.filter(a => a.status === 'on_field').length;
  const onBreakEmployees = companyAttendance.filter(a => a.status === 'on_break').length;
  const lateEmployees = companyAttendance.filter(a => a.status === 'late').length;
  const onLeaveEmployees = companyAttendance.filter(a => a.status === 'on_leave').length;
  const pendingLeavesCount = companyLeaves.filter(l => l.status === 'pending').length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const assignee = users.find(u => u.id === newTaskAssignee) || companyEmployees[0] || users[3];
    
    // Evaluate operational territory range for this task
    const territoryEval = evaluateTerritoryRange(
      newTaskLat,
      newTaskLng,
      assignee.assignedTerritoryBaseLat || 28.6328,
      assignee.assignedTerritoryBaseLng || 77.2235,
      assignee.assignedOperatingRadiusKm || 8.0,
      assignee.assignedTerritoryName || 'Assigned Operational Zone'
    );

    addTask({
      assignedToUserId: assignee.id,
      assignedToName: assignee.fullName,
      createdById: currentUser.id,
      title: newTaskTitle,
      description: newTaskDesc,
      clientName: newTaskClient,
      clientAddress: newTaskAddress,
      targetLat: newTaskLat,
      targetLng: newTaskLng,
      targetGeofenceRadiusMeters: 100,
      priority: newTaskPriority,
      dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10) + ' 05:00 PM',
      status: 'pending',
      isEnRouteStop: newTaskIsEnRoute,
      enRouteDetourMeters: newTaskIsEnRoute ? 280 : undefined,
      territoryName: territoryEval.territoryName,
      isInsideAssignedTerritory: territoryEval.isInsideTerritory,
      distanceFromTerritoryBaseKm: territoryEval.distanceFromBaseKm,
      territoryWarning: territoryEval.warningMessage
    });

    setNewTaskTitle('');
    setNewTaskClient('');
    setNewTaskAddress('Connaught Place Outer Circle, New Delhi');
    setNewTaskLat(28.6315);
    setNewTaskLng(77.2167);
    setNewTaskDesc('');
    setNewTaskIsEnRoute(false);
    setShowNewTaskModal(false);
    
    if (newTaskIsEnRoute) {
      showToast(`⚡ On-the-way Waypoint Lead dispatched to ${assignee.fullName}!`);
    } else if (!territoryEval.isInsideTerritory) {
      showToast(`⚠️ Task dispatched, but flagged as Out-of-Territory (${territoryEval.formattedDistance} from base)!`);
    } else {
      showToast(`📍 In-Territory Task dispatched to ${assignee.fullName} (${territoryEval.formattedDistance} from base)!`);
    }
  };

  const handleAssignTaskDirect = (empId: string) => {
    setNewTaskAssignee(empId);
    setShowNewTaskModal(true);
  };

  // CSV Payroll Exporter
  const handleExportPayrollCSV = () => {
    const headers = 'Employee Code,Employee Name,Department,Present Days,Working Hours,Overtime Hours,Late Minutes,Deductions (INR),Net Payable Days\n';
    const rows = companyAttendance.map(a => 
      `"${a.employeeCode}","${a.employeeName}","${a.department}",24,${a.workingHours * 24},${a.overtimeHours * 24},${a.lateMinutes},0,24`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FieldSure_Payroll_Report_${currentTenant.code}_August2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Payroll CSV Report downloaded successfully.');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 14-Day Free Trial Active Banner (If Trial Company) */}
      {currentTenant.status === 'trial' && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 rounded-2xl p-4 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black tracking-wide uppercase">14-Day Full Access Trial Sandbox Active</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold">
                  Expires {currentTenant.trialEndsAt || 'in 14 days'}
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                You have full access to Live GPS Map, Task Geofence Verification, Instant Employee Onboarding, and 2-Way Dispatch Chat.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {companyEmployees.length > 0 && (
              <button
                onClick={() => {
                  setCurrentUser(companyEmployees[0]);
                  setViewMode('employee_pwa');
                  showToast(`📱 Switched to Employee PWA view as ${companyEmployees[0].fullName} to test GPS check-ins.`);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5" /> Test as Employee PWA
              </button>
            )}
            <button
              onClick={() => setActiveTab('employees')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-white border border-emerald-400/40 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add Real Employees
            </button>
          </div>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">{currentTenant.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 uppercase">
              {currentTenant.plan} Plan
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Company Operations & Workforce Compliance Console • {companyUsers.length} of {currentTenant.maxEmployees} Seats Active
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setActiveTab('employees')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4 text-purple-600" /> Manage Team ({companyUsers.length})
          </button>

          <button
            onClick={() => {
              try {
                const popoutUrl = `${window.location.origin}${window.location.pathname}?view=map_command_center`;
                window.open(popoutUrl, '_blank', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
                showToast('🚀 Live Map launched in independent window for Multi-Screen monitoring!');
              } catch (e) {
                setViewMode('map_command_center');
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95"
            title="Open Live Map in a dedicated second window for Multi-Monitor setup"
          >
            <Monitor className="w-4 h-4" /> 🖥️ Popout Map (Dual-Screen)
          </button>

          <button
            onClick={() => setShowNewTaskModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Assign Field Task
          </button>
          
          <button
            onClick={handleExportPayrollCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" /> Export Payroll (CSV)
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold shadow-xs transition-colors"
            title="Log Out of Company Dashboard"
          >
            <LogOut className="w-4 h-4 text-rose-600" /> Log Out
          </button>
        </div>
      </div>

      {/* Admin Module Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('live_map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'live_map' ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200/60' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" /> Live Duty-Time Map
        </button>

        <button
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'employees' ? 'bg-white text-purple-700 shadow-xs ring-1 ring-slate-200/60' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Team & Employees ({companyUsers.length})
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'attendance' ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200/60' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" /> Attendance & Shifts
          {onBreakEmployees > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
              {onBreakEmployees} on break
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('leaves_approvals')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'leaves_approvals' ? 'bg-white text-rose-700 shadow-xs ring-1 ring-slate-200/60' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5 text-rose-600" />
          <span>Leave Requests</span>
          {pendingLeavesCount > 0 ? (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-extrabold animate-pulse">
              {pendingLeavesCount} pending
            </span>
          ) : (
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
              {companyLeaves.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('tasks_visits')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'tasks_visits' ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200/60' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Tasks & GPS Geofence Logs
        </button>

        <button
          onClick={() => setActiveTab('chat_dispatch')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'chat_dispatch' ? 'bg-white text-teal-700 shadow-xs ring-1 ring-slate-200/60' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-teal-600" /> Live Dispatch & Chat
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'expenses' ? 'bg-white text-amber-700 shadow-xs ring-1 ring-slate-200/60' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" /> Expense Approvals
        </button>

        <button
          onClick={() => setActiveTab('performance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'performance' ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200/60' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> Performance Engine
        </button>

        <button
          onClick={() => setActiveTab('payroll')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'payroll' ? 'bg-white text-purple-700 shadow-xs ring-1 ring-slate-200/60' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" /> Payroll Ready Hours
        </button>

        <button
          onClick={() => setActiveTab('audit_privacy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'audit_privacy' ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/60' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Audit Logs & Privacy
        </button>
      </div>

      {/* ===================== TAB 1: LIVE DUTY-TIME MAP ===================== */}
      {activeTab === 'live_map' && (
        <LiveDutyGoogleMap
          selectedEmployeeId={selectedEmployeeForMap}
          onSelectEmployee={setSelectedEmployeeForMap}
        />
      )}

      {/* ===================== TAB 2: TEAM & EMPLOYEE MANAGEMENT ===================== */}
      {activeTab === 'employees' && (
        <EmployeeRosterView onAssignTaskToEmployee={handleAssignTaskDirect} />
      )}

      {/* ===================== TAB 2: ATTENDANCE & SHIFTS ===================== */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Live Attendance & Break Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Total Roster</span>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-xl font-extrabold text-slate-900">{companyUsers.length}</div>
              <div className="text-[10px] text-slate-500 mt-1">{companyEmployees.length} Field Officers</div>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold mb-1">
                <span>🟢 On Field Duty</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-xl font-extrabold text-emerald-900">{onFieldEmployees}</div>
              <div className="text-[10px] text-emerald-600 mt-1">Active GPS Tracked</div>
            </div>

            <div className="bg-white rounded-2xl border border-amber-200 bg-amber-50/30 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-amber-800 font-bold mb-1">
                <span className="flex items-center gap-1"><Coffee className="w-3.5 h-3.5 text-amber-600" /> On Break</span>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              </div>
              <div className="text-xl font-extrabold text-amber-900">{onBreakEmployees}</div>
              <div className="text-[10px] text-amber-700 mt-1">{onBreakEmployees > 0 ? 'Tea / Lunch Break Active' : 'No breaks right now'}</div>
            </div>

            <div className="bg-white rounded-2xl border border-blue-200 bg-blue-50/20 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-blue-700 font-semibold mb-1">
                <span>🏖️ On Leave</span>
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-xl font-extrabold text-blue-900">{onLeaveEmployees}</div>
              <div className="text-[10px] text-blue-600 mt-1">Approved Leaves</div>
            </div>

            <div className="bg-white rounded-2xl border border-rose-200 bg-rose-50/30 p-4 shadow-xs cursor-pointer hover:border-rose-300 transition-all" onClick={() => setActiveTab('leaves_approvals')}>
              <div className="flex items-center justify-between text-xs text-rose-700 font-bold mb-1">
                <span>📝 Pending Leaves</span>
                <CalendarCheck className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-xl font-extrabold text-rose-900">{pendingLeavesCount}</div>
              <div className="text-[10px] text-rose-600 font-bold mt-1">Click to Review →</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Today's Attendance & Real-Time Break Register</h2>
                <p className="text-xs text-slate-500">Live work status, active break intervals, punch times, and shift approvals</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search employee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                    <th className="py-3 px-3">Employee</th>
                    <th className="py-3 px-3">Shift</th>
                    <th className="py-3 px-3">Live Status</th>
                    <th className="py-3 px-3">Punch-In</th>
                    <th className="py-3 px-3">Break Info</th>
                    <th className="py-3 px-3">Hours Logged</th>
                    <th className="py-3 px-3">Approval</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companyAttendance
                    .filter(a => a.employeeName.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((att) => (
                      <tr key={att.id} className={`hover:bg-slate-50/80 transition-colors ${att.status === 'on_break' ? 'bg-amber-50/30' : ''}`}>
                        <td className="py-3 px-3 font-medium text-slate-900">
                          <div>{att.employeeName}</div>
                          <span className="text-[10px] text-slate-400 font-mono">{att.employeeCode} • {att.department}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{att.shift}</td>
                        <td className="py-3 px-3">
                          {att.status === 'on_break' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                              <Coffee className="w-3 h-3 text-amber-700" />
                              <span>ON BREAK</span>
                            </span>
                          ) : att.status === 'on_field' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              <span>ON FIELD</span>
                            </span>
                          ) : att.status === 'present' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                              PRESENT
                            </span>
                          ) : att.status === 'on_leave' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                              ON LEAVE
                            </span>
                          ) : att.status === 'late' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                              LATE PUNCH
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800">
                              {att.status.replace('_', ' ')}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-semibold">{att.punchInTime || '--:--'}</td>
                        <td className="py-3 px-3">
                          {att.status === 'on_break' ? (
                            <div className="text-amber-800 font-semibold">
                              <span className="text-[11px] font-bold">{att.currentBreakReason || 'Break'}</span>
                              <div className="text-[10px] text-amber-600">Since {att.breakStartTime || 'Just now'}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{att.workingHours} hrs</td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-semibold capitalize ${
                            att.approvedStatus === 'approved' ? 'text-emerald-700' :
                            att.approvedStatus === 'regularized' ? 'text-blue-700' :
                            'text-amber-700'
                          }`}>
                            {att.approvedStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {att.approvedStatus === 'pending_correction' && (
                            <button
                              onClick={() => approveAttendanceCorrection(att.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                            >
                              Approve Correction
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB: LEAVE REQUESTS & APPROVALS ===================== */}
      {activeTab === 'leaves_approvals' && (
        <div className="space-y-6">
          {/* Top Leave Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Total Applications</span>
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{companyLeaves.length}</div>
              <div className="text-[11px] text-slate-500 mt-1">All time records</div>
            </div>

            <div className="bg-white rounded-2xl border border-amber-200 bg-amber-50/20 p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-amber-800 font-bold mb-1">
                <span>⏳ Pending Review</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-extrabold text-amber-900">{pendingLeavesCount}</div>
              <div className="text-[11px] text-amber-700 mt-1">Requires Admin Action</div>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-emerald-800 font-bold mb-1">
                <span>✅ Approved Leaves</span>
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-900">
                {companyLeaves.filter(l => l.status === 'approved').length}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">Granted by Management</div>
            </div>

            <div className="bg-white rounded-2xl border border-rose-200 bg-rose-50/20 p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-rose-800 font-bold mb-1">
                <span>❌ Rejected Leaves</span>
                <CalendarX className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-extrabold text-rose-900">
                {companyLeaves.filter(l => l.status === 'rejected').length}
              </div>
              <div className="text-[11px] text-rose-700 mt-1">Declined requests</div>
            </div>
          </div>

          {/* Main Leave Applications Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-rose-600" />
                  <span>Employee Leave Applications & Review Portal</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Manage time-off requests submitted by field employees with instant approval & rejection workflows.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setLeaveStatusFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      leaveStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({companyLeaves.length})
                  </button>
                  <button
                    onClick={() => setLeaveStatusFilter('pending')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      leaveStatusFilter === 'pending' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pending ({pendingLeavesCount})
                  </button>
                  <button
                    onClick={() => setLeaveStatusFilter('approved')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      leaveStatusFilter === 'approved' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setLeaveStatusFilter('rejected')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      leaveStatusFilter === 'rejected' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Rejected
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, reason, type..."
                    value={leaveSearchTerm}
                    onChange={(e) => setLeaveSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* List / Grid of Leaves */}
            {companyLeaves.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Leave Applications Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When employees submit leave applications from the Mobile Employee PWA, they will appear here in real time for approval.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {companyLeaves
                  .filter(l => {
                    const matchesFilter = leaveStatusFilter === 'all' || l.status === leaveStatusFilter;
                    const matchesSearch = 
                      l.employeeName.toLowerCase().includes(leaveSearchTerm.toLowerCase()) ||
                      l.reason.toLowerCase().includes(leaveSearchTerm.toLowerCase()) ||
                      l.leaveType.toLowerCase().includes(leaveSearchTerm.toLowerCase());
                    return matchesFilter && matchesSearch;
                  })
                  .map((leave) => {
                    const isPending = leave.status === 'pending';
                    const isApproved = leave.status === 'approved';
                    const isRejected = leave.status === 'rejected';

                    return (
                      <div
                        key={leave.id}
                        className={`rounded-2xl border p-5 transition-all shadow-xs ${
                          isPending 
                            ? 'bg-amber-50/20 border-amber-200 ring-1 ring-amber-200/50' 
                            : isApproved 
                            ? 'bg-emerald-50/10 border-emerald-200' 
                            : 'bg-slate-50/50 border-slate-200 opacity-80'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          
                          {/* Left: Employee details & leave badge */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                                {leave.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                  <span>{leave.employeeName}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                    isPending ? 'bg-amber-100 text-amber-800' :
                                    isApproved ? 'bg-emerald-100 text-emerald-800' :
                                    'bg-rose-100 text-rose-800'
                                  }`}>
                                    ● {leave.status}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500">
                                  Applied on <span className="font-semibold text-slate-700">{leave.appliedOn}</span>
                                </div>
                              </div>
                            </div>

                            {/* Leave Details Badges */}
                            <div className="flex items-center gap-2 flex-wrap text-xs">
                              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold capitalize">
                                📋 {leave.leaveType} Leave
                              </span>
                              <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-bold">
                                📅 {leave.startDate} to {leave.endDate}
                              </span>
                              <span className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 font-bold">
                                ⏳ {leave.totalDays} {leave.totalDays === 1 ? 'Day' : 'Days'}
                              </span>
                            </div>

                            {/* Reason Description */}
                            <div className="bg-white rounded-xl border border-slate-200/80 p-3 text-xs text-slate-700">
                              <span className="font-bold text-slate-900 block mb-0.5">Reason for leave:</span>
                              <p className="italic text-slate-600">"{leave.reason}"</p>
                            </div>

                            {/* Review Remarks if processed */}
                            {!isPending && leave.reviewedBy && (
                              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                <span>Reviewed by: <strong className="text-slate-800">{leave.reviewedBy}</strong></span>
                                {leave.reviewRemarks && <span>• Remarks: <em>"{leave.reviewRemarks}"</em></span>}
                              </div>
                            )}
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-2 lg:flex-col lg:items-end justify-end">
                            {isPending ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    approveLeave(leave.id, 'Approved by Company Admin');
                                    try { confetti({ particleCount: 40, spread: 50 }); } catch (err) {}
                                  }}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" /> Approve Leave
                                </button>
                                
                                <button
                                  onClick={() => {
                                    setRejectingLeave(leave);
                                    setRejectionRemarks('');
                                  }}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" /> Reject
                                </button>
                              </div>
                            ) : (
                              <div className="text-right">
                                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold ${
                                  isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {isApproved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                                  <span>{isApproved ? 'Leave Approved' : 'Leave Rejected'}</span>
                                </span>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Leave Remarks Modal */}
      {rejectingLeave && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarX className="w-5 h-5 text-rose-600" />
                <span>Reject Leave Application</span>
              </h3>
              <button onClick={() => setRejectingLeave(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>Are you sure you want to decline the leave request for <strong>{rejectingLeave.employeeName}</strong>?</p>
              <p className="text-slate-500">Duration: {rejectingLeave.startDate} to {rejectingLeave.endDate} ({rejectingLeave.totalDays} days)</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Reason / Remarks for Rejection (Optional):</label>
              <textarea
                value={rejectionRemarks}
                onChange={(e) => setRejectionRemarks(e.target.value)}
                placeholder="e.g. Critical client deliveries scheduled, please reschedule or contact HR..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectingLeave(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  rejectLeave(rejectingLeave.id, rejectionRemarks || 'Declined by Admin due to operational schedule');
                  setRejectingLeave(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: TASKS & FIELD VISITS ===================== */}
      {activeTab === 'tasks_visits' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Tasks Management */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Task Assignments</h2>
              <button
                onClick={() => setShowNewTaskModal(true)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Assign Task
              </button>
            </div>

            <div className="space-y-3">
              {companyTasks.map((task) => {
                // Compute Real-Time En-Route Proximity Telemetry
                const isRahul = task.assignedToUserId === 'emp-rahul-sharma';
                const currentOfficerLat = isRahul ? 28.5800 : (task.targetLat ? task.targetLat - 0.015 : 28.5800);
                const currentOfficerLng = isRahul ? 77.2500 : (task.targetLng ? task.targetLng - 0.012 : 77.2500);

                const enRouteTelemetry = (task.targetLat && task.targetLng) ? evaluateEnRouteTelemetry(
                  currentOfficerLat,
                  currentOfficerLng,
                  22,
                  task.targetLat,
                  task.targetLng,
                  task.initialTripDistanceMeters || 2800,
                  task.targetGeofenceRadiusMeters || 100
                ) : null;

                return (
                  <div key={task.id} className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                          <span>{task.title}</span>
                          {task.isGeofenceVerified && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> GPS Geofence Verified ({task.distanceFromTargetMeters?.toFixed(1) || '11.2'}m)
                            </span>
                          )}
                          {task.status === 'in_progress' && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold border border-blue-300 animate-pulse">
                              <Radio className="w-3 h-3 text-blue-600" /> En-Route Active
                            </span>
                          )}
                          {task.isEnRouteStop && task.status !== 'completed' && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                              ⚡ En-Route Waypoint (+{task.enRouteDetourMeters || 280}m detour)
                            </span>
                          )}
                          {task.isLocked && task.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold border border-slate-300">
                              <Lock className="w-3 h-3" /> Queued (Sequential Lock)
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">{task.description}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                        task.priority === 'urgent' ? 'bg-rose-100 text-rose-800' :
                        task.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>

                    {/* Destination / Target Location Pin & Territory Adherence */}
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-700 font-semibold">
                        <span className="flex items-center gap-1.5 text-blue-700">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Client Site: <strong>{task.clientName}</strong></span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          Geofence Radius: {task.targetGeofenceRadiusMeters || 100}m
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 pl-5">{task.clientAddress}</p>
                      
                      {/* Territory Status Tag */}
                      <div className="pl-5 pt-1 flex items-center gap-2 flex-wrap text-[10px]">
                        <span className={`px-2 py-0.5 rounded-md font-semibold ${
                          task.isInsideAssignedTerritory !== false 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {task.isInsideAssignedTerritory !== false 
                            ? `✅ In Territory (${task.distanceFromTerritoryBaseKm || 1.8} km from Hub)`
                            : `⚠️ Out of Operating Territory (${task.distanceFromTerritoryBaseKm || 11.8} km)`
                          }
                        </span>
                        {task.territoryName && (
                          <span className="text-slate-400">Zone: {task.territoryName}</span>
                        )}
                      </div>
                    </div>

                    {/* Live Proximity & Heading Tracker HUD Card */}
                    {enRouteTelemetry && task.status !== 'completed' && (
                      <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50/90 to-indigo-50/70 border border-blue-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-900 flex items-center gap-1.5 text-[11px]">
                            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                            <span>Live Proximity Radar & Heading</span>
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 uppercase">
                            {enRouteTelemetry.headingStatus.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center pt-1">
                          <div className="bg-white/80 p-1.5 rounded-lg border border-blue-100">
                            <span className="text-[9px] text-slate-400 block">Remaining</span>
                            <strong className="text-emerald-700 text-xs font-mono">{enRouteTelemetry.formattedDistance}</strong>
                          </div>
                          <div className="bg-white/80 p-1.5 rounded-lg border border-blue-100">
                            <span className="text-[9px] text-slate-400 block">Estimated Arrival</span>
                            <strong className="text-blue-700 text-xs">{enRouteTelemetry.formattedEta}</strong>
                          </div>
                          <div className="bg-white/80 p-1.5 rounded-lg border border-blue-100">
                            <span className="text-[9px] text-slate-400 block">Bearing / Direction</span>
                            <strong className="text-slate-800 text-xs font-mono">{enRouteTelemetry.cardinalDirection} ({Math.round(enRouteTelemetry.bearingDegrees)}°)</strong>
                          </div>
                        </div>

                        {/* Corridor Progress Bar */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span>Corridor Journey</span>
                            <span className="font-bold text-blue-800">{enRouteTelemetry.proximityProgressPercentage}% Traveled</span>
                          </div>
                          <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(5, enRouteTelemetry.proximityProgressPercentage)}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => setSelectedTaskForRadar(task)}
                            className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-xs transition-colors"
                          >
                            <Radio className="w-3 h-3" /> Live Radar HUD
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEmployeeForMap(task.assignedToUserId);
                              setActiveTab('live_map');
                              showToast(`Switched to Live Map centered on ${task.assignedToName}`);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <Navigation className="w-3 h-3" /> Track on Map
                          </button>
                          <button
                            onClick={() => {
                              if (task.targetLat && task.targetLng) {
                                const newLat = currentOfficerLat + (task.targetLat - currentOfficerLat) * 0.35;
                                const newLng = currentOfficerLng + (task.targetLng - currentOfficerLng) * 0.35;
                                updateTaskEnRouteTelemetry(task.id, newLat, newLng, 25);
                                showToast(`Simulated step: ${task.assignedToName} moved closer to ${task.clientName}!`);
                              }
                            }}
                            className="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10px] transition-colors"
                            title="Simulate step closer to destination"
                          >
                            ⚡ Step Closer
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Assignment & Verification Stats */}
                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                      <span>Officer: <strong>{task.assignedToName}</strong></span>
                      <span>Due: <strong>{task.dueDate}</strong></span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          task.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        {task.checkInTime && (
                          <span className="text-[10px] text-slate-500">
                            Checked-in: <strong>{task.checkInTime}</strong>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {task.isGeofenceVerified && (
                          <button
                            onClick={() => setSelectedTaskForProof(task)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3 h-3 text-emerald-600" /> View GPS Proof
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Field Visits & GPS Proof Verification */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Field Visits & Geofence Logs</h2>
              <span className="text-xs font-semibold text-emerald-700">GPS Timestamp Verified</span>
            </div>

            <div className="space-y-3">
              {companyVisits.map((visit) => (
                <div key={visit.id} className="p-4 rounded-xl border border-slate-200 space-y-2 bg-slate-50/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{visit.clientName}</h3>
                      <p className="text-xs text-slate-500">{visit.purpose}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      visit.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      visit.status === 'checked_in' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {visit.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {visit.address}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Officer: <strong>{visit.employeeName}</strong></span>
                    <span className="text-emerald-700 font-bold">
                      GPS Distance: {visit.verifiedGpsDistanceMeters || 8.5}m from pin
                    </span>
                  </div>

                  {visit.notes && (
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600">
                      <strong>Visit Notes:</strong> {visit.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ===================== TAB: LIVE DISPATCH & CHAT ===================== */}
      {activeTab === 'chat_dispatch' && (
        <LiveChatDispatchView 
          companyUsers={companyUsers} 
          onNavigateToMap={(empId) => {
            if (empId) setSelectedEmployeeForMap(empId);
            setActiveTab('live_map');
          }}
        />
      )}

      {/* ===================== TAB 4: EXPENSE APPROVALS ===================== */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Field Expense Audit & Approval Queue</h2>
              <p className="text-xs text-slate-500">Verify travel slips, meals, and emergency maintenance claims</p>
            </div>
            <span className="text-xs font-bold text-slate-700">
              Pending Total: ₹{companyExpenses.filter(e => e.status === 'pending').reduce((a, b) => a + b.amount, 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-3">
            {companyExpenses.map((exp) => (
              <div key={exp.id} className="p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{exp.employeeName}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {exp.category}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      exp.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      exp.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {exp.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{exp.description}</p>
                  <span className="text-[10px] text-slate-400">{exp.date} • Submitted via FieldSure PWA</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-900">₹{exp.amount.toLocaleString('en-IN')}</span>
                    {exp.receiptUrl && (
                      <button
                        onClick={() => setSelectedReceiptModal(exp.receiptUrl!)}
                        className="block text-[11px] text-blue-600 hover:underline font-medium cursor-pointer"
                      >
                        View Receipt Slip
                      </button>
                    )}
                  </div>

                  {exp.status === 'pending' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => approveExpense(exp.id, 'Approved by Finance & COO')}
                        className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => rejectExpense(exp.id, 'Receipt does not match duty log')}
                        className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 5: PERFORMANCE & SHIFT POLICY ENGINE ===================== */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          
          {/* Admin Shift Policy Configuration Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span>Admin Shift Timings & Checkout Policy Controls</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Configure mandatory shift working hours, break allowances, and restrict unauthorized early punch-outs.
                </p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                shiftPolicy?.restrictEarlyPunchOut 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                  : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}>
                {shiftPolicy?.restrictEarlyPunchOut ? '🔒 Anti-Tamper Punch Locked' : '🔓 Flexible Hours'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <label className="font-bold text-slate-800 block">Shift Timing Window</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Start:</span>
                    <input
                      type="time"
                      value={shiftPolicy?.shiftStartTime || '09:00'}
                      onChange={(e) => setShiftPolicy(prev => ({ ...prev, shiftStartTime: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">End:</span>
                    <input
                      type="time"
                      value={shiftPolicy?.shiftEndTime || '18:00'}
                      onChange={(e) => setShiftPolicy(prev => ({ ...prev, shiftEndTime: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <label className="font-bold text-slate-800 block">Min Required Work Hours</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="14"
                    value={shiftPolicy?.minWorkHoursRequired || 8.0}
                    onChange={(e) => setShiftPolicy(prev => ({ ...prev, minWorkHoursRequired: Number(e.target.value) }))}
                    className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 font-mono"
                  />
                  <span className="text-slate-600 font-medium">Hours / Day</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Required before standard punch-out</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <label className="font-bold text-slate-800 block">Max Break Allowance</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="5"
                    min="10"
                    max="120"
                    value={shiftPolicy?.maxAllowedBreakMinutes || 45}
                    onChange={(e) => setShiftPolicy(prev => ({ ...prev, maxAllowedBreakMinutes: Number(e.target.value) }))}
                    className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 font-mono"
                  />
                  <span className="text-slate-600 font-medium">Minutes Total</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Excess breaks trigger performance deductions</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="font-bold text-slate-800 block">Checkout Authorization Policy</label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={shiftPolicy?.restrictEarlyPunchOut || false}
                    onChange={(e) => setShiftPolicy(prev => ({ ...prev, restrictEarlyPunchOut: e.target.checked }))}
                    className="w-4 h-4 accent-emerald-600"
                  />
                  <span className="font-semibold text-[11px]">Require Reason for Early Exit</span>
                </label>
                <p className="text-[10px] text-slate-500">
                  Employees cannot punch out early without selecting a valid emergency reason and logging admin remarks.
                </p>
              </div>
            </div>
          </div>

          {/* Weight Configuration Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Explainable Performance Scoring Engine</span>
                </h2>
                <p className="text-xs text-slate-500">Weights dynamically calculate each field employee's operational rating</p>
              </div>
              <span className="text-xs font-bold text-slate-700">
                Total Formula Weight: {Object.values(performanceWeights).reduce((a: number, b: number) => a + Number(b), 0)}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Task Completion SLA ({performanceWeights.taskCompletionWeight || 40}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={performanceWeights.taskCompletionWeight || 40}
                  onChange={(e) => setPerformanceWeights(prev => ({ ...prev, taskCompletionWeight: Number(e.target.value) }))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Based on tasks completed & geofence verified</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Shift Working Hours ({performanceWeights.shiftAdherenceWeight || 25}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={performanceWeights.shiftAdherenceWeight || 25}
                  onChange={(e) => setPerformanceWeights(prev => ({ ...prev, shiftAdherenceWeight: Number(e.target.value) }))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Hours vs {shiftPolicy?.minWorkHoursRequired || 8.0}h required + early exits</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Break Discipline ({performanceWeights.breakDisciplineWeight || 20}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={performanceWeights.breakDisciplineWeight || 20}
                  onChange={(e) => setPerformanceWeights(prev => ({ ...prev, breakDisciplineWeight: Number(e.target.value) }))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Staying within {shiftPolicy?.maxAllowedBreakMinutes || 45}m break allowance</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  GPS & Geofence Accuracy ({performanceWeights.gpsAccuracyWeight || 15}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={performanceWeights.gpsAccuracyWeight || 15}
                  onChange={(e) => setPerformanceWeights(prev => ({ ...prev, gpsAccuracyWeight: Number(e.target.value) }))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Check-in within 100m geofence radius</span>
              </div>
            </div>

            {/* Legal Notice Box */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Statutory Notice:</strong> Performance scores are operational decision indicators and reflect real-time task completions, break discipline, and shift adherence. All metrics remain transparent to employees in their PWA.
              </span>
            </div>
          </div>

          {/* Employee Performance Scores Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Real-Time Employee Performance Leaderboard</h3>
                <p className="text-xs text-slate-500">Live evaluation generated from assigned tasks, shift compliance, and break logs</p>
              </div>
              <span className="text-xs font-bold text-slate-700 font-mono">
                {companyScores.length} Field Officers Evaluated
              </span>
            </div>

            <div className="space-y-3">
              {companyScores.map((score) => (
                <div key={score.userId} className="p-4 rounded-xl border border-slate-200 space-y-3 hover:border-slate-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        {score.employeeName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{score.employeeName}</h4>
                        <p className="text-xs text-slate-500">{score.department || 'Field Area Operations'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-2xl font-black text-slate-900 font-mono">{score.overallScore}%</span>
                        <span className="text-[10px] text-slate-400 block">Performance Index</span>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                        score.overallScore >= 88 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                          : score.overallScore >= 70
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : 'bg-amber-50 text-amber-700 border-amber-300'
                      }`}>
                        {score.statusBadge || 'Standard Performer'}
                      </span>
                    </div>
                  </div>

                  {/* Component Breakdown Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-semibold">
                        <span>Task SLA</span>
                        <span className="text-emerald-600 font-bold">{score.taskCompletionScore}%</span>
                      </div>
                      <p className="font-bold text-slate-900 mt-1">
                        {score.breakdown?.tasksCompleted || 0} / {score.breakdown?.tasksAssigned || 0} Tasks Done
                      </p>
                      <span className="text-[10px] text-emerald-700">
                        {score.breakdown?.tasksGeofenceVerified || 0} Geofence Verified
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-semibold">
                        <span>Shift Adherence</span>
                        <span className="text-blue-600 font-bold">{score.shiftAdherenceScore || score.workingHoursScore}%</span>
                      </div>
                      <p className="font-bold text-slate-900 mt-1">
                        {score.breakdown?.workingHoursActual || 8.0}h / {score.breakdown?.workingHoursRequired || 8.0}h Target
                      </p>
                      <span className={`text-[10px] font-semibold ${score.breakdown?.earlyExitsCount ? 'text-rose-600' : 'text-slate-500'}`}>
                        {score.breakdown?.earlyExitsCount ? `⚠️ ${score.breakdown.earlyExitsCount} Early Exits` : 'Full Shift Complete'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-semibold">
                        <span>Break Discipline</span>
                        <span className={`font-bold ${score.breakDisciplineScore < 80 ? 'text-amber-600' : 'text-purple-600'}`}>
                          {score.breakDisciplineScore}%
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 mt-1">
                        {score.breakdown?.breakMinutesTaken || 0}m Taken
                      </p>
                      <span className="text-[10px] text-slate-500">
                        Max Allowed: {score.breakdown?.breakMinutesAllowed || 45}m
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-semibold">
                        <span>GPS Accuracy</span>
                        <span className="text-teal-600 font-bold">{score.gpsAccuracyScore}%</span>
                      </div>
                      <p className="font-bold text-slate-900 mt-1">
                        ±3.8m Telemetry
                      </p>
                      <span className="text-[10px] text-slate-500">
                        100% Geofence Accuracy
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ===================== TAB 6: PAYROLL READY HOURS ===================== */}
      {activeTab === 'payroll' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Payroll-Ready Working Hours Ledger</h2>
              <p className="text-xs text-slate-500">Calculated billable hours, overtime, and salary ready export</p>
            </div>

            <button
              onClick={handleExportPayrollCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" /> Download Complete Payroll CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                  <th className="py-3 px-3">Emp Code</th>
                  <th className="py-3 px-3">Full Name</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Present Days</th>
                  <th className="py-3 px-3">Total Work Hours</th>
                  <th className="py-3 px-3">Approved OT</th>
                  <th className="py-3 px-3">Payable Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companyAttendance.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-mono font-semibold text-slate-700">{att.employeeCode}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{att.employeeName}</td>
                    <td className="py-3 px-3 text-slate-600">{att.department}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">24 / 24</td>
                    <td className="py-3 px-3 font-semibold text-emerald-800">{att.workingHours * 24} hrs</td>
                    <td className="py-3 px-3 text-slate-600">+{att.overtimeHours * 24} hrs</td>
                    <td className="py-3 px-3 font-bold text-slate-900">24 Days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== TAB 7: AUDIT LOGS & PRIVACY ===================== */}
      {activeTab === 'audit_privacy' && (
        <div className="space-y-6">
          {/* Retention configuration */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Company Privacy & Data Retention Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">GPS Route Trace Retention Policy</span>
                <p className="text-slate-500">Configure how many days raw lat/lng breadcrumbs are stored before automatic cryptographic purging.</p>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold">
                  <option value="30">30 Days (Strict Data Minimization)</option>
                  <option value="60">60 Days (Standard)</option>
                  <option value="90" selected>90 Days (Enterprise Default)</option>
                </select>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">System Audit Log Retention</span>
                <p className="text-slate-500">Append-only, access-controlled audit trail of administrative actions, data views, and approval events.</p>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold">
                  <option value="180">180 Days</option>
                  <option value="365" selected>365 Days (1 Year)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Append-only Audit Trail</h3>
                <p className="text-xs text-slate-500">Access-controlled record of administrative lookups, updates, and location views</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
                {companyAuditLogs.length} Events Logged
              </span>
            </div>

            <div className="space-y-2.5">
              {companyAuditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="text-[10px] text-slate-400 font-mono">[{log.targetEntity}]</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{log.details}</p>
                    <span className="text-[10px] text-slate-400">{log.timestamp} • Actor: {log.actorName} ({log.ipAddress})</span>
                  </div>

                  {log.reason && (
                    <div className="text-right">
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                        Reason: {log.reason}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateTask} className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Assign New Field Task</h3>
              <button type="button" onClick={() => setShowNewTaskModal(false)} className="text-slate-400 text-xs">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cold Chain Reefer Temperature Audit"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Client / Store Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Bazaar Store"
                    value={newTaskClient}
                    onChange={(e) => setNewTaskClient(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Assign Field Officer *</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  >
                    {companyEmployees.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.assignedTerritoryName || 'Assigned Zone'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Officer Assigned Territory Info Box */}
              {(() => {
                const selUser = users.find(u => u.id === newTaskAssignee);
                const terrEval = evaluateTerritoryRange(
                  newTaskLat,
                  newTaskLng,
                  selUser?.assignedTerritoryBaseLat || 28.6328,
                  selUser?.assignedTerritoryBaseLng || 77.2235,
                  selUser?.assignedOperatingRadiusKm || 8.0,
                  selUser?.assignedTerritoryName || 'Assigned Operational Zone'
                );

                return (
                  <div className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                    terrEval.isInsideTerritory 
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                      : 'bg-rose-50/70 border-rose-200 text-rose-900'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Officer Zone: {selUser?.assignedTerritoryName || 'Central & South Delhi Zone'}</span>
                      </span>
                      <span className="font-mono">{selUser?.assignedOperatingRadiusKm || 8.0} km Max Limit</span>
                    </div>
                    <p className="text-[11px]">
                      {terrEval.isInsideTerritory 
                        ? `✅ Target is ${terrEval.distanceFromBaseKm} km from territory base hub (Within authorized limit).`
                        : `⚠️ Range Warning: Target is ${terrEval.distanceFromBaseKm} km away (+${(terrEval.distanceFromBaseKm - terrEval.allowedRadiusKm).toFixed(1)} km outside allowed operating radius).`
                      }
                    </p>
                  </div>
                );
              })()}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-semibold block">Target Location & Geofence *</label>
                  <span className="text-[10px] text-emerald-600 font-bold">100m Geofence Pin</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Connaught Place Outer Circle, New Delhi"
                  value={newTaskAddress}
                  onChange={(e) => setNewTaskAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />

                {/* Preset Landmark Picker */}
                <div className="mt-2 space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">Quick Preset Locations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setNewTaskAddress('Connaught Place Outer Circle, New Delhi');
                        setNewTaskLat(28.6315);
                        setNewTaskLng(77.2167);
                        if (!newTaskClient) setNewTaskClient('Apex Supermart Central');
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium"
                    >
                      📍 Connaught Place (In-Zone: ~1.8km)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewTaskAddress('DLF Phase 2 Cyber City, Gurugram');
                        setNewTaskLat(28.4900);
                        setNewTaskLng(77.0850);
                        if (!newTaskClient) setNewTaskClient('Cyber Tech Towers Hub');
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium"
                    >
                      📍 Cyber City (Out-of-Zone: ~18km)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewTaskAddress('Sector 18 Commercial Hub, Noida');
                        setNewTaskLat(28.5700);
                        setNewTaskLng(77.3200);
                        if (!newTaskClient) setNewTaskClient('Wave Silver Mall');
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium"
                    >
                      📍 Sector 18 Noida (~12km)
                    </button>
                  </div>
                </div>
              </div>

              {/* On-The-Way / En-Route Waypoint Toggle */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-900 text-xs">
                  <input
                    type="checkbox"
                    checked={newTaskIsEnRoute}
                    onChange={(e) => setNewTaskIsEnRoute(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-300"
                  />
                  <span>⚡ Mark as On-The-Way Lead (En-Route Waypoint Stop)</span>
                </label>
                <p className="text-[10px] text-amber-800/80 pl-6">
                  Check this if the lead is on the employee's current travel route. The employee will be allowed to accept and prioritize this stop without being blocked by sequential task locks.
                </p>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Instructions / Deliverables</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Inspect store shelves, record product batch, get supervisor signature..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
              >
                Dispatch Task with GPS Pin
              </button>
            </div>
          </form>
        </div>
      )}

      {/* GPS Verification Proof Modal */}
      {selectedTaskForProof && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">GPS Geofence Audit Certificate</h4>
                  <p className="text-[11px] text-emerald-700 font-semibold">Cryptographically Verified Field Check-In</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTaskForProof(null)} 
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Task Title & Officer */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{selectedTaskForProof.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                    Completed ✓
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Assigned Officer: <strong className="text-slate-700">{selectedTaskForProof.assignedToName}</strong>
                </p>
              </div>

              {/* Target Location vs Actual GPS Check-In */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-blue-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-600" /> Target Site Pin
                  </span>
                  <p className="font-semibold text-slate-900 text-[11px]">{selectedTaskForProof.clientName}</p>
                  <p className="text-[10px] text-slate-500 truncate">{selectedTaskForProof.clientAddress}</p>
                  <p className="text-[9px] font-mono text-slate-400">
                    Coords: {selectedTaskForProof.targetLat || 28.6315}, {selectedTaskForProof.targetLng || 77.2167}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 flex items-center gap-1">
                    <CheckCheck className="w-3 h-3 text-emerald-600" /> Actual GPS Check-In
                  </span>
                  <p className="font-semibold text-slate-900 text-[11px]">
                    Distance: <strong className="text-emerald-700 font-black">{selectedTaskForProof.distanceFromTargetMeters?.toFixed(1) || '11.2'} meters</strong>
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{selectedTaskForProof.checkInAddress || selectedTaskForProof.clientAddress}</p>
                  <p className="text-[9px] font-mono text-slate-400">
                    Timestamp: {selectedTaskForProof.checkInTime || 'Today'} (Accuracy: ±3.1m)
                  </p>
                </div>
              </div>

              {/* Telemetry metadata */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Geofence Status</span>
                  <strong className="text-emerald-700 text-xs font-bold">Within 100m ✓</strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Device Battery</span>
                  <strong className="text-slate-800 text-xs font-bold">88% (Healthy)</strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Mock GPS Check</span>
                  <strong className="text-emerald-700 text-xs font-bold">Passed (Hardware)</strong>
                </div>
              </div>

              {/* Completion Notes */}
              {selectedTaskForProof.completionNotes && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Field Completion Notes</span>
                  <p className="text-slate-700 text-xs italic">{selectedTaskForProof.completionNotes}</p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedTaskForProof(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceiptModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-sm w-full space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Expense Receipt Proof</h4>
              <button onClick={() => setSelectedReceiptModal(null)} className="text-slate-400 text-xs">✕</button>
            </div>
            <img src={selectedReceiptModal} alt="Receipt" className="w-full h-64 object-cover rounded-xl" />
            <button
              onClick={() => setSelectedReceiptModal(null)}
              className="w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Live Task Radar Modal */}
      {selectedTaskForRadar && (
        <LiveTaskRadarModal
          task={selectedTaskForRadar}
          employeeSession={{
            id: 'duty-sess-active',
            userId: selectedTaskForRadar.assignedToUserId,
            employeeName: selectedTaskForRadar.assignedToName,
            employeeCode: 'EMP-FLD-01',
            lat: selectedTaskForRadar.assignedToUserId === 'emp-rahul-sharma' ? 28.5800 : (selectedTaskForRadar.targetLat || 28.5800) - 0.015,
            lng: selectedTaskForRadar.assignedToUserId === 'emp-rahul-sharma' ? 77.2500 : (selectedTaskForRadar.targetLng || 77.2500) - 0.012,
            speedKmH: 24,
            batteryLevel: 88,
            status: 'active',
            address: 'Lajpat Nagar Ring Road, New Delhi',
            punchInTime: '09:02 AM',
            activeTask: selectedTaskForRadar.title,
            department: 'Field Operations',
            phone: '+91 98765 43210',
            shiftName: 'General Field Shift',
            totalDutyMinutes: 120
          }}
          employeeUser={users.find(u => u.id === selectedTaskForRadar.assignedToUserId)}
          onClose={() => setSelectedTaskForRadar(null)}
          onDirectPing={(msg) => {
            sendMessage(msg, selectedTaskForRadar.assignedToUserId, selectedTaskForRadar.assignedToName);
            showToast(`Audio/Text Directive dispatched to ${selectedTaskForRadar.assignedToName}'s device!`);
          }}
          onSimulateStepTowardsDestination={(taskId) => {
            if (selectedTaskForRadar.targetLat && selectedTaskForRadar.targetLng) {
              const curLat = selectedTaskForRadar.assignedToUserId === 'emp-rahul-sharma' ? 28.5800 : (selectedTaskForRadar.targetLat - 0.015);
              const curLng = selectedTaskForRadar.assignedToUserId === 'emp-rahul-sharma' ? 77.2500 : (selectedTaskForRadar.targetLng - 0.012);
              const newLat = curLat + (selectedTaskForRadar.targetLat - curLat) * 0.35;
              const newLng = curLng + (selectedTaskForRadar.targetLng - curLng) * 0.35;
              updateTaskEnRouteTelemetry(taskId, newLat, newLng, 26);
              showToast(`Simulated step: ${selectedTaskForRadar.assignedToName} moved closer to destination!`);
            }
          }}
        />
      )}
    </div>
  );
};
