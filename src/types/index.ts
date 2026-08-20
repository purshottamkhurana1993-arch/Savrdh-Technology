export type UserRole = 
  | 'super_admin'
  | 'finance_admin'
  | 'support_admin'
  | 'company_owner'
  | 'company_hr'
  | 'company_manager'
  | 'company_viewer'
  | 'employee';

export type TenantPlan = 'Starter' | 'Growth' | 'Enterprise';

export interface Tenant {
  id: string;
  name: string;
  code: string; // e.g. AKBS, NCRF, BRIGHT
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  plan: TenantPlan;
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  trialEndsAt?: string;
  maxEmployees: number;
  activeEmployees: number;
  gstNumber?: string;
  billingAddress: string;
  createdAt: string;
  retentionDaysGps: number;
  retentionDaysAudit: number;
  features: {
    liveTracking: boolean;
    geofencing: boolean;
    expenseManagement: boolean;
    performanceScoring: boolean;
    payrollExport: boolean;
    apiAccess: boolean;
  };
}

export interface User {
  id: string;
  tenantId: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  employeeCode?: string;
  designation?: string;
  department?: string;
  branch?: string;
  reportingManagerId?: string;
  status: 'active' | 'inactive' | 'invited';
  createdAt: string;
}

export interface DutySession {
  id: string;
  tenantId: string;
  userId: string;
  employeeName: string;
  shiftName: string;
  date: string;
  punchInTime: string; // ISO or HH:mm
  punchInLocation: {
    lat: number;
    lng: number;
    address: string;
    accuracyMeters: number;
  };
  punchOutTime?: string;
  punchOutLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'active' | 'completed' | 'on_break';
  totalDutyMinutes: number;
  totalBreakMinutes: number;
  breaks: {
    id: string;
    startTime: string;
    endTime?: string;
    reason: string;
  }[];
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
    batteryLevel: number;
    isMockGpsDetected: boolean;
    lastPingAt: string;
  };
  isOfflineSync?: boolean;
}

export interface RoutePoint {
  id: string;
  sessionId: string;
  tenantId: string;
  userId: string;
  timestamp: string;
  lat: number;
  lng: number;
  address: string;
  speedKmH: number;
  batteryLevel: number;
  accuracyMeters: number;
}

export interface AttendanceRecord {
  id: string;
  tenantId: string;
  userId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  date: string;
  shift: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave' | 'on_field';
  punchInTime?: string;
  punchOutTime?: string;
  workingHours: number;
  overtimeHours: number;
  lateMinutes: number;
  approvedStatus: 'approved' | 'pending_correction' | 'regularized';
  notes?: string;
}

export interface FieldTask {
  id: string;
  tenantId: string;
  assignedToUserId: string;
  assignedToName: string;
  createdById: string;
  title: string;
  description: string;
  clientName: string;
  clientAddress: string;
  targetLat?: number;
  targetLng?: number;
  targetGeofenceRadiusMeters?: number; // e.g. 100m
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  checkInTime?: string;
  checkInLat?: number;
  checkInLng?: number;
  checkInAddress?: string;
  distanceFromTargetMeters?: number;
  isGeofenceVerified?: boolean;
  verificationGpsAccuracy?: number;
  batteryAtCheckIn?: number;
  completedAt?: string;
  completionNotes?: string;
  proofImageUrl?: string;
  clientSignatoryName?: string;
}

export interface FieldVisit {
  id: string;
  tenantId: string;
  userId: string;
  employeeName: string;
  clientName: string;
  clientContact: string;
  purpose: string;
  address: string;
  lat: number;
  lng: number;
  checkInTime?: string;
  checkInLat?: number;
  checkInLng?: number;
  checkOutTime?: string;
  checkOutLat?: number;
  checkOutLng?: number;
  status: 'scheduled' | 'checked_in' | 'completed' | 'missed';
  notes?: string;
  photoProofUrl?: string;
  verifiedGpsDistanceMeters?: number;
}

export interface ExpenseRecord {
  id: string;
  tenantId: string;
  userId: string;
  employeeName: string;
  date: string;
  category: 'Fuel / Travel' | 'Client Meal' | 'Lodging' | 'Vehicle Maintenance' | 'Mobile / Internet' | 'Other';
  amount: number;
  currency: string;
  description: string;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedById?: string;
  approvalRemarks?: string;
  createdAt: string;
}

export interface InAppMessage {
  id: string;
  tenantId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string; // or 'all_team'
  recipientName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'announcement' | 'direct' | 'task_alert' | 'system';
}

export interface LeaveRequest {
  id: string;
  tenantId: string;
  userId: string;
  employeeName: string;
  leaveType: 'Casual' | 'Sick' | 'Earned' | 'Emergency';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
  reviewedBy?: string;
  reviewRemarks?: string;
}

export interface PerformanceWeightConfig {
  attendanceWeight: number; // e.g. 30%
  workingHoursWeight: number; // e.g. 25%
  taskCompletionWeight: number; // e.g. 25%
  visitCompletionWeight: number; // e.g. 15%
  managerFeedbackWeight: number; // e.g. 5%
}

export interface EmployeePerformanceScore {
  userId: string;
  employeeName: string;
  department: string;
  overallScore: number; // 0 - 100
  attendanceScore: number; // 0 - 100
  workingHoursScore: number;
  taskCompletionScore: number;
  visitScore: number;
  managerRating: number; // 1 - 5
  calculatedAt: string;
  trend: 'up' | 'down' | 'stable';
  breakdown: {
    totalWorkDays: number;
    daysPresent: number;
    tasksAssigned: number;
    tasksCompleted: number;
    visitsScheduled: number;
    visitsCompleted: number;
    overtimeHours: number;
  };
}

export interface SaaSInvoice {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  billingMonth: string;
  plan: TenantPlan;
  seats: number;
  baseAmount: number;
  gstAmount: number; // 18% GST in India
  totalAmount: number;
  paymentGateway: 'Razorpay' | 'Cashfree';
  status: 'paid' | 'pending' | 'overdue';
  paidAt?: string;
  invoicePdfUrl?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  tenantId: string;
  tenantName: string;
  reportedBy: string;
  category: 'Billing' | 'GPS Tracking' | 'App Bug' | 'Hardware/Permissions' | 'Feature Request';
  priority: 'low' | 'medium' | 'high' | 'critical';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string; // e.g. "VIEW_EMPLOYEE_LOCATION", "UPDATE_PERFORMANCE_RULE", "IMPERSONATE_TENANT"
  targetEntity: string;
  targetId: string;
  timestamp: string;
  ipAddress: string;
  reason?: string;
  details: string;
}

export interface ConsentRecord {
  userId: string;
  tenantId: string;
  locationDutyConsent: boolean;
  cameraReceiptConsent: boolean;
  micVoiceNoteConsent: boolean;
  acknowledgedPrivacyPolicy: boolean;
  consentedAt: string;
  version: string;
}
