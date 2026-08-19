import { jsPDF } from 'jspdf';

export function generateAndDownloadFieldSurePdf(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const totalPages = 8;

  const addHeader = (pageNum: number, pageTitle: string) => {
    if (pageNum === 1) return;
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 16, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('FieldSure™ Enterprise SaaS', 14, 10);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text('By Savrdh Technologies', 72, 10);

    doc.setTextColor(203, 213, 225);
    doc.text(pageTitle, pageWidth - 14, 10, { align: 'right' });
  };

  const addFooter = (pageNum: number) => {
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Confidential • FieldSure SaaS Master Product Manual & Architectural Dossier (DPDP 2023 & ISO 27001)', 14, pageHeight - 7);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Accent Top Bar
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Logo Box
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(20, 28, 24, 24, 4, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('F✓', 26, 44);

  // Brand Name
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('FieldSure™', 50, 40);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(52, 211, 153);
  doc.text('Enterprise Workforce Telemetry, NOC Command & Automated Payroll SaaS', 50, 47);

  // Document Badge
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(20, 64, pageWidth - 40, 12, 2, 2, 'F');
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DOCUMENT REF: FS-MANUAL-2026-V2.4  |  SECURITY: MULTI-TENANT ISOLATED  |  SAVRDH TECHNOLOGIES', 24, 71.5);

  // Main Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(21);
  doc.setFont('helvetica', 'bold');
  doc.text('Complete Product Manual, Working Model', 20, 94);
  doc.text('& Enterprise Architecture Dossier', 20, 103);

  // Subtitle
  doc.setTextColor(203, 213, 225);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const summaryText = 'An integrated, multi-tenant enterprise field-force management SaaS engineered for transparent, consent-driven employee telemetry, client geofencing, multi-tier performance scoring, automated payroll CSV generation, and audited SaaS super-admin billing governance.';
  const splitSummary = doc.splitTextToSize(summaryText, pageWidth - 40);
  doc.text(splitSummary, 20, 114);

  // 3 Module Feature Cards
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(20, 138, 52, 60, 3, 3, 'F');
  doc.setFillColor(59, 130, 246);
  doc.circle(28, 148, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Employee PWA', 35, 150);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('• 1-Tap GPS Duty Punch-In\n• Permanent Tracking Banner\n• Geofenced Client Visits\n• Photo Proof & OCR Claims\n• Offline IndexedDB Queue', 25, 160);

  doc.setFillColor(30, 41, 59);
  doc.roundedRect(79, 138, 52, 60, 3, 3, 'F');
  doc.setFillColor(16, 185, 129);
  doc.circle(87, 148, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Company Admin', 94, 150);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('• Dual-Screen NOC Map Wall\n• Route Breadcrumb Trace\n• Attendance Master Register\n• Expense Fraud Filters\n• 1-Click Payroll CSV Export', 84, 160);

  doc.setFillColor(30, 41, 59);
  doc.roundedRect(138, 138, 52, 60, 3, 3, 'F');
  doc.setFillColor(168, 85, 247);
  doc.circle(146, 148, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Savrdh Super-Admin', 153, 150);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('• Multi-Tenant Provisioning\n• Multi-Tier SaaS MRR Engine\n• 18% GST Automated Invoicing\n• 30-Min Support Impersonation\n• Immutable Audit Security', 143, 160);

  // Legal Privacy Compliance Banner
  doc.setFillColor(6, 78, 59);
  doc.roundedRect(20, 212, pageWidth - 40, 32, 3, 3, 'F');
  doc.setTextColor(167, 243, 208);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('INDIA DPDP ACT 2023 & ISO 27001 LEGAL COMPLIANCE GUARANTEE', 26, 220);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text('1. Location tracked strictly during active verified shift hours with mandatory persistent indicator.', 26, 226);
  doc.text('2. Automatic GPS tracking termination immediately upon punch-out (Zero off-duty tracking).', 26, 231);
  doc.text('3. Strict zero-access policy to employee personal WhatsApp, SMS, photo gallery, or browsing data.', 26, 236);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text('Designed, Engineered & Operated by Savrdh Technologies', 20, 275);
  doc.text('Version 2.4.0-Enterprise • August 2026', pageWidth - 20, 275, { align: 'right' });

  // ==========================================
  // PAGE 2: COMPLETE WORKING MODEL ARCHITECTURE
  // ==========================================
  doc.addPage();
  addHeader(2, 'Architecture: Technical Working Model & Data Flow');

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('End-to-End System Working Model & Data Flow Pipeline', 14, 26);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('From physical device sensors on Android/iOS to cloud security filters and enterprise video wall command centers.', 14, 32);

  // 4 Architecture Flow Blocks
  const archSteps = [
    { num: '01', title: 'Edge Telemetry Capture', sub: 'HTML5 Geolocation API, Device Battery Level API, and Network connectivity monitoring.', tech: 'IndexedDB Queue • AES-256 Storage', bg: [239, 246, 255], border: [191, 219, 254], col: [30, 64, 175] },
    { num: '02', title: 'Anti-Spoofing Security Gate', sub: 'Filters mock location providers, developer fake GPS apps, and impossible velocity jumps (>160km/h).', tech: 'Edge Verification • Timestamp Hashing', bg: [254, 242, 242], border: [254, 202, 202], col: [153, 27, 27] },
    { num: '03', title: 'Cloud Telemetry Engine', sub: 'Tenant-isolated real-time router processes 4-second breadcrumbs and geofence entry/exit events.', tech: 'PostgreSQL / Firestore • Multi-Tenant Router', bg: [245, 243, 255], border: [221, 214, 254], col: [91, 33, 182] },
    { num: '04', title: 'Enterprise NOC Command Wall', sub: 'Dual-Monitor popout video wall renders high-contrast live Google Maps with instant audio dispatches.', tech: 'Dual-Screen Popout • Leaflet/Google Vector Tiles', bg: [236, 253, 245], border: [167, 243, 208], col: [6, 95, 70] },
  ];

  archSteps.forEach((s, i) => {
    const y = 40 + i * 36;
    doc.setFillColor(s.bg[0], s.bg[1], s.bg[2]);
    doc.setDrawColor(s.border[0], s.border[1], s.border[2]);
    doc.roundedRect(14, y, pageWidth - 28, 30, 2.5, 2.5, 'FD');

    doc.setFillColor(s.col[0], s.col[1], s.col[2]);
    doc.roundedRect(18, y + 4, 10, 8, 1.5, 1.5, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(s.num, 20.5, y + 9.5);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(s.col[0], s.col[1], s.col[2]);
    doc.text(s.title, 32, y + 10);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(s.sub, 32, y + 17, { maxWidth: pageWidth - 70 });

    doc.setFontSize(7);
    doc.setFont('courier', 'bold');
    doc.setTextColor(s.col[0], s.col[1], s.col[2]);
    doc.text(s.tech, 32, y + 24);
  });

  // Flow Summary Box
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(14, 192, pageWidth - 28, 56, 3, 3, 'F');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 211, 153);
  doc.text('Key Technical Guarantees in Production Architecture:', 20, 201);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text('• Battery Efficiency: Adaptive throttling ensures mobile power consumption remains strictly under 2% per hour.', 20, 210);
  doc.text('• Zero Data Loss: Local IndexedDB saves up to 500 audit logs offline and seamlessly flushes to cloud upon 4G restore.', 20, 218);
  doc.text('• Schema Isolation: Every client tenant database query contains enforced tenantId parameters matching JWT claims.', 20, 226);
  doc.text('• Independent Dual-Monitor Engine: Web workers and window messaging allow 60 FPS live tracking without freezing the main CRM.', 20, 234);

  addFooter(2);

  // ==========================================
  // PAGE 3: ROLE GUIDE - COMPANY OWNER & MANAGERS
  // ==========================================
  doc.addPage();
  addHeader(3, 'Product Manual: Company Admin & Operations Guide');

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Company Admin & Manager: How to Operate FieldSure', 14, 26);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Step-by-step instructions for shift scheduling, task geofencing, expense audits, and dual-monitor tracking.', 14, 32);

  const managerSteps = [
    {
      step: 'STEP 1: Task Assignment & Client Geofencing',
      desc: 'Navigate to "Company Admin" -> "Tasks & Field Visits" -> Click "Assign Field Task". Enter the client name, physical Delhi-NCR street address, priority, and assign to a field officer. Set the geofence perimeter (100m to 500m radius). Push notification triggers instantly on the officer\'s phone.',
      action: 'Action Button: [ Assign Field Task ]'
    },
    {
      step: 'STEP 2: Multi-Screen NOC Command Center Setup',
      desc: 'Click "Popout Map (Dual-Screen)" in the dashboard header. A new browser window opens in NOC mode. Drag this window onto your secondary monitor or operations TV wall to monitor live speeds, real-time GPS breadcrumbs, and active client check-ins while continuing CRM workflows on Screen 1.',
      action: 'Action Button: [ 🖥️ Popout Map (Dual-Screen) ]'
    },
    {
      step: 'STEP 3: Fuel & Expense Audit Verification',
      desc: 'Go to the "Expense Approvals" tab. Review uploaded fuel bills and hotel receipts. The system automatically compares the officer\'s claimed odometer readings against verified GPS route distances to eliminate fraudulent claims before 1-click approval or rejection.',
      action: 'Action Button: [ Approve / Reject Expense ]'
    },
    {
      step: 'STEP 4: 1-Click Payroll CSV Export for Accounting',
      desc: 'At month-end, click "Export Payroll (CSV)". The system compiles verified work hours, attendance penalties, approved expense reimbursements, and performance incentives into a structured CSV file compatible with Tally, Keka, and GreytHR.',
      action: 'Action Button: [ Export Payroll (CSV) ]'
    }
  ];

  managerSteps.forEach((m, idx) => {
    const y = 40 + idx * 46;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, pageWidth - 28, 40, 2.5, 2.5, 'FD');

    doc.setFillColor(30, 64, 175);
    doc.roundedRect(18, y + 4, 8, 8, 1.5, 1.5, 'F');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`${idx + 1}`, 21, y + 9.5);

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(m.step, 30, y + 10);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitDesc = doc.splitTextToSize(m.desc, pageWidth - 50);
    doc.text(splitDesc, 20, y + 17);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(m.action, 20, y + 36);
  });

  addFooter(3);

  // ==========================================
  // PAGE 4: ROLE GUIDE - FIELD EMPLOYEE PWA
  // ==========================================
  doc.addPage();
  addHeader(4, 'Product Manual: Field Employee Mobile PWA Guide');

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Field Employee: Daily On-Ground Mobile Workflow', 14, 26);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Simple 3-step duty flow with zero technical training required on Android and iOS devices.', 14, 32);

  const empSteps = [
    {
      title: '1. Morning Duty Punch-In & DPDP Consent',
      desc: 'Open the FieldSure PWA link on Chrome or Safari. Press the large green "Punch In for Duty" button. The device verifies GPS lock, initiates background duty recording, and starts the duty timer with a clear visual status pill.',
      tip: 'Requires: GPS Location Permission (Duty Shift Only)'
    },
    {
      title: '2. Client Site Check-In & Photo Audit Form',
      desc: 'Upon arriving at the client location, the app detects geofence proximity. Tap "Check-in at Site", capture a verified geo-stamped camera photo, fill in visit notes, and submit. If offline in a basement, IndexedDB holds the report safely.',
      tip: 'Feature: 100% Offline Submission with Auto-Sync'
    },
    {
      title: '3. Expense Claim Submission on the Move',
      desc: 'Snap a photo of your fuel receipt or meal bill. Enter the amount and category. The app attaches current GPS coordinates and timestamps to the claim for instant HR approval.',
      tip: 'Feature: Direct OCR Receipt Attachment'
    },
    {
      title: '4. Evening Punch-Out & Privacy Shield Termination',
      desc: 'Tap "Punch Out from Duty". The app instantly terminates all background location watchers and telemetry threads. Personal privacy is 100% restored with zero off-duty data capture.',
      tip: 'Guarantee: DPDP Act 2023 Lawful Duty Termination'
    }
  ];

  empSteps.forEach((s, i) => {
    const y = 40 + i * 46;
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(14, y, pageWidth - 28, 40, 2.5, 2.5, 'FD');

    doc.setFillColor(5, 150, 105);
    doc.roundedRect(18, y + 4, 8, 8, 1.5, 1.5, 'F');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`${i + 1}`, 21, y + 9.5);

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(6, 95, 70);
    doc.text(s.title, 30, y + 10);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const splitDesc = doc.splitTextToSize(s.desc, pageWidth - 50);
    doc.text(splitDesc, 20, y + 17);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text(s.tip, 20, y + 36);
  });

  addFooter(4);

  // ==========================================
  // PAGE 5: SAVRDH SUPER-ADMIN & SUBSCRIPTION MRR
  // ==========================================
  doc.addPage();
  addHeader(5, 'Savrdh Super-Admin: SaaS Governance & Billing');

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Super-Admin: SaaS Multi-Tenant & MRR Revenue Suite', 14, 26);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Complete governance suite for managing company accounts, user license allocations, and 18% GST invoices.', 14, 32);

  // Revenue metrics
  const revMetrics = [
    { label: 'Monthly Recurring (MRR)', val: 'INR 8,45,000', sub: '+18.4% Growth MoM' },
    { label: 'Annual Run Rate (ARR)', val: 'INR 1.01 Cr', sub: 'Target: 2.5 Cr FY27' },
    { label: 'Active Enterprise Tenants', val: '24 Companies', sub: '100% On-Time Renewals' },
    { label: 'Active Billed Seats', val: '4,280 Officers', sub: '99.4% Platform Uptime' }
  ];

  revMetrics.forEach((m, idx) => {
    const x = 14 + idx * 46;
    doc.setFillColor(250, 245, 255);
    doc.setDrawColor(233, 213, 255);
    doc.roundedRect(x, 38, 43, 24, 2, 2, 'FD');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 33, 168);
    doc.text(m.label, x + 3, 44);

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(88, 28, 135);
    doc.text(m.val, x + 3, 52);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text(m.sub, x + 3, 58);
  });

  // Subscription Plans Comparison Table
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 68, pageWidth - 28, 90, 3, 3, 'FD');

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('FieldSure™ Subscription Pricing Tiers & Feature Matrix', 20, 76);

  doc.setFillColor(241, 245, 249);
  doc.rect(20, 81, pageWidth - 40, 7, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('PLAN TIER', 24, 85.5);
  doc.text('PRICE / USER / MO', 65, 85.5);
  doc.text('SEAT CAPACITY', 105, 85.5);
  doc.text('INCLUDED CAPABILITIES', 140, 85.5);

  const planRows = [
    { name: 'Starter Plan', price: 'INR 99 / mo', seats: 'Up to 25 Users', feats: 'GPS Attendance, Basic Shifts, Shift Reports' },
    { name: 'Growth Plan (Popular)', price: 'INR 149 / mo', seats: 'Up to 150 Users', feats: 'Real-Time Map, Geofencing, Expense OCR Audit' },
    { name: 'Enterprise Plan', price: 'INR 249 / mo', seats: 'Unlimited Seats', feats: 'Dual-Monitor NOC Wall, AI Performance, ERP API' },
  ];

  planRows.forEach((p, i) => {
    const y = 94 + i * 14;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(p.name, 24, y);
    doc.setTextColor(16, 185, 129);
    doc.text(p.price, 65, y);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    doc.text(p.seats, 105, y);
    doc.setTextColor(71, 85, 105);
    doc.text(p.feats, 140, y);

    doc.setDrawColor(241, 245, 249);
    doc.line(20, y + 5, pageWidth - 20, y + 5);
  });

  // Invoicing & Tax Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 164, pageWidth - 28, 70, 3, 3, 'FD');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Automated GST Compliant Billing Workflow', 20, 173);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('1. Invoice Generation: On the 1st of every calendar month, the system calculates active employee counts.', 20, 181);
  doc.text('2. 18% GST Calculation: Automatically computes CGST (9%) + SGST (9%) or IGST (18%) based on tenant state code.', 20, 187);
  doc.text('3. Payment Gateway: Integrated Razorpay webhook updates payment status and automatically unlocks new user seats.', 20, 193);
  doc.text('4. Impersonation Protocol: Support engineers can request time-boxed 30-minute access with mandatory customer OTP.', 20, 199);

  addFooter(5);

  // ==========================================
  // PAGE 6: VISUAL MOCKUP - EXECUTIVE & MAP COMMAND
  // ==========================================
  doc.addPage();
  addHeader(6, 'Visual Mockup: Operations & NOC Command');

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Company Operations & Dual-Monitor Live Map UI', 14, 26);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('High-fidelity operational layout with real-time vector telemetry tiles and officer status cards.', 14, 32);

  // Map Container Graphic
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(14, 40, pageWidth - 28, 120, 3, 3, 'F');

  // Simulated Map Elements
  doc.setFillColor(30, 41, 59);
  doc.rect(16, 42, pageWidth - 32, 10, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 211, 153);
  doc.text('● LIVE TELEMETRY STREAM (4s PING) — CONNAUGHT PLACE & NOIDA SEC 62', 22, 48.5);

  // Roads and geofences
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(1.5);
  doc.line(30, 70, 180, 130);
  doc.line(60, 140, 170, 60);

  // Geofence Circle
  doc.setFillColor(16, 185, 129);
  doc.circle(80, 95, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text('Apollo Pharmacy Geofence (300m)', 62, 95);

  // Officer Markers
  doc.setFillColor(59, 130, 246);
  doc.circle(78, 92, 4, 'F');
  doc.circle(130, 110, 4, 'F');
  doc.circle(150, 75, 4, 'F');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Rahul Sharma (22 km/h • 84% Bat)', 85, 92);
  doc.text('Vikram Patel (At Client Site)', 137, 110);
  doc.text('Sneha Reddy (En Route • 38 km/h)', 157, 75);

  // Telemetry Dossier Panel
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 166, pageWidth - 28, 68, 3, 3, 'FD');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Real-Time Officer Telemetry Dossier', 20, 174);

  const dossierRows = [
    { field: 'Selected Officer:', val: 'Rahul Sharma (Field Service Engineer • North Delhi Branch)' },
    { field: 'Current GPS Coordinate:', val: '28.6315° N, 77.2167° E (Connaught Place Inner Circle, ±3.8m accuracy)' },
    { field: 'Live Movement Velocity:', val: '22.4 km/h (Moving smoothly on Barakhamba Road)' },
    { field: 'Device Hardware Health:', val: '84% Battery Charging • 5G Jio Network • Mock GPS: Inactive' },
    { field: 'Assigned Client Geofence:', val: 'Apollo Pharmacy Retail HQ (Inside perimeter for 18 minutes)' },
  ];

  dossierRows.forEach((d, idx) => {
    const y = 182 + idx * 9;
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(d.field, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(d.val, 65, y);
  });

  addFooter(6);

  // ==========================================
  // PAGE 7: DPDP ACT 2023 & SECURITY SPECIFICATION
  // ==========================================
  doc.addPage();
  addHeader(7, 'Security: DPDP Act & Privacy Architecture');

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Legal Compliance & Cryptographic Security Blueprint', 14, 26);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('India Digital Personal Data Protection Act 2023 technical measures and data retention controls.', 14, 32);

  // 4 Security Tenets
  const tenets = [
    {
      title: 'Lawful Purpose & Purpose Limitation',
      desc: 'GPS telemetry is captured exclusively during active employee duty shifts for client visit verification and mileage reimbursement. No off-duty location is ever requested or logged.'
    },
    {
      title: 'Consent Architecture & Audit Trail',
      desc: 'Digital consent records are versioned, timestamped, and stored with SHA-256 signatures. Employees can review full audit logs of which manager viewed their location data.'
    },
    {
      title: 'Automated 60-Day Telemetry Purge',
      desc: 'To prevent data bloat and liability, raw GPS breadcrumb coordinates are automatically purged after 60 days, while verified attendance summaries remain stored for payroll records.'
    },
    {
      title: 'Anti-Mock GPS & Device Root Check',
      desc: 'Edge algorithms detect fake GPS injection apps and rooted environments, flagging potential attendance fraud without exposing false positives.'
    }
  ];

  tenets.forEach((t, i) => {
    const y = 40 + i * 36;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, pageWidth - 28, 30, 2.5, 2.5, 'FD');

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Tenet ${i + 1}: ${t.title}`, 20, y + 8);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitText = doc.splitTextToSize(t.desc, pageWidth - 42);
    doc.text(splitText, 20, y + 15);
  });

  // Security Verification Badge
  doc.setFillColor(6, 78, 59);
  doc.roundedRect(14, 190, pageWidth - 28, 45, 3, 3, 'F');
  doc.setTextColor(167, 243, 208);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('SAVRDH TECHNOLOGIES SECURITY & COMPLIANCE SEAL', 20, 200);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text('• ISO/IEC 27001:2022 Information Security Management Standards Compliant.', 20, 208);
  doc.text('• End-to-end TLS 1.3 encryption in transit with AES-256 encrypted database at rest.', 20, 214);
  doc.text('• SOC-2 Type II audit logging and multi-factor authentication ready.', 20, 220);
  doc.text('• Hosted on Indian Sovereign Cloud Data Centers (MeitY empaneled GCP/AWS regions).', 20, 226);

  addFooter(7);

  // ==========================================
  // PAGE 8: ROI BENEFITS & BUSINESS VALUE MATRIX
  // ==========================================
  doc.addPage();
  addHeader(8, 'Business Model: ROI & Financial Benefits Matrix');

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Enterprise ROI & Quantified Business Value', 14, 26);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Tangible monthly cost reductions, fraud elimination, and field productivity gains.', 14, 32);

  // 4 Big ROI Impact Cards
  const roiImpacts = [
    { title: 'Zero Proxy Attendance', metric: 'INR 45,000+ / mo', desc: 'Average monthly savings per 100 field officers by eliminating buddy punching and fake manual muster entries.' },
    { title: '28% Fuel Claim Reduction', metric: '28% Reduced TA/DA', desc: 'Eliminates inflated travel allowances by matching claimed odometer numbers directly against verified GPS traces.' },
    { title: '+35% Daily Client Visits', metric: '+35% Productivity', desc: 'Real-time task dispatch and instant geofence check-ins enable officers to complete 5-6 visits daily vs 3-4 previously.' },
    { title: '100% Payroll Automation', metric: '40 Hours Saved / mo', desc: 'HR teams eliminate manual Excel reconciliation by generating one-click payroll CSV files ready for disbursement.' }
  ];

  roiImpacts.forEach((r, idx) => {
    const y = 40 + idx * 36;
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(14, y, pageWidth - 28, 30, 2.5, 2.5, 'FD');

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(6, 95, 70);
    doc.text(r.title, 20, y + 8);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(4, 120, 87);
    doc.text(r.metric, pageWidth - 24, y + 8, { align: 'right' });

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const splitDesc = doc.splitTextToSize(r.desc, pageWidth - 42);
    doc.text(splitDesc, 20, y + 16);
  });

  // Final Call to Action & Savrdh Contact
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(14, 190, pageWidth - 28, 45, 3, 3, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Transform Your Field Force Operations Today', 20, 201);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('FieldSure™ Enterprise SaaS is available for immediate enterprise deployment with 14-day free pilot.', 20, 209);
  doc.text('For enterprise trials, custom ERP integration, or on-premise deployments:', 20, 215);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 211, 153);
  doc.text('Contact: enterprise@savrdh.com  |  Portal: https://fieldsure.savrdh.com  |  Support: +91 11 4982 9900', 20, 224);

  addFooter(8);

  // Directly save in browser
  doc.save('FieldSure_Enterprise_SaaS_Master_Product_Manual_And_Dossier.pdf');
}
