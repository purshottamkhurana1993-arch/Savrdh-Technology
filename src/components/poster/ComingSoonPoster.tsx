import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Download, 
  Printer, 
  Calendar, 
  ShieldCheck, 
  Smartphone, 
  Building2, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Zap, 
  ArrowRight, 
  Mail, 
  Share2, 
  Layers, 
  Lock, 
  Eye,
  Star,
  Award,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FieldSureLogo } from '../common/FieldSureLogo';
import { generateAndDownloadPosterPdf } from '../../utils/generatePosterPdf';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const ComingSoonPoster: React.FC = () => {
  const { setViewMode, showToast, language } = useApp();
  const posterRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [teamSize, setTeamSize] = useState('20-100');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [posterTheme, setPosterTheme] = useState<'dark' | 'emerald'>('dark');

  // Countdown to Launch Date: October 15, 2026
  const [timeLeft, setTimeLeft] = useState({
    days: 58,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const generatedTicket = `FS-VIP-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedTicket);
    setIsSubmitted(true);
    showToast(`🎉 VIP Early Access reserved! Ticket: ${generatedTicket}`);
  };

  const handleDownloadPosterPdf = async () => {
    setIsExporting(true);
    showToast('📄 Generating High-Resolution Vector Poster PDF...');

    try {
      // Primary: Instant, flawless vector jsPDF generator
      generateAndDownloadPosterPdf(posterTheme);
      showToast('✅ Coming Soon Poster PDF downloaded successfully!');
    } catch (err) {
      console.warn('Vector PDF generation fallback:', err);
      // Fallback: direct download link
      const link = document.createElement('a');
      link.href = '/FieldSure_Coming_Soon_Poster_Savrdh.pdf';
      link.download = `FieldSure_Coming_Soon_Poster_Savrdh_${posterTheme.toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('✅ Downloaded pre-rendered High-DPI Poster PDF!');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!posterRef.current) return;
    setIsExporting(true);
    showToast('🖼️ Generating High-Resolution Poster Image (PNG)...');

    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: posterTheme === 'dark' ? '#0a0f1d' : '#062c22'
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `FieldSure_Coming_Soon_Poster_${posterTheme.toUpperCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('✅ High-Resolution Poster Image (PNG) downloaded!');
    } catch (err) {
      console.error(err);
      // Direct static image fallback
      const link = document.createElement('a');
      link.href = '/fieldsure_launch_poster.jpg';
      link.download = 'FieldSure_Launch_Artwork_Savrdh.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('✅ Downloaded high-res artwork asset!');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintPoster = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Top Toolbar (Hidden when printing) */}
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Official Launch Poster
            </span>
            <span className="text-xs text-slate-500">• Q4 2026 Global Release</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 mt-1">FieldSure™ Official "Coming Soon" Promotional Poster</h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setPosterTheme('dark')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                posterTheme === 'dark'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Midnight Tech
            </button>
            <button
              onClick={() => setPosterTheme('emerald')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                posterTheme === 'emerald'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Savrdh Emerald
            </button>
          </div>

          <button
            onClick={handleDownloadPosterPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            title="Download crisp Vector A4 PDF Poster"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isExporting ? 'Exporting...' : 'Download Vector PDF'}</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            title="Download High-Resolution Image (PNG)"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Download Image (PNG)</span>
          </button>

          <button
            onClick={handlePrintPoster}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print High-DPI</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* THE OFFICIAL HIGH-IMPACT POSTER CONTAINER (PRINTABLE & EXPORTABLE) */}
      {/* ============================================================ */}
      <div 
        ref={posterRef}
        className={`relative overflow-hidden rounded-3xl border shadow-2xl p-6 sm:p-10 transition-colors duration-500 ${
          posterTheme === 'dark' 
            ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-slate-800 text-white' 
            : 'bg-gradient-to-b from-emerald-950 via-slate-900 to-emerald-950 border-emerald-800/60 text-white'
        }`}
        style={{ minHeight: '880px' }}
      >
        {/* Background Ambient Glow Accents */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Poster Header Grid */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-slate-950 font-black text-2xl tracking-tighter">F✓</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">FieldSure™</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Enterprise SaaS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Engineered & Operated by <strong>Savrdh Technologies</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Launch Target</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Q4 • October 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Hero Showcase Section */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center">
          
          {/* Left Column: Bold Typography, Tagline, & Countdown */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-300">The Next Era of Field Workforce Intelligence</span>
            </div>

            {/* Giant Title */}
            <div className="space-y-2">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Workforce Telemetry. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Transparent & Consent-Driven.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed pt-2">
                Say goodbye to invasive surveillance and inaccurate manual registers. FieldSure provides live GPS telemetry, Android-first offline PWA duty punching, instant geofenced visit verification, and automated 1-click payroll CSV generation.
              </p>
            </div>

            {/* Live Launch Countdown Timer */}
            <div className="bg-slate-900/90 border border-slate-700/70 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Official Public Launch Countdown
                </span>
                <span className="text-[11px] text-slate-400">Target Release: Oct 15, 2026</span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-2">
                  <div className="text-2xl sm:text-3xl font-black text-white">{timeLeft.days}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">Days</div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-2">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">{timeLeft.hours}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">Hours</div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-2">
                  <div className="text-2xl sm:text-3xl font-black text-teal-300">{timeLeft.minutes}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">Minutes</div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-2">
                  <div className="text-2xl sm:text-3xl font-black text-cyan-400 animate-pulse">{timeLeft.seconds}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">Seconds</div>
                </div>
              </div>
            </div>

            {/* Core Feature Matrix */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Google Maps Live Grid</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Live officer tracking with ±3.8m accuracy & route breadcrumbs.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Offline Android PWA</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">IndexedDB caching for zero data loss in 2G/remote field zones.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">DPDP Act 2023 Lawful</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tracking ends upon punch-out. Zero personal media access.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Enterprise Multi-Tenant</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Automated 18% GST invoices & instant RazorpayX / Keka payroll CSV.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: High-Res Cinematic Visual Artwork & Badge */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group">
              {/* Generated Image Asset */}
              <img
                src="/fieldsure_launch_poster.jpg"
                alt="FieldSure Enterprise SaaS Coming Soon Launch Artwork"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlaid Holographic Badge */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">Savrdh Cloud Suite</div>
                  <div className="text-xs font-bold text-white">Multi-Tenant Tenant Isolation</div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  ISO 27001 Aligned
                </div>
              </div>
            </div>

            {/* Sub-quote */}
            <p className="text-[11px] text-slate-400 text-center italic mt-3 max-w-xs">
              "Empowering Indian enterprise field-forces with transparent, lawful, and high-efficiency mobile workflows."
            </p>
          </div>

        </div>

        {/* Early Access Registration Banner */}
        <div className="relative z-10 mt-8 pt-8 border-t border-slate-800/80">
          {!isSubmitted ? (
            <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>Reserve VIP Early-Bird Access & 60-Day Extended Pilot</span>
                </h3>
                <p className="text-xs text-slate-400 max-w-lg">
                  Be among the first 50 enterprise companies to get early deployment support, free custom geofencing setup, and locked-in lifetime renewal rates.
                </p>
              </div>

              <form onSubmit={handleRegister} className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter work email address..."
                  className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  Join VIP Waitlist
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-2 animate-in fade-in zoom-in-95">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">VIP Early-Access Confirmed!</h3>
              <p className="text-xs text-emerald-200">
                Your Priority Ticket ID: <strong className="text-white font-mono bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/30">{ticketId}</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                A Savrdh enterprise specialist will contact <strong>{email}</strong> prior to the Q4 launch date.
              </p>
            </div>
          )}
        </div>

        {/* Poster Footer Legal Stamp */}
        <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">FieldSure™ SaaS</span>
            <span>• Property of <strong>Savrdh Technologies</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <Lock className="w-3 h-3" /> Privacy controls aligned to DPDP Act 2023 principles
            </span>
            <span>•</span>
            <span>Made in India for Global Enterprises</span>
          </div>
        </div>

      </div>

    </div>
  );
};
