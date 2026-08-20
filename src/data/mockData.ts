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
  ConsentRecord 
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
    createdAt: '2026-01-16'
  }
];

// Clean Operational Collections (Populated dynamically as real actions occur)
export const mockDutySessions: DutySession[] = [];

export const mockRoutePoints: RoutePoint[] = [];

export const mockAttendanceRecords: AttendanceRecord[] = [];

export const mockTasks: FieldTask[] = [];

export const mockFieldVisits: FieldVisit[] = [];

export const mockExpenses: ExpenseRecord[] = [];

export const mockMessages: InAppMessage[] = [];

export const mockLeaves: LeaveRequest[] = [];

export const defaultPerformanceWeights: PerformanceWeightConfig = {
  attendanceWeight: 30,
  workingHoursWeight: 25,
  taskCompletionWeight: 25,
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
