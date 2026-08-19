import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  ShieldCheck, 
  Navigation, 
  Battery, 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  RefreshCw, 
  Compass, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Key, 
  ExternalLink,
  Play, 
  Pause, 
  Building, 
  Target,
  Maximize2,
  Minimize2,
  Crosshair,
  Radio,
  Sparkles,
  Zap,
  Volume2,
  ArrowLeft,
  Tv,
  Monitor,
  Bell,
  Users,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FieldSureLogo } from '../common/FieldSureLogo';

const MAP_TILE_LAYERS = {
  streets: {
    name: 'Street RoadMap',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap',
    maxZoom: 20
  },
  satellite: {
    name: 'Satellite Aerial Hybrid',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; High-Res Aerial Imagery',
    maxZoom: 19
  },
  dark: {
    name: 'Midnight NOC Command',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap',
    maxZoom: 20
  },
  terrain: {
    name: 'Topographic Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap contributors',
    maxZoom: 17
  }
};

export const MultiScreenMapCommandCenter: React.FC = () => {
  const { 
    currentTenant, 
    routePoints, 
    fieldVisits, 
    sendMessage, 
    showToast,
    setViewMode,
    language
  } = useApp();

  const [tileLayerKey, setTileLayerKey] = useState<'streets' | 'satellite' | 'dark' | 'terrain'>('dark');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('emp-rahul-sharma');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSimulatingLiveTelemetry, setIsSimulatingLiveTelemetry] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'break'>('all');
  const [myRealLocation, setMyRealLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [isLocatingUser, setIsLocatingUser] = useState<boolean>(false);
  const [alertTicker, setAlertTicker] = useState<string[]>([
    '08:54 AM: Rahul Sharma punched in at Connaught Place Hub (GPS Verified ±3.8m)',
    '09:15 AM: Priya Verma entered DLF Cyber City Geofence (Inspection Active)',
    '10:30 AM: Amit Kumar logged refueling break at NH-44 Faridabad Rest Stop',
    '11:45 AM: Neha Singh uploaded vaccine audit batch report for Sohna Agro Cluster'
  ]);

  // Live Field Officers state with Real Delhi-NCR coordinates
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
      lat: 28.6289,
      lng: 77.2180,
      address: 'Outer Circle, Connaught Place, New Delhi',
      batteryLevel: 74,
      speedKmH: 18,
      accuracyMeters: 3.8,
      lastPingAt: 'Just now',
      activeTask: 'Poultry Farm Outlet Inspection & Temp Audit'
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
      lat: 28.4950,
      lng: 77.0890,
      address: 'Building 10B, DLF Cyber City, Gurugram',
      batteryLevel: 61,
      speedKmH: 0,
      accuracyMeters: 3.2,
      lastPingAt: '1 min ago',
      activeTask: 'Cold Storage Reefer Unit 4 Calibration Audit'
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
      lat: 28.4110,
      lng: 77.3180,
      address: 'NH-44 Bypass Indian Oil Rest Stop, Faridabad',
      batteryLevel: 82,
      speedKmH: 0,
      accuracyMeters: 4.5,
      lastPingAt: '4 mins ago',
      activeTask: 'Vehicle Refueling & Lunch Break'
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
      lat: 28.3840,
      lng: 77.0420,
      address: 'Badshahpur - Sohna Agro Cluster, Gurugram',
      batteryLevel: 58,
      speedKmH: 24,
      accuracyMeters: 5.0,
      lastPingAt: '2 mins ago',
      activeTask: 'Broiler Flock Vaccine Batch Inspection'
    }
  ]);

  // Leaflet references
  const leafletContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletMarkersGroupRef = useRef<L.LayerGroup | null>(null);
  const leafletTileLayerRef = useRef<L.TileLayer | null>(null);

  // Periodic Telemetry Simulation Stream
  useEffect(() => {
    if (!isSimulatingLiveTelemetry) return;

    const interval = setInterval(() => {
      setLiveSessions(prev =>
        prev.map(session => {
          if (session.status === 'on_break') {
            return { ...session, lastPingAt: 'Just now' };
          }
          const deltaLat = (Math.random() - 0.48) * 0.0004;
          const deltaLng = (Math.random() - 0.48) * 0.0004;
          const speedVariation = Math.max(5, Math.min(45, Math.round(session.speedKmH + (Math.random() * 6 - 3))));
          return {
            ...session,
            lat: session.lat + deltaLat,
            lng: session.lng + deltaLng,
            speedKmH: speedVariation,
            lastPingAt: 'Just now'
          };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimulatingLiveTelemetry]);

  // Leaflet initialization
  useEffect(() => {
    if (!leafletContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(leafletContainerRef.current, {
        center: [28.5500, 77.2000],
        zoom: 11,
        zoomControl: false,
        attributionControl: true
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      const layerConfig = MAP_TILE_LAYERS[tileLayerKey];
      const tileLayer = L.tileLayer(layerConfig.url, {
        attribution: layerConfig.attribution,
        maxZoom: layerConfig.maxZoom
      }).addTo(map);
      leafletTileLayerRef.current = tileLayer;

      const group = L.layerGroup().addTo(map);
      leafletMarkersGroupRef.current = group;

      leafletMapRef.current = map;
    }
  }, []);

  // Update tile layer
  useEffect(() => {
    if (!leafletMapRef.current) return;
    if (leafletTileLayerRef.current) {
      leafletMapRef.current.removeLayer(leafletTileLayerRef.current);
    }
    const layerConfig = MAP_TILE_LAYERS[tileLayerKey];
    const newTileLayer = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      maxZoom: layerConfig.maxZoom
    }).addTo(leafletMapRef.current);
    leafletTileLayerRef.current = newTileLayer;
  }, [tileLayerKey]);

  // Render Markers, Routes & Geofences
  useEffect(() => {
    if (!leafletMapRef.current || !leafletMarkersGroupRef.current) return;
    const group = leafletMarkersGroupRef.current;
    group.clearLayers();

    // 1. Geofences
    fieldVisits.forEach(visit => {
      const isCompleted = visit.status === 'completed';
      const isOngoing = visit.status === 'in_progress';

      const circle = L.circle([visit.lat, visit.lng], {
        radius: 400,
        color: isCompleted ? '#10b981' : isOngoing ? '#3b82f6' : '#64748b',
        fillColor: isCompleted ? '#10b981' : isOngoing ? '#3b82f6' : '#64748b',
        fillOpacity: 0.2,
        weight: 2,
        dashArray: '4 4'
      });

      const pinIcon = L.divIcon({
        className: 'visit-pin',
        html: `
          <div style="background: ${isCompleted ? '#059669' : '#1e293b'}; color: white; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); white-space: nowrap; display: flex; align-items: center; gap: 4px;">
            <span>🏢</span>
            <span>${visit.clientName}</span>
          </div>
        `,
        iconSize: [110, 24],
        iconAnchor: [55, 12]
      });

      const marker = L.marker([visit.lat, visit.lng], { icon: pinIcon })
        .bindPopup(`<strong>${visit.clientName}</strong><br/>${visit.address}<br/>Status: ${visit.status}`);

      group.addLayer(circle);
      group.addLayer(marker);
    });

    // 2. Breadcrumbs Polyline for Selected Employee
    if (selectedEmployeeId === 'emp-rahul-sharma' && routePoints.length > 0) {
      const latlngs = routePoints.map(p => [p.lat, p.lng] as [number, number]);
      const poly = L.polyline(latlngs, {
        color: '#10b981',
        weight: 5,
        opacity: 0.85
      });
      group.addLayer(poly);
    }

    // 3. Officers
    const displaySessions = liveSessions.filter(s => {
      if (activeFilter === 'active') return s.status === 'active';
      if (activeFilter === 'break') return s.status === 'on_break';
      return true;
    });

    displaySessions.forEach(session => {
      const isSelected = selectedEmployeeId === session.userId;
      const isBreak = session.status === 'on_break';
      const initials = session.employeeName.split(' ').map(n => n[0]).join('');

      const empIcon = L.divIcon({
        className: 'noc-officer-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="
              width: 42px; 
              height: 42px; 
              border-radius: 50%; 
              background: ${isSelected ? '#4f46e5' : isBreak ? '#d97706' : '#059669'}; 
              color: white; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-weight: 800; 
              font-size: 14px; 
              border: 3px solid white; 
              box-shadow: 0 10px 25px rgba(0,0,0,0.5);
              ${isSelected ? 'box-shadow: 0 0 0 6px rgba(165, 180, 252, 0.7), 0 10px 25px rgba(0,0,0,0.5);' : ''}
            ">
              ${initials}
            </div>
            <div style="
              margin-top: 4px;
              background: rgba(15, 23, 42, 0.95);
              color: white;
              font-size: 10px;
              font-weight: 800;
              padding: 3px 8px;
              border-radius: 6px;
              border: 1px solid rgba(255,255,255,0.3);
              white-space: nowrap;
            ">
              ${session.employeeName.split(' ')[0]} • ${isBreak ? 'Break' : `${session.speedKmH} km/h`}
            </div>
          </div>
        `,
        iconSize: [90, 70],
        iconAnchor: [45, 35]
      });

      const marker = L.marker([session.lat, session.lng], { icon: empIcon })
        .bindPopup(`
          <div style="padding: 6px; font-family: system-ui; min-width: 220px;">
            <div style="font-size: 10px; font-weight: 800; color: ${isBreak ? '#d97706' : '#059669'}; text-transform: uppercase;">
              ● ${isBreak ? 'ON BREAK' : 'ACTIVE IN TRANSIT'} • 🔋 ${session.batteryLevel}%
            </div>
            <div style="font-size: 14px; font-weight: 800; margin-top: 4px; color: #0f172a;">${session.employeeName}</div>
            <div style="font-size: 11px; color: #64748b;">${session.department} • ${session.speedKmH} km/h</div>
            <div style="margin-top: 6px; font-size: 11px; color: #334155;"><strong>Current:</strong> ${session.address}</div>
          </div>
        `);

      marker.on('click', () => setSelectedEmployeeId(session.userId));
      group.addLayer(marker);
    });

    // 4. My Real Location if enabled
    if (myRealLocation) {
      const myIcon = L.divIcon({
        className: 'noc-my-loc',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(59, 130, 246, 0.5); animation: ping 1.5s infinite;"></div>
            <div style="width: 20px; height: 20px; border-radius: 50%; background: #2563eb; border: 3px solid white; box-shadow: 0 0 12px #2563eb;"></div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });
      const myMarker = L.marker([myRealLocation.lat, myRealLocation.lng], { icon: myIcon })
        .bindPopup(`<strong>📍 My Live Device GPS</strong><br/>Accuracy: ±${Math.round(myRealLocation.accuracy)}m`);
      group.addLayer(myMarker);
    }
  }, [liveSessions, fieldVisits, selectedEmployeeId, tileLayerKey, activeFilter, myRealLocation]);

  // Handler: Fullscreen Toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
      showToast('Entered Fullscreen Multi-Screen Wall Mode');
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
      showToast('Exited Fullscreen Mode');
    }
  };

  // Handler: Popout to real browser window
  const handlePopoutNewWindow = () => {
    try {
      const popoutUrl = `${window.location.origin}${window.location.pathname}?view=map_command_center`;
      window.open(popoutUrl, '_blank', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
      showToast('🚀 Live Map opened in a new independent browser window!');
    } catch (e) {
      showToast('⚠️ Popout window blocked by browser. Please allow popups or use the direct link.');
    }
  };

  // Handler: Locate real device GPS
  const handleLocateMyRealDevice = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocatingUser(true);
    showToast('Acquiring real device GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude, accuracy } = pos.coords;
        setMyRealLocation({ lat: latitude, lng: longitude, accuracy });
        setIsLocatingUser(false);
        if (leafletMapRef.current) {
          leafletMapRef.current.setView([latitude, longitude], 15, { animate: true });
        }
        showToast(`📍 Live GPS locked! [${latitude.toFixed(4)}, ${longitude.toFixed(4)}] ±${Math.round(accuracy)}m`);
      },
      err => {
        setIsLocatingUser(false);
        showToast(`GPS Error: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const selectedOfficer = liveSessions.find(s => s.userId === selectedEmployeeId) || liveSessions[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden font-sans select-none">
      
      {/* ========================================================================= */}
      {/* 1. TOP NOC COMMAND WALL HEADER */}
      {/* ========================================================================= */}
      <header className="h-16 bg-slate-900/95 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 shadow-lg backdrop-blur-md">
        
        {/* Left: Branding & Tenant */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('company_admin')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Return to Main CRM / Admin Panel"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Back to CRM</span>
          </button>

          <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold text-white tracking-wide">
                  FieldSure™ Enterprise NOC Control Center
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  Multi-Screen Wall Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Tenant: <strong className="text-slate-200">{currentTenant.name}</strong> • Real-Time Field Telemetry Stream (Asia-South1)
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Telemetry Telemetry Status */}
        <div className="hidden lg:flex items-center gap-6 text-xs bg-slate-950/60 border border-slate-800 px-4 py-1.5 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">Stream: <strong className="text-emerald-400">Adaptive Duty Location</strong></span>
          </div>
          <div className="text-slate-500">|</div>
          <div className="text-slate-300">
            Field Force: <strong className="text-white">{liveSessions.filter(s => s.status === 'active').length} Active</strong> / {liveSessions.length} Total
          </div>
          <div className="text-slate-500">|</div>
          <div className="text-slate-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>DPDP Aligned Duty Privacy Guard: <strong>Active</strong></span>
          </div>
        </div>

        {/* Right: Multi-Screen Controls */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={handlePopoutNewWindow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95"
            title="Open dedicated popout window for Dual-Monitor Setup"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Popout New Window</span>
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen TV / Wall Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleLocateMyRealDevice}
            disabled={isLocatingUser}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all"
            title="Track my real device physical location"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLocatingUser ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{isLocatingUser ? 'Locating...' : 'My Real GPS'}</span>
          </button>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN SPLIT VIEWPORT (MAP 72% + OPERATIONS SIDEBAR 28%) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT: THE EXPANSIVE FULL-SIZE REAL MAP CANVAS */}
        <div className="flex-1 relative bg-slate-900 overflow-hidden flex flex-col">
          
          {/* Floating Floating Layer Toolbar & Focus Filters */}
          <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-2xl flex items-center gap-3 text-xs">
            
            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeFilter === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Staff ({liveSessions.length})
              </button>
              <button
                onClick={() => setActiveFilter('active')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeFilter === 'active' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Moving ({liveSessions.filter(s => s.status === 'active').length})
              </button>
              <button
                onClick={() => setActiveFilter('break')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeFilter === 'break' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Break ({liveSessions.filter(s => s.status === 'on_break').length})
              </button>
            </div>

            <div className="h-5 w-px bg-slate-800"></div>

            {/* Tile Layer Switcher */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl">
              {(['dark', 'satellite', 'streets', 'terrain'] as const).map(k => (
                <button
                  key={k}
                  onClick={() => setTileLayerKey(k)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                    tileLayerKey === k 
                      ? 'bg-slate-700 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {k === 'dark' ? '🌃 Dark NOC' : k === 'satellite' ? '🛰️ Satellite' : k === 'streets' ? '🗺️ Streets' : '🏔️ Topo'}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                if (leafletMapRef.current) {
                  leafletMapRef.current.setView([28.5500, 77.2000], 11, { animate: true });
                  showToast('Re-centered view on central Delhi-NCR Field Hub');
                }
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              title="Reset Map Center"
            >
              <Compass className="w-4 h-4" />
            </button>
          </div>

          {/* Real Leaflet Map DOM Element */}
          <div ref={leafletContainerRef} className="w-full h-full z-10" />

          {/* Floating Bottom Telemetry Ticker */}
          <div className="absolute bottom-4 left-4 right-4 z-[400] pointer-events-none flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 shadow-2xl flex items-center gap-3 text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Live GNSS Feed:
              </span>
              <span className="text-slate-300 font-mono">
                {liveSessions.map(s => `${s.employeeName.split(' ')[0]}: ${s.speedKmH}km/h`).join(' • ')}
              </span>
            </div>

            <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 shadow-2xl text-xs text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Location Integrity: <strong>Risk Engine Active</strong></span>
            </div>
          </div>

        </div>

        {/* RIGHT: OPERATIONS CONTROL PANEL & OFFICER TELEMETRY DOSSIER */}
        <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col overflow-y-auto shrink-0 divide-y divide-slate-800">
          
          {/* Section 1: Selected Officer Spotlight */}
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Officer Focus Spotlight
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                selectedOfficer.status === 'on_break'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {selectedOfficer.status === 'on_break' ? 'ON BREAK' : 'ACTIVE ON DUTY'}
              </span>
            </div>

            {/* Officer selector pills */}
            <div className="grid grid-cols-2 gap-2">
              {liveSessions.map(emp => (
                <button
                  key={emp.userId}
                  onClick={() => {
                    setSelectedEmployeeId(emp.userId);
                    if (leafletMapRef.current) {
                      leafletMapRef.current.setView([emp.lat, emp.lng], 14, { animate: true });
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedEmployeeId === emp.userId
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{emp.employeeName.split(' ')[0]}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{emp.batteryLevel}%</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 truncate">{emp.speedKmH} km/h • {emp.status === 'on_break' ? 'Break' : 'Moving'}</div>
                </button>
              ))}
            </div>

            {/* Detail Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedOfficer.employeeName}</h4>
                  <p className="text-xs text-slate-400">{selectedOfficer.department}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Speed</span>
                  <span className="text-xs font-bold text-emerald-400">{selectedOfficer.speedKmH} km/h</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Shift Punch-In:</span>
                  <span className="text-slate-200 font-mono font-bold">{selectedOfficer.punchInTime}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>GPS Accuracy:</span>
                  <span className="text-emerald-400 font-mono font-bold">±{selectedOfficer.accuracyMeters}m (GNSS L1/L5)</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Current Address:</span>
                  <span className="text-slate-200 text-right truncate max-w-[170px]">{selectedOfficer.address}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Assigned Task:</span>
                  <span className="text-slate-200 text-right truncate max-w-[170px]">{selectedOfficer.activeTask}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => showToast(`Calling ${selectedOfficer.employeeName} (${selectedOfficer.phone})...`)}
                  className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Officer</span>
                </button>
                <button
                  onClick={() => sendMessage('NOC Dispatch: Please submit current site status.', selectedOfficer.userId, selectedOfficer.employeeName)}
                  className="py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Dispatch Alert</span>
                </button>
              </div>
            </div>

          </div>

          {/* Section 2: Real-Time Event & Geofence Ticker */}
          <div className="p-5 space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-blue-400" />
                Live NOC Event Stream
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Real-time</span>
            </div>

            <div className="space-y-2 text-xs">
              {alertTicker.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-300 leading-relaxed">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Mass Broadcast Emergency Alert */}
          <div className="p-5 bg-slate-950 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Emergency Control:</span>
              <span className="text-emerald-400 font-bold">All 4 Channels Open</span>
            </div>

            <button
              onClick={() => {
                showToast('🚨 Mass Emergency Alert broadcasted to all active field staff devices!');
                setAlertTicker(prev => [`${new Date().toLocaleTimeString()}: 🚨 Mass Emergency Broadcast Dispatched by NOC Admin`, ...prev]);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>Broadcast Emergency Siren / Push Alert</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
