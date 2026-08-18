import React, { useState, useEffect, useRef } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import { 
  ShieldCheck, 
  Navigation, 
  Battery, 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  RefreshCw, 
  Sliders, 
  Compass, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Key, 
  ExternalLink,
  Play,
  Pause,
  User as UserIcon,
  Building,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DutySession, FieldVisit, RoutePoint } from '../../types';

interface LiveDutyGoogleMapProps {
  onSelectEmployee?: (employeeId: string) => void;
  selectedEmployeeId?: string;
}

// Polyline component for Google Maps using google.maps.Polyline
const MapPolyline: React.FC<{ path: { lat: number; lng: number }[]; color?: string }> = ({ path, color = '#10b981' }) => {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map
      });
    } else {
      polylineRef.current.setPath(path);
      polylineRef.current.setOptions({ strokeColor: color });
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, path, color]);

  return null;
};

// Map Recenter Helper
const MapController: React.FC<{ center: { lat: number; lng: number } | null; zoom?: number }> = ({ center, zoom = 13 }) => {
  const map = useMap();

  useEffect(() => {
    if (map && center) {
      map.panTo(center);
      if (zoom) map.setZoom(zoom);
    }
  }, [map, center, zoom]);

  return null;
};

export const LiveDutyGoogleMap: React.FC<LiveDutyGoogleMapProps> = ({
  onSelectEmployee,
  selectedEmployeeId = 'emp-rahul-sharma'
}) => {
  const { 
    currentTenant, 
    routePoints, 
    fieldVisits, 
    sendMessage,
    showToast 
  } = useApp();

  // Environment API key
  const envApiKey = (typeof process !== 'undefined' && process.env && process.env.GOOGLE_MAPS_PLATFORM_KEY) || '';
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    return localStorage.getItem('fieldsure_gmaps_key') || envApiKey;
  });
  const [inputKey, setInputKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  const activeApiKey = customApiKey || envApiKey;

  // Active Map view state
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'break' | 'visits'>('all');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [selectedMarker, setSelectedMarker] = useState<{
    type: 'employee' | 'visit';
    data: any;
  } | null>(null);

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>({
    lat: 28.5800,
    lng: 77.2500
  });

  // Simulated live telemetry stream (movement generator)
  const [isSimulatingLiveTelemetry, setIsSimulatingLiveTelemetry] = useState<boolean>(true);
  const [liveSessions, setLiveSessions] = useState([
    {
      id: 'duty-rahul-today',
      userId: 'emp-rahul-sharma',
      employeeName: 'Rahul Sharma',
      employeeCode: 'AKBS-FLD-102',
      department: 'North Region Distribution',
      phone: '+91 97110 54321',
      shiftName: 'General Field Shift (09:00 - 18:00)',
      punchInTime: '08:54 AM',
      status: 'active' as const,
      totalDutyMinutes: 382,
      lat: 28.6139,
      lng: 77.2090,
      address: 'Near Connaught Place Outer Circle, New Delhi',
      batteryLevel: 74,
      speedKmH: 18,
      accuracyMeters: 3.8,
      lastPingAt: 'Just now',
      activeTask: 'Poultry Farm Inspection & Temperature Logging'
    },
    {
      id: 'duty-priya-today',
      userId: 'emp-priya-verma',
      employeeName: 'Priya Verma',
      employeeCode: 'AKBS-FLD-103',
      department: 'Field Quality Assurance',
      phone: '+91 97110 54322',
      shiftName: 'Morning Audit Shift (08:30 - 17:30)',
      punchInTime: '08:28 AM',
      status: 'active' as const,
      totalDutyMinutes: 410,
      lat: 28.4986,
      lng: 77.0878,
      address: 'Sector 29 Commercial Complex, Gurugram',
      batteryLevel: 61,
      speedKmH: 0,
      accuracyMeters: 3.2,
      lastPingAt: '1 min ago',
      activeTask: 'Cold Storage Reefer Calibration Audit'
    },
    {
      id: 'duty-amit-today',
      userId: 'emp-amit-kumar',
      employeeName: 'Amit Kumar',
      employeeCode: 'AKBS-FLD-104',
      department: 'Logistics',
      phone: '+91 97110 54323',
      shiftName: 'Early Dispatch Shift (07:00 - 16:00)',
      punchInTime: '07:05 AM',
      status: 'on_break' as const,
      totalDutyMinutes: 420,
      lat: 28.4230,
      lng: 77.3090,
      address: 'NH-44 Bypass Fuel Station, Faridabad (Resting)',
      batteryLevel: 82,
      speedKmH: 0,
      accuracyMeters: 4.5,
      lastPingAt: '4 mins ago',
      activeTask: 'Vehicle Refueling & Evening Rest'
    },
    {
      id: 'duty-neha-today',
      userId: 'emp-neha-singh',
      employeeName: 'Neha Singh',
      employeeCode: 'AKBS-FLD-105',
      department: 'Field Health Services',
      phone: '+91 97110 54324',
      shiftName: 'General Field Shift (09:00 - 18:00)',
      punchInTime: '09:12 AM',
      status: 'active' as const,
      totalDutyMinutes: 350,
      lat: 28.4350,
      lng: 77.0110,
      address: 'Sohna Road Agro Tech Center, Gurugram',
      batteryLevel: 58,
      speedKmH: 24,
      accuracyMeters: 5.0,
      lastPingAt: '2 mins ago',
      activeTask: 'Vaccination Batch Quality Sampling'
    }
  ]);

  // Live GPS telemetry animation jitter to simulate real moving field duty officers
  useEffect(() => {
    if (!isSimulatingLiveTelemetry) return;

    const interval = setInterval(() => {
      setLiveSessions(prev => 
        prev.map(emp => {
          if (emp.status === 'on_break') return emp;
          // Micro-movement jitter within 20-50 meters
          const deltaLat = (Math.random() - 0.5) * 0.0006;
          const deltaLng = (Math.random() - 0.5) * 0.0006;
          return {
            ...emp,
            lat: emp.lat + deltaLat,
            lng: emp.lng + deltaLng,
            speedKmH: Math.max(8, Math.min(45, Math.round(emp.speedKmH + (Math.random() - 0.5) * 6))),
            batteryLevel: Math.max(15, emp.batteryLevel - (Math.random() > 0.8 ? 1 : 0)),
            lastPingAt: 'Just now'
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulatingLiveTelemetry]);

  // Handle Key Saving
  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      localStorage.setItem('fieldsure_gmaps_key', inputKey.trim());
      setCustomApiKey(inputKey.trim());
      setShowKeyModal(false);
      showToast('✅ Google Maps API Key configured successfully!');
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('fieldsure_gmaps_key');
    setCustomApiKey('');
    setInputKey('');
    showToast('Google Maps API Key cleared.');
  };

  // Filtered employees
  const filteredSessions = liveSessions.filter(s => {
    if (activeFilter === 'active') return s.status === 'active';
    if (activeFilter === 'break') return s.status === 'on_break';
    if (activeFilter === 'visits') return false;
    return true;
  });

  const selectedEmployeeSession = liveSessions.find(s => s.userId === selectedEmployeeId) || liveSessions[0];

  // Route path for selected employee
  const selectedPath = routePoints.map(p => ({ lat: p.lat, lng: p.lng }));

  return (
    <div className="space-y-4">
      {/* Top Banner: Privacy & API Status */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Google Maps Field Telemetry Engine</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3 h-3" /> DPDP Consent Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live GPS duty markers plotted dynamically • Restricted to active duty hours only
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsSimulatingLiveTelemetry(!isSimulatingLiveTelemetry)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSimulatingLiveTelemetry 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            title="Toggle simulated GPS real-time ping updates"
          >
            {isSimulatingLiveTelemetry ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Feed Active (5s)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-500" />
                <span>Resume Live Stream</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{activeApiKey ? 'Maps Key Configured' : 'Configure Maps API Key'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Map + Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left 2 Cols: The Google Map Container */}
        <div className="lg:col-span-2 flex flex-col space-y-3">
          
          {/* Filter Bar & Map Controls */}
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All On-Field ({liveSessions.length})
              </button>
              <button
                onClick={() => setActiveFilter('active')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  activeFilter === 'active' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Moving / Active ({liveSessions.filter(s => s.status === 'active').length})
              </button>
              <button
                onClick={() => setActiveFilter('break')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  activeFilter === 'break' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                On Break ({liveSessions.filter(s => s.status === 'on_break').length})
              </button>
              <button
                onClick={() => setActiveFilter('visits')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  activeFilter === 'visits' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Client Visits ({fieldVisits.length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={mapType}
                onChange={(e) => setMapType(e.target.value as any)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="roadmap">Standard Roadmap</option>
                <option value="hybrid">Satellite Hybrid</option>
                <option value="terrain">Terrain View</option>
              </select>

              <button
                onClick={() => {
                  setMapCenter({ lat: 28.5800, lng: 77.2500 });
                  showToast('Map centered on Delhi-NCR Field Hub');
                }}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                title="Reset Map Center"
              >
                <Compass className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Map View Canvas */}
          <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900">
            {activeApiKey ? (
              <APIProvider apiKey={activeApiKey}>
                <Map
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  defaultCenter={{ lat: 28.5800, lng: 77.2500 }}
                  defaultZoom={11}
                  mapTypeId={mapType}
                  gestureHandling={'greedy'}
                  disableDefaultUI={false}
                  className="w-full h-full"
                  mapId="DEMO_MAP_ID"
                >
                  <MapController center={mapCenter} />

                  {/* Route polyline for selected employee */}
                  {selectedEmployeeId === 'emp-rahul-sharma' && (
                    <MapPolyline path={selectedPath} color="#10b981" />
                  )}

                  {/* Plot Active Employee Duty Markers */}
                  {filteredSessions.map((session) => {
                    const isSelected = selectedEmployeeId === session.userId;
                    const isBreak = session.status === 'on_break';

                    return (
                      <AdvancedMarker
                        key={session.id}
                        position={{ lat: session.lat, lng: session.lng }}
                        onClick={() => {
                          setSelectedMarker({ type: 'employee', data: session });
                          if (onSelectEmployee) onSelectEmployee(session.userId);
                        }}
                        title={`${session.employeeName} (${session.status})`}
                      >
                        <div className="relative cursor-pointer group transition-transform hover:scale-110">
                          {/* Pulsing Aura */}
                          <span 
                            className={`animate-ping absolute inline-flex h-10 w-10 -top-1 -left-1 rounded-full opacity-60 ${
                              isBreak ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                          />
                          
                          {/* Marker Body */}
                          <div 
                            className={`relative w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-bold text-white shadow-xl text-xs ${
                              isSelected 
                                ? 'bg-indigo-600 ring-4 ring-indigo-300' 
                                : isBreak 
                                  ? 'bg-amber-500' 
                                  : 'bg-emerald-600'
                            }`}
                          >
                            {session.employeeName.split(' ').map(n => n[0]).join('')}
                          </div>

                          {/* Quick Badge */}
                          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-900/90 text-[9px] font-bold text-white whitespace-nowrap shadow-md">
                            {session.employeeName.split(' ')[0]} • {isBreak ? 'Break' : `${session.speedKmH}km/h`}
                          </div>
                        </div>
                      </AdvancedMarker>
                    );
                  })}

                  {/* Plot Client Visits */}
                  {(activeFilter === 'all' || activeFilter === 'visits') && fieldVisits.map((visit) => (
                    <AdvancedMarker
                      key={visit.id}
                      position={{ lat: visit.lat, lng: visit.lng }}
                      onClick={() => setSelectedMarker({ type: 'visit', data: visit })}
                      title={`Client: ${visit.clientName}`}
                    >
                      <div className="relative cursor-pointer group">
                        <div className={`w-7 h-7 rounded-lg border-2 border-white flex items-center justify-center text-white shadow-lg ${
                          visit.status === 'completed' 
                            ? 'bg-emerald-600' 
                            : visit.status === 'checked_in' 
                              ? 'bg-blue-600 ring-2 ring-blue-300 animate-bounce' 
                              : 'bg-slate-700'
                        }`}>
                          <Building className="w-3.5 h-3.5" />
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded bg-slate-800 text-[8px] font-medium text-white whitespace-nowrap">
                          {visit.clientName.slice(0, 14)}...
                        </div>
                      </div>
                    </AdvancedMarker>
                  ))}

                  {/* InfoWindow Popup on Marker Click */}
                  {selectedMarker && selectedMarker.type === 'employee' && (
                    <InfoWindow
                      position={{ lat: selectedMarker.data.lat, lng: selectedMarker.data.lng }}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-2 max-w-[260px] text-slate-800">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{selectedMarker.data.employeeName}</h4>
                            <span className="text-[10px] text-slate-500 font-mono">{selectedMarker.data.employeeCode}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            selectedMarker.data.status === 'on_break' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {selectedMarker.data.status === 'on_break' ? 'ON BREAK' : 'ACTIVE DUTY'}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 mb-2 flex items-start gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{selectedMarker.data.address}</span>
                        </p>

                        <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded-lg text-[10px] text-slate-700 mb-2">
                          <div>
                            <span className="text-slate-400 block">Speed</span>
                            <span className="font-bold">{selectedMarker.data.speedKmH} km/h</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Battery</span>
                            <span className="font-bold text-emerald-700">{selectedMarker.data.batteryLevel}%</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Punch-In</span>
                            <span className="font-bold">{selectedMarker.data.punchInTime}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">GPS Accuracy</span>
                            <span className="font-bold">±{selectedMarker.data.accuracyMeters}m</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={() => {
                              showToast(`Calling ${selectedMarker.data.employeeName}...`);
                            }}
                            className="flex-1 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center gap-1"
                          >
                            <Phone className="w-3 h-3" /> Call
                          </button>
                          <button
                            onClick={() => {
                              sendMessage('Please share update on your current client visit.', selectedMarker.data.userId, selectedMarker.data.employeeName);
                            }}
                            className="flex-1 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" /> Alert
                          </button>
                        </div>
                      </div>
                    </InfoWindow>
                  )}

                  {selectedMarker && selectedMarker.type === 'visit' && (
                    <InfoWindow
                      position={{ lat: selectedMarker.data.lat, lng: selectedMarker.data.lng }}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-2 max-w-[240px] text-slate-800">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase">
                          {selectedMarker.data.status.replace('_', ' ')}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 mt-1">{selectedMarker.data.clientName}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{selectedMarker.data.address}</p>
                        <p className="text-[11px] text-slate-700 mt-1.5 font-medium">{selectedMarker.data.purpose}</p>
                        {selectedMarker.data.checkInTime && (
                          <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-emerald-700 font-bold">
                            ✓ Checked In: {selectedMarker.data.checkInTime}
                          </div>
                        )}
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
            ) : (
              /* Fallback Interactive Vector Map with API Key Setup CTA */
              <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between p-4 overflow-hidden">
                {/* SVG Vector Background Grid */}
                <svg className="w-full h-full absolute inset-0 opacity-40">
                  <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.75" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                  <path d="M 50 180 Q 200 120 400 200 T 700 150" fill="none" stroke="#475569" strokeWidth="4" />
                  <path d="M 220 20 L 250 360" fill="none" stroke="#475569" strokeWidth="3" />
                  <path d="M 480 30 L 460 340" fill="none" stroke="#475569" strokeWidth="3" />
                  <circle cx="280" cy="160" r="45" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4" />
                  <path d="M 120 260 L 240 210 L 380 170 L 480 140" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" />
                </svg>

                {/* Top overlay note */}
                <div className="z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">Live Field Grid (Interactive Simulation Mode)</span>
                  </div>
                  <button
                    onClick={() => setShowKeyModal(true)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Key className="w-3 h-3" /> Enable Live Google Maps
                  </button>
                </div>

                {/* Vector Markers for fallback simulation */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Marker 1: Rahul Sharma */}
                  <div 
                    onClick={() => onSelectEmployee && onSelectEmployee('emp-rahul-sharma')}
                    className="absolute top-[38%] left-[62%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  >
                    <div className="relative">
                      <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-60"></span>
                      <div className="relative w-8 h-8 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center text-xs font-bold shadow-lg">
                        RS
                      </div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 mt-1.5 bg-slate-900 border border-slate-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                      Rahul Sharma (Connaught Place • 18 km/h)
                    </div>
                  </div>

                  {/* Marker 2: Priya Verma */}
                  <div 
                    onClick={() => onSelectEmployee && onSelectEmployee('emp-priya-verma')}
                    className="absolute top-[58%] left-[34%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center text-xs font-bold shadow-lg">
                        PV
                      </div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 mt-1.5 bg-slate-900 border border-slate-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                      Priya Verma (Cyber Hub Gurugram)
                    </div>
                  </div>

                  {/* Marker 3: Amit Kumar (On Break) */}
                  <div 
                    onClick={() => onSelectEmployee && onSelectEmployee('emp-amit-kumar')}
                    className="absolute top-[72%] left-[54%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-amber-600 border-2 border-white text-white flex items-center justify-center text-xs font-bold shadow-lg">
                        AK
                      </div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 mt-1.5 bg-slate-900 border border-slate-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                      Amit Kumar (On Break • Faridabad)
                    </div>
                  </div>

                  {/* Marker 4: Neha Singh */}
                  <div 
                    onClick={() => onSelectEmployee && onSelectEmployee('emp-neha-singh')}
                    className="absolute top-[68%] left-[26%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center text-xs font-bold shadow-lg">
                        NS
                      </div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 mt-1.5 bg-slate-900 border border-slate-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                      Neha Singh (Sohna Farm • 24 km/h)
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="z-10 bg-slate-900/95 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Google Maps SDK Ready • Ready to connect with live Maps Key</span>
                  <span className="text-emerald-400 font-medium">GPS Accuracy: ±3.8m • Telemetry Stream: 5s</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                {liveSessions.filter(s => s.status === 'active').length}
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Active On Duty</span>
                <span className="font-bold text-slate-800">In Transit & Audits</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                {liveSessions.filter(s => s.status === 'on_break').length}
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">On Break</span>
                <span className="font-bold text-slate-800">Lunch & Refuel</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                {fieldVisits.length}
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Client Geofences</span>
                <span className="font-bold text-slate-800">Verified Checkpoints</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                100%
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Anti-Mock GPS</span>
                <span className="font-bold text-slate-800">Zero Spoofing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Selected Officer Dossier & Verified Route Breadcrumb Trace */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Selected Officer Telemetry</h3>
                <p className="text-[11px] text-slate-500">Live GPS tracking session details</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                selectedEmployeeSession.status === 'on_break' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {selectedEmployeeSession.status === 'on_break' ? 'ON BREAK' : 'ON DUTY'}
              </span>
            </div>

            {/* Officer selector pill list */}
            <div className="mt-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Switch Officer Focus
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {liveSessions.map(emp => (
                  <button
                    key={emp.userId}
                    onClick={() => {
                      if (onSelectEmployee) onSelectEmployee(emp.userId);
                      setMapCenter({ lat: emp.lat, lng: emp.lng });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedEmployeeId === emp.userId 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {emp.employeeName.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Officer Details Card */}
            <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    {selectedEmployeeSession.employeeName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{selectedEmployeeSession.employeeName}</h4>
                    <span className="text-[10px] font-mono text-slate-500">{selectedEmployeeSession.employeeCode}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Battery</span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 justify-end">
                    <Battery className="w-3.5 h-3.5" /> {selectedEmployeeSession.batteryLevel}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 border-t border-slate-200/60 pt-2">
                {selectedEmployeeSession.department}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-400 text-[10px] block">Punch-In</span>
                  <span className="font-semibold text-slate-800">{selectedEmployeeSession.punchInTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Current Speed</span>
                  <span className="font-semibold text-slate-800">{selectedEmployeeSession.speedKmH} km/h</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] text-slate-400 block">Current Address</span>
                <p className="text-xs font-medium text-slate-800 flex items-start gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{selectedEmployeeSession.address}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] text-slate-400 block">Assigned Duty Task</span>
                <p className="text-xs font-semibold text-slate-900 mt-0.5">
                  {selectedEmployeeSession.activeTask}
                </p>
              </div>
            </div>

            {/* Verified Route Trace Breadcrumbs */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Today's Verified Geotrack Trace
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">5 Pings Recorded</span>
              </div>

              <div className="space-y-2 text-xs max-h-[160px] overflow-y-auto pr-1">
                {routePoints.map((pt, idx) => (
                  <div key={pt.id} className="p-2 rounded-lg border border-slate-100 bg-slate-50/70 space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="font-bold text-slate-800">{pt.timestamp}</span>
                      <span>{pt.speedKmH} km/h • ±{pt.accuracyMeters}m</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{pt.address}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  showToast(`Dispatching live check-in request to ${selectedEmployeeSession.employeeName}`);
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Target className="w-3.5 h-3.5" /> Request Check-In
              </button>
              <button
                onClick={() => {
                  setMapCenter({ lat: selectedEmployeeSession.lat, lng: selectedEmployeeSession.lng });
                  showToast(`Zoomed into ${selectedEmployeeSession.employeeName}`);
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" /> Locate
              </button>
            </div>

            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-center justify-between">
              <span>GeoJSON Audit Stream Verified</span>
              <button
                onClick={() => showToast('GeoJSON route log exported to audit console.')}
                className="font-bold text-emerald-700 hover:underline"
              >
                Export Log
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Modal: Google Maps API Key Configurator */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Configure Google Maps Platform Key</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              FieldSure utilizes <strong>Google Maps Platform</strong> with vector maps, custom advanced markers, and real-time route polylines. To connect your live GCP Maps project, provide your API key below:
            </p>

            <form onSubmit={handleSaveKey} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Google Maps API Key
                </label>
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
                <span className="font-bold text-slate-800 block">Required API enablement in Google Cloud Console:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  <li><strong>Maps JavaScript API</strong> (Enabled)</li>
                  <li><strong>Geocoding API</strong> & <strong>Places API</strong> (Optional for address searches)</li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2">
                {customApiKey ? (
                  <button
                    type="button"
                    onClick={handleClearKey}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Clear Stored Key
                  </button>
                ) : <span />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                  >
                    Save & Load Map
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
