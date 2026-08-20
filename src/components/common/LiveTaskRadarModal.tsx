import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Compass, 
  Gauge, 
  Clock, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Radio, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Target,
  CornerDownRight,
  TrendingUp,
  Flame
} from 'lucide-react';
import { FieldTask, DutySession, User } from '../../types';
import { evaluateEnRouteTelemetry, formatDistance } from '../../utils/geoTracking';

interface LiveTaskRadarModalProps {
  task: FieldTask;
  employeeSession?: DutySession;
  employeeUser?: User;
  onClose: () => void;
  onOpenLiveMap?: (employeeId: string) => void;
  onDirectPing?: (message: string) => void;
  onSimulateStepTowardsDestination?: (taskId: string) => void;
}

export const LiveTaskRadarModal: React.FC<LiveTaskRadarModalProps> = ({
  task,
  employeeSession,
  employeeUser,
  onClose,
  onOpenLiveMap,
  onDirectPing,
  onSimulateStepTowardsDestination
}) => {
  // Current live coords (or fallback to Connaught Place default)
  const [empLat, setEmpLat] = useState<number>(employeeSession?.lat || 28.6289);
  const [empLng, setEmpLng] = useState<number>(employeeSession?.lng || 77.2180);
  const [speed, setSpeed] = useState<number>(employeeSession?.speedKmH || 24);
  const [pingMessage, setPingMessage] = useState<string>('');
  const [showPingInput, setShowPingInput] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const targetLat = task.targetLat || 28.6328;
  const targetLng = task.targetLng || 77.2235;
  const geofenceRadius = task.targetGeofenceRadiusMeters || 100;

  // Real-time calculated telemetry
  const telemetry = evaluateEnRouteTelemetry(
    empLat,
    empLng,
    speed,
    targetLat,
    targetLng,
    task.initialTripDistanceMeters || 2800,
    geofenceRadius
  );

  // Simulation handler: Moves the employee 25% closer to the target with each step
  const handleStepCloser = () => {
    setIsSimulating(true);
    setEmpLat(prev => prev + (targetLat - prev) * 0.35);
    setEmpLng(prev => prev + (targetLng - prev) * 0.35);
    setSpeed(26);
    if (onSimulateStepTowardsDestination) {
      onSimulateStepTowardsDestination(task.id);
    }
    setTimeout(() => setIsSimulating(false), 600);
  };

  const handleSendPing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pingMessage.trim()) return;
    if (onDirectPing) {
      onDirectPing(pingMessage);
    }
    setPingMessage('');
    setShowPingInput(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        
        {/* Header with Live Pulsing Radar Beacon */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Radio className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Live En-Route Radar & Heading Monitor</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold uppercase">
                  Telemetry Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Tracking {task.assignedToName} → {task.clientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* Main En-Route Corridor Status Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
            
            {/* Live Convergence Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-emerald-950/40 border border-blue-500/20">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Heading Status & Convergence
                </span>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {telemetry.statusText}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Distance to Site</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {telemetry.formattedDistance}
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Estimated Arrival</span>
                  <span className="text-sm font-bold text-blue-300">
                    {telemetry.formattedEta}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Corridor Navigation Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" /> Start Point (Field Origin)
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {telemetry.proximityProgressPercentage}% En-Route Complete
                </span>
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-rose-400" /> {task.clientName}
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60 relative">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.max(6, telemetry.proximityProgressPercentage)}%` }}
                ></div>
                {/* Geofence Threshold Marker */}
                <div 
                  className="absolute right-3 top-0 bottom-0 w-1 bg-emerald-400/80 rounded" 
                  title={`100m Geofence Boundary (${geofenceRadius}m)`}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span>Speed: {speed} km/h</span>
                <span>Target Geofence: {geofenceRadius}m Radius</span>
                <span className={telemetry.isInsideGeofence ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  {telemetry.isInsideGeofence ? '✓ Inside Geofence Zone' : 'Outside Geofence'}
                </span>
              </div>
            </div>
          </div>

          {/* Location & Destination Details Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Origin & Current Live Position */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5" /> Employee Live GPS
                </span>
                <span className="text-[10px] font-mono text-slate-400">±2.4m GPS Precision</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Officer:</span>
                  <span className="font-semibold text-white">{task.assignedToName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Live Coordinates:</span>
                  <span className="font-mono text-[11px] text-slate-300">{empLat.toFixed(5)}, {empLng.toFixed(5)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Velocity:</span>
                  <span className="font-semibold text-emerald-400">{speed} km/h (Active Transit)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Compass Bearing:</span>
                  <span className="font-semibold text-slate-200">{Math.round(telemetry.bearingDegrees)}° ({telemetry.cardinalDirection})</span>
                </div>
              </div>
            </div>

            {/* Destination Client Site Details */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Target Destination Pin
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">{geofenceRadius}m Geofence</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Client Hub:</span>
                  <span className="font-bold text-white truncate">{task.clientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Site Coordinates:</span>
                  <span className="font-mono text-[11px] text-slate-300">{targetLat.toFixed(5)}, {targetLng.toFixed(5)}</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  <span className="text-slate-500 block text-[10px]">Destination Address:</span>
                  <span className="text-slate-300 line-clamp-2">{task.clientAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Task Info & SLA */}
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300">Deliverable: {task.title}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                task.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300' :
                task.priority === 'high' ? 'bg-amber-500/20 text-amber-300' :
                'bg-slate-800 text-slate-300'
              }`}>
                {task.priority} Priority
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">{task.description}</p>
          </div>

          {/* Direct Ping Accordion */}
          {showPingInput && (
            <form onSubmit={handleSendPing} className="p-3 bg-slate-950 rounded-xl border border-blue-500/40 space-y-2">
              <label className="text-xs font-bold text-blue-300 block">
                Send Direct Audio/Text Directive to Officer Device
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={pingMessage}
                  onChange={(e) => setPingMessage(e.target.value)}
                  placeholder="e.g., Client is expecting you at Reception Desk A. Update ETA."
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Action Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          
          {/* Simulation & Movement Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStepCloser}
              disabled={isSimulating || telemetry.isInsideGeofence}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                telemetry.isInsideGeofence 
                  ? 'bg-emerald-900/60 text-emerald-300 cursor-default' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              {telemetry.isInsideGeofence ? '✓ Arrived Inside Geofence' : 'Simulate Live Transit Movement'}
            </button>

            <button
              onClick={() => setShowPingInput(!showPingInput)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> Ping Officer
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenLiveMap && (
              <button
                onClick={() => {
                  onClose();
                  onOpenLiveMap(task.assignedToUserId);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Compass className="w-3.5 h-3.5" /> View on Live Google Map
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
