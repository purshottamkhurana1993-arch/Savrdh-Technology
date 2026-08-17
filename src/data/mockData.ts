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

export const mockTenants: Tenant[] = [
  {
    id: 'tenant-akbs',
    name: 'AKBS Poultry Pvt Ltd',
    code: 'AKBS',
    contactEmail: 'admin@akbspoultry.com',
    contactPhone: '+91 98765 43210',
    plan: 'Enterprise',
    status: 'active',
    maxEmployees: 150,
    activeEmployees: 118,
    gstNumber: '07AABCU9603R1ZN',
    billingAddress: 'Plot 44, Udyog Vihar Phase 4, Gurugram, Haryana 122015',
    createdAt: '2025-03-12',
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
  },
  {
    id: 'tenant-ncrf',
    name: 'NCR Field Services Ltd',
    code: 'NCRF',
    contactEmail: 'ops@ncrfieldservices.in',
    contactPhone: '+91 98112 34567',
    plan: 'Growth',
    status: 'active',
    maxEmployees: 80,
    activeEmployees: 54,
    gstNumber: '06AACCF8821M1Z5',
    billingAddress: 'Sector 62, Coreinthian Park, Noida, UP 201301',
    createdAt: '2025-06-18',
    retentionDaysGps: 60,
    retentionDaysAudit: 180,
    features: {
      liveTracking: true,
      geofencing: true,
      expenseManagement: true,
      performanceScoring: true,
      payrollExport: true,
      apiAccess: false,
    }
  },
  {
    id: 'tenant-bright',
    name: 'Bright Retail Network',
    code: 'BRIGHT',
    contactEmail: 'management@brightretail.co',
    contactPhone: '+91 99201 88776',
    plan: 'Starter',
    status: 'trial',
    trialEndsAt: '2026-09-01',
    maxEmployees: 30,
    activeEmployees: 19,
    gstNumber: '27AALCB2290P1ZQ',
    billingAddress: 'Andheri East Logistics Hub, Mumbai, MH 400069',
    createdAt: '2026-07-20',
    retentionDaysGps: 30,
    retentionDaysAudit: 90,
    features: {
      liveTracking: true,
      geofencing: false,
      expenseManagement: false,
      performanceScoring: false,
      payrollExport: true,
      apiAccess: false,
    }
  }
];

export const mockUsers: User[] = [
  // Savrdh Super Admin
  {
    id: 'user-savrdh-root',
    tenantId: 'savrdh-platform',
    role: 'super_admin',
    fullName: 'Rajesh Verma (Savrdh Admin)',
    email: 'rajesh.verma@savrdh.com',
    phone: '+91 98100 00001',
    designation: 'Principal Platform Architect',
    department: 'SaaS Platform Ops',
    status: 'active',
    createdAt: '2025-01-01'
  },
  // Company Admin - AKBS
  {
    id: 'user-akbs-admin',
    tenantId: 'tenant-akbs',
    role: 'company_owner',
    fullName: 'Vikram Singhania',
    email: 'vikram.singhania@akbspoultry.com',
    phone: '+91 98765 11111',
    employeeCode: 'AKBS-ADM-01',
    designation: 'Chief Operating Officer',
    department: 'Executive Operations',
    branch: 'Gurugram HQ',
    status: 'active',
    createdAt: '2025-03-12'
  },
  {
    id: 'user-akbs-hr',
    tenantId: 'tenant-akbs',
    role: 'company_hr',
    fullName: 'Ananya Deshmukh',
    email: 'ananya.d@akbspoultry.com',
    phone: '+91 98765 22222',
    employeeCode: 'AKBS-HR-04',
    designation: 'Head of People & Compliance',
    department: 'Human Resources',
    branch: 'Gurugram HQ',
    status: 'active',
    createdAt: '2025-03-15'
  },
  // Employees - AKBS
  {
    id: 'emp-rahul-sharma',
    tenantId: 'tenant-akbs',
    role: 'employee',
    fullName: 'Rahul Sharma',
    email: 'rahul.s@akbspoultry.com',
    phone: '+91 97110 54321',
    employeeCode: 'AKBS-FLD-102',
    designation: 'Senior Farm Area Officer',
    department: 'North Region Distribution',
    branch: 'NCR North Hub',
    reportingManagerId: 'user-akbs-admin',
    status: 'active',
    createdAt: '2025-04-01'
  },
  {
    id: 'emp-priya-verma',
    tenantId: 'tenant-akbs',
    role: 'employee',
    fullName: 'Priya Verma',
    email: 'priya.v@akbspoultry.com',
    phone: '+91 97110 54322',
    employeeCode: 'AKBS-FLD-103',
    designation: 'Quality & Cold-Chain Inspector',
    department: 'Field Quality Assurance',
    branch: 'Delhi Central',
    reportingManagerId: 'user-akbs-admin',
    status: 'active',
    createdAt: '2025-04-05'
  },
  {
    id: 'emp-amit-kumar',
    tenantId: 'tenant-akbs',
    role: 'employee',
    fullName: 'Amit Kumar',
    email: 'amit.k@akbspoultry.com',
    phone: '+91 97110 54323',
    employeeCode: 'AKBS-FLD-104',
    designation: 'Route Delivery Lead',
    department: 'Logistics',
    branch: 'Faridabad Hub',
    reportingManagerId: 'user-akbs-admin',
    status: 'active',
    createdAt: '2025-05-10'
  },
  {
    id: 'emp-neha-singh',
    tenantId: 'tenant-akbs',
    role: 'employee',
    fullName: 'Neha Singh',
    email: 'neha.s@akbspoultry.com',
    phone: '+91 97110 54324',
    employeeCode: 'AKBS-FLD-105',
    designation: 'Veterinary Field Associate',
    department: 'Field Health Services',
    branch: 'Gurugram HQ',
    reportingManagerId: 'user-akbs-admin',
    status: 'active',
    createdAt: '2025-05-12'
  },
  {
    id: 'emp-rohit-yadav',
    tenantId: 'tenant-akbs',
    role: 'employee',
    fullName: 'Rohit Yadav',
    email: 'rohit.y@akbspoultry.com',
    phone: '+91 97110 54325',
    employeeCode: 'AKBS-FLD-106',
    designation: 'Wholesale Sales Executive',
    department: 'Sales & Distribution',
    branch: 'Noida Hub',
    reportingManagerId: 'user-akbs-admin',
    status: 'active',
    createdAt: '2025-06-01'
  },
  // NCR Field Services
  {
    id: 'emp-deepak-gupta',
    tenantId: 'tenant-ncrf',
    role: 'employee',
    fullName: 'Deepak Gupta',
    email: 'deepak.g@ncrfieldservices.in',
    phone: '+91 98110 11223',
    employeeCode: 'NCRF-TECH-401',
    designation: 'Telecom Mast Maintenance Specialist',
    department: 'Field Engineering',
    branch: 'Noida Sector 62',
    status: 'active',
    createdAt: '2025-07-01'
  },
  {
    id: 'emp-suresh-nair',
    tenantId: 'tenant-ncrf',
    role: 'employee',
    fullName: 'Suresh Nair',
    email: 'suresh.n@ncrfieldservices.in',
    phone: '+91 98110 11224',
    employeeCode: 'NCRF-TECH-402',
    designation: 'HVAC Network Technician',
    department: 'HVAC Field Ops',
    branch: 'South Delhi Hub',
    status: 'active',
    createdAt: '2025-07-10'
  }
];

export const mockDutySessions: DutySession[] = [
  {
    id: 'duty-rahul-today',
    tenantId: 'tenant-akbs',
    userId: 'emp-rahul-sharma',
    employeeName: 'Rahul Sharma',
    shiftName: 'General Field Shift (09:00 AM - 06:00 PM)',
    date: '2026-08-17',
    punchInTime: '08:54 AM',
    punchInLocation: {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Sector 18 Market, Noida, Uttar Pradesh',
      accuracyMeters: 4.8
    },
    status: 'active',
    totalDutyMinutes: 382,
    totalBreakMinutes: 35,
    breaks: [
      {
        id: 'brk-1',
        startTime: '01:15 PM',
        endTime: '01:50 PM',
        reason: 'Lunch Break'
      }
    ],
    currentLocation: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Near Connaught Place Outer Circle, New Delhi',
      batteryLevel: 74,
      isMockGpsDetected: false,
      lastPingAt: '3 mins ago'
    },
    isOfflineSync: false
  },
  {
    id: 'duty-priya-today',
    tenantId: 'tenant-akbs',
    userId: 'emp-priya-verma',
    employeeName: 'Priya Verma',
    shiftName: 'Morning Audit Shift (08:30 AM - 05:30 PM)',
    date: '2026-08-17',
    punchInTime: '08:28 AM',
    punchInLocation: {
      lat: 28.4595,
      lng: 77.0266,
      address: 'Cyber Hub Gate 2, DLF Phase 2, Gurugram',
      accuracyMeters: 3.2
    },
    status: 'active',
    totalDutyMinutes: 410,
    totalBreakMinutes: 20,
    breaks: [
      {
        id: 'brk-2',
        startTime: '12:30 PM',
        endTime: '12:50 PM',
        reason: 'Tea & Rest Break'
      }
    ],
    currentLocation: {
      lat: 28.4986,
      lng: 77.0878,
      address: 'Sector 29 Commercial Complex, Gurugram',
      batteryLevel: 61,
      isMockGpsDetected: false,
      lastPingAt: '1 min ago'
    }
  },
  {
    id: 'duty-amit-today',
    tenantId: 'tenant-akbs',
    userId: 'emp-amit-kumar',
    employeeName: 'Amit Kumar',
    shiftName: 'Early Dispatch Shift (07:00 AM - 04:00 PM)',
    date: '2026-08-17',
    punchInTime: '07:05 AM',
    punchInLocation: {
      lat: 28.4089,
      lng: 77.3178,
      address: 'Bata Chowk Industrial Area, Faridabad',
      accuracyMeters: 6.1
    },
    status: 'on_break',
    totalDutyMinutes: 420,
    totalBreakMinutes: 45,
    breaks: [
      {
        id: 'brk-3',
        startTime: '03:10 PM',
        reason: 'Evening Rest / Vehicle Refueling'
      }
    ],
    currentLocation: {
      lat: 28.4230,
      lng: 77.3090,
      address: 'NH-44 Bypass Fuel Station, Faridabad',
      batteryLevel: 82,
      isMockGpsDetected: false,
      lastPingAt: '5 mins ago'
    }
  },
  {
    id: 'duty-neha-today',
    tenantId: 'tenant-akbs',
    userId: 'emp-neha-singh',
    employeeName: 'Neha Singh',
    shiftName: 'General Field Shift (09:00 AM - 06:00 PM)',
    date: '2026-08-17',
    punchInTime: '09:12 AM',
    punchInLocation: {
      lat: 28.4720,
      lng: 77.0390,
      address: 'South City 1, Gurugram',
      accuracyMeters: 5.0
    },
    status: 'active',
    totalDutyMinutes: 350,
    totalBreakMinutes: 15,
    breaks: [],
    currentLocation: {
      lat: 28.4350,
      lng: 77.0110,
      address: 'Sohna Road Agro Tech Center, Gurugram',
      batteryLevel: 58,
      isMockGpsDetected: false,
      lastPingAt: '2 mins ago'
    }
  }
];

export const mockRoutePoints: RoutePoint[] = [
  {
    id: 'rt-1',
    sessionId: 'duty-rahul-today',
    tenantId: 'tenant-akbs',
    userId: 'emp-rahul-sharma',
    timestamp: '08:54 AM',
    lat: 28.5355,
    lng: 77.3910,
    address: 'Punch-In: Sector 18 Market, Noida',
    speedKmH: 0,
    batteryLevel: 98,
    accuracyMeters: 4.8
  },
  {
    id: 'rt-2',
    sessionId: 'duty-rahul-today',
    tenantId: 'tenant-akbs',
    userId: 'emp-rahul-sharma',
    timestamp: '10:15 AM',
    lat: 28.5700,
    lng: 77.3200,
    address: 'DND Flyway Toll Plaza Entry',
    speedKmH: 42,
    batteryLevel: 91,
    accuracyMeters: 5.2
  },
  {
    id: 'rt-3',
    sessionId: 'duty-rahul-today',
    tenantId: 'tenant-akbs',
    userId: 'emp-rahul-sharma',
    timestamp: '11:30 AM',
    lat: 28.5920,
    lng: 77.2400,
    address: 'Client Visit 1: Lodhi Colony Fresh Outlet',
    speedKmH: 0,
    batteryLevel: 85,
    accuracyMeters: 3.8
  },
  {
    id: 'rt-4',
    sessionId: 'duty-rahul-today',
    tenantId: 'tenant-akbs',
    userId: 'emp-rahul-sharma',
    timestamp: '01:15 PM',
    lat: 28.6010,
    lng: 77.2280,
    address: 'Khan Market Lunch Stop',
    speedKmH: 0,
    batteryLevel: 79,
    accuracyMeters: 4.1
  },
  {
    id: 'rt-5',
    sessionId: 'duty-rahul-today',
    tenantId: 'tenant-akbs',
    userId: 'emp-rahul-sharma',
    timestamp: '03:45 PM',
    lat: 28.6139,
    lng: 77.2090,
    address: 'Client Visit 2: Connaught Place Central Hub',
    speedKmH: 18,
    batteryLevel: 74,
    accuracyMeters: 4.5
  }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-1',
    tenantId: 'tenant-akbs',
    userId: 'emp-rahul-sharma',
    employeeName: 'Rahul Sharma',
    employeeCode: 'AKBS-FLD-102',
    department: 'North Region Distribution',
    date: '2026-08-17',
    shift: 'General Field (09:00 - 18:00)',
    status: 'on_field',
    punchInTime: '08:54 AM',
    workingHours: 6.8,
    overtimeHours: 0,
    lateMinutes: 0,
    approvedStatus: 'approved'
  },
  {
    id: 'att-2',
    tenantId: 'tenant-akbs',
    userId: 'emp-priya-verma',
    employeeName: 'Priya Verma',
    employeeCode: 'AKBS-FLD-103',
    department: 'Field Quality Assurance',
    date: '2026-08-17',
    shift: 'Morning Audit (08:30 - 17:30)',
    status: 'on_field',
    punchInTime: '08:28 AM',
    workingHours: 7.2,
    overtimeHours: 0.5,
    lateMinutes: 0,
    approvedStatus: 'approved'
  },
  {
    id: 'att-3',
    tenantId: 'tenant-akbs',
    userId: 'emp-amit-kumar',
    employeeName: 'Amit Kumar',
    employeeCode: 'AKBS-FLD-104',
    department: 'Logistics',
    date: '2026-08-17',
    shift: 'Early Dispatch (07:00 - 16:00)',
    status: 'present',
    punchInTime: '07:05 AM',
    workingHours: 7.5,
    overtimeHours: 0.8,
    lateMinutes: 5,
    approvedStatus: 'approved'
  },
  {
    id: 'att-4',
    tenantId: 'tenant-akbs',
    userId: 'emp-neha-singh',
    employeeName: 'Neha Singh',
    employeeCode: 'AKBS-FLD-105',
    department: 'Field Health Services',
    date: '2026-08-17',
    shift: 'General Field (09:00 - 18:00)',
    status: 'late',
    punchInTime: '09:12 AM',
    workingHours: 5.9,
    overtimeHours: 0,
    lateMinutes: 12,
    approvedStatus: 'pending_correction',
    notes: 'Traffic congestion on Sohna Road bypass'
  },
  {
    id: 'att-5',
    tenantId: 'tenant-akbs',
    userId: 'emp-rohit-yadav',
    employeeName: 'Rohit Yadav',
    employeeCode: 'AKBS-FLD-106',
    department: 'Sales & Distribution',
    date: '2026-08-17',
    shift: 'General Field (09:00 - 18:00)',
    status: 'on_leave',
    workingHours: 0,
    overtimeHours: 0,
    lateMinutes: 0,
    approvedStatus: 'approved',
    notes: 'Approved Casual Leave'
  }
];

export const mockTasks: FieldTask[] = [
  {
    id: 'task-101',
    tenantId: 'tenant-akbs',
    assignedToUserId: 'emp-rahul-sharma',
    assignedToName: 'Rahul Sharma',
    createdById: 'user-akbs-admin',
    title: 'Poultry Farm Inspection & Temperature Logging',
    description: 'Verify bio-security fence, check hatchery ventilation fans and record ambient humidity log.',
    clientName: 'GreenPastures Farm #3',
    clientAddress: 'Plot 12, Sohna Rural Belt, Gurugram',
    priority: 'high',
    dueDate: '2026-08-17 04:00 PM',
    status: 'in_progress'
  },
  {
    id: 'task-102',
    tenantId: 'tenant-akbs',
    assignedToUserId: 'emp-rahul-sharma',
    assignedToName: 'Rahul Sharma',
    createdById: 'user-akbs-admin',
    title: 'Retail Store Sample Box Handover',
    description: 'Deliver new organic poultry cutlets display sample kit and collect signed acknowledgment.',
    clientName: 'Modern Bazaar Mega Store',
    clientAddress: 'DLF Phase 1 Market, Gurugram',
    priority: 'medium',
    dueDate: '2026-08-17 06:30 PM',
    status: 'pending'
  },
  {
    id: 'task-103',
    tenantId: 'tenant-akbs',
    assignedToUserId: 'emp-priya-verma',
    assignedToName: 'Priya Verma',
    createdById: 'user-akbs-admin',
    title: 'Cold Storage Reefer Calibration Audit',
    description: 'Calibrate digital temperature dataloggers on transport reefer truck DL-1L-8890.',
    clientName: 'FrostLogix Cold Chain Terminal',
    clientAddress: 'Kapashera Border, New Delhi',
    priority: 'urgent',
    dueDate: '2026-08-17 02:00 PM',
    status: 'completed',
    completedAt: '2026-08-17 01:45 PM',
    completionNotes: 'Temperature verified at -18.2°C. Calibration certificate stamped & uploaded.'
  }
];

export const mockFieldVisits: FieldVisit[] = [
  {
    id: 'vis-301',
    tenantId: 'tenant-akbs',
    userId: 'emp-rahul-sharma',
    employeeName: 'Rahul Sharma',
    clientName: 'Nature Fresh Organic Mart',
    clientContact: '+91 98223 99881 (Mr. Arvind Gupta)',
    purpose: 'Quarterly Vendor Shelf Audit & Stock Replenishment Check',
    address: 'B-14, Connaught Place Inner Circle, New Delhi',
    lat: 28.6315,
    lng: 77.2167,
    checkInTime: '11:32 AM',
    checkInLat: 28.6314,
    checkInLng: 77.2169,
    checkOutTime: '12:20 PM',
    checkOutLat: 28.6316,
    checkOutLng: 77.2168,
    status: 'completed',
    notes: 'Store manager confirmed 15% surge in weekend egg sales. Requested 40 extra crates on Thursday.',
    verifiedGpsDistanceMeters: 14.2
  },
  {
    id: 'vis-302',
    tenantId: 'tenant-akbs',
    userId: 'emp-rahul-sharma',
    employeeName: 'Rahul Sharma',
    clientName: 'Le Meridien Hospitality Kitchen',
    clientContact: '+91 99100 44221 (Chef Sanjeev)',
    purpose: 'Bulk Fresh Supply Contract Verification',
    address: 'Windsor Place, Janpath, New Delhi',
    lat: 28.6180,
    lng: 77.2185,
    checkInTime: '02:40 PM',
    checkInLat: 28.6181,
    checkInLng: 77.2184,
    status: 'checked_in',
    notes: 'In meeting with executive procurement team.',
    verifiedGpsDistanceMeters: 8.5
  },
  {
    id: 'vis-303',
    tenantId: 'tenant-akbs',
    userId: 'emp-rahul-sharma',
    employeeName: 'Rahul Sharma',
    clientName: 'Delhi Central Club Commissary',
    clientContact: '+91 98188 33211',
    purpose: 'Quality Feedback Collection & Monthly Invoice Stamping',
    address: 'Barakhamba Road, New Delhi',
    lat: 28.6270,
    lng: 77.2270,
    status: 'scheduled'
  }
];

export const mockExpenses: ExpenseRecord[] = [
  {
    id: 'exp-501',
    tenantId: 'tenant-akbs',
    userId: 'emp-rahul-sharma',
    employeeName: 'Rahul Sharma',
    date: '2026-08-17',
    category: 'Fuel / Travel',
    amount: 680,
    currency: 'INR',
    description: 'CNG refueling for field motorcycle during South Delhi farm audits (28.4 kms).',
    receiptUrl: 'https://images.unsplash.com/photo-1554415707-9e49016a35f3?w=300&q=80',
    status: 'pending',
    createdAt: '2026-08-17 01:55 PM'
  },
  {
    id: 'exp-502',
    tenantId: 'tenant-akbs',
    userId: 'emp-priya-verma',
    employeeName: 'Priya Verma',
    date: '2026-08-16',
    category: 'Fuel / Travel',
    amount: 1450,
    currency: 'INR',
    description: 'Inter-city toll plaza and fuel allowance for Kundli expressway poultry audit.',
    receiptUrl: 'https://images.unsplash.com/photo-1554415707-9e49016a35f3?w=300&q=80',
    status: 'approved',
    approvedById: 'user-akbs-admin',
    approvalRemarks: 'Toll slip verified with GPS timeline.',
    createdAt: '2026-08-16 06:10 PM'
  },
  {
    id: 'exp-503',
    tenantId: 'tenant-akbs',
    userId: 'emp-amit-kumar',
    employeeName: 'Amit Kumar',
    date: '2026-08-15',
    category: 'Vehicle Maintenance',
    amount: 920,
    currency: 'INR',
    description: 'Emergency puncture repair and engine oil top-up for delivery tempo.',
    receiptUrl: 'https://images.unsplash.com/photo-1554415707-9e49016a35f3?w=300&q=80',
    status: 'approved',
    approvedById: 'user-akbs-admin',
    approvalRemarks: 'Approved as per emergency vehicle maintenance budget.',
    createdAt: '2026-08-15 05:20 PM'
  }
];

export const mockMessages: InAppMessage[] = [
  {
    id: 'msg-1',
    tenantId: 'tenant-akbs',
    senderId: 'user-akbs-admin',
    senderName: 'Vikram Singhania (Ops COO)',
    senderRole: 'Company Admin',
    recipientId: 'all_team',
    recipientName: 'All Field Officers',
    content: 'Team: High temperature alert across NCR today. Please ensure all poultry delivery reefers maintain below 4°C at all checkstops.',
    timestamp: '09:00 AM',
    isRead: true,
    type: 'announcement'
  },
  {
    id: 'msg-2',
    tenantId: 'tenant-akbs',
    senderId: 'user-akbs-hr',
    senderName: 'Ananya Deshmukh (HR)',
    senderRole: 'Company HR',
    recipientId: 'emp-rahul-sharma',
    recipientName: 'Rahul Sharma',
    content: 'Hi Rahul, your expense claim for last week fuel voucher has been credited in today payroll run.',
    timestamp: '11:15 AM',
    isRead: true,
    type: 'direct'
  },
  {
    id: 'msg-3',
    tenantId: 'tenant-akbs',
    senderId: 'system',
    senderName: 'FieldSure Automated Geofence',
    senderRole: 'System',
    recipientId: 'emp-rahul-sharma',
    recipientName: 'Rahul Sharma',
    content: 'Verified Arrival at Le Meridien Hospitality Kitchen (8.5m accuracy). Check-in timestamp recorded.',
    timestamp: '02:40 PM',
    isRead: false,
    type: 'task_alert'
  }
];

export const mockLeaves: LeaveRequest[] = [
  {
    id: 'lv-1',
    tenantId: 'tenant-akbs',
    userId: 'emp-rohit-yadav',
    employeeName: 'Rohit Yadav',
    leaveType: 'Casual',
    startDate: '2026-08-17',
    endDate: '2026-08-17',
    totalDays: 1,
    reason: 'Family domestic commitment.',
    status: 'approved',
    appliedOn: '2026-08-14',
    reviewedBy: 'Ananya Deshmukh',
    reviewRemarks: 'Approved with full casual quota balance.'
  },
  {
    id: 'lv-2',
    tenantId: 'tenant-akbs',
    userId: 'emp-priya-verma',
    leaveType: 'Sick',
    employeeName: 'Priya Verma',
    startDate: '2026-08-25',
    endDate: '2026-08-26',
    totalDays: 2,
    reason: 'Scheduled dental procedure.',
    status: 'pending',
    appliedOn: '2026-08-16'
  }
];

export const defaultPerformanceWeights: PerformanceWeightConfig = {
  attendanceWeight: 30,
  workingHoursWeight: 25,
  taskCompletionWeight: 25,
  visitCompletionWeight: 15,
  managerFeedbackWeight: 5
};

export const mockPerformanceScores: EmployeePerformanceScore[] = [
  {
    userId: 'emp-rahul-sharma',
    employeeName: 'Rahul Sharma',
    department: 'North Region Distribution',
    overallScore: 94.2,
    attendanceScore: 96,
    workingHoursScore: 92,
    taskCompletionScore: 95,
    visitScore: 93,
    managerRating: 4.8,
    calculatedAt: '2026-08-17 03:00 PM',
    trend: 'up',
    breakdown: {
      totalWorkDays: 24,
      daysPresent: 24,
      tasksAssigned: 42,
      tasksCompleted: 40,
      visitsScheduled: 68,
      visitsCompleted: 64,
      overtimeHours: 6.5
    }
  },
  {
    userId: 'emp-priya-verma',
    employeeName: 'Priya Verma',
    department: 'Field Quality Assurance',
    overallScore: 96.8,
    attendanceScore: 100,
    workingHoursScore: 97,
    taskCompletionScore: 98,
    visitScore: 94,
    managerRating: 5.0,
    calculatedAt: '2026-08-17 03:00 PM',
    trend: 'up',
    breakdown: {
      totalWorkDays: 24,
      daysPresent: 24,
      tasksAssigned: 36,
      tasksCompleted: 36,
      visitsScheduled: 50,
      visitsCompleted: 48,
      overtimeHours: 9.0
    }
  },
  {
    userId: 'emp-amit-kumar',
    employeeName: 'Amit Kumar',
    department: 'Logistics',
    overallScore: 88.5,
    attendanceScore: 92,
    workingHoursScore: 90,
    taskCompletionScore: 85,
    visitScore: 88,
    managerRating: 4.3,
    calculatedAt: '2026-08-17 03:00 PM',
    trend: 'stable',
    breakdown: {
      totalWorkDays: 24,
      daysPresent: 22,
      tasksAssigned: 30,
      tasksCompleted: 26,
      visitsScheduled: 55,
      visitsCompleted: 49,
      overtimeHours: 12.0
    }
  },
  {
    userId: 'emp-neha-singh',
    employeeName: 'Neha Singh',
    department: 'Field Health Services',
    overallScore: 81.4,
    attendanceScore: 83,
    workingHoursScore: 78,
    taskCompletionScore: 84,
    visitScore: 82,
    managerRating: 4.0,
    calculatedAt: '2026-08-17 03:00 PM',
    trend: 'down',
    breakdown: {
      totalWorkDays: 24,
      daysPresent: 20,
      tasksAssigned: 25,
      tasksCompleted: 21,
      visitsScheduled: 40,
      visitsCompleted: 33,
      overtimeHours: 1.0
    }
  }
];

export const mockInvoices: SaaSInvoice[] = [
  {
    id: 'inv-2026-08-01',
    invoiceNumber: 'SAV-INV-2608-001',
    tenantId: 'tenant-akbs',
    tenantName: 'AKBS Poultry Pvt Ltd',
    billingMonth: 'August 2026',
    plan: 'Enterprise',
    seats: 120,
    baseAmount: 36000,
    gstAmount: 6480, // 18%
    totalAmount: 42480,
    paymentGateway: 'Razorpay',
    status: 'paid',
    paidAt: '2026-08-02',
    invoicePdfUrl: 'https://fieldsure.savrdh.com/invoices/SAV-INV-2608-001.pdf'
  },
  {
    id: 'inv-2026-08-02',
    invoiceNumber: 'SAV-INV-2608-002',
    tenantId: 'tenant-ncrf',
    tenantName: 'NCR Field Services Ltd',
    billingMonth: 'August 2026',
    plan: 'Growth',
    seats: 55,
    baseAmount: 13750,
    gstAmount: 2475,
    totalAmount: 16225,
    paymentGateway: 'Cashfree',
    status: 'paid',
    paidAt: '2026-08-04'
  },
  {
    id: 'inv-2026-08-03',
    invoiceNumber: 'SAV-INV-2608-003',
    tenantId: 'tenant-bright',
    tenantName: 'Bright Retail Network',
    billingMonth: 'August 2026 (Trial Conversion)',
    plan: 'Starter',
    seats: 20,
    baseAmount: 3999,
    gstAmount: 719.82,
    totalAmount: 4718.82,
    paymentGateway: 'Razorpay',
    status: 'pending'
  }
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'tkt-881',
    ticketNumber: 'SUP-8819',
    tenantId: 'tenant-akbs',
    tenantName: 'AKBS Poultry Pvt Ltd',
    reportedBy: 'Ananya Deshmukh (HR Head)',
    category: 'Billing',
    priority: 'medium',
    subject: 'Request to update GSTIN state code on monthly invoice',
    description: 'We recently updated our Haryana GSTIN branch registration. Please ensure invoice reflects state code 06 instead of Delhi 07 for Gurugram warehouse.',
    status: 'in_progress',
    createdAt: '2026-08-15'
  },
  {
    id: 'tkt-882',
    ticketNumber: 'SUP-8820',
    tenantId: 'tenant-ncrf',
    tenantName: 'NCR Field Services Ltd',
    reportedBy: 'Deepak Gupta (Field Tech)',
    category: 'GPS Tracking',
    priority: 'low',
    subject: 'Battery optimization setting prompt on Xiaomi MIUI Android 14',
    description: 'App prompt for background power exemption worked smoothly once guided by the in-app permission manager.',
    status: 'resolved',
    createdAt: '2026-08-14'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'aud-901',
    tenantId: 'tenant-akbs',
    actorId: 'user-akbs-admin',
    actorName: 'Vikram Singhania (COO)',
    actorRole: 'company_owner',
    action: 'VIEW_DUTY_LOCATION_MAP',
    targetEntity: 'DutySessions',
    targetId: 'tenant-akbs/live-map',
    timestamp: '2026-08-17 02:45:10',
    ipAddress: '122.161.44.12',
    reason: 'Active field route oversight during peak shift',
    details: 'Viewed active GPS coordinates of 4 on-duty officers.'
  },
  {
    id: 'aud-902',
    tenantId: 'tenant-akbs',
    actorId: 'user-akbs-admin',
    actorName: 'Vikram Singhania (COO)',
    actorRole: 'company_owner',
    action: 'APPROVE_EXPENSE',
    targetEntity: 'Expenses',
    targetId: 'exp-502',
    timestamp: '2026-08-16 18:15:00',
    ipAddress: '122.161.44.12',
    reason: 'Verified toll receipt matching GPS route timeline',
    details: 'Approved ₹1,450 fuel & toll reimbursement for Priya Verma.'
  },
  {
    id: 'aud-903',
    tenantId: 'savrdh-platform',
    actorId: 'user-savrdh-root',
    actorName: 'Rajesh Verma (Savrdh Admin)',
    actorRole: 'super_admin',
    action: 'AUDITED_SUPPORT_ACCESS',
    targetEntity: 'Tenants',
    targetId: 'tenant-akbs',
    timestamp: '2026-08-15 11:30:22',
    ipAddress: '49.36.12.80',
    reason: 'Support Ticket #SUP-8819 GSTIN billing ledger audit',
    details: 'Time-limited 30-min support impersonation session granted and logged.'
  },
  {
    id: 'aud-904',
    tenantId: 'tenant-akbs',
    actorId: 'emp-rahul-sharma',
    actorName: 'Rahul Sharma',
    actorRole: 'employee',
    action: 'PUNCH_IN_DUTY',
    targetEntity: 'DutySession',
    targetId: 'duty-rahul-today',
    timestamp: '2026-08-17 08:54:02',
    ipAddress: '42.106.89.14',
    details: 'Punch in with GPS consent verified. Lat: 28.5355, Lng: 77.3910.'
  }
];

export const mockConsentRecord: ConsentRecord = {
  userId: 'emp-rahul-sharma',
  tenantId: 'tenant-akbs',
  locationDutyConsent: true,
  cameraReceiptConsent: true,
  micVoiceNoteConsent: false,
  acknowledgedPrivacyPolicy: true,
  consentedAt: '2025-04-01 09:00:00',
  version: 'v2.4-2026'
};
