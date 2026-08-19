import { jsPDF } from 'jspdf';

export function generateAndDownloadPosterPdf(theme: 'dark' | 'emerald' = 'dark'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

  // Background Canvas
  if (theme === 'dark') {
    doc.setFillColor(10, 15, 29); // slate-950
  } else {
    doc.setFillColor(6, 44, 34); // emerald-950
  }
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Neon Glow Bar
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Ambient Inner Glow Container
  doc.setFillColor(theme === 'dark' ? 15 : 10, theme === 'dark' ? 23 : 55, theme === 'dark' ? 42 : 45);
  doc.roundedRect(10, 12, pageWidth - 20, pageHeight - 24, 6, 6, 'F');
  doc.setDrawColor(theme === 'dark' ? 51 : 16, theme === 'dark' ? 65 : 185, theme === 'dark' ? 85 : 129);
  doc.setLineWidth(0.4);
  doc.roundedRect(10, 12, pageWidth - 20, pageHeight - 24, 6, 6, 'S');

  // ==========================================
  // 1. POSTER HEADER & BRANDING
  // ==========================================
  // Brand Icon Logo
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(16, 18, 14, 14, 3, 3, 'F');
  doc.setTextColor(10, 15, 29);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('F✓', 20.5, 27.5);

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('FieldSure™', 34, 25);

  // Tag & Owner
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Next-Gen Workforce SaaS  •  Engineered & Operated by Savrdh Technologies', 34, 30);

  // Launch Target Badge (Right Side)
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - 68, 18, 52, 14, 3, 3, 'F');
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.3);
  doc.roundedRect(pageWidth - 68, 18, 52, 14, 3, 3, 'S');

  doc.setTextColor(16, 185, 129);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL LAUNCH TARGET', pageWidth - 42, 23, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('Q4 • OCTOBER 2026', pageWidth - 42, 29, { align: 'center' });

  // Divider Line
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.3);
  doc.line(16, 36, pageWidth - 16, 36);

  // ==========================================
  // 2. HERO STATEMENT & BADGES
  // ==========================================
  // Eyebrow Status Pill
  doc.setFillColor(16, 185, 129, 0.15);
  doc.setFillColor(20, 35, 50);
  doc.roundedRect(16, 42, 90, 7, 3.5, 3.5, 'F');
  doc.setTextColor(52, 211, 153);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('●  THE NEXT ERA OF WORKFORCE TELEMETRY', 20, 47);

  // Big Bold Headline
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Workforce Telemetry.', 16, 58);

  doc.setTextColor(52, 211, 153); // Emerald gradient effect
  doc.text('Transparent & Consent-Driven.', 16, 67);

  // Subtitle Paragraph
  doc.setTextColor(203, 213, 225);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Say goodbye to invasive surveillance and inaccurate manual registers.', 16, 75);
  doc.text('FieldSure delivers live GPS telemetry, Android-first offline PWA duty punching,', 16, 80);
  doc.text('instant geofenced visit verification, and automated 1-click payroll CSV export.', 16, 85);

  // ==========================================
  // 3. COUNTDOWN BOX (LIVE LAUNCH TICKER)
  // ==========================================
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(16, 92, pageWidth - 32, 28, 4, 4, 'F');
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.4);
  doc.roundedRect(16, 92, pageWidth - 32, 28, 4, 4, 'S');

  doc.setTextColor(52, 211, 153);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('⏱  OFFICIAL PUBLIC LAUNCH COUNTDOWN', 22, 98);
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Target Release: October 15, 2026', pageWidth - 22, 98, { align: 'right' });

  // 4 Countdown Units (Days, Hours, Minutes, Seconds)
  const unitWidth = (pageWidth - 32 - 12 - 18) / 4;
  const unitY = 102;
  const unitH = 15;

  const timeUnits = [
    { num: '58', label: 'DAYS' },
    { num: '14', label: 'HOURS' },
    { num: '32', label: 'MINUTES' },
    { num: '45', label: 'SECONDS' }
  ];

  timeUnits.forEach((u, i) => {
    const unitX = 22 + i * (unitWidth + 4);
    doc.setFillColor(10, 15, 29);
    doc.roundedRect(unitX, unitY, unitWidth, unitH, 2, 2, 'F');
    doc.setDrawColor(51, 65, 85);
    doc.setLineWidth(0.2);
    doc.roundedRect(unitX, unitY, unitWidth, unitH, 2, 2, 'S');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(u.num, unitX + unitWidth / 2, unitY + 8, { align: 'center' });

    doc.setTextColor(52, 211, 153);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text(u.label, unitX + unitWidth / 2, unitY + 13, { align: 'center' });
  });

  // ==========================================
  // 4. CORE 4 PILLAR CARDS (2x2 GRID)
  // ==========================================
  const cardW = (pageWidth - 32 - 6) / 2;
  const cardH = 25;
  const gridY = 126;

  const pillars = [
    {
      title: '🛰️ Google Maps Live Telemetry',
      desc: '±3.8m real-time GPS accuracy, dynamic route breadcrumbs, live officer speed & halt duration tracking.'
    },
    {
      title: '📱 Offline Android PWA Engine',
      desc: '1-Tap duty punch-in, biometric/photo geo-tagging, IndexedDB local caching for 2G & remote dead-zones.'
    },
    {
      title: '🛡️ DPDP Act 2023 Lawful Consent',
      desc: 'Tracking ends permanently upon punch-out. Zero access to private WhatsApp, SMS, or personal media.'
    },
    {
      title: '🏢 Multi-Tenant SaaS & Payroll',
      desc: '18% GST automated invoices, instant RazorpayX / Keka CSV payroll export, and custom seat tiers.'
    }
  ];

  pillars.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = 16 + col * (cardW + 6);
    const cy = gridY + row * (cardH + 5);

    doc.setFillColor(15, 23, 42);
    doc.roundedRect(cx, cy, cardW, cardH, 3, 3, 'F');
    doc.setDrawColor(51, 65, 85);
    doc.setLineWidth(0.3);
    doc.roundedRect(cx, cy, cardW, cardH, 3, 3, 'S');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(p.title, cx + 4, cy + 6.5);

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    const splitDesc = doc.splitTextToSize(p.desc, cardW - 8);
    doc.text(splitDesc, cx + 4, cy + 12);
  });

  // ==========================================
  // 5. ARCHITECTURAL & COMPLIANCE BADGES (3 BOXES)
  // ==========================================
  const badgeY = 188;
  const badgeW = (pageWidth - 32 - 8) / 3;
  const badgeH = 20;

  const specBadges = [
    { title: 'ISO 27001 Certified', sub: 'Enterprise Security Posture' },
    { title: 'DPDP Act 2023 Lawful', sub: 'Strict Consent & Auto-Purge' },
    { title: 'Multi-Tenant Isolated', sub: 'Savrdh Cloud Suite (AWS/GCP)' }
  ];

  specBadges.forEach((b, i) => {
    const bx = 16 + i * (badgeW + 4);
    doc.setFillColor(20, 30, 48);
    doc.roundedRect(bx, badgeY, badgeW, badgeH, 2.5, 2.5, 'F');
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.2);
    doc.roundedRect(bx, badgeY, badgeW, badgeH, 2.5, 2.5, 'S');

    doc.setTextColor(52, 211, 153);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(b.title, bx + badgeW / 2, badgeY + 8, { align: 'center' });

    doc.setTextColor(203, 213, 225);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text(b.sub, bx + badgeW / 2, badgeY + 14, { align: 'center' });
  });

  // ==========================================
  // 6. VIP EARLY-BIRD ACCESS BANNER
  // ==========================================
  const vipY = 214;
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(16, vipY, pageWidth - 32, 44, 4, 4, 'F');
  doc.setDrawColor(245, 158, 11); // Amber accent
  doc.setLineWidth(0.5);
  doc.roundedRect(16, vipY, pageWidth - 32, 44, 4, 4, 'S');

  doc.setTextColor(245, 158, 11);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('⚡ RESERVE VIP EARLY-BIRD PILOT (FIRST 50 ENTERPRISES)', 22, vipY + 9);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('• 60-Day Extended Free Pilot with Dedicated Account Architect Support', 22, vipY + 16);
  doc.text('• Free Custom Geofencing & Office Polygon Mapping Setup', 22, vipY + 22);
  doc.text('• Locked-in Lifetime Renewal Discount & Priority SLA Dispatch', 22, vipY + 28);

  // VIP Ticket Tag
  doc.setFillColor(245, 158, 11);
  doc.roundedRect(pageWidth - 70, vipY + 12, 48, 22, 2.5, 2.5, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('PRIORITY ACCESS PASS', pageWidth - 46, vipY + 19, { align: 'center' });
  doc.setFontSize(10);
  doc.text('VIP-SAV-2026', pageWidth - 46, vipY + 28, { align: 'center' });

  // ==========================================
  // 7. FOOTER LEGAL & COPYRIGHT
  // ==========================================
  const footY = 268;
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.3);
  doc.line(16, footY, pageWidth - 16, footY);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('FieldSure™ Next-Gen Enterprise Field Workforce Platform', 16, footY + 6);
  doc.text('© 2026 Savrdh Technologies. All Rights Reserved. • Made in India for Global Enterprises', 16, footY + 10);

  doc.setTextColor(52, 211, 153);
  doc.setFont('helvetica', 'bold');
  doc.text('https://fieldsure.savrdh.com', pageWidth - 16, footY + 8, { align: 'right' });

  // Save the PDF
  doc.save(`FieldSure_Coming_Soon_Poster_Savrdh_${theme.toUpperCase()}.pdf`);
}
