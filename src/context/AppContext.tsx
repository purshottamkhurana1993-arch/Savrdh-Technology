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
  RoutePoint,
  ShiftPolicyConfig
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
  defaultShiftPolicy,
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

  // Shift Policy & Working Hours Config
  shiftPolicy: ShiftPolicyConfig;
  updateShiftPolicy: (policy: Partial<ShiftPolicyConfig>) => void;

  // Employee State & Active Duty
  currentDutySession: DutySession | null;
  punchIn: (locationName?: string, coords?: { lat: number; lng: number }) => void;
  punchOut: (options?: { isEarlyExit?: boolean; earlyExitReason?: string; force?: boolean }) => void;
  startBreak: (reason: string) => void;
  endBreak: () => void;
  consent: ConsentRecord;
  updateConsent: (consent: Partial<ConsentRecord>) => void;

  // Operational Data
  attendanceRecords: AttendanceRecord[];
  approveAttendanceCorrection: (recordId: string) => void;
  tasks: FieldTask[];
  updateTaskStatus: (taskId: string, status: FieldTask['status'], notes?: string) => void;
  startTaskTrip: (taskId: string) => void;
  updateTaskEnRouteTelemetry: (taskId: string, currentLat: number, currentLng: number, speedKmH: number) => void;
  completeTaskWithGpsProof: (taskId: string, proofData: {
    checkInLat: number;
    checkInLng: number;
    checkInAddress: string;
    distanceFromTargetMeters: number;
    photoProofUrl?: string;
    completionNotes?: string;
    clientSignatoryName?: string;
  }) => void;
  addTask: (task: Omit<FieldTask, 'id' | 'tenantId'>) => void;
  fieldVisits: FieldVisit[];
  checkInVisit: (visitId: string, lat?: number, lng?: number) => void;
  checkOutVisit: (visitId: string, notes?: string, photoUrl?: string) => void;
  expenses: ExpenseRecord[];
  submitExpense: (exp: Omit<ExpenseRecord, 'id' | 'tenantId' | 'status' | 'createdAt'>) => void;
  approveExpense: (expenseId: string, remarks?: string) => void;
  rejectExpense: (expenseId: string, remarks?: string) => void;
  messages: InAppMessage[];
  sendMessage: (
    content: string, 
    recipientId: string, 
    recipientName: string,
    options?: {
      type?: InAppMessage['type'];
      locationData?: InAppMessage['locationData'];
    }
  ) => void;
  sendLocationMessage: (recipientId?: string, recipientName?: string, customNote?: string) => void;
  leaves: LeaveRequest[];
  applyLeave: (leave: Omit<LeaveRequest, 'id' | 'tenantId' | 'status' | 'appliedOn'>) => void;
  approveLeave: (leaveId: string, remarks?: string) => void;
  rejectLeave: (leaveId: string, remarks?: string) => void;
  
  // Free Trial Sandbox & Demo Onboarding
  showFreeTrialModal: boolean;
  setShowFreeTrialModal: (val: boolean) => void;
  startCompanyTrial: (trialData: {
    companyName: string;
    ownerName: string;
    email: string;
    phone: string;
    industry: string;
    maxEmployees: number;
    prefillSampleData: boolean;
  }) => void;
  registerCompany: (data: {
    companyName: string;
    ownerName: string;
    email: string;
    phone: string;
    industry: string;
    plan?: Tenant['plan'];
    maxEmployees?: number;
    password?: string;
  }) => { tenant: Tenant; owner: User };
  resetToCleanProductionState: () => void;

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

  // LocalStorage Persistence Helpers
  const STORAGE_PREFIX = 'fieldsure_v2_';

  function getStored<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function setStored<T>(key: string, value: T) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }

  // Tenants & Users
  const [tenants, setTenants] = useState<Tenant[]>(() => getStored<Tenant[]>('tenants', mockTenants));
  const [currentTenant, setCurrentTenant] = useState<Tenant>(() => getStored<Tenant>('current_tenant', mockTenants[0]));
  const [users, setUsers] = useState<User[]>(() => getStored<User[]>('users', mockUsers));
  const [currentUser, setCurrentUser] = useState<User>(() => getStored<User>('current_user', mockUsers[0])); // Savrdh Technologies Super-Admin by default
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Sync core collections to LocalStorage
  useEffect(() => { setStored('tenants', tenants); }, [tenants]);
  useEffect(() => { setStored('users', users); }, [users]);
  useEffect(() => { setStored('current_tenant', currentTenant); }, [currentTenant]);
  useEffect(() => { setStored('current_user', currentUser); }, [currentUser]);

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
  const [shiftPolicy, setShiftPolicy] = useState<ShiftPolicyConfig>(() => getStored<ShiftPolicyConfig>('shift_policy', defaultShiftPolicy));
  const [currentDutySession, setCurrentDutySession] = useState<DutySession | null>(() => getStored<DutySession | null>('current_duty_session', mockDutySessions[0] || null));
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>(() => getStored<RoutePoint[]>('route_points', mockRoutePoints));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => getStored<AttendanceRecord[]>('attendance', mockAttendanceRecords));
  const [tasks, setTasks] = useState<FieldTask[]>(() => getStored<FieldTask[]>('tasks', mockTasks));
  const [fieldVisits, setFieldVisits] = useState<FieldVisit[]>(() => getStored<FieldVisit[]>('field_visits', mockFieldVisits));
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => getStored<ExpenseRecord[]>('expenses', mockExpenses));
  const [messages, setMessages] = useState<InAppMessage[]>(() => getStored<InAppMessage[]>('messages', mockMessages));
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => getStored<LeaveRequest[]>('leaves', mockLeaves));
  const [performanceWeights, setPerformanceWeights] = useState<PerformanceWeightConfig>(() => getStored<PerformanceWeightConfig>('perf_weights', defaultPerformanceWeights));
  const [performanceScores, setPerformanceScores] = useState<EmployeePerformanceScore[]>(() => getStored<EmployeePerformanceScore[]>('scores', mockPerformanceScores));
  const [invoices, setInvoices] = useState<SaaSInvoice[]>(() => getStored<SaaSInvoice[]>('invoices', mockInvoices));
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => getStored<SupportTicket[]>('tickets', mockSupportTickets));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getStored<AuditLog[]>('audit_logs', mockAuditLogs));
  const [consent, setConsent] = useState<ConsentRecord>(() => getStored<ConsentRecord>('consent', mockConsentRecord));

  // Sync operational data to LocalStorage
  useEffect(() => { setStored('shift_policy', shiftPolicy); }, [shiftPolicy]);
  useEffect(() => { setStored('perf_weights', performanceWeights); }, [performanceWeights]);
  useEffect(() => { setStored('current_duty_session', currentDutySession); }, [currentDutySession]);
  useEffect(() => { setStored('route_points', routePoints); }, [routePoints]);
  useEffect(() => { setStored('attendance', attendanceRecords); }, [attendanceRecords]);
  useEffect(() => { setStored('tasks', tasks); }, [tasks]);
  useEffect(() => { setStored('field_visits', fieldVisits); }, [fieldVisits]);
  useEffect(() => { setStored('expenses', expenses); }, [expenses]);
  useEffect(() => { setStored('messages', messages); }, [messages]);
  useEffect(() => { setStored('leaves', leaves); }, [leaves]);
  useEffect(() => { setStored('scores', performanceScores); }, [performanceScores]);
  useEffect(() => { setStored('invoices', invoices); }, [invoices]);
  useEffect(() => { setStored('tickets', supportTickets); }, [supportTickets]);
  useEffect(() => { setStored('audit_logs', auditLogs); }, [auditLogs]);
  useEffect(() => { setStored('consent', consent); }, [consent]);

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

  // ==========================================
  // DYNAMIC PERFORMANCE CALCULATION ENGINE
  // Automatically recalculates scores based on:
  // 1. Admin Task Assignment & Verified GPS Completion (40%)
  // 2. Shift Working Hours & Early Exit Discipline (25%)
  // 3. Break & Idle Time Limits vs Overtime (20%)
  // 4. GPS Tracking Continuity & Accuracy (15%)
  // ==========================================
  const calculateScores = (
    currentUsersList: User[] = users,
    currentTaskList: FieldTask[] = tasks,
    currentAttendanceList: AttendanceRecord[] = attendanceRecords,
    currentDuty: DutySession | null = currentDutySession,
    policy: ShiftPolicyConfig = shiftPolicy,
    weights: PerformanceWeightConfig = performanceWeights
  ): EmployeePerformanceScore[] => {
    const empUsers = currentUsersList.filter(u => u.role === 'employee');
    
    return empUsers.map(emp => {
      // 1. Task calculations for this employee
      const empTasks = currentTaskList.filter(t => t.assignedToUserId === emp.id || (!t.assignedToUserId && t.tenantId === emp.tenantId));
      const totalTasksAssigned = empTasks.length;
      const completedTasks = empTasks.filter(t => t.status === 'completed');
      const totalTasksCompleted = completedTasks.length;
      const geofenceVerifiedTasks = completedTasks.filter(t => t.isGeofenceVerified).length;

      let taskCompletionScore = 100;
      if (totalTasksAssigned > 0) {
        const completionRate = (totalTasksCompleted / totalTasksAssigned) * 100;
        const geofenceRate = totalTasksCompleted > 0 ? (geofenceVerifiedTasks / totalTasksCompleted) * 100 : 100;
        taskCompletionScore = Math.round((completionRate * 0.75) + (geofenceRate * 0.25));
      }

      // 2. Attendance & Shift Working Hours Adherence
      const empAtt = currentAttendanceList.find(a => a.userId === emp.id || a.employeeCode === emp.employeeCode);
      const minRequired = policy.minWorkHoursRequired || 8.0;
      let workingHours = empAtt?.workingHours || 0;
      const isCurrentlyActive = currentDuty && currentDuty.userId === emp.id && (currentDuty.status === 'active' || currentDuty.status === 'on_break');
      
      if (isCurrentlyActive && workingHours < 4) {
        workingHours = 5.2; // active field duty ongoing
      }

      let shiftAdherenceScore = 100;
      const isEarlyExit = empAtt?.notes?.includes('Early Punch-Out') || (currentDuty?.userId === emp.id && currentDuty?.isEarlyExit);

      if (workingHours < minRequired && !isCurrentlyActive) {
        const ratio = Math.min(1, workingHours / minRequired);
        shiftAdherenceScore = Math.round(ratio * 100);
        if (isEarlyExit) {
          shiftAdherenceScore = Math.max(35, shiftAdherenceScore - 20); // Penalty for unauthorized early checkout
        }
      } else if (empAtt?.status === 'late') {
        shiftAdherenceScore = 80;
      }

      // 3. Break & Idle Time Discipline Score
      let breakMinutes = 0;
      if (currentDuty && currentDuty.userId === emp.id) {
        breakMinutes = currentDuty.totalBreakMinutes || (currentDuty.breaks.length * 20);
      } else if (empAtt?.status === 'on_break') {
        breakMinutes = 30;
      }

      const maxAllowedBreak = policy.maxAllowedBreakMinutes || 45;
      let excessivePenalty = 0;
      let breakDisciplineScore = 100;
      if (breakMinutes > maxAllowedBreak) {
        excessivePenalty = (breakMinutes - maxAllowedBreak) * 2;
        breakDisciplineScore = Math.max(0, 100 - excessivePenalty);
      }

      // 4. GPS Accuracy & Tracking Score
      let gpsAccuracyScore = 98;
      if (totalTasksCompleted > 0 && geofenceVerifiedTasks < totalTasksCompleted) {
        gpsAccuracyScore = Math.round(75 + (geofenceVerifiedTasks / totalTasksCompleted) * 25);
      }

      // Weighted Composite Score
      const tWeight = weights.taskCompletionWeight ?? 40;
      const sWeight = weights.shiftAdherenceWeight ?? 25;
      const bWeight = weights.breakDisciplineWeight ?? 20;
      const gWeight = weights.gpsAccuracyWeight ?? 15;
      const totalWeightSum = (tWeight + sWeight + bWeight + gWeight) || 100;

      const rawOverall = Math.round(
        (taskCompletionScore * tWeight +
         shiftAdherenceScore * sWeight +
         breakDisciplineScore * bWeight +
         gpsAccuracyScore * gWeight) / totalWeightSum
      );
      const overallScore = Math.min(100, Math.max(0, rawOverall));

      let statusBadge: EmployeePerformanceScore['statusBadge'] = 'Good Standing';
      if (overallScore >= 88) statusBadge = 'Elite Performer';
      else if (overallScore >= 70) statusBadge = 'Good Standing';
      else if (overallScore >= 50) statusBadge = 'Needs Attention';
      else statusBadge = 'Critical Flag';

      return {
        tenantId: emp.tenantId,
        userId: emp.id,
        employeeName: emp.fullName,
        department: emp.department || 'Field Operations',
        overallScore,
        attendanceScore: shiftAdherenceScore,
        workingHoursScore: Math.min(100, Math.round((workingHours / minRequired) * 100)),
        taskCompletionScore,
        breakDisciplineScore,
        shiftAdherenceScore,
        gpsAccuracyScore,
        managerRating: overallScore >= 90 ? 5 : overallScore >= 75 ? 4 : overallScore >= 60 ? 3 : 2,
        calculatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        trend: overallScore >= 75 ? 'up' : overallScore >= 55 ? 'stable' : 'down',
        statusBadge,
        breakdown: {
          totalWorkDays: 22,
          daysPresent: 21,
          tasksAssigned: totalTasksAssigned,
          tasksCompleted: totalTasksCompleted,
          tasksGeofenceVerified: geofenceVerifiedTasks,
          visitsScheduled: 5,
          visitsCompleted: 5,
          overtimeHours: Math.max(0, Number((workingHours - minRequired).toFixed(1))),
          breakMinutesTaken: breakMinutes,
          breakMinutesAllowed: maxAllowedBreak,
          excessiveBreakPenalty: excessivePenalty,
          workingHoursActual: Number(workingHours.toFixed(1)),
          workingHoursRequired: minRequired,
          earlyExitsCount: isEarlyExit ? 1 : 0
        }
      };
    });
  };

  // Recompute scores on key lifecycle events
  useEffect(() => {
    const updated = calculateScores(users, tasks, attendanceRecords, currentDutySession, shiftPolicy, performanceWeights);
    setPerformanceScores(updated);
  }, [tasks, attendanceRecords, currentDutySession, shiftPolicy, performanceWeights]);

  const updateShiftPolicy = (newPolicy: Partial<ShiftPolicyConfig>) => {
    setShiftPolicy(prev => {
      const updated = { ...prev, ...newPolicy };
      addAuditLog('UPDATE_SHIFT_POLICY', 'ShiftPolicyConfig', currentTenant.id, `Shift timings: ${updated.shiftStartTime} - ${updated.shiftEndTime}, Min Work: ${updated.minWorkHoursRequired}h, Max Break: ${updated.maxAllowedBreakMinutes}m`);
      showToast('⚙️ Company Shift Timings & Working Hours Policy updated.');
      return updated;
    });
  };

  // Punch In Handler with GPS verification & Shift details
  const punchIn = (locationName?: string, coords?: { lat: number; lng: number }) => {
    if (!consent.locationDutyConsent) {
      showToast('⚠️ Privacy Consent Required: Please grant duty-time GPS access in Privacy settings.');
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const lat = coords?.lat || 28.5355 + (Math.random() * 0.002 - 0.001);
    const lng = coords?.lng || 77.3910 + (Math.random() * 0.002 - 0.001);
    const address = locationName || 'Sector 18 Field Hub, Noida (GPS Verified)';

    const newSession: DutySession = {
      id: `duty-${Date.now()}`,
      tenantId: currentTenant.id,
      userId: currentUser.id,
      employeeName: currentUser.fullName,
      shiftName: `${shiftPolicy.shiftName} (${shiftPolicy.shiftStartTime} - ${shiftPolicy.shiftEndTime})`,
      date: now.toISOString().slice(0, 10),
      punchInTime: timeStr,
      punchInLocation: {
        lat,
        lng,
        address,
        accuracyMeters: 3.8
      },
      status: 'active',
      totalDutyMinutes: 0,
      totalBreakMinutes: 0,
      breaks: [],
      currentLocation: {
        lat,
        lng,
        address,
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
      showToast(`✅ Punch-In verified at ${timeStr}. Shift Policy: ${shiftPolicy.shiftStartTime} - ${shiftPolicy.shiftEndTime} (Min ${shiftPolicy.minWorkHoursRequired}h).`);
    }

    setCurrentDutySession(newSession);

    // Update attendance table
    setAttendanceRecords(prev => {
      const existing = prev.find(a => a.userId === currentUser.id);
      if (existing) {
        return prev.map(a => a.userId === currentUser.id ? { 
          ...a, 
          status: 'on_field', 
          punchInTime: timeStr,
          shift: `${shiftPolicy.shiftName} (${shiftPolicy.shiftStartTime} - ${shiftPolicy.shiftEndTime})`
        } : a);
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
          shift: `${shiftPolicy.shiftName} (${shiftPolicy.shiftStartTime} - ${shiftPolicy.shiftEndTime})`,
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

    addAuditLog('PUNCH_IN_DUTY', 'DutySession', newSession.id, `Duty started at ${timeStr} with GPS verified (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
  };

  // Punch Out Handler with Early Exit check & reason logging
  const punchOut = (options?: { isEarlyExit?: boolean; earlyExitReason?: string; force?: boolean }) => {
    if (!currentDutySession) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isEarly = options?.isEarlyExit || false;
    const reason = options?.earlyExitReason || '';

    const completedSession: DutySession = {
      ...currentDutySession,
      status: 'completed',
      punchOutTime: timeStr,
      isEarlyExit: isEarly,
      earlyExitReason: reason || undefined,
      punchOutLocation: {
        lat: currentDutySession.currentLocation?.lat || 28.5355,
        lng: currentDutySession.currentLocation?.lng || 77.3910,
        address: currentDutySession.currentLocation?.address || 'Duty Completed Location'
      }
    };

    setCurrentDutySession(completedSession);

    const calculatedHours = isEarly ? 4.5 : shiftPolicy.minWorkHoursRequired || 8.0;

    setAttendanceRecords(prev => prev.map(a => 
      a.userId === currentUser.id ? { 
        ...a, 
        status: 'present', 
        punchOutTime: timeStr, 
        workingHours: calculatedHours,
        notes: isEarly ? `Early Punch-Out: ${reason}` : 'Full Shift Completed'
      } : a
    ));

    if (isEarly) {
      addAuditLog('EARLY_PUNCH_OUT_DUTY', 'DutySession', currentDutySession.id, `Early exit before shift completion logged by ${currentUser.fullName}. Reason: ${reason}`);
      showToast(`⚠️ Early Punch-Out Recorded: "${reason}". Flagged for Admin Review.`);
    } else {
      addAuditLog('PUNCH_OUT_DUTY', 'DutySession', currentDutySession.id, 'Shift working hours completed. Location tracking stopped.');
      showToast(`🛑 Duty Completed at ${timeStr}. Full shift logged successfully.`);
    }
  };

  // Break handlers with duration calculation & excessive break alerts
  const startBreak = (reason: string) => {
    if (!currentDutySession) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const breakId = `brk-${Date.now()}`;

    setCurrentDutySession(prev => prev ? {
      ...prev,
      status: 'on_break',
      breaks: [...prev.breaks, { id: breakId, startTime: timeStr, reason, durationMinutes: 0 }]
    } : null);

    setAttendanceRecords(prev => prev.map(a => 
      a.userId === currentUser.id ? {
        ...a,
        status: 'on_break',
        currentBreakReason: reason,
        breakStartTime: timeStr
      } : a
    ));

    showToast(`⏸️ Break Started: ${reason} at ${timeStr} (Max Allowed: ${shiftPolicy.maxAllowedBreakMinutes} mins)`);
    addAuditLog('START_BREAK', 'DutySession', currentDutySession.id, `${currentUser.fullName} started break: ${reason}`);
  };

  const endBreak = () => {
    if (!currentDutySession) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const breakDuration = 20; // 20 min standard increment for test/session

    const newTotalBreaks = (currentDutySession.totalBreakMinutes || 0) + breakDuration;

    setCurrentDutySession(prev => prev ? {
      ...prev,
      status: 'active',
      breaks: prev.breaks.map((b, i) => i === prev.breaks.length - 1 ? { ...b, endTime: timeStr, durationMinutes: breakDuration } : b),
      totalBreakMinutes: newTotalBreaks
    } : null);

    setAttendanceRecords(prev => prev.map(a => 
      a.userId === currentUser.id ? {
        ...a,
        status: 'on_field',
        currentBreakReason: undefined,
        breakStartTime: undefined
      } : a
    ));

    if (newTotalBreaks > shiftPolicy.maxAllowedBreakMinutes) {
      showToast(`⚠️ Break Ended. Note: Total break (${newTotalBreaks}m) exceeds allowed limit (${shiftPolicy.maxAllowedBreakMinutes}m).`);
    } else {
      showToast(`▶️ Break Ended at ${timeStr}. Resumed active duty (${newTotalBreaks}m / ${shiftPolicy.maxAllowedBreakMinutes}m used).`);
    }

    addAuditLog('END_BREAK', 'DutySession', currentDutySession.id, `${currentUser.fullName} resumed active field duty. Total break today: ${newTotalBreaks} mins`);
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

  const startTaskTrip = (taskId: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'in_progress',
          tripStartedAt: timeStr,
          lastHeadingStatus: 'approaching'
        };
      }
      return t;
    }));
    addAuditLog('START_TASK_TRIP', 'FieldTask', taskId, `Employee started en-route trip navigation towards destination`);
    showToast('🚀 Task Trip Started! Live destination telemetry is now broadcasting.');
  };

  const updateTaskEnRouteTelemetry = (taskId: string, currentLat: number, currentLng: number, speedKmH: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && t.targetLat && t.targetLng) {
        // Calculate distance using simple calculation
        const R = 6371e3;
        const φ1 = (currentLat * Math.PI) / 180;
        const φ2 = (t.targetLat * Math.PI) / 180;
        const Δφ = ((t.targetLat - currentLat) * Math.PI) / 180;
        const Δλ = ((t.targetLng - currentLng) * Math.PI) / 180;
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const dist = R * c;
        const eta = Math.max(1, Math.round(dist / (((Math.max(10, speedKmH) * 1000) / 3600) * 60)));
        const heading = dist <= (t.targetGeofenceRadiusMeters || 100) ? 'arrived' : speedKmH < 3 ? 'stationary' : 'approaching';

        return {
          ...t,
          lastKnownDistanceMeters: Math.round(dist),
          lastKnownEtaMinutes: eta,
          lastHeadingStatus: heading
        };
      }
      return t;
    }));
  };

  const completeTaskWithGpsProof = (
    taskId: string, 
    proofDataOrLat: any,
    maybeLng?: number,
    maybeAddress?: string,
    maybeNotes?: string,
    maybePhotoUrl?: string
  ) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = new Date().toISOString();
    
    // Support both object payload and positional arguments safely
    let checkInLat = 28.49008;
    let checkInLng = 77.08506;
    let checkInAddress = 'Client Site';
    let distanceFromTargetMeters = 11.2;
    let completionNotes = 'Task completed at field site with verified GPS check-in.';
    let photoProofUrl: string | undefined = undefined;
    let clientSignatoryName: string | undefined = undefined;

    if (typeof proofDataOrLat === 'object' && proofDataOrLat !== null) {
      checkInLat = typeof proofDataOrLat.checkInLat === 'number' ? proofDataOrLat.checkInLat : checkInLat;
      checkInLng = typeof proofDataOrLat.checkInLng === 'number' ? proofDataOrLat.checkInLng : checkInLng;
      checkInAddress = proofDataOrLat.checkInAddress || checkInAddress;
      distanceFromTargetMeters = typeof proofDataOrLat.distanceFromTargetMeters === 'number' ? proofDataOrLat.distanceFromTargetMeters : 11.2;
      completionNotes = proofDataOrLat.completionNotes || completionNotes;
      photoProofUrl = proofDataOrLat.photoProofUrl;
      clientSignatoryName = proofDataOrLat.clientSignatoryName;
    } else if (typeof proofDataOrLat === 'number') {
      checkInLat = proofDataOrLat;
      checkInLng = typeof maybeLng === 'number' ? maybeLng : checkInLng;
      checkInAddress = maybeAddress || checkInAddress;
      completionNotes = maybeNotes || completionNotes;
      photoProofUrl = maybePhotoUrl;
      distanceFromTargetMeters = 11.2;
    }
    
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const radius = t.targetGeofenceRadiusMeters || 100;
        return {
          ...t,
          status: 'completed',
          checkInTime: timeStr,
          checkInLat,
          checkInLng,
          checkInAddress: checkInAddress || t.clientAddress,
          distanceFromTargetMeters,
          isGeofenceVerified: distanceFromTargetMeters <= radius,
          verificationGpsAccuracy: 2.8,
          batteryAtCheckIn: 82,
          completedAt: nowIso,
          completionNotes: completionNotes || t.completionNotes || 'Task completed at field site with verified GPS check-in.',
          proofImageUrl: photoProofUrl || t.proofImageUrl,
          clientSignatoryName: clientSignatoryName || t.clientSignatoryName
        };
      }
      return t;
    }));

    addAuditLog('COMPLETED_TASK_GEOFENCE_VERIFIED', 'FieldTask', taskId, `GPS verified at ${distanceFromTargetMeters.toFixed(1)}m from site pin`);
    showToast(`✅ Task GPS Check-In Verified (${distanceFromTargetMeters.toFixed(1)}m from site). Marked Completed!`);
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

  const sendMessage = (
    content: string, 
    recipientId: string, 
    recipientName: string,
    options?: {
      type?: InAppMessage['type'];
      locationData?: InAppMessage['locationData'];
    }
  ) => {
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
      type: options?.type || (recipientId === 'all_team' ? 'announcement' : 'direct'),
      locationData: options?.locationData
    };
    setMessages(prev => [newMsg, ...prev]);
    showToast('Official message dispatched.');
  };

  const sendLocationMessage = (
    recipientId: string = 'all_team', 
    recipientName: string = 'Operations Team', 
    customNote?: string
  ) => {
    const lat = currentDutySession?.currentLat || 28.49008 + (Math.random() * 0.003 - 0.0015);
    const lng = currentDutySession?.currentLng || 77.08506 + (Math.random() * 0.003 - 0.0015);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Determine realistic address based on employee duty location
    const addresses = [
      'DLF Cyber City, Building 10-A, DLF Phase 2, Gurugram, Haryana',
      'Cyber Hub Plaza, Sector 24, DLF Phase 2, Gurugram',
      'DLF Horizon Center, Golf Course Road, Sector 43, Gurugram',
      'Connaught Place Inner Circle, Radial Road 3, New Delhi',
      'Udyog Vihar Phase IV, Sector 18, Gurugram, Haryana'
    ];
    const address = currentDutySession?.lastKnownAddress || addresses[Math.floor(Math.random() * addresses.length)];
    const battery = currentDutySession?.batteryLevel || Math.floor(78 + Math.random() * 18);

    const locationMsg: InAppMessage = {
      id: `msg-loc-${Date.now()}`,
      tenantId: currentTenant.id,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      recipientId,
      recipientName,
      content: customNote || `📍 Live GPS Location: ${address}`,
      timestamp: timeStr,
      isRead: false,
      type: 'location_share',
      locationData: {
        lat,
        lng,
        address,
        accuracyMeters: 2.5,
        batteryLevel: battery,
        capturedAt: timeStr,
        speedKmph: 0
      }
    };

    setMessages(prev => [locationMsg, ...prev]);

    // Also update duty session telemetry & add real-time route point
    if (currentDutySession) {
      setCurrentDutySession(prev => prev ? {
        ...prev,
        currentLat: lat,
        currentLng: lng,
        lastKnownAddress: address,
        batteryLevel: battery
      } : null);

      setRoutePoints(prev => [
        ...prev,
        {
          id: `rpt-${Date.now()}`,
          sessionId: currentDutySession.id,
          lat,
          lng,
          speedKmph: 0,
          batteryLevel: battery,
          timestamp: timeStr,
          address
        }
      ]);
    }

    addAuditLog('LOCATION_SHARE', 'InAppMessage', locationMsg.id, `${currentUser.fullName} broadcasted live GPS coordinates (${lat.toFixed(5)}, ${lng.toFixed(5)}) to ${recipientName}`);
    showToast(`📍 Live GPS coordinates successfully transmitted to ${recipientName}!`);
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
    addAuditLog('APPLY_LEAVE', 'LeaveRequest', newLeave.id, `${leaveData.employeeName} applied for ${leaveData.totalDays} day(s) ${leaveData.leaveType} leave (${leaveData.startDate} to ${leaveData.endDate})`);
    showToast(`📝 Leave request (${leaveData.totalDays}d ${leaveData.leaveType}) submitted for Manager / Admin approval.`);
  };

  const approveLeave = (leaveId: string, remarks?: string) => {
    let targetLeave: LeaveRequest | undefined;
    setLeaves(prev => prev.map(l => {
      if (l.id === leaveId) {
        targetLeave = l;
        return {
          ...l,
          status: 'approved',
          reviewedBy: currentUser.fullName,
          reviewRemarks: remarks || 'Approved by HR & Admin'
        };
      }
      return l;
    }));

    if (targetLeave) {
      // Also update employee attendance status to 'on_leave'
      const empId = targetLeave.userId;
      setAttendanceRecords(prev => prev.map(a => 
        a.userId === empId ? { ...a, status: 'on_leave', notes: `Leave Approved: ${targetLeave?.leaveType} (${remarks || 'Approved by Admin'})` } : a
      ));
    }

    addAuditLog('APPROVE_LEAVE', 'LeaveRequest', leaveId, remarks || 'Approved leave request by Admin');
    showToast(`✅ Leave request approved successfully.`);
  };

  const rejectLeave = (leaveId: string, remarks?: string) => {
    setLeaves(prev => prev.map(l => l.id === leaveId ? {
      ...l,
      status: 'rejected',
      reviewedBy: currentUser.fullName,
      reviewRemarks: remarks || 'Leave request declined'
    } : l));
    addAuditLog('REJECT_LEAVE', 'LeaveRequest', leaveId, remarks || 'Rejected leave application');
    showToast(`❌ Leave application declined.`);
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

  const [showFreeTrialModal, setShowFreeTrialModal] = useState<boolean>(false);

  const startCompanyTrial = (trialData: {
    companyName: string;
    ownerName: string;
    email: string;
    phone: string;
    industry: string;
    maxEmployees: number;
    prefillSampleData: boolean;
  }) => {
    const rawCode = trialData.companyName.replace(/[^a-zA-Z]/g, '').slice(0, 6).toUpperCase();
    const code = rawCode || 'TRIAL';
    const trialTenantId = `tenant-${code.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 14);

    const newTenant: Tenant = {
      id: trialTenantId,
      name: trialData.companyName,
      code,
      contactEmail: trialData.email,
      contactPhone: trialData.phone,
      plan: 'Growth',
      status: 'trial',
      trialEndsAt: expiryDate.toISOString().slice(0, 10),
      maxEmployees: trialData.maxEmployees || 25,
      activeEmployees: trialData.prefillSampleData ? 3 : 1,
      billingAddress: `Sector 62, Corporate Park (${trialData.industry})`,
      createdAt: new Date().toISOString().slice(0, 10),
      retentionDaysGps: 90,
      retentionDaysAudit: 365,
      features: {
        liveTracking: true,
        geofencing: true,
        expenseManagement: true,
        performanceScoring: true,
        payrollExport: true,
        apiAccess: true
      }
    };

    const ownerUserId = `user-${trialTenantId}-owner`;
    const ownerUser: User = {
      id: ownerUserId,
      tenantId: trialTenantId,
      role: 'company_owner',
      fullName: trialData.ownerName,
      email: trialData.email,
      phone: trialData.phone,
      employeeCode: `${code}-ADM-01`,
      designation: 'Managing Director & Operations Head',
      department: 'Executive Leadership',
      branch: 'Main HQ',
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10)
    };

    const sampleUsers: User[] = [ownerUser];
    const sampleDuty: DutySession[] = [];
    const sampleTasks: FieldTask[] = [];
    const sampleVisits: FieldVisit[] = [];
    const sampleExpenses: ExpenseRecord[] = [];
    const sampleMessages: InAppMessage[] = [
      {
        id: `msg-welcome-${Date.now()}`,
        tenantId: trialTenantId,
        senderId: 'user-savrdh-root',
        senderName: 'Savrdh Platform Dispatcher',
        senderRole: 'super_admin',
        recipientId: 'all_team',
        recipientName: 'All Operations Team',
        content: `🎉 Welcome to ${trialData.companyName}! Your 14-day full-featured trial sandbox is live. You can dispatch field tasks, verify GPS geofences, and live-track field duty sessions.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        type: 'announcement'
      }
    ];

    if (trialData.prefillSampleData) {
      const emp1Id = `emp-${trialTenantId}-1`;
      const emp2Id = `emp-${trialTenantId}-2`;

      const emp1: User = {
        id: emp1Id,
        tenantId: trialTenantId,
        role: 'employee',
        fullName: 'Amit Kumar (Field Lead)',
        email: `amit@${code.toLowerCase()}demo.com`,
        phone: '+91 98111 22334',
        employeeCode: `${code}-FLD-101`,
        designation: 'Senior Route Executive',
        department: 'Field Operations',
        branch: 'Zone North',
        reportingManagerId: ownerUserId,
        status: 'active',
        createdAt: new Date().toISOString().slice(0, 10)
      };

      const emp2: User = {
        id: emp2Id,
        tenantId: trialTenantId,
        role: 'employee',
        fullName: 'Pooja Verma (Quality Officer)',
        email: `pooja@${code.toLowerCase()}demo.com`,
        phone: '+91 98111 22335',
        employeeCode: `${code}-FLD-102`,
        designation: 'Area Quality Inspector',
        department: 'Quality Assurance',
        branch: 'Zone Central',
        reportingManagerId: ownerUserId,
        status: 'active',
        createdAt: new Date().toISOString().slice(0, 10)
      };

      sampleUsers.push(emp1, emp2);

      sampleDuty.push({
        id: `duty-${trialTenantId}-1`,
        tenantId: trialTenantId,
        userId: emp1Id,
        employeeName: emp1.fullName,
        shiftName: 'General Field Shift (09:00 AM - 06:00 PM)',
        date: new Date().toISOString().slice(0, 10),
        punchInTime: '09:05 AM',
        punchInLocation: {
          lat: 28.5355,
          lng: 77.3910,
          address: 'Sector 18 Market Hub, Noida',
          accuracyMeters: 4.5
        },
        status: 'active',
        totalDutyMinutes: 320,
        totalBreakMinutes: 15,
        breaks: [],
        currentLocation: {
          lat: 28.5380,
          lng: 77.3940,
          address: 'Atta Market Sector 27, Noida (GPS Active)',
          batteryLevel: 86,
          isMockGpsDetected: false,
          lastPingAt: 'Just now'
        }
      });

      sampleTasks.push(
        {
          id: `task-${trialTenantId}-1`,
          tenantId: trialTenantId,
          assignedToUserId: emp1Id,
          assignedToName: emp1.fullName,
          createdById: ownerUserId,
          title: 'Client Site Inspection & Stock Auditing',
          description: 'Inspect shelf placement, scan inventory barcode, verify refrigeration and record supervisor acknowledgment.',
          clientName: 'Apex Supermart Outlet #4',
          clientAddress: 'Connaught Place Outer Circle, New Delhi',
          targetLat: 28.6315,
          targetLng: 77.2167,
          targetGeofenceRadiusMeters: 100,
          priority: 'urgent',
          dueDate: 'Today 04:30 PM',
          status: 'in_progress',
          checkInTime: '01:40 PM',
          checkInLat: 28.6314,
          checkInLng: 77.2168,
          checkInAddress: 'Connaught Place Outer Circle, New Delhi',
          distanceFromTargetMeters: 11.2,
          isGeofenceVerified: true,
          verificationGpsAccuracy: 3.1,
          batteryAtCheckIn: 88
        },
        {
          id: `task-${trialTenantId}-2`,
          tenantId: trialTenantId,
          assignedToUserId: emp2Id,
          assignedToName: emp2.fullName,
          createdById: ownerUserId,
          title: 'New Merchant POS Setup & KYC Verification',
          description: 'Deploy merchant payment terminal, collect signature on trade agreement and take store facade photo.',
          clientName: 'Heritage Mart Retailers',
          clientAddress: 'DLF Phase 2 Cyber City, Gurugram',
          targetLat: 28.4900,
          targetLng: 77.0850,
          targetGeofenceRadiusMeters: 100,
          priority: 'high',
          dueDate: 'Today 06:00 PM',
          status: 'pending'
        }
      );

      sampleVisits.push({
        id: `vis-${trialTenantId}-1`,
        tenantId: trialTenantId,
        userId: emp1Id,
        employeeName: emp1.fullName,
        clientName: 'Apex Supermart Outlet #4',
        clientContact: '+91 99100 44556 (Mr. Rajesh)',
        purpose: 'Scheduled Quality Audit',
        address: 'Connaught Place Outer Circle, New Delhi',
        lat: 28.6315,
        lng: 77.2167,
        status: 'checked_in',
        checkInTime: '01:40 PM',
        checkInLat: 28.6314,
        checkInLng: 77.2168,
        verifiedGpsDistanceMeters: 11.2
      });

      sampleExpenses.push({
        id: `exp-${trialTenantId}-1`,
        tenantId: trialTenantId,
        userId: emp1Id,
        employeeName: emp1.fullName,
        date: new Date().toISOString().slice(0, 10),
        category: 'Fuel / Travel',
        amount: 350,
        currency: 'INR',
        description: 'Two-wheeler fuel claim for North Zone client visit rounds (38 km)',
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 16)
      });
    }

    // Update state
    setTenants(prev => [newTenant, ...prev]);
    setUsers(prev => [...sampleUsers, ...prev]);
    if (sampleDuty.length > 0) {
      setCurrentDutySession(sampleDuty[0]);
    }
    if (sampleTasks.length > 0) {
      setTasks(prev => [...sampleTasks, ...prev]);
    }
    if (sampleVisits.length > 0) {
      setFieldVisits(prev => [...sampleVisits, ...prev]);
    }
    if (sampleExpenses.length > 0) {
      setExpenses(prev => [...sampleExpenses, ...prev]);
    }
    setMessages(prev => [...sampleMessages, ...prev]);

    // Log the user in directly as the trial company owner
    setCurrentTenant(newTenant);
    setCurrentUser(ownerUser);
    setIsLoggedIn(true);
    setViewMode('company_admin');
    setShowFreeTrialModal(false);

    showToast(`🚀 Trial Company "${newTenant.name}" is now live! 14-Day Full Sandbox Activated.`);
  };

  const registerCompany = (data: {
    companyName: string;
    ownerName: string;
    email: string;
    phone: string;
    industry: string;
    plan?: Tenant['plan'];
    maxEmployees?: number;
    password?: string;
  }) => {
    const code = data.companyName
      .replace(/[^a-zA-Z]/g, '')
      .slice(0, 5)
      .toUpperCase() || 'COMP';
    const tenantId = `tenant-${Date.now()}`;
    const ownerUserId = `user-${Date.now()}`;

    const newTenant: Tenant = {
      id: tenantId,
      name: data.companyName,
      code,
      contactEmail: data.email,
      contactPhone: data.phone,
      plan: data.plan || 'Growth',
      status: 'active',
      maxEmployees: data.maxEmployees || 50,
      activeEmployees: 1,
      gstNumber: '07AABCU' + Math.floor(1000 + Math.random() * 9000) + 'R1ZN',
      billingAddress: 'Corporate Headquarters, ' + (data.industry || 'Business District'),
      createdAt: new Date().toISOString().slice(0, 10),
      retentionDaysGps: 90,
      retentionDaysAudit: 365,
      features: {
        liveTracking: true,
        geofencing: true,
        expenseManagement: true,
        performanceScoring: true,
        payrollExport: true,
        apiAccess: true,
      }
    };

    const ownerUser: User = {
      id: ownerUserId,
      tenantId,
      role: 'company_owner',
      fullName: data.ownerName,
      email: data.email,
      phone: data.phone,
      employeeCode: `${code}-ADM-01`,
      designation: 'Founder & Managing Director',
      department: 'Executive Management',
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10)
    };

    setTenants(prev => [newTenant, ...prev]);
    setUsers(prev => [ownerUser, ...prev]);
    setCurrentTenant(newTenant);
    setCurrentUser(ownerUser);
    setIsLoggedIn(true);
    setViewMode('company_admin');
    showToast(`🎉 Welcome, ${data.ownerName}! ${data.companyName} is registered and ready for production.`);
    return { tenant: newTenant, owner: ownerUser };
  };

  const resetToCleanProductionState = () => {
    try {
      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach(k => {
          if (k.startsWith(STORAGE_PREFIX)) {
            localStorage.removeItem(k);
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
    setTenants(mockTenants);
    setCurrentTenant(mockTenants[0]);
    setUsers(mockUsers);
    setCurrentUser(mockUsers[0]);
    setCurrentDutySession(null);
    setRoutePoints([]);
    setAttendanceRecords([]);
    setTasks([]);
    setFieldVisits([]);
    setExpenses([]);
    setMessages([]);
    setLeaves([]);
    setPerformanceScores([]);
    setInvoices([]);
    setSupportTickets([]);
    setAuditLogs(mockAuditLogs);
    showToast('🧹 Platform reset to 100% clean production state with Master accounts.');
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
        startTaskTrip,
        updateTaskEnRouteTelemetry,
        completeTaskWithGpsProof,
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
        sendLocationMessage,
        leaves,
        applyLeave,
        approveLeave,
        rejectLeave,
        showFreeTrialModal,
        setShowFreeTrialModal,
        startCompanyTrial,
        registerCompany,
        resetToCleanProductionState,
        shiftPolicy,
        updateShiftPolicy,
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
