import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Tenant, 
  User, 
  DutySession, 
  AttendanceRecord, 
  FieldTask, 
  FieldVisit, 
  ExpenseRecord, 
  InAppMessage, 
  LeaveRequest, 
  PerformanceWeightConfig, 
  EmployeePerformanceScore, 
  SaaSInvoice, 
  SupportTicket, 
  AuditLog, 
  ConsentRecord,
  RoutePoint
} from '../types';
import { 
  mockTenants, 
  mockUsers, 
  mockDutySessions, 
  mockRoutePoints, 
  mockAttendanceRecords, 
  mockTasks, 
  mockFieldVisits, 
  mockExpenses, 
  mockMessages, 
  mockLeaves, 
  defaultPerformanceWeights, 
  mockPerformanceScores, 
  mockInvoices, 
  mockSupportTickets, 
  mockAuditLogs, 
  mockConsentRecord 
} from '../data/mockData';

export type AppViewMode = 'visualizer' | 'company_admin' | 'employee_pwa' | 'super_admin' | 'architecture' | 'mockups_pdf' | 'coming_soon_poster' | 'auth_portal' | 'map_command_center' | 'product_manual';

interface AppContextType {
  // Navigation & View
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  isMobileDeviceFrame: boolean;
  setIsMobileDeviceFrame: (val: boolean) => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  offlineQueueCount: number;

  // Active Tenant & User
  tenants: Tenant[];
  currentTenant: Tenant;
  setCurrentTenant: (t: Tenant) => void;
  users: User[];
  currentUser: User;
  setCurrentUser: (u: User) => void;
  isLoggedIn: boolean;
  login: (user: User, tenant?: Tenant, targetView?: AppViewMode) => void;
  logout: () => void;
  addEmployee: (empData: Omit<User, 'id' | 'createdAt'>) => boolean;
  removeEmployee: (userId: string) => void;
  updateEmployeeStatus: (userId: string, status: 'active' | 'inactive' | 'suspended') => void;

  // Employee State & Active Duty
  currentDutySession: DutySession | null;
  punchIn: (locationName?: string) => void;
  punchOut: () => void;
  startBreak: (reason: string) => void;
  endBreak: () => void;
  consent: ConsentRecord;
  updateConsent: (consent: Partial<ConsentRecord>) => void;

  // Operational Data
  attendanceRecords: AttendanceRecord[];
  approveAttendanceCorrection: (recordId: string) => void;
  tasks: FieldTask[];
  updateTaskStatus: (taskId: string, status: FieldTask['status'], notes?: string) => void;
  addTask: (task: Omit<FieldTask, 'id' | 'tenantId'>) => void;
  fieldVisits: FieldVisit[];
  checkInVisit: (visitId: string, lat?: number, lng?: number) => void;
  checkOutVisit: (visitId: string, notes?: string, photoUrl?: string) => void;
  expenses: ExpenseRecord[];
  submitExpense: (exp: Omit<ExpenseRecord, 'id' | 'tenantId' | 'status' | 'createdAt'>) => void;
  approveExpense: (expenseId: string, remarks?: string) => void;
  rejectExpense: (expenseId: string, remarks?: string) => void;
  messages: InAppMessage[];
  sendMessage: (content: string, recipientId: string, recipientName: string) => void;
  leaves: LeaveRequest[];
  applyLeave: (leave: Omit<LeaveRequest, 'id' | 'tenantId' | 'status' | 'appliedOn'>) => void;
  approveLeave: (leaveId: string, remarks?: string) => void;
  
  // Performance Engine
  performanceWeights: PerformanceWeightConfig;
  setPerformanceWeights: React.Dispatch<React.SetStateAction<PerformanceWeightConfig>>;
  performanceScores: EmployeePerformanceScore[];

  // SaaS Super Admin
  invoices: SaaSInvoice[];
  supportTickets: SupportTicket[];
  createSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => void;
  updateTicketStatus: (id: string, status: SupportTicket['status']) => void;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, entity: string, id: string, reason?: string, details?: string) => void;
  addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt' | 'activeEmployees'>) => void;
  updateTenantPlan: (tenantId: string, plan: Tenant['plan'], maxEmp: number) => void;
  updateTenantStatus: (tenantId: string, status: Tenant['status']) => void;

  // Active Route Points
  routePoints: RoutePoint[];

  // Banner Notification
  notificationToast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<AppViewMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryView = params.get('view');
      if (queryView === 'map_command_center' || queryView === 'live_map' || queryView === 'map_popout') {
        return 'map_command_center';
      }
      if (queryView && ['visualizer', 'company_admin', 'employee_pwa', 'super_admin', 'architecture', 'mockups_pdf', 'coming_soon_poster', 'auth_portal'].includes(queryView)) {
        return queryView as AppViewMode;
      }
    }
    return 'super_admin';
  });
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isMobileDeviceFrame, setIsMobileDeviceFrame] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Tenants & Users
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [currentTenant, setCurrentTenant] = useState<Tenant>(mockTenants[0]);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]); // Savrdh Technologies Super-Admin by default
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const login = (user: User, tenant?: Tenant, targetView?: AppViewMode) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    if (tenant) {
      setCurrentTenant(tenant);
    } else {
      const userTenant = tenants.find(t => t.id === user.tenantId);
      if (userTenant) setCurrentTenant(userTenant);
    }

    if (targetView) {
      setViewMode(targetView);
    } else {
      if (user.role === 'super_admin') setViewMode('super_admin');
      else if (user.role === 'employee') setViewMode('employee_pwa');
      else setViewMode('company_admin');
    }

    showToast(`✅ Welcome, ${user.fullName}! Logged in as ${user.role.replace('_', ' ')}.`);
  };

  const logout = () => {
    setIsLoggedIn(false);
    // Stop active duty session tracking on logout
    if (currentDutySession && currentDutySession.status === 'active') {
      setCurrentDutySession(null);
    }
    showToast('👋 You have been logged out successfully. Choose a role to log in.');
    setViewMode('auth_portal');
  };

  // Operational State
  const [currentDutySession, setCurrentDutySession] = useState<DutySession | null>(mockDutySessions[0]);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>(mockRoutePoints);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [tasks, setTasks] = useState<FieldTask[]>(mockTasks);
  const [fieldVisits, setFieldVisits] = useState<FieldVisit[]>(mockFieldVisits);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(mockExpenses);
  const [messages, setMessages] = useState<InAppMessage[]>(mockMessages);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(mockLeaves);
  const [performanceWeights, setPerformanceWeights] = useState<PerformanceWeightConfig>(defaultPerformanceWeights);
  const [performanceScores, setPerformanceScores] = useState<EmployeePerformanceScore[]>(mockPerformanceScores);
  const [invoices, setInvoices] = useState<SaaSInvoice[]>(mockInvoices);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [consent, setConsent] = useState<ConsentRecord>(mockConsentRecord);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  const addAuditLog = (action: string, entity: string, id: string, reason?: string, details?: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      tenantId: currentTenant.id,
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action,
      targetEntity: entity,
      targetId: id,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '103.212.14.88',
      reason,
      details: details || `Executed ${action} on ${entity} [${id}]`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Punch In Handler
  const punchIn = (locationName?: string) => {
    if (!consent.locationDutyConsent) {
      showToast('⚠️ Privacy Consent Required: Please grant duty-time GPS access in Privacy settings.');
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newSession: DutySession = {
      id: `duty-${Date.now()}`,
      tenantId: currentTenant.id,
      userId: currentUser.id,
      employeeName: currentUser.fullName,
      shiftName: 'General Field Shift (09:00 AM - 06:00 PM)',
      date: now.toISOString().slice(0, 10),
      punchInTime: timeStr,
      punchInLocation: {
        lat: 28.5355,
        lng: 77.3910,
        address: locationName || 'Sector 18 Field Hub, Noida (GPS Verified)',
        accuracyMeters: 4.2
      },
      status: 'active',
      totalDutyMinutes: 0,
      totalBreakMinutes: 0,
      breaks: [],
      currentLocation: {
        lat: 28.5355,
        lng: 77.3910,
        address: locationName || 'Sector 18 Field Hub, Noida',
        batteryLevel: 94,
        isMockGpsDetected: false,
        lastPingAt: 'Just now'
      },
      isOfflineSync: isOffline
    };

    if (isOffline) {
      setOfflineQueueCount(prev => prev + 1);
      showToast('📴 Offline Mode: Punch-In cached locally. Will auto-sync on connectivity.');
    } else {
      showToast(`✅ Punch-In verified at ${timeStr}. Duty tracking is now active.`);
    }

    setCurrentDutySession(newSession);

    // Update attendance table
    setAttendanceRecords(prev => {
      const existing = prev.find(a => a.userId === currentUser.id);
      if (existing) {
        return prev.map(a => a.userId === currentUser.id ? { ...a, status: 'on_field', punchInTime: timeStr } : a);
      }
      return [
        {
          id: `att-${Date.now()}`,
          tenantId: currentTenant.id,
          userId: currentUser.id,
          employeeName: currentUser.fullName,
          employeeCode: currentUser.employeeCode || 'EMP-100',
          department: currentUser.department || 'Field Ops',
          date: now.toISOString().slice(0, 10),
          shift: 'General Field (09:00 - 18:00)',
          status: 'on_field',
          punchInTime: timeStr,
          workingHours: 0.1,
          overtimeHours: 0,
          lateMinutes: 0,
          approvedStatus: 'approved'
        },
        ...prev
      ];
    });

    addAuditLog('PUNCH_IN_DUTY', 'DutySession', newSession.id, 'Duty session started with employee GPS consent');
  };

  // Punch Out Handler
  const punchOut = () => {
    if (!currentDutySession) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setCurrentDutySession(prev => prev ? {
      ...prev,
      status: 'completed',
      punchOutTime: timeStr,
      punchOutLocation: {
        lat: prev.currentLocation?.lat || 28.5355,
        lng: prev.currentLocation?.lng || 77.3910,
        address: prev.currentLocation?.address || 'Duty Completed Location'
      }
    } : null);

    setAttendanceRecords(prev => prev.map(a => 
      a.userId === currentUser.id ? { ...a, status: 'present', punchOutTime: timeStr, workingHours: 8.2 } : a
    ));

    addAuditLog('PUNCH_OUT_DUTY', 'DutySession', currentDutySession.id, 'Duty ended. Location tracking automatically stopped.');
    showToast(`🛑 Duty Ended at ${timeStr}. Location tracking has automatically stopped for privacy.`);
  };

  // Break handlers
  const startBreak = (reason: string) => {
    if (!currentDutySession) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const breakId = `brk-${Date.now()}`;

    setCurrentDutySession(prev => prev ? {
      ...prev,
      status: 'on_break',
      breaks: [...prev.breaks, { id: breakId, startTime: timeStr, reason }]
    } : null);

    showToast(`⏸️ Break Started: ${reason} at ${timeStr}`);
    addAuditLog('START_BREAK', 'DutySession', currentDutySession.id, reason);
  };

  const endBreak = () => {
    if (!currentDutySession) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setCurrentDutySession(prev => prev ? {
      ...prev,
      status: 'active',
      breaks: prev.breaks.map((b, i) => i === prev.breaks.length - 1 ? { ...b, endTime: timeStr } : b),
      totalBreakMinutes: prev.totalBreakMinutes + 25
    } : null);

    showToast(`▶️ Break Ended at ${timeStr}. Resumed active duty.`);
    addAuditLog('END_BREAK', 'DutySession', currentDutySession.id, 'Resumed active field duty');
  };

  const updateConsent = (newConsent: Partial<ConsentRecord>) => {
    setConsent(prev => ({ ...prev, ...newConsent }));
    addAuditLog('UPDATE_PRIVACY_CONSENT', 'ConsentRecord', currentUser.id, 'Employee updated privacy consent preferences');
    showToast('🔒 Privacy & Permission preferences saved.');
  };

  const approveAttendanceCorrection = (recordId: string) => {
    setAttendanceRecords(prev => prev.map(a => a.id === recordId ? { ...a, approvedStatus: 'regularized', notes: 'Approved by Manager' } : a));
    addAuditLog('APPROVE_ATTENDANCE_CORRECTION', 'AttendanceRecord', recordId, 'Manager approved regularization');
    showToast('Attendance correction approved.');
  };

  const updateTaskStatus = (taskId: string, status: FieldTask['status'], notes?: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? {
      ...t,
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : t.completedAt,
      completionNotes: notes || t.completionNotes
    } : t));
    addAuditLog('UPDATE_TASK_STATUS', 'FieldTask', taskId, `Status changed to ${status}`);
    showToast(`Task status updated to: ${status.replace('_', ' ').toUpperCase()}`);
  };

  const addTask = (taskData: Omit<FieldTask, 'id' | 'tenantId'>) => {
    const newTask: FieldTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      tenantId: currentTenant.id
    };
    setTasks(prev => [newTask, ...prev]);
    addAuditLog('CREATE_TASK', 'FieldTask', newTask.id, `Task assigned to ${taskData.assignedToName}`);
    showToast('New task successfully assigned.');
  };

  const checkInVisit = (visitId: string, lat?: number, lng?: number) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFieldVisits(prev => prev.map(v => v.id === visitId ? {
      ...v,
      status: 'checked_in',
      checkInTime: timeStr,
      checkInLat: lat || 28.6181,
      checkInLng: lng || 77.2184,
      verifiedGpsDistanceMeters: 6.4
    } : v));
    addAuditLog('VISIT_CHECK_IN', 'FieldVisit', visitId, 'GPS timestamp check-in recorded');
    showToast(`📍 Checked in to client visit at ${timeStr}`);
  };

  const checkOutVisit = (visitId: string, notes?: string, photoUrl?: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFieldVisits(prev => prev.map(v => v.id === visitId ? {
      ...v,
      status: 'completed',
      checkOutTime: timeStr,
      checkOutLat: 28.6183,
      checkOutLng: 77.2185,
      notes: notes || v.notes,
      photoProofUrl: photoUrl || v.photoProofUrl
    } : v));
    addAuditLog('VISIT_CHECK_OUT', 'FieldVisit', visitId, 'Visit proof and checkout summary saved');
    showToast(`✅ Client visit completed & proof recorded at ${timeStr}`);
  };

  const submitExpense = (exp: Omit<ExpenseRecord, 'id' | 'tenantId' | 'status' | 'createdAt'>) => {
    const newExp: ExpenseRecord = {
      ...exp,
      id: `exp-${Date.now()}`,
      tenantId: currentTenant.id,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setExpenses(prev => [newExp, ...prev]);
    addAuditLog('SUBMIT_EXPENSE', 'ExpenseRecord', newExp.id, `Claimed ₹${exp.amount} for ${exp.category}`);
    showToast(`🧾 Expense claim for ₹${exp.amount} submitted for approval.`);
  };

  const approveExpense = (expenseId: string, remarks?: string) => {
    setExpenses(prev => prev.map(e => e.id === expenseId ? {
      ...e,
      status: 'approved',
      approvedById: currentUser.id,
      approvalRemarks: remarks || 'Approved by Manager'
    } : e));
    addAuditLog('APPROVE_EXPENSE', 'ExpenseRecord', expenseId, remarks || 'Approved expense claim');
    showToast('Expense claim approved.');
  };

  const rejectExpense = (expenseId: string, remarks?: string) => {
    setExpenses(prev => prev.map(e => e.id === expenseId ? {
      ...e,
      status: 'rejected',
      approvedById: currentUser.id,
      approvalRemarks: remarks || 'Rejected'
    } : e));
    addAuditLog('REJECT_EXPENSE', 'ExpenseRecord', expenseId, remarks || 'Rejected expense claim');
    showToast('Expense claim rejected.');
  };

  const sendMessage = (content: string, recipientId: string, recipientName: string) => {
    const newMsg: InAppMessage = {
      id: `msg-${Date.now()}`,
      tenantId: currentTenant.id,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      recipientId,
      recipientName,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      type: recipientId === 'all_team' ? 'announcement' : 'direct'
    };
    setMessages(prev => [newMsg, ...prev]);
    showToast('Official message dispatched.');
  };

  const applyLeave = (leaveData: Omit<LeaveRequest, 'id' | 'tenantId' | 'status' | 'appliedOn'>) => {
    const newLeave: LeaveRequest = {
      ...leaveData,
      id: `lv-${Date.now()}`,
      tenantId: currentTenant.id,
      status: 'pending',
      appliedOn: new Date().toISOString().slice(0, 10)
    };
    setLeaves(prev => [newLeave, ...prev]);
    addAuditLog('APPLY_LEAVE', 'LeaveRequest', newLeave.id, `${leaveData.totalDays} day(s) ${leaveData.leaveType} leave`);
    showToast('Leave request submitted.');
  };

  const approveLeave = (leaveId: string, remarks?: string) => {
    setLeaves(prev => prev.map(l => l.id === leaveId ? {
      ...l,
      status: 'approved',
      reviewedBy: currentUser.fullName,
      reviewRemarks: remarks || 'Approved by HR'
    } : l));
    addAuditLog('APPROVE_LEAVE', 'LeaveRequest', leaveId, remarks || 'Approved leave');
    showToast('Leave request approved.');
  };

  const createSupportTicket = (ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      ticketNumber: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'open',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    addAuditLog('CREATE_SUPPORT_TICKET', 'SupportTicket', newTicket.id, ticketData.subject);
    showToast(`Support Ticket ${newTicket.ticketNumber} created.`);
  };

  const updateTicketStatus = (id: string, status: SupportTicket['status']) => {
    setSupportTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    showToast(`Support ticket marked as ${status}.`);
  };

  const addTenant = (tenantData: Omit<Tenant, 'id' | 'createdAt' | 'activeEmployees'>) => {
    const newTenant: Tenant = {
      ...tenantData,
      id: `tenant-${tenantData.code.toLowerCase()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      activeEmployees: 1
    };
    setTenants(prev => [...prev, newTenant]);
    addAuditLog('ONBOARD_TENANT', 'Tenant', newTenant.id, `New tenant company onboarded: ${newTenant.name}`);
    showToast(`🏢 Tenant Company "${newTenant.name}" onboarded successfully.`);
  };

  const updateTenantPlan = (tenantId: string, plan: Tenant['plan'], maxEmp: number) => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, plan, maxEmployees: maxEmp } : t));
    addAuditLog('UPDATE_TENANT_PLAN', 'Tenant', tenantId, `Plan updated to ${plan} (${maxEmp} seats)`);
    showToast('Subscription plan upgraded.');
  };

  const updateTenantStatus = (tenantId: string, status: Tenant['status']) => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, status } : t));
    addAuditLog('UPDATE_TENANT_STATUS', 'Tenant', tenantId, `Tenant status set to ${status}`);
    showToast(`Tenant status updated to: ${status}`);
  };

  // Company Employee Management (Add / Remove / Status)
  const addEmployee = (empData: Omit<User, 'id' | 'createdAt'>): boolean => {
    const tenantUsers = users.filter(u => u.tenantId === currentTenant.id && u.status === 'active');
    if (tenantUsers.length >= currentTenant.maxEmployees) {
      showToast(`⚠️ License Seat Limit Reached (${currentTenant.maxEmployees} seats). Please upgrade your plan in SaaS Console.`);
      return false;
    }

    const newEmpId = `emp-${Date.now()}`;
    const newEmployee: User = {
      ...empData,
      id: newEmpId,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    setUsers(prev => [...prev, newEmployee]);

    // Update active employee count on tenant
    setTenants(prev => prev.map(t => t.id === currentTenant.id ? {
      ...t,
      activeEmployees: t.activeEmployees + 1
    } : t));

    setCurrentTenant(prev => ({
      ...prev,
      activeEmployees: prev.activeEmployees + 1
    }));

    addAuditLog('ADD_EMPLOYEE', 'User', newEmpId, `Added employee ${newEmployee.fullName} (${newEmployee.employeeCode || newEmployee.designation})`);
    showToast(`✅ Employee ${newEmployee.fullName} added successfully to ${currentTenant.name}!`);
    return true;
  };

  const removeEmployee = (userId: string) => {
    const empToRemove = users.find(u => u.id === userId);
    if (!empToRemove) return;

    if (empToRemove.role === 'company_owner' || empToRemove.role === 'super_admin') {
      showToast('⚠️ Primary Administrator cannot be deleted.');
      return;
    }

    // Remove user
    setUsers(prev => prev.filter(u => u.id !== userId));

    // Update active employee count on tenant
    setTenants(prev => prev.map(t => t.id === currentTenant.id ? {
      ...t,
      activeEmployees: Math.max(1, t.activeEmployees - 1)
    } : t));

    setCurrentTenant(prev => ({
      ...prev,
      activeEmployees: Math.max(1, prev.activeEmployees - 1)
    }));

    addAuditLog('REMOVE_EMPLOYEE', 'User', userId, `Removed employee ${empToRemove.fullName} (${empToRemove.email})`);
    showToast(`🗑️ Employee ${empToRemove.fullName} removed from ${currentTenant.name}.`);
  };

  const updateEmployeeStatus = (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    const emp = users.find(u => u.id === userId);
    if (!emp) return;

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    addAuditLog('UPDATE_EMPLOYEE_STATUS', 'User', userId, `Employee status changed to ${status}`);
    showToast(`Status of ${emp.fullName} updated to ${status}.`);
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        language,
        setLanguage,
        isMobileDeviceFrame,
        setIsMobileDeviceFrame,
        isOffline,
        setIsOffline,
        offlineQueueCount,
        tenants,
        currentTenant,
        setCurrentTenant,
        users,
        currentUser,
        setCurrentUser,
        isLoggedIn,
        login,
        logout,
        addEmployee,
        removeEmployee,
        updateEmployeeStatus,
        currentDutySession,
        punchIn,
        punchOut,
        startBreak,
        endBreak,
        consent,
        updateConsent,
        attendanceRecords,
        approveAttendanceCorrection,
        tasks,
        updateTaskStatus,
        addTask,
        fieldVisits,
        checkInVisit,
        checkOutVisit,
        expenses,
        submitExpense,
        approveExpense,
        rejectExpense,
        messages,
        sendMessage,
        leaves,
        applyLeave,
        approveLeave,
        performanceWeights,
        setPerformanceWeights,
        performanceScores,
        invoices,
        supportTickets,
        createSupportTicket,
        updateTicketStatus,
        auditLogs,
        addAuditLog,
        addTenant,
        updateTenantPlan,
        updateTenantStatus,
        routePoints,
        notificationToast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
