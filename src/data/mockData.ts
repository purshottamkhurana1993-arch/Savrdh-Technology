import { 
  Tenant, 
  User, 
  DutySession, 
  RoutePoint, 
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
  ShiftPolicyConfig
} from '../types';

/**
 * FieldSure Production Initial Seed
 * Clean, production-ready baseline without artificial dummy clutter.
 * Real companies and employees are created dynamically and stored in LocalStorage.
 */

export const mockTenants: Tenant[] = [
  {
    id: 'tenant-apex',
    name: 'Apex Field Operations Pvt Ltd',
    code: 'APEX',
    contactEmail: 'admin@apexfresh.in',
    contactPhone: '+91 98765 43210',
    plan: 'Growth',
    status: 'active',
    maxEmployees: 50,
    activeEmployees: 2,
    gstNumber: '07AABCU9603R1ZN',
    billingAddress: 'Tower B, DLF Cyber City Phase 2, Gurugram, Haryana 122002',
    createdAt: '2026-01-15',
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
  }
];

export const mockUsers: User[] = [
  // Savrdh Master Super Admin (Platform Owner)
  {
    id: 'user-savrdh-root',
    tenantId: 'savrdh-platform',
    role: 'super_admin',
    fullName: 'Master Super-Admin (Savrdh)',
    email: 'superadmin@savrdh.in',
    phone: '+91 98100 00001',
    designation: 'Principal Platform Administrator',
    department: 'SaaS Platform Operations',
    status: 'active',
    createdAt: '2026-01-01'
  },
  // Company Owner / Admin
  {
    id: 'user-apex-admin',
    tenantId: 'tenant-apex',
    role: 'company_owner',
    fullName: 'Vikram Mehta (Company Owner)',
    email: 'vikram.mehta@apexfresh.in',
    phone: '+91 98765 11111',
    employeeCode: 'APEX-ADM-01',
    designation: 'Operations Director & Founder',
    department: 'Executive Management',
    branch: 'Gurugram HQ',
    status: 'active',
    createdAt: '2026-01-15'
  },
  // Initial Field Employee / Lead
  {
    id: 'emp-rahul-sharma',
    tenantId: 'tenant-apex',
    role: 'employee',
    fullName: 'Rahul Sharma (Field Lead)',
    email: 'rahul.sharma@apexfresh.in',
    phone: '+91 98765 43210',
    employeeCode: 'APEX-EMP-001',
    designation: 'Senior Field Operations Executive',
    department: 'Field Operations',
    branch: 'Delhi NCR Hub',
    reportingManagerId: 'user-apex-admin',
    status: 'active',
    createdAt: '2026-01-16',
    assignedTerritoryName: 'Central & South Delhi Operational Zone',
    assignedTerritoryBaseLat: 28.6328,
    assignedTerritoryBaseLng: 77.2235,
    assignedOperatingRadiusKm: 8.0
  }
];

// Clean Operational Collections (Populated dynamically as real actions occur)
export const mockDutySessions: DutySession[] = [];

export const mockRoutePoints: RoutePoint[] = [];

export const mockAttendanceRecords: AttendanceRecord[] = [];

export const mockTasks: FieldTask[] = [
  {
    id: 'task-rahul-01',
    tenantId: 'tenant-apex',
    assignedToUserId: 'emp-rahul-sharma',
    assignedToName: 'Rahul Sharma (Field Lead)',
    createdById: 'user-apex-admin',
    title: 'Client Geofence Inspection & Hardware Audit',
    description: 'Perform physical site audit, inspect IoT gateway antennas, and verify 100m geofence accuracy at Airtel Enterprise Hub.',
    clientName: 'Bharti Airtel Enterprise Hub',
    clientAddress: 'Tower A, Barakhamba Road, Connaught Place, New Delhi, 110001',
    targetLat: 28.6328,
    targetLng: 77.2235,
    targetGeofenceRadiusMeters: 100,
    priority: 'high',
    dueDate: '2026-08-20',
    status: 'in_progress',
    tripStartedAt: '09:30 AM',
    initialTripDistanceMeters: 2800,
    lastKnownDistanceMeters: 920,
    lastKnownEtaMinutes: 4,
    lastHeadingStatus: 'approaching',
    territoryName: 'Central & South Delhi Operational Zone',
    isInsideAssignedTerritory: true,
    distanceFromTerritoryBaseKm: 0.1,
    isLocked: false,
    sequenceOrder: 1
  },
  {
    id: 'task-rahul-enroute',
    tenantId: 'tenant-apex',
    assignedToUserId: 'emp-rahul-sharma',
    assignedToName: 'Rahul Sharma (Field Lead)',
    createdById: 'user-apex-admin',
    title: 'Urgent Sample Handover (On-The-Way Lead)',
    description: 'Quick document pickup & sample verification at ITO transit junction directly along your route corridor.',
    clientName: 'Apollo Pharmacy Express Hub',
    clientAddress: 'Vikram Nagar, Near ITO Crossing, Bahadur Shah Zafar Marg, New Delhi',
    targetLat: 28.6275,
    targetLng: 77.2410,
    targetGeofenceRadiusMeters: 80,
    priority: 'urgent',
    dueDate: '2026-08-20',
    status: 'pending',
    isEnRouteStop: true,
    enRouteDetourMeters: 280,
    territoryName: 'Central & South Delhi Operational Zone',
    isInsideAssignedTerritory: true,
    distanceFromTerritoryBaseKm: 1.8,
    isLocked: false, // Allowed as en-route waypoint stop!
    sequenceOrder: 2
  },
  {
    id: 'task-rahul-02',
    tenantId: 'tenant-apex',
    assignedToUserId: 'emp-rahul-sharma',
    assignedToName: 'Rahul Sharma (Field Lead)',
    createdById: 'user-apex-admin',
    title: 'POS Terminal Maintenance & Sign-Off',
    description: 'Deliver replacement POS terminal, test 4G SIM connectivity, and acquire manager signature.',
    clientName: 'Max Healthcare Corporate Office',
    clientAddress: 'Press Enclave Road, Saket, New Delhi, 110017',
    targetLat: 28.5276,
    targetLng: 77.2135,
    targetGeofenceRadiusMeters: 150,
    priority: 'high',
    dueDate: '2026-08-20',
    status: 'pending',
    initialTripDistanceMeters: 12400,
    territoryName: 'Central & South Delhi Operational Zone',
    isInsideAssignedTerritory: true,
    distanceFromTerritoryBaseKm: 11.8,
    territoryWarning: 'Near territory outer boundary (11.8 km vs 8.0 km default)',
    isLocked: true,
    lockReason: 'Complete Airtel Enterprise Hub inspection first before travelling to Saket',
    sequenceOrder: 3
  }
];

export const mockFieldVisits: FieldVisit[] = [];

export const mockExpenses: ExpenseRecord[] = [];

export const mockMessages: InAppMessage[] = [];

export const mockLeaves: LeaveRequest[] = [];

export const defaultShiftPolicy: ShiftPolicyConfig = {
  shiftName: 'General Field Operations Shift',
  shiftStartTime: '09:00',
  shiftEndTime: '18:00',
  minWorkHoursRequired: 8.0,
  maxAllowedBreakMinutes: 45,
  maxAllowedBreaksCount: 2,
  restrictEarlyPunchOut: true,
  requireGeofenceForPunch: true,
  requireEarlyExitReason: true,
  performanceWeights: {
    taskCompletionWeight: 40,
    shiftAdherenceWeight: 25,
    breakDisciplineWeight: 20,
    gpsAccuracyWeight: 15
  }
};

export const defaultPerformanceWeights: PerformanceWeightConfig = {
  taskCompletionWeight: 40,
  shiftAdherenceWeight: 25,
  breakDisciplineWeight: 20,
  gpsAccuracyWeight: 15,
  attendanceWeight: 25,
  workingHoursWeight: 25,
  visitCompletionWeight: 15,
  managerFeedbackWeight: 5
};

export const mockPerformanceScores: EmployeePerformanceScore[] = [];

export const mockInvoices: SaaSInvoice[] = [];

export const mockSupportTickets: SupportTicket[] = [];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'aud-sys-init',
    tenantId: 'savrdh-platform',
    actorId: 'user-savrdh-root',
    actorName: 'Master Super-Admin',
    actorRole: 'super_admin',
    action: 'PLATFORM_INITIALIZATION',
    targetEntity: 'System',
    targetId: 'fieldsure-core',
    timestamp: '2026-01-01 00:00:00',
    ipAddress: '127.0.0.1',
    reason: 'Production Engine Initialization',
    details: 'FieldSure SaaS multi-tenant telemetry and security kernel ready.'
  }
];

export const mockConsentRecord: ConsentRecord = {
  userId: 'emp-rahul-sharma',
  tenantId: 'tenant-apex',
  locationDutyConsent: true,
  cameraReceiptConsent: true,
  micVoiceNoteConsent: true,
  acknowledgedPrivacyPolicy: true,
  consentedAt: new Date().toISOString(),
  version: 'v2.4'
};
