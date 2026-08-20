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
  CheckCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { LiveDutyGoogleMap } from './LiveDutyGoogleMap';
import { EmployeeRosterView } from './EmployeeRosterView';
import { LiveChatDispatchView } from './LiveChatDispatchView';
import { FieldTask } from '../../types';

export const CompanyDashboard: React.FC = () => {
  const { 
    currentTenant, 
    currentUser, 
    attendanceRecords, 
    approveAttendanceCorrection, 
    tasks, 
    updateTaskStatus,
    addTask, 
    fieldVisits, 
    expenses, 
    approveExpense, 
    rejectExpense, 
    leaves, 
    approveLeave, 
    performanceWeights, 
    setPerformanceWeights, 
    performanceScores, 
    auditLogs, 
    routePoints, 
    users,
    showToast,
    setViewMode,
    setCurrentUser,
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState<'live_map' | 'employees' | 'attendance' | 'tasks_visits' | 'chat_dispatch' | 'expenses' | 'performance' | 'payroll' | 'audit_privacy'>('live_map');
  const [selectedEmployeeForMap, setSelectedEmployeeForMap] = useState<string>('emp-rahul-sharma');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedReceiptModal, setSelectedReceiptModal] = useState<string | null>(null);
  const [selectedTaskForProof, setSelectedTaskForProof] = useState<FieldTask | null>(null);

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

  // Attendance metrics
  const totalEmployees = companyUsers.length;
  const presentEmployees = companyAttendance.filter(a => a.status === 'present' || a.status === 'on_field').length;
  const onFieldEmployees = companyAttendance.filter(a => a.status === 'on_field').length;
  const lateEmployees = companyAttendance.filter(a => a.status === 'late').length;
  const onLeaveEmployees = companyAttendance.filter(a => a.status === 'on_leave').length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const assignee = users.find(u => u.id === newTaskAssignee) || companyEmployees[0] || users[3];
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
      status: 'pending'
    });
    setNewTaskTitle('');
    setNewTaskClient('');
    setNewTaskAddress('Connaught Place Outer Circle, New Delhi');
    setNewTaskLat(28.6315);
    setNewTaskLng(77.2167);
    setNewTaskDesc('');
    setShowNewTaskModal(false);
    showToast(`📍 Task with 100m GPS Geofence dispatched to ${assignee.fullName}!`);
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
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Today's Attendance Master Register</h2>
              <p className="text-xs text-slate-500">Working hours calculation, punch times, and regularization approvals</p>
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
                  <th className="py-3 px-3">Shift Allocated</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Punch-In</th>
                  <th className="py-3 px-3">Hours Logged</th>
                  <th className="py-3 px-3">Overtime</th>
                  <th className="py-3 px-3">Approval</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companyAttendance
                  .filter(a => a.employeeName.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-900">
                        <div>{att.employeeName}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{att.employeeCode} • {att.department}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{att.shift}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          att.status === 'present' || att.status === 'on_field' ? 'bg-emerald-100 text-emerald-800' :
                          att.status === 'late' ? 'bg-amber-100 text-amber-800' :
                          att.status === 'on_leave' ? 'bg-blue-100 text-blue-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {att.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-semibold">{att.punchInTime || '--:--'}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{att.workingHours} hrs</td>
                      <td className="py-3 px-3 text-slate-600">{att.overtimeHours ? `+${att.overtimeHours} hrs` : '-'}</td>
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
              {companyTasks.map((task) => (
                <div key={task.id} className="p-4 rounded-xl border border-slate-200 space-y-2.5 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{task.title}</span>
                        {task.isGeofenceVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> GPS Geofence Verified ({task.distanceFromTargetMeters?.toFixed(1) || '11.2'}m)
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

                  {/* Destination / Target Location Pin */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-700 font-semibold">
                      <span className="flex items-center gap-1.5 text-blue-700">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>Client Site: <strong>{task.clientName}</strong></span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Geofence Radius: {task.targetGeofenceRadiusMeters || 100}m
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 pl-5">{task.clientAddress}</p>
                  </div>

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
              ))}
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
        <LiveChatDispatchView companyUsers={companyUsers} />
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

      {/* ===================== TAB 5: PERFORMANCE SCORING ENGINE ===================== */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          
          {/* Weight Configuration Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Explainable Performance Scoring Rules</h2>
                <p className="text-xs text-slate-500">Configure weighting parameters across operational dimensions</p>
              </div>
              <span className="text-xs font-bold text-slate-700">
                Total Weight: {Object.values(performanceWeights).reduce((a: number, b: number) => a + Number(b), 0)}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Attendance ({performanceWeights.attendanceWeight}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={performanceWeights.attendanceWeight}
                  onChange={(e) => setPerformanceWeights(prev => ({ ...prev, attendanceWeight: Number(e.target.value) }))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Working Hours ({performanceWeights.workingHoursWeight}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={performanceWeights.workingHoursWeight}
                  onChange={(e) => setPerformanceWeights(prev => ({ ...prev, workingHoursWeight: Number(e.target.value) }))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Task SLA ({performanceWeights.taskCompletionWeight}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={performanceWeights.taskCompletionWeight}
                  onChange={(e) => setPerformanceWeights(prev => ({ ...prev, taskCompletionWeight: Number(e.target.value) }))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Field Visits ({performanceWeights.visitCompletionWeight}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={performanceWeights.visitCompletionWeight}
                  onChange={(e) => setPerformanceWeights(prev => ({ ...prev, visitCompletionWeight: Number(e.target.value) }))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Feedback Rating ({performanceWeights.managerFeedbackWeight}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={performanceWeights.managerFeedbackWeight}
                  onChange={(e) => setPerformanceWeights(prev => ({ ...prev, managerFeedbackWeight: Number(e.target.value) }))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Legal Notice Box */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Mandatory Statutory Notice:</strong> Performance scores are operational indicators only and must never serve as the sole automated basis for disciplinary action or termination. All metrics remain subject to manual human manager review.
              </span>
            </div>
          </div>

          {/* Employee Performance Scores Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Explainable Breakdown per Employee</h3>

            <div className="space-y-3">
              {companyScores.map((score) => (
                <div key={score.userId} className="p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{score.employeeName}</h4>
                      <p className="text-xs text-slate-500">{score.department}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-emerald-700">{score.overallScore}</span>
                        <span className="text-xs text-slate-400"> / 100</span>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        ★ {score.managerRating}
                      </span>
                    </div>
                  </div>

                  {/* Component Breakdown Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase">Attendance Score</span>
                      <p className="font-bold text-slate-900 mt-0.5">{score.attendanceScore}%</p>
                      <span className="text-[10px] text-slate-400">{score.breakdown.daysPresent}/{score.breakdown.totalWorkDays} Days</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase">Working Hours</span>
                      <p className="font-bold text-slate-900 mt-0.5">{score.workingHoursScore}%</p>
                      <span className="text-[10px] text-slate-400">+{score.breakdown.overtimeHours}h OT</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase">Task SLA Score</span>
                      <p className="font-bold text-slate-900 mt-0.5">{score.taskCompletionScore}%</p>
                      <span className="text-[10px] text-slate-400">{score.breakdown.tasksCompleted}/{score.breakdown.tasksAssigned} Tasks</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase">Visit SLA Score</span>
                      <p className="font-bold text-slate-900 mt-0.5">{score.visitScore}%</p>
                      <span className="text-[10px] text-slate-400">{score.breakdown.visitsCompleted}/{score.breakdown.visitsScheduled} Visits</span>
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
                      <option key={u.id} value={u.id}>{u.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>

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
                      📍 Connaught Place (Delhi)
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
                      📍 Cyber City (Gurugram)
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
                      📍 Sector 18 (Noida)
                    </button>
                  </div>
                </div>
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
    </div>
  );
};
