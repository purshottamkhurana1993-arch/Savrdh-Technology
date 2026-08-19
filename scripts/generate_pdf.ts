import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

function generateFieldSurePdf() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

  // Helper functions
  const addHeader = (pageNum: number, pageTitle: string) => {
    if (pageNum === 1) return; // Cover page doesn't get running header
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

  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Confidential • FieldSure SaaS Mockups & Architectural Dossier (ISO 27001 & DPDP 2023 Compliant)', 14, pageHeight - 7);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  // Background Dark Theme
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Accent Top Bar
  doc.setFillColor(16, 185, 129); // #10b981
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Logo Box
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(20, 30, 24, 24, 4, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('F✓', 26, 46);

  // Brand Name
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('FieldSure™', 50, 42);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(52, 211, 153);
  doc.text('Enterprise Workforce Management & GPS Telemetry SaaS', 50, 49);

  // Document Badge
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(20, 68, pageWidth - 40, 12, 2, 2, 'F');
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('DOCUMENT REF: FS-SPEC-2026-V2.4  |  SECURITY: MULTI-TENANT ISOLATED  |  OWNER: SAVRDH TECHNOLOGIES', 25, 75.5);

  // Main Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Complete SaaS Product Mockup Suite', 20, 100);
  doc.text('& Technical Architecture Specification', 20, 110);

  // Subtitle
  doc.setTextColor(203, 213, 225);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'normal');
  const summaryText = 'An integrated, multi-tenant enterprise field-force management SaaS engineered for transparent, consent-driven employee telemetry, client geofencing, multi-tier performance scoring, automated payroll CSV generation, and audited SaaS super-admin billing governance.';
  const splitSummary = doc.splitTextToSize(summaryText, pageWidth - 40);
  doc.text(splitSummary, 20, 122);

  // 3 Module Feature Cards
  // Card 1
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(20, 145, 52, 60, 3, 3, 'F');
  doc.setFillColor(59, 130, 246);
  doc.circle(28, 155, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Employee PWA', 35, 157);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  const pwaText = '• 1-Tap Duty Punch-In\n• Permanent Tracking Banner\n• Geofenced Client Visits\n• Photo Proof & OCR Claims\n• Offline IndexedDB Queue';
  doc.text(pwaText, 25, 167);

  // Card 2
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(79, 145, 52, 60, 3, 3, 'F');
  doc.setFillColor(16, 185, 129);
  doc.circle(87, 155, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Company Admin', 94, 157);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  const adminText = '• Google Maps Live Grid\n• Route Breadcrumb Trace\n• Attendance Master Register\n• Shift Regularizations\n• Automated Payroll CSV';
  doc.text(adminText, 84, 167);

  // Card 3
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(138, 145, 52, 60, 3, 3, 'F');
  doc.setFillColor(168, 85, 247);
  doc.circle(146, 155, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Savrdh Super-Admin', 153, 157);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  const superText = '• Tenant Provisioning\n• Multi-Tier SaaS MRR\n• 18% GST Invoicing\n• 30-Min Impersonation\n• Immutable Audit Stream';
  doc.text(superText, 143, 167);

  // Legal Privacy Compliance Banner
  doc.setFillColor(6, 78, 59); // deep emerald
  doc.roundedRect(20, 218, pageWidth - 40, 28, 3, 3, 'F');
  doc.setTextColor(167, 243, 208);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('LEGAL & PRIVACY ARCHITECTURE GUARANTEE (INDIA DPDP ACT 2023)', 26, 226);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text('1. Location tracked strictly during active employee duty session with visible persistent indicator.', 26, 232);
  doc.text('2. Automatic GPS tracking termination immediately upon punch-out.', 26, 237);
  doc.text('3. Strict zero-access policy to employee personal WhatsApp, SMS, photo gallery, or browsing data.', 26, 242);

  // Meta Footer
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8.5);
  doc.text('Designed, Engineered & Operated by Savrdh Technologies', 20, 275);
  doc.text('Version 2.4.0-Enterprise • August 2026', pageWidth - 20, 275, { align: 'right' });


  // ==========================================
  // PAGE 2: EXECUTIVE KPI & REAL-TIME OPERATIONAL VISUALIZER
  // ==========================================
  doc.addPage();
  addHeader(2, 'Screen 01: Executive KPI Visualizer');

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Executive KPI & Operational Health Dashboard', 14, 26);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Real-time operational health, field telemetry coverage, and automated expense pipelines across all company branches.', 14, 32);

  // 4 Top Metric Cards
  const cards = [
    { title: 'Total Onboarded', val: '118 Officers', sub: '100% Verified Seats', bg: [248, 250, 252], border: [226, 232, 240], col: [15, 23, 42] },
    { title: 'Active Duty Today', val: '86 Officers', sub: '72.8% Field Coverage', bg: [236, 253, 245], border: [167, 243, 208], col: [6, 95, 70] },
    { title: 'Client Visits Logged', val: '68 Visits', sub: '94.1% Verified GPS', bg: [239, 246, 255], border: [191, 219, 254], col: [30, 64, 175] },
    { title: 'System Health Score', val: '96.4 / 100', sub: 'Optimal Field Performance', bg: [250, 245, 255], border: [233, 213, 255], col: [107, 33, 168] },
  ];

  cards.forEach((c, idx) => {
    const x = 14 + idx * 46;
    doc.setFillColor(c.bg[0], c.bg[1], c.bg[2]);
    doc.setDrawColor(c.border[0], c.border[1], c.border[2]);
    doc.roundedRect(x, 38, 43, 24, 2, 2, 'FD');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(c.title, x + 3, 44);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(c.col[0], c.col[1], c.col[2]);
    doc.text(c.val, x + 3, 52);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(c.sub, x + 3, 58);
  });

  // Middle Section: Attendance Distribution Table & Chart Simulation
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 68, pageWidth - 28, 85, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Today’s Shift Attendance Distribution Register', 20, 76);

  // Table Headers
  doc.setFillColor(241, 245, 249);
  doc.rect(20, 81, pageWidth - 40, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('CATEGORY / STATUS', 24, 85.5);
  doc.text('COUNT', 90, 85.5);
  doc.text('PERCENTAGE', 120, 85.5);
  doc.text('STATUS NOTE / ACTION', 150, 85.5);

  const tableRows = [
    { cat: 'Present & On-Field Duty', count: '86 Officers', pct: '72.8%', note: 'GPS Stream Active (±3.8m)', col: [16, 185, 129] },
    { cat: 'Late Punch-Ins (Regularization Pending)', count: '6 Officers', pct: '5.1%', note: 'Traffic delays reported', col: [245, 158, 11] },
    { cat: 'Approved Casual & Sick Leaves', count: '4 Officers', pct: '3.4%', note: 'HR approved in portal', col: [59, 130, 246] },
    { cat: 'Weekly Scheduled Off-Duty', count: '18 Officers', pct: '15.3%', note: 'Roster rotation compliance', col: [148, 163, 184] },
    { cat: 'Unexcused Absent / No Punch', count: '4 Officers', pct: '3.4%', note: 'Auto-flagged to Branch Manager', col: [239, 68, 68] },
  ];

  tableRows.forEach((r, i) => {
    const y = 94 + i * 9;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(r.cat, 24, y);
    doc.text(r.count, 90, y);
    doc.setFont('helvetica', 'bold');
    doc.text(r.pct, 120, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(r.note, 150, y);

    // subtle separator line
    doc.setDrawColor(241, 245, 249);
    doc.line(20, y + 2.5, pageWidth - 20, y + 2.5);
  });

  // Expense Claims Breakdown Panel
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 160, pageWidth - 28, 70, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Expense Reimbursement Pipeline (August 2026)', 20, 168);

  const expBoxes = [
    { title: 'Total Fuel Claims', amt: '₹28,450', count: '38 Requests', bg: [248, 250, 252] },
    { title: 'Food & Daily Allowance', amt: '₹14,350', count: '29 Requests', bg: [248, 250, 252] },
    { title: 'Approved & Disbursed', amt: '₹34,200', count: '100% Verified Receipts', bg: [236, 253, 245] },
    { title: 'Audit Flagged (Distance Mismatch)', amt: '₹2,400', count: '2 Under Investigation', bg: [254, 242, 242] },
  ];

  expBoxes.forEach((eb, idx) => {
    const x = 20 + idx * 43.5;
    doc.setFillColor(eb.bg[0], eb.bg[1], eb.bg[2]);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, 174, 40, 28, 2, 2, 'FD');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(eb.title, x + 2.5, 180);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(eb.amt, x + 2.5, 189);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(eb.count, x + 2.5, 196);
  });

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('• Automated Fuel Calculation: Distance computed from verified GPS route breadcrumbs multiplied by company per-km rate (₹4.50/km for 2-Wheelers, ₹9.00/km for 4-Wheelers).', 20, 214);
  doc.text('• Anti-Fraud Engine: Discrepancies between submitted odometer photos and GPS odometer are flagged for manager review.', 20, 220);

  addFooter(2, 6);


  // ==========================================
  // PAGE 3: COMPANY ADMIN & GOOGLE MAPS TELEMETRY
  // ==========================================
  doc.addPage();
  addHeader(3, 'Screen 02: Company Admin Live Map');

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Company Admin Console — Google Maps Live Grid', 14, 26);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Real-time field officer tracking, dynamic route breadcrumbs, battery monitoring, and visit validations.', 14, 32);

  // Map Mockup Container
  doc.setFillColor(15, 23, 42); // dark map background
  doc.roundedRect(14, 38, pageWidth - 28, 110, 3, 3, 'F');

  // Map Top Bar
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(18, 42, pageWidth - 36, 10, 2, 2, 'F');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Delhi-NCR Live Field Grid • Google Maps Platform SDK', 24, 48.5);

  doc.setTextColor(16, 185, 129);
  doc.text('● 4 Active Officers Tracked  |  GPS Accuracy ±3.8m  |  Refresh: 5s', pageWidth - 24, 48.5, { align: 'right' });

  // Map Canvas Vector Elements
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.4);
  // Grid Lines
  for (let i = 0; i < 7; i++) {
    doc.line(20 + i * 24, 56, 20 + i * 24, 142);
  }
  for (let j = 0; j < 4; j++) {
    doc.line(20, 60 + j * 24, pageWidth - 20, 60 + j * 24);
  }

  // Simulated Road Arteries
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(2);
  doc.line(25, 120, 180, 75);
  doc.line(70, 56, 85, 140);
  doc.line(140, 56, 130, 140);

  // Green Trajectory Breadcrumb
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(1.5);
  doc.line(40, 115, 75, 100);
  doc.line(75, 100, 115, 85);
  doc.line(115, 85, 150, 78);

  // Map Pins
  // Pin 1: Rahul Sharma
  doc.setFillColor(16, 185, 129);
  doc.circle(150, 78, 4.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('RS', 148, 80);
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(132, 84, 38, 7, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Rahul Sharma (CP Outlet • 18km/h)', 134, 88.5);

  // Pin 2: Priya Verma
  doc.setFillColor(16, 185, 129);
  doc.circle(85, 105, 4.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('PV', 83.2, 107);
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(70, 111, 34, 7, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Priya Verma (Cyber Hub)', 72, 115.5);

  // Pin 3: Amit Kumar (Break)
  doc.setFillColor(245, 158, 11);
  doc.circle(115, 125, 4.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('AK', 113.2, 127);
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(102, 131, 28, 7, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Amit Kumar (On Break)', 104, 135.5);

  // Bottom Detail Cards: Officer Dossier & Shift Register
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 154, 88, 85, 3, 3, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Active Officer Dossier: Rahul Sharma', 20, 163);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('• Employee ID: AKBS-FLD-102 (Senior Farm Officer)', 20, 172);
  doc.text('• Shift: General Field (09:00 - 18:00)', 20, 178);
  doc.text('• Punch-In Time: 08:54 AM (Sector 18 Noida)', 20, 184);
  doc.text('• Telemetry Battery: 74% (Good) | Speed: 18 km/h', 20, 190);
  doc.text('• Verified Geotrack Waypoints Today:', 20, 198);
  doc.setTextColor(100, 116, 139);
  doc.text('   - 08:54 AM: Sector 18 Market Punch-In (±3.8m)', 20, 204);
  doc.text('   - 11:30 AM: Lodhi Colony Fresh Mart (Check-in Verified)', 20, 210);
  doc.text('   - 03:45 PM: Connaught Place Retail Hub (In Progress)', 20, 216);
  doc.text('• Total Distance Traveled: 28.4 km', 20, 224);

  // Right Box: Payroll CSV Export
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(108, 154, pageWidth - 122, 85, 3, 3, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Automated Attendance & Payroll Engine', 114, 163);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('• Shift Regularization Workflow: Managers can approve traffic delays with one click.', 114, 172);
  doc.text('• Direct Payroll CSV Export: Standard formats compatible with RazorpayX, Keka, and Zoho Payroll.', 114, 180);
  doc.text('• Verified Allowances: Automatic computation of travel allowance based on route logs.', 114, 188);
  doc.text('• Audit Logs: Every manager override is permanently saved to compliance logs.', 114, 196);

  doc.setFillColor(236, 253, 245);
  doc.roundedRect(114, 204, pageWidth - 134, 25, 2, 2, 'F');
  doc.setTextColor(6, 95, 70);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('1-CLICK PAYROLL CSV EXPORT READY', 118, 211);
  doc.setFont('helvetica', 'normal');
  doc.text('Includes Net Days Present, Overtime Hours, Verified Travel Allowances, and TDS deductibles.', 118, 217);
  doc.text('Export format: CSV / Excel / JSON API.', 118, 223);

  addFooter(3, 6);


  // ==========================================
  // PAGE 4: EMPLOYEE ANDROID PWA MOCKUPS
  // ==========================================
  doc.addPage();
  addHeader(4, 'Screen 03: Employee Android PWA');

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Employee Android-First PWA Mobile Mockups', 14, 26);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('High-contrast, compact mobile experience optimized for 4G/2G field conditions with full offline caching.', 14, 32);

  // 3 Mobile Viewport Mockups
  const pwaScreens = [
    {
      title: 'Duty Punch & Timer',
      sub: '1-Tap GPS Duty Punch',
      bg: [248, 250, 252],
      render: (x: number, y: number) => {
        // Status Bar
        doc.setFillColor(15, 23, 42);
        doc.roundedRect(x + 2, y + 2, 54, 8, 1, 1, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6);
        doc.text('09:41  •  FieldSure 4G', x + 5, y + 7.5);

        // Employee Info
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.text('Rahul Sharma', x + 5, y + 17);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text('AKBS-FLD-102 • General Shift', x + 5, y + 21);

        // Location Tracking Banner
        doc.setFillColor(16, 185, 129);
        doc.roundedRect(x + 4, y + 24, 50, 9, 1.5, 1.5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(5.5);
        doc.setFont('helvetica', 'bold');
        doc.text('● Location Tracking Active (Consent Verified)', x + 6, y + 30);

        // Timer Card
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(x + 4, y + 36, 50, 32, 2, 2, 'FD');
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(6);
        doc.text('DUTY TIME ELAPSED', x + 12, y + 43);
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('06h : 22m : 14s', x + 10, y + 53);
        doc.setFontSize(5.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(16, 185, 129);
        doc.text('Punched in at 08:54 AM (Noida)', x + 9, y + 61);

        // Actions
        doc.setFillColor(245, 158, 11);
        doc.roundedRect(x + 4, y + 72, 50, 8, 1.5, 1.5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');
        doc.text('Take Official Rest / Lunch Break', x + 9, y + 77.5);

        doc.setFillColor(225, 29, 72);
        doc.roundedRect(x + 4, y + 83, 50, 9, 1.5, 1.5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');
        doc.text('🛑 Punch-Out (Stop GPS Tracking)', x + 8, y + 89);
      }
    },
    {
      title: 'Geofenced Client Visits',
      sub: 'Proof of Visit & Geofence',
      bg: [248, 250, 252],
      render: (x: number, y: number) => {
        doc.setFillColor(15, 23, 42);
        doc.roundedRect(x + 2, y + 2, 54, 8, 1, 1, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6);
        doc.text('09:41  •  Client Visits', x + 5, y + 7.5);

        doc.setTextColor(15, 23, 42);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.text('Assigned Field Visits (3)', x + 5, y + 17);

        // Visit 1: Completed
        doc.setFillColor(236, 253, 245);
        doc.setDrawColor(167, 243, 208);
        doc.roundedRect(x + 4, y + 22, 50, 22, 1.5, 1.5, 'FD');
        doc.setTextColor(6, 95, 70);
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'bold');
        doc.text('Nature Fresh Mart', x + 6, y + 28);
        doc.setFontSize(5.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text('CP Inner Circle • Checked In 11:30 AM', x + 6, y + 34);
        doc.setTextColor(16, 185, 129);
        doc.text('✓ GPS Geofence Matched (8.5m)', x + 6, y + 40);

        // Visit 2: Next
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(x + 4, y + 48, 50, 22, 1.5, 1.5, 'FD');
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'bold');
        doc.text('Le Meridien Kitchen Hub', x + 6, y + 54);
        doc.setFontSize(5.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text('Janpath Road • Scheduled 04:30 PM', x + 6, y + 60);
        doc.setTextColor(59, 130, 246);
        doc.text('Bulk poultry supply contract', x + 6, y + 66);

        // Action Photo
        doc.setFillColor(37, 99, 235);
        doc.roundedRect(x + 4, y + 76, 50, 16, 1.5, 1.5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');
        doc.text('📸 Take Geotagged Client Photo', x + 8, y + 83);
        doc.setFontSize(5);
        doc.setFont('helvetica', 'normal');
        doc.text('Embeds GPS Watermark & Timestamp', x + 9, y + 88);
      }
    },
    {
      title: 'Expense & Offline Sync',
      sub: 'Fuel Claims & Local Cache',
      bg: [248, 250, 252],
      render: (x: number, y: number) => {
        doc.setFillColor(15, 23, 42);
        doc.roundedRect(x + 2, y + 2, 54, 8, 1, 1, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6);
        doc.text('09:41  •  Expense Claims', x + 5, y + 7.5);

        doc.setTextColor(15, 23, 42);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.text('Submit Travel / Fuel Claim', x + 5, y + 17);

        // Fuel Box
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(x + 4, y + 22, 50, 26, 1.5, 1.5, 'FD');
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(5.5);
        doc.text('CLAIM AMOUNT', x + 6, y + 28);
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('₹680.00', x + 6, y + 37);
        doc.setFontSize(5.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text('CNG Fuel • 28.4km route verified', x + 6, y + 44);

        // Offline Box
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(x + 4, y + 52, 50, 20, 1.5, 1.5, 'F');
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');
        doc.text('📴 Offline Storage Engine', x + 6, y + 58);
        doc.setFontSize(5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text('IndexedDB locally buffers all GPS coordinates & photos when network is lost. Auto-syncs on reconnect.', x + 6, y + 63, { maxWidth: 46 });

        // Submit
        doc.setFillColor(15, 23, 42);
        doc.roundedRect(x + 4, y + 76, 50, 16, 1.5, 1.5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');
        doc.text('🧾 Submit Claim with Receipt', x + 9, y + 83);
        doc.setFontSize(5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text('Auto-routes to Manager for approval', x + 9, y + 88);
      }
    }
  ];

  pwaScreens.forEach((scr, idx) => {
    const x = 14 + idx * 62;
    const y = 40;

    // Phone Frame
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(x, y, 58, 106, 5, 5, 'F');

    // Phone Inner Screen
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x + 2, y + 2, 54, 102, 3, 3, 'F');

    // Render contents
    scr.render(x, y);

    // Title beneath
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(scr.title, x + 29, y + 114, { align: 'center' });

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(scr.sub, x + 29, y + 119, { align: 'center' });
  });

  // Feature Highlights Bottom Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 168, pageWidth - 28, 70, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Progressive Web App (PWA) Architectural Advantages', 20, 177);

  const pwaFeatures = [
    { title: 'Zero App Store Friction', desc: 'Installed directly from browser via Web App Manifest with service worker caching.' },
    { title: 'Low Battery Consumption', desc: 'Adaptive GPS sampling throttles interval when employee is stationary (accelerometer fused).' },
    { title: 'Full Offline Survivability', desc: 'All duty actions, breaks, and visits are buffered in IndexedDB and synchronized automatically.' },
    { title: 'Watermarked Photo Proof', desc: 'Client visit verification photos are stamped on canvas with lat/lng, address, and timestamp.' },
  ];

  pwaFeatures.forEach((f, idx) => {
    const fx = 20 + (idx % 2) * 88;
    const fy = 186 + Math.floor(idx / 2) * 22;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`✓ ${f.title}`, fx, fy);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(f.desc, fx + 4, fy + 5, { maxWidth: 82 });
  });

  addFooter(4, 6);


  // ==========================================
  // PAGE 5: SAVRDH SUPER-ADMIN SAAS GOVERNANCE
  // ==========================================
  doc.addPage();
  addHeader(5, 'Screen 04: Savrdh Super-Admin Panel');

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Savrdh Super-Admin SaaS Governance & Billing', 14, 26);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Multi-tenant company provisioning, automated GST billing, seat governance, and cryptographically audited support impersonation.', 14, 32);

  // Top Metrics
  const superMetrics = [
    { title: 'Monthly SaaS MRR', val: '₹63,423', sub: '+18% vs last month', bg: [250, 245, 255], border: [233, 213, 255], col: [107, 33, 168] },
    { title: 'Active Tenant Companies', val: '3 Enterprises', sub: '191 Active Field Seats', bg: [248, 250, 252], border: [226, 232, 240], col: [15, 23, 42] },
    { title: 'Global Platform Uptime', val: '99.98%', sub: 'Zero GPS Engine Outages', bg: [236, 253, 245], border: [167, 243, 208], col: [6, 95, 70] },
    { title: 'GST Invoices Paid', val: '100%', sub: 'Razorpay & Cashfree API', bg: [239, 246, 255], border: [191, 219, 254], col: [30, 64, 175] },
  ];

  superMetrics.forEach((m, idx) => {
    const x = 14 + idx * 46;
    doc.setFillColor(m.bg[0], m.bg[1], m.bg[2]);
    doc.setDrawColor(m.border[0], m.border[1], m.border[2]);
    doc.roundedRect(x, 38, 43, 24, 2, 2, 'FD');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(m.title, x + 3, 44);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(m.col[0], m.col[1], m.col[2]);
    doc.text(m.val, x + 3, 52);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(m.sub, x + 3, 58);
  });

  // Tenant Provisioning Ledger Table
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 68, pageWidth - 28, 80, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Multi-Tenant Provisioning & Subscription Ledger', 20, 76);

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(20, 81, pageWidth - 40, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('TENANT NAME', 24, 85.5);
  doc.text('PLAN TIER', 75, 85.5);
  doc.text('ACTIVE SEATS', 105, 85.5);
  doc.text('MONTHLY BILLING (GST)', 135, 85.5);
  doc.text('STATUS', 175, 85.5);

  const tenantRows = [
    { name: 'AKBS Poultry Pvt Ltd', plan: 'Enterprise', seats: '118 / 150', bill: '₹42,480 /mo', stat: '● Active' },
    { name: 'NCR Field Services Ltd', plan: 'Growth', seats: '54 / 80', bill: '₹16,225 /mo', stat: '● Active' },
    { name: 'Bright Retail Network', plan: 'Starter', seats: '19 / 30', bill: '₹4,718 /mo', stat: '● 14-Day Trial' },
  ];

  tenantRows.forEach((tr, i) => {
    const y = 95 + i * 11;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(tr.name, 24, y);

    doc.setFont('helvetica', 'normal');
    doc.text(tr.plan, 75, y);
    doc.text(tr.seats, 105, y);
    doc.setFont('helvetica', 'bold');
    doc.text(tr.bill, 135, y);
    doc.setTextColor(16, 185, 129);
    doc.text(tr.stat, 175, y);

    doc.setDrawColor(241, 245, 249);
    doc.line(20, y + 3.5, pageWidth - 20, y + 3.5);
  });

  // Audited Impersonation & Security Section
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(14, 154, pageWidth - 28, 85, 3, 3, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text('Cryptographically Audited Super-Admin Impersonation Protocol', 20, 164);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('When Savrdh support engineers access a tenant account for technical troubleshooting:', 20, 172);

  const impSteps = [
    '1. 30-Minute Hard Time-Limit: Impersonation token expires automatically after 30 minutes without exception.',
    '2. Mandatory Access Reason: Support engineer must specify ticket ID and authorized client contact name.',
    '3. Immutable Audit Record: Actor IP, user agent, timestamp, and all mutations are logged to a write-only audit trail.',
    '4. Tenant Visible Notification: Company Admin sees active support badge with 1-click session revocation.',
  ];

  impSteps.forEach((s, idx) => {
    doc.text(s, 20, 182 + idx * 8);
  });

  doc.setFillColor(30, 41, 59);
  doc.roundedRect(20, 214, pageWidth - 40, 18, 2, 2, 'F');
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.text('GST Invoicing API Integration: Integrated with ClearTax and Razorpay Invoices. Generates IRN and QR code for Indian GST compliance on every monthly subscription debit.', 24, 222, { maxWidth: pageWidth - 48 });

  addFooter(5, 6);


  // ==========================================
  // PAGE 6: DATABASE SCHEMA & DPDP SECURITY
  // ==========================================
  doc.addPage();
  addHeader(6, 'Technical Specs: Schema & DPDP Rules');

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Multi-Tenant Database Schema & Firestore Security Rules', 14, 26);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Complete data model hierarchy and cryptographically enforced access control specifications.', 14, 32);

  // Firestore Schema Grid
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 38, pageWidth - 28, 85, 3, 3, 'FD');

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Multi-Tenant Firestore Collection Hierarchy', 20, 46);

  const collections = [
    { path: '/tenants/{tenantId}', desc: 'Company metadata, subscription plan, GST details, seat allocation quota, and custom branding config.' },
    { path: '/tenants/{tenantId}/users/{userId}', desc: 'Employee profile, assigned role (admin/officer), supervisor ID, phone, and DPDP consent record.' },
    { path: '/tenants/{tenantId}/dutySessions/{sessionId}', desc: 'Duty punch-in/out timestamps, battery logs, break periods, and GPS route breadcrumb points array.' },
    { path: '/tenants/{tenantId}/fieldVisits/{visitId}', desc: 'Client geofence coordinates, verified check-in timestamp, distance delta, notes, and photo proof URL.' },
    { path: '/tenants/{tenantId}/expenseClaims/{claimId}', desc: 'Fuel/travel reimbursement claims, amount, receipt image proof, GPS distance comparison, and status.' },
    { path: '/tenants/{tenantId}/auditLogs/{logId}', desc: 'Immutable write-only security log stream recording actor ID, IP address, timestamp, and modification payload.' },
  ];

  collections.forEach((col, idx) => {
    const cy = 54 + idx * 11;
    doc.setFontSize(8);
    doc.setFont('courier', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(col.path, 20, cy);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(col.desc, 90, cy, { maxWidth: pageWidth - 110 });

    doc.setDrawColor(241, 245, 249);
    doc.line(20, cy + 3.5, pageWidth - 20, cy + 3.5);
  });

  // Firestore Rules Code Box
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(14, 128, pageWidth - 28, 62, 3, 3, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 211, 153);
  doc.text('firestore.rules (Tenant Isolation & Role-Based Access Control)', 20, 136);

  doc.setFontSize(7);
  doc.setFont('courier', 'normal');
  doc.setTextColor(226, 232, 240);
  const rulesCode = [
    `rules_version = '2';`,
    `service cloud.firestore {`,
    `  match /databases/{database}/documents {`,
    `    function isSuperAdmin() { return request.auth.token.role == 'super_admin'; }`,
    `    function isTenantUser(tenantId) { return request.auth.token.tenantId == tenantId; }`,
    `    function isCompanyAdmin(tenantId) {`,
    `      return isTenantUser(tenantId) && request.auth.token.role in ['company_admin', 'manager'];`,
    `    }`,
    `    match /tenants/{tenantId}/{document=**} {`,
    `      allow read, write: if isSuperAdmin() || isTenantUser(tenantId);`,
    `    }`,
    `  }`,
    `}`
  ];

  rulesCode.forEach((line, i) => {
    doc.text(line, 20, 142 + i * 3.8);
  });

  // DPDP Compliance Matrix
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(14, 194, pageWidth - 28, 44, 3, 3, 'FD');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 95, 70);
  doc.text('India Digital Personal Data Protection (DPDP) Act 2023 Compliance Matrix', 20, 202);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(6, 95, 70);
  doc.text('• Purpose Limitation: GPS data is strictly recorded for verified duty hours, field dispatch, and client visit reimbursement.', 20, 209);
  doc.text('• Data Minimization: Zero access to employee personal apps, call logs, SMS, photos outside visit uploads.', 20, 215);
  doc.text('• Storage Limitation: Automated 30/60/90-day GPS purge job runs on Cloud Functions based on tenant policy.', 20, 221);
  doc.text('• Right to Grievance Redressal: Employee can view complete audit logs of when and who viewed their location history.', 20, 227);
  doc.text('• Consent Management: Versioned consent timestamp is cryptographically attached to every user profile record.', 20, 233);

  addFooter(6, 6);

  // Save to /public and /dist
  const pdfBytes = doc.output('arraybuffer');
  
  if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
    fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
  }

  const publicPath = path.join(process.cwd(), 'public', 'FieldSure_SaaS_All_Mockups_Savrdh_Dossier.pdf');
  fs.writeFileSync(publicPath, Buffer.from(pdfBytes));
  console.log(`Successfully generated PDF dossier at: ${publicPath}`);

  if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
    const distPath = path.join(process.cwd(), 'dist', 'FieldSure_SaaS_All_Mockups_Savrdh_Dossier.pdf');
    fs.writeFileSync(distPath, Buffer.from(pdfBytes));
    console.log(`Also copied to dist at: ${distPath}`);
  }
}

generateFieldSurePdf();
