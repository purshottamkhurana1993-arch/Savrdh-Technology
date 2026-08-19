import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Coffee, 
  Calendar, 
  FileText, 
  Receipt, 
  MessageSquare, 
  Shield, 
  HelpCircle, 
  Smartphone, 
  Play, 
  Square, 
  Camera, 
  Upload, 
  AlertCircle, 
  ArrowRight, 
  Radio, 
  Battery, 
  Wifi, 
  WifiOff, 
  Check, 
  Navigation,
  Send,
  Plus,
  RefreshCw,
  Eye,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FieldSureLogo } from '../common/FieldSureLogo';
import confetti from 'canvas-confetti';

export const EmployeePWA: React.FC = () => {
  const { 
    currentUser, 
    currentTenant, 
    currentDutySession, 
    punchIn, 
    punchOut, 
    startBreak, 
    endBreak, 
    consent, 
    updateConsent, 
    tasks, 
    updateTaskStatus, 
    fieldVisits, 
    checkInVisit, 
    checkOutVisit, 
    expenses, 
    submitExpense, 
    messages, 
    sendMessage, 
    leaves, 
    applyLeave, 
    attendanceRecords, 
    routePoints,
    isOffline,
    isMobileDeviceFrame,
    setIsMobileDeviceFrame,
    language 
  } = useApp();

  // Active PWA Tab
  const [activeTab, setActiveTab] = useState<'duty' | 'visits' | 'tasks' | 'expenses' | 'chat' | 'history' | 'privacy' | 'help'>('duty');

  // Duty session live timer
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(382 * 60);
  useEffect(() => {
    let interval: any = null;
    if (currentDutySession && currentDutySession.status === 'active') {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentDutySession]);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Form states
  const [breakReason, setBreakReason] = useState('Lunch Break');
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showVisitProofModal, setShowVisitProofModal] = useState<string | null>(null);
  const [visitProofNotes, setVisitProofNotes] = useState('');
  const [newChatText, setNewChatText] = useState('');

  // Expense form
  const [expCategory, setExpCategory] = useState<'Fuel / Travel' | 'Client Meal' | 'Lodging' | 'Vehicle Maintenance' | 'Mobile / Internet' | 'Other'>('Fuel / Travel');
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expReceiptAttached, setExpReceiptAttached] = useState(false);

  // Leave form
  const [leaveType, setLeaveType] = useState<'Casual' | 'Sick' | 'Earned' | 'Emergency'>('Casual');
  const [leaveStartDate, setLeaveStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [leaveEndDate, setLeaveEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [leaveReason, setLeaveReason] = useState('');

  const isDutyActive = currentDutySession && currentDutySession.status === 'active';
  const isOnBreak = currentDutySession && currentDutySession.status === 'on_break';

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.75 }
      });
    } catch (e) {}
  };

  const handlePunchIn = () => {
    punchIn();
    triggerConfetti();
  };

  const handlePunchOut = () => {
    punchOut();
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expAmount || isNaN(Number(expAmount))) return;
    submitExpense({
      userId: currentUser.id,
      employeeName: currentUser.fullName,
      date: new Date().toISOString().slice(0, 10),
      category: expCategory,
      amount: Number(expAmount),
      currency: 'INR',
      description: expDesc || `${expCategory} field claim`,
      receiptUrl: expReceiptAttached ? 'https://images.unsplash.com/photo-1554415707-9e49016a35f3?w=300&q=80' : undefined
    });
    setExpAmount('');
    setExpDesc('');
    setExpReceiptAttached(false);
    setShowExpenseModal(false);
    triggerConfetti();
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason) return;
    applyLeave({
      userId: currentUser.id,
      employeeName: currentUser.fullName,
      leaveType,
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      totalDays: 1,
      reason: leaveReason
    });
    setLeaveReason('');
    setShowLeaveModal(false);
    triggerConfetti();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;
    sendMessage(newChatText, 'all_team', 'Field Operations Team');
    setNewChatText('');
  };

  // Content for the mobile application
  const appContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans">
      
      {/* Mobile Top App Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            F✓
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              FieldSure <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-normal">Browser PWA</span>
            </h1>
            <p className="text-[11px] text-slate-400 truncate max-w-[170px]">{currentTenant.name}</p>
          </div>
        </div>

        {/* Battery & Online indicator */}
        <div className="flex items-center gap-2">
          {isOffline ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <WifiOff className="w-3 h-3" /> Offline Mode
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400">
              <Wifi className="w-3 h-3" />
            </span>
          )}
          <span className="text-[11px] text-slate-400 flex items-center gap-0.5" title="Battery status displayed only where supported and permitted by the device">
            <Battery className="w-3.5 h-3.5 text-emerald-400" /> 74%
          </span>
        </div>
      </div>

      {/* Mandatory PWA Limitation Notice */}
      <div className="px-3 py-1 bg-amber-500/10 border-b border-amber-500/20 text-[10px] text-amber-300 font-medium text-center">
        Limited browser version — continuous background location is not guaranteed.
      </div>

      {/* Mandatory Transparent Privacy Indicator: Duty Location Banner */}
      <div className={`px-3 py-1.5 text-[11px] font-medium border-b flex items-center justify-between shrink-0 ${
        isDutyActive 
          ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
          : isOnBreak 
          ? 'bg-amber-950/80 border-amber-800 text-amber-300'
          : 'bg-slate-800/80 border-slate-700 text-slate-400'
      }`}>
        <div className="flex items-center gap-1.5 truncate">
          <span className="relative flex h-2 w-2 shrink-0">
            {isDutyActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isDutyActive ? 'bg-emerald-500' : isOnBreak ? 'bg-amber-500' : 'bg-slate-500'}`}></span>
          </span>
          <span className="truncate">
            {isDutyActive ? 'Location tracking active (Duty hours only)' : isOnBreak ? 'Duty paused (On Break)' : 'Tracking stopped (Punch-In to start)'}
          </span>
        </div>
        <button 
          onClick={() => setActiveTab('privacy')}
          className="underline hover:text-white shrink-0 text-[10px] ml-2"
        >
          Consent Info
        </button>
      </div>

      {/* Main Scrollable Body Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950 text-slate-200">
        
        {/* ===================== TAB 1: DUTY PUNCH ===================== */}
        {activeTab === 'duty' && (
          <div className="space-y-4">
            
            {/* Employee Profile Header Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {currentUser.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">{currentUser.fullName}</h2>
                  <p className="text-xs text-slate-400">{currentUser.designation || 'Field Area Officer'}</p>
                  <span className="text-[10px] text-emerald-400 font-mono">{currentUser.employeeCode || 'AKBS-FLD-102'}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Shift Today</span>
                <span className="text-xs font-semibold text-slate-200">09:00 - 18:00</span>
              </div>
            </div>

            {/* Main Interactive Punch-In / Punch-Out Circle & Timer */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 rounded-3xl p-6 text-center space-y-5 shadow-lg relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {isDutyActive ? 'Active Duty Timer' : isOnBreak ? 'Break Elapsed' : 'Ready For Shift'}
                </span>
                <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
                  {isDutyActive || isOnBreak ? formatTimer(elapsedSeconds) : '00:00:00'}
                </div>
                <p className="text-xs text-slate-400">
                  {isDutyActive 
                    ? `Punched In at ${currentDutySession?.punchInTime}`
                    : isOnBreak
                    ? `Break started (${currentDutySession?.breaks[currentDutySession.breaks.length - 1]?.reason})`
                    : 'Tap below to record GPS start position'}
                </p>
              </div>

              {/* Big Action Button */}
              <div className="flex justify-center py-2">
                {!isDutyActive && !isOnBreak ? (
                  <button
                    onClick={handlePunchIn}
                    className="w-36 h-36 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-base shadow-xl shadow-emerald-950 flex flex-col items-center justify-center gap-1.5 border-4 border-emerald-400/30 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Play className="w-8 h-8 fill-white" />
                    <span>PUNCH IN</span>
                    <span className="text-[9px] font-normal text-emerald-100 opacity-80">Capture GPS</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePunchOut}
                    className="w-36 h-36 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold text-base shadow-xl shadow-rose-950 flex flex-col items-center justify-center gap-1.5 border-4 border-rose-400/30 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Square className="w-8 h-8 fill-white" />
                    <span>PUNCH OUT</span>
                    <span className="text-[9px] font-normal text-rose-100 opacity-80">Stop Tracking</span>
                  </button>
                )}
              </div>

              {/* Break Control Buttons */}
              {(isDutyActive || isOnBreak) && (
                <div className="pt-2 flex justify-center gap-3">
                  {!isOnBreak ? (
                    <button
                      onClick={() => setShowBreakModal(true)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                    >
                      <Coffee className="w-3.5 h-3.5" />
                      <span>Take a Break</span>
                    </button>
                  ) : (
                    <button
                      onClick={endBreak}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors animate-pulse"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Resume Active Duty</span>
                    </button>
                  )}
                </div>
              )}

              {/* Live Location Coordinates Status */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-left text-xs text-slate-400">
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    {currentDutySession?.currentLocation?.address || 'Connaught Place Outer Circle, New Delhi'}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono shrink-0 ml-2">±4.2m GPS</span>
              </div>
            </div>

            {/* Daily Route Trace Timeline */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" /> Today's Verified Route Points
                </h3>
                <span className="text-[10px] text-slate-400">{routePoints.length} Pings Logged</span>
              </div>

              <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {routePoints.map((pt, i) => (
                  <div key={pt.id} className="relative text-xs">
                    <div className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${i === routePoints.length - 1 ? 'bg-emerald-400 ring-2 ring-emerald-500/40' : 'bg-slate-600'}`}></div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-semibold text-white">{pt.timestamp}</span>
                      <span className="text-[10px] text-slate-500">{pt.speedKmH} km/h • {pt.batteryLevel}% bat</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{pt.address}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('visits')}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 w-fit mb-2 group-hover:scale-105 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Field Visits</h4>
                <p className="text-[11px] text-slate-400">3 client audits scheduled</p>
              </button>

              <button
                onClick={() => setActiveTab('tasks')}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit mb-2 group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Daily Tasks</h4>
                <p className="text-[11px] text-slate-400">2 pending assignments</p>
              </button>

              <button
                onClick={() => {
                  setActiveTab('expenses');
                  setShowExpenseModal(true);
                }}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 w-fit mb-2 group-hover:scale-105 transition-transform">
                  <Receipt className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Claim Expense</h4>
                <p className="text-[11px] text-slate-400">Upload fuel/meal slip</p>
              </button>

              <button
                onClick={() => {
                  setActiveTab('history');
                  setShowLeaveModal(true);
                }}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 w-fit mb-2 group-hover:scale-105 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Apply Leave</h4>
                <p className="text-[11px] text-slate-400">Casual / Medical</p>
              </button>
            </div>

          </div>
        )}

        {/* ===================== TAB 2: VISITS ===================== */}
        {activeTab === 'visits' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Assigned Field Visits</h2>
                <p className="text-xs text-slate-400">GPS geofence timestamp verification</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-900/60 text-blue-300 font-semibold">
                {fieldVisits.filter(v => v.status === 'completed').length}/{fieldVisits.length} Done
              </span>
            </div>

            <div className="space-y-3">
              {fieldVisits.map((visit) => (
                <div key={visit.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white">{visit.clientName}</h3>
                      <p className="text-xs text-slate-400">{visit.purpose}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      visit.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      visit.status === 'checked_in' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-pulse' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {visit.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{visit.address}</span>
                  </div>

                  <div className="text-xs text-slate-400">
                    Contact: <strong className="text-slate-300">{visit.clientContact}</strong>
                  </div>

                  {/* Visit Status Actions */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    {visit.status === 'scheduled' && (
                      <button
                        onClick={() => checkInVisit(visit.id)}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" /> Check-In with GPS
                      </button>
                    )}

                    {visit.status === 'checked_in' && (
                      <button
                        onClick={() => setShowVisitProofModal(visit.id)}
                        className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" /> Complete Visit & Proof
                      </button>
                    )}

                    {visit.status === 'completed' && (
                      <div className="w-full p-2 bg-slate-950/60 rounded-xl text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Check-In: {visit.checkInTime} • Check-Out: {visit.checkOutTime}</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Verified (8.5m)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: TASKS ===================== */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Assigned Daily Tasks</h2>
                <p className="text-xs text-slate-400">Review deliverables and log progress</p>
              </div>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xs font-bold text-white">{task.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      task.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300' :
                      task.priority === 'high' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {task.priority}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">{task.description}</p>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Client: <strong className="text-slate-300">{task.clientName}</strong></span>
                    <span>Due: <strong className="text-slate-300">{task.dueDate}</strong></span>
                  </div>

                  {/* Status Toggle Buttons */}
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                    {task.status !== 'completed' ? (
                      <>
                        <button
                          onClick={() => updateTaskStatus(task.id, 'in_progress')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${task.status === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => {
                            updateTaskStatus(task.id, 'completed', 'Inspection completed and signed by store supervisor.');
                            triggerConfetti();
                          }}
                          className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                        >
                          Mark Completed ✓
                        </button>
                      </>
                    ) : (
                      <div className="w-full text-center text-xs text-emerald-400 font-semibold py-1 bg-emerald-950/40 rounded-lg flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Task Completed & Logged
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: EXPENSES ===================== */}
        {activeTab === 'expenses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Expense Claims</h2>
                <p className="text-xs text-slate-400">Submit fuel, travel & field bills</p>
              </div>
              <button
                onClick={() => setShowExpenseModal(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Claim
              </button>
            </div>

            <div className="space-y-2.5">
              {expenses.map((exp) => (
                <div key={exp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{exp.category}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        exp.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                        exp.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        {exp.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 max-w-[200px] truncate">{exp.description}</p>
                    <span className="text-[10px] text-slate-500">{exp.date}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-white">₹{exp.amount.toLocaleString('en-IN')}</span>
                    {exp.receiptUrl && (
                      <span className="block text-[10px] text-blue-400 font-medium mt-0.5">Receipt Attached</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 5: OFFICIAL CHAT ===================== */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-[420px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {/* Chat header */}
            <div className="p-3 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between text-xs">
              <span className="font-bold text-white">Official Field Broadcast & Dispatch</span>
              <span className="text-[10px] text-slate-400">🔒 Official FieldSure Channel</span>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.senderId === currentUser.id ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                    <span className="font-semibold text-slate-300">{m.senderName}</span>
                    <span>• {m.timestamp}</span>
                  </div>
                  <div className={`p-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.senderId === currentUser.id 
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : m.type === 'announcement'
                      ? 'bg-amber-950/80 border border-amber-800 text-amber-200 rounded-bl-xs'
                      : 'bg-slate-800 text-slate-200 rounded-bl-xs'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="p-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type official message to operations..."
                value={newChatText}
                onChange={(e) => setNewChatText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ===================== TAB 6: ATTENDANCE HISTORY ===================== */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Attendance & Leaves</h2>
                <p className="text-xs text-slate-400">August 2026 Shift Log</p>
              </div>
              <button
                onClick={() => setShowLeaveModal(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Apply Leave
              </button>
            </div>

            <div className="space-y-2.5">
              {attendanceRecords.map((att) => (
                <div key={att.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{att.date}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        att.status === 'present' || att.status === 'on_field' ? 'bg-emerald-500/20 text-emerald-400' :
                        att.status === 'late' ? 'bg-amber-500/20 text-amber-400' :
                        att.status === 'on_leave' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        {att.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      In: {att.punchInTime || '--:--'} • Out: {att.punchOutTime || 'Active'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-200">{att.workingHours} hrs</span>
                    <span className="block text-[10px] text-emerald-400 capitalize">{att.approvedStatus.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Leave requests section */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Leave Applications</h3>
              {leaves.map((l) => (
                <div key={l.id} className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{l.leaveType} Leave ({l.totalDays} Day)</span>
                    <p className="text-[11px] text-slate-400">{l.startDate} to {l.endDate} • {l.reason}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    l.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 7: PRIVACY & CONSENT ===================== */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Shield className="w-5 h-5" />
                <span>FieldSure Privacy & Consent Transparency</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                FieldSure follows DPDP 2023 principles. Location is tracked <strong>strictly during your active duty shift</strong> after punch-in and ceases automatically upon punch-out.
              </p>
            </div>

            {/* Consent Toggles */}
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5 max-w-[240px]">
                  <span className="text-xs font-bold text-white">Duty-Time GPS Tracking</span>
                  <p className="text-[11px] text-slate-400">Required for shift attendance and field visit verification.</p>
                </div>
                <input
                  type="checkbox"
                  checked={consent.locationDutyConsent}
                  onChange={(e) => updateConsent({ locationDutyConsent: e.target.checked })}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5 max-w-[240px]">
                  <span className="text-xs font-bold text-white">Camera for Receipts & Proofs</span>
                  <p className="text-[11px] text-slate-400">Only accessed when you voluntarily take photos of bills or visit sites.</p>
                </div>
                <input
                  type="checkbox"
                  checked={consent.cameraReceiptConsent}
                  onChange={(e) => updateConsent({ cameraReceiptConsent: e.target.checked })}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5 max-w-[240px]">
                  <span className="text-xs font-bold text-white">Voice Note Audio Notes</span>
                  <p className="text-[11px] text-slate-400">Only enabled during active voice memo recording. No ambient listening.</p>
                </div>
                <input
                  type="checkbox"
                  checked={consent.micVoiceNoteConsent}
                  onChange={(e) => updateConsent({ micVoiceNoteConsent: e.target.checked })}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Employee Privacy Rights (DPDP Aligned)
              </div>
              <p>• Your personal WhatsApp, SMS, photos or personal calls are never accessed.</p>
              <p>• You may request a complete export or purge of your past GPS logs via the Grievance tab.</p>
            </div>
          </div>
        )}

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="bg-slate-900 border-t border-slate-800 px-2 py-1.5 shrink-0 grid grid-cols-5 gap-1">
        <button
          onClick={() => setActiveTab('duty')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
            activeTab === 'duty' ? 'text-emerald-400 bg-emerald-500/10 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Duty</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
            activeTab === 'visits' ? 'text-emerald-400 bg-emerald-500/10 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Visits</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
            activeTab === 'tasks' ? 'text-emerald-400 bg-emerald-500/10 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Tasks</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
            activeTab === 'expenses' ? 'text-emerald-400 bg-emerald-500/10 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Expenses</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
            activeTab === 'chat' ? 'text-emerald-400 bg-emerald-500/10 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Chat</span>
        </button>
      </div>

      {/* Break Reason Modal */}
      {showBreakModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xs w-full space-y-4">
            <h3 className="text-sm font-bold text-white">Select Break Type</h3>
            <select
              value={breakReason}
              onChange={(e) => setBreakReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="Lunch Break">Lunch Break</option>
              <option value="Tea & Refreshment">Tea & Refreshment</option>
              <option value="Vehicle Refueling / Maintenance">Vehicle Refueling / Maintenance</option>
              <option value="Emergency Rest">Emergency Rest</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBreakModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  startBreak(breakReason);
                  setShowBreakModal(false);
                }}
                className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
              >
                Start Break
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expense Submission Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleExpenseSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Submit Expense Claim</h3>
              <button type="button" onClick={() => setShowExpenseModal(false)} className="text-slate-400 text-xs">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Expense Category</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Fuel / Travel">Fuel / Travel</option>
                  <option value="Client Meal">Client Meal</option>
                  <option value="Vehicle Maintenance">Vehicle Maintenance</option>
                  <option value="Lodging">Lodging</option>
                  <option value="Mobile / Internet">Mobile / Internet</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Amount (₹ INR)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 680"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description / Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Fuel for North Delhi client visits"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {/* Receipt attachment simulation */}
              <div 
                onClick={() => setExpReceiptAttached(!expReceiptAttached)}
                className={`p-3 border-2 border-dashed rounded-xl cursor-pointer text-center transition-colors ${
                  expReceiptAttached ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <Camera className="w-5 h-5 mx-auto mb-1" />
                <span className="font-semibold block">{expReceiptAttached ? 'Receipt Attached (bill_slip_01.jpg)' : 'Tap to Upload Receipt Photo'}</span>
                <span className="text-[10px] text-slate-500">Camera / Gallery permission required</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowExpenseModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Submit Claim
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleLeaveSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Apply for Leave</h3>
              <button type="button" onClick={() => setShowLeaveModal(false)} className="text-slate-400 text-xs">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Casual">Casual Leave</option>
                  <option value="Sick">Sick / Medical Leave</option>
                  <option value="Earned">Earned Leave</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">From Date</label>
                  <input
                    type="date"
                    value={leaveStartDate}
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">To Date</label>
                  <input
                    type="date"
                    value={leaveEndDate}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Reason</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Reason for leave request..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Complete Visit Proof Modal */}
      {showVisitProofModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full space-y-4">
            <h3 className="text-sm font-bold text-white">Complete Field Visit & Submit Proof</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Visit Summary Notes</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Discussed inventory replenishment, verified display stock..."
                  value={visitProofNotes}
                  onChange={(e) => setVisitProofNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>GPS Geofence Match: <strong>8.5m accuracy</strong></span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowVisitProofModal(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  checkOutVisit(showVisitProofModal, visitProofNotes, 'https://images.unsplash.com/photo-1554415707-9e49016a35f3?w=300&q=80');
                  setShowVisitProofModal(null);
                  setVisitProofNotes('');
                  triggerConfetti();
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Complete Visit ✓
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  return (
    <div className="py-4 space-y-4">
      {/* Device Frame View Controls */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-900">
            Employee Android-first PWA Simulation
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            (Role: <strong className="text-slate-700">{currentUser.fullName}</strong>)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileDeviceFrame(!isMobileDeviceFrame)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              isMobileDeviceFrame
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isMobileDeviceFrame ? 'Phone Frame: ON' : 'Phone Frame: OFF (Full View)'}
          </button>
        </div>
      </div>

      {/* Phone Container vs Full Screen Container */}
      {isMobileDeviceFrame ? (
        <div className="flex justify-center py-4">
          <div className="w-[390px] h-[780px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 ring-8 ring-slate-900/40 relative flex flex-col overflow-hidden">
            {/* Phone Speaker Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-900 mr-2"></div>
              <div className="w-10 h-1 bg-slate-800 rounded-full"></div>
            </div>
            
            {/* Screen Wrapper */}
            <div className="w-full h-full rounded-[38px] overflow-hidden pt-4 flex flex-col bg-slate-950">
              {appContent}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto min-h-[720px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
          {appContent}
        </div>
      )}
    </div>
  );
};
