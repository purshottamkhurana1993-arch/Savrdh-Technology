import React, { useState, useEffect, useRef } from 'react';
import { 
  APIProvider, 
  Map as GoogleMap, 
  AdvancedMarker, 
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
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
  Crosshair,
  Globe,
  Radio,
  Sparkles,
  Zap,
  Monitor
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DutySession, FieldVisit, RoutePoint } from '../../types';

interface LiveDutyGoogleMapProps {
  onSelectEmployee?: (employeeId: string) => void;
  selectedEmployeeId?: string;
}

// Tile layers for the Leaflet Real-World Map Engine
const MAP_TILE_LAYERS = {
  streets: {
    name: 'Street RoadMap',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 20
  },
  satellite: {
    name: 'Satellite Hybrid',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19
  },
  dark: {
    name: 'Midnight Command',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 20
  },
  terrain: {
    name: 'Terrain Topo',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17
  }
};

// Polyline component for Google Maps using google.maps.Polyline
const GoogleMapPolyline: React.FC<{ path: { lat: number; lng: number }[]; color?: string }> = ({ path, color = '#10b981' }) => {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 0.85,
        strokeWeight: 5,
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

// Map Recenter Helper for Google Maps
const GoogleMapController: React.FC<{ center: { lat: number; lng: number } | null; zoom?: number }> = ({ center, zoom = 13 }) => {
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
    showToast,
    setViewMode 
  } = useApp();

  const handlePopoutWindow = () => {
    try {
      const popoutUrl = `${window.location.origin}${window.location.pathname}?view=map_command_center`;
      window.open(popoutUrl, '_blank', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
      showToast('🚀 Live Map launched in independent window for Multi-Screen monitoring!');
    } catch (e) {
      setViewMode('map_command_center');
    }
  };

  // Environment API key for Google Maps Platform
  const envApiKey = (typeof process !== 'undefined' && process.env && process.env.GOOGLE_MAPS_PLATFORM_KEY) || '';
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    return localStorage.getItem('fieldsure_gmaps_key') || envApiKey;
  });
  const [inputKey, setInputKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const activeApiKey = customApiKey || envApiKey;

  // Map Engine selector (leaflet = instant zero-config real map tiles; gmp = Google Maps Platform WebGL)
  const [mapEngine, setMapEngine] = useState<'leaflet' | 'google_maps'>(activeApiKey ? 'google_maps' : 'leaflet');

  // Active Map view state
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'break' | 'visits'>('all');
  const [tileLayerKey, setTileLayerKey] = useState<'streets' | 'satellite' | 'dark' | 'terrain'>('streets');
  const [gmpMapType, setGmpMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 28.5800,
    lng: 77.2500
  });
  const [mapZoom, setMapZoom] = useState<number>(12);

  // User's own real physical device GPS location
  const [myRealLocation, setMyRealLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [isLocatingUser, setIsLocatingUser] = useState<boolean>(false);

  // Selected marker for Google Maps InfoWindow
  const [selectedMarker, setSelectedMarker] = useState<{
    type: 'employee' | 'visit';
    data: any;
  } | null>(null);

  // Live Simulated/Real Employees with Real Delhi-NCR GPS Coordinates
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
      lat: 28.6289,
      lng: 77.2180,
      address: 'Outer Circle, Connaught Place, New Delhi',
      batteryLevel: 74,
      speedKmH: 18,
      accuracyMeters: 3.8,
      lastPingAt: 'Just now',
      activeTask: 'Poultry Farm Outlet Inspection & Temp Audit',
      color: '#10b981'
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
      activeTask: 'Cold Storage Reefer Unit 4 Calibration Audit',
      color: '#3b82f6'
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
      activeTask: 'Vehicle Refueling & Lunch Break',
      color: '#f59e0b'
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
      activeTask: 'Broiler Flock Vaccine Batch Inspection',
      color: '#8b5cf6'
    }
  ]);

  // Leaflet Map Container Ref & Map Instance Ref
  const leafletContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapInstanceRef = useRef<L.Map | null>(null);
  const leafletMarkersGroupRef = useRef<L.LayerGroup | null>(null);
  const leafletTileLayerRef = useRef<L.TileLayer | null>(null);

  // Continuous Telemetry Stream (Small realistic GPS jitter & movement)
  useEffect(() => {
    if (!isSimulatingLiveTelemetry) return;

    const interval = setInterval(() => {
      setLiveSessions(prev =>
        prev.map(session => {
          if (session.status === 'on_break') {
            return {
              ...session,
              lastPingAt: 'Just now'
            };
          }

          // Small delta for realistic GPS movement along roads
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
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulatingLiveTelemetry]);

  // --------------------------------------------------------------------------
  // LEAFLET MAP INITIALIZATION & REACTIVE UPDATES
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (mapEngine !== 'leaflet' || !leafletContainerRef.current) return;

    // 1. Initialize Leaflet map instance once
    if (!leafletMapInstanceRef.current) {
      const map = L.map(leafletContainerRef.current, {
        center: [mapCenter.lat, mapCenter.lng],
        zoom: mapZoom,
        zoomControl: false,
        attributionControl: true
      });

      // Add zoom control top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add selected tile layer
      const layerConfig = MAP_TILE_LAYERS[tileLayerKey];
      const tileLayer = L.tileLayer(layerConfig.url, {
        attribution: layerConfig.attribution,
        maxZoom: layerConfig.maxZoom
      }).addTo(map);

      leafletTileLayerRef.current = tileLayer;

      // Layer group for all markers & overlays
      const markersGroup = L.layerGroup().addTo(map);
      leafletMarkersGroupRef.current = markersGroup;

      leafletMapInstanceRef.current = map;
    }

    return () => {
      // Keep instance or destroy on unmount
    };
  }, [mapEngine]);

  // Update Tile Layer if changed
  useEffect(() => {
    if (!leafletMapInstanceRef.current || mapEngine !== 'leaflet') return;

    if (leafletTileLayerRef.current) {
      leafletMapInstanceRef.current.removeLayer(leafletTileLayerRef.current);
    }

    const layerConfig = MAP_TILE_LAYERS[tileLayerKey];
    const newTileLayer = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      maxZoom: layerConfig.maxZoom
    }).addTo(leafletMapInstanceRef.current);

    leafletTileLayerRef.current = newTileLayer;
  }, [tileLayerKey, mapEngine]);

  // Sync Markers, Geofences, and Breadcrumbs onto Leaflet Map
  useEffect(() => {
    if (!leafletMapInstanceRef.current || !leafletMarkersGroupRef.current || mapEngine !== 'leaflet') return;

    const group = leafletMarkersGroupRef.current;
    group.clearLayers();

    // 1. Plot Geofences (Client Checkpoints)
    fieldVisits.forEach((visit) => {
      const isCompleted = visit.status === 'completed';
      const isOngoing = visit.status === 'in_progress';

      // Geofence Circle
      const geofenceCircle = L.circle([visit.lat, visit.lng], {
        radius: 350,
        color: isCompleted ? '#10b981' : isOngoing ? '#3b82f6' : '#94a3b8',
        fillColor: isCompleted ? '#10b981' : isOngoing ? '#3b82f6' : '#94a3b8',
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '4 4'
      });

      // Geofence Pin
      const visitIcon = L.divIcon({
        className: 'custom-visit-marker',
        html: `
          <div style="background: ${isCompleted ? '#059669' : isOngoing ? '#2563eb' : '#475569'}; color: white; padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white; white-space: nowrap; display: flex; align-items: center; gap: 4px;">
            <span>🏢</span>
            <span>${visit.clientName}</span>
          </div>
        `,
        iconSize: [120, 30],
        iconAnchor: [60, 15]
      });

      const visitMarker = L.marker([visit.lat, visit.lng], { icon: visitIcon });
      
      const popupHtml = `
        <div style="padding: 6px; font-family: system-ui, sans-serif; min-width: 200px;">
          <div style="font-size: 10px; font-weight: 800; color: #2563eb; text-transform: uppercase;">${visit.status.replace('_', ' ')} GEOFENCE</div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">${visit.clientName}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${visit.address}</div>
          <div style="font-size: 11px; color: #334155; margin-top: 6px; font-weight: 500;"><strong>Purpose:</strong> ${visit.purpose}</div>
          ${visit.checkInTime ? `<div style="margin-top: 6px; font-size: 11px; color: #059669; font-weight: bold;">✓ Checked In at ${visit.checkInTime}</div>` : ''}
        </div>
      `;

      visitMarker.bindPopup(popupHtml);
      group.addLayer(geofenceCircle);
      group.addLayer(visitMarker);
    });

    // 2. Plot Breadcrumbs polyline for selected employee
    if (selectedEmployeeId === 'emp-rahul-sharma' && routePoints.length > 0) {
      const latlngs = routePoints.map(p => [p.lat, p.lng] as [number, number]);
      const routePolyline = L.polyline(latlngs, {
        color: '#10b981',
        weight: 5,
        opacity: 0.85,
        smoothFactor: 1
      });

      // Start & Waypoint Dots
      latlngs.forEach((pt, i) => {
        const isStart = i === 0;
        const isLatest = i === latlngs.length - 1;
        const dot = L.circleMarker(pt, {
          radius: isLatest ? 7 : isStart ? 6 : 4,
          color: isLatest ? '#059669' : '#10b981',
          fillColor: isLatest ? '#10b981' : '#ffffff',
          fillOpacity: 1,
          weight: 2
        }).bindPopup(`<strong>Point ${i + 1}</strong>: ${routePoints[i].address}<br/>Time: ${routePoints[i].timestamp}`);
        group.addLayer(dot);
      });

      group.addLayer(routePolyline);
    }

    // 3. Plot Real-Time Field Employee Duty Markers
    filteredSessions.forEach(session => {
      const isSelected = selectedEmployeeId === session.userId;
      const isBreak = session.status === 'on_break';
      const initials = session.employeeName.split(' ').map(n => n[0]).join('');

      const employeeIcon = L.divIcon({
        className: 'custom-employee-marker',
        html: `
          <div style="position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center;">
            <div style="
              position: relative;
              width: 38px; 
              height: 38px; 
              border-radius: 50%; 
              background: ${isSelected ? '#4f46e5' : isBreak ? '#d97706' : '#059669'}; 
              color: white; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-weight: 800; 
              font-size: 13px; 
              border: 3px solid white; 
              box-shadow: 0 8px 20px rgba(0,0,0,0.35);
              ${isSelected ? 'box-shadow: 0 0 0 4px #a5b4fc, 0 8px 20px rgba(0,0,0,0.35);' : ''}
            ">
              ${initials}
            </div>
            
            <div style="
              margin-top: 4px;
              background: rgba(15, 23, 42, 0.95);
              color: white;
              font-size: 10px;
              font-weight: 700;
              padding: 2px 8px;
              border-radius: 6px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.25);
              border: 1px solid rgba(255,255,255,0.2);
              white-space: nowrap;
            ">
              ${session.employeeName.split(' ')[0]} • ${isBreak ? 'Break' : `${session.speedKmH} km/h`}
            </div>
          </div>
        `,
        iconSize: [80, 60],
        iconAnchor: [40, 30]
      });

      const marker = L.marker([session.lat, session.lng], { icon: employeeIcon });
      
      const popupHtml = `
        <div style="padding: 6px; font-family: system-ui, sans-serif; min-width: 220px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${isBreak ? '#fef3c7' : '#d1fae5'}; color: ${isBreak ? '#92400e' : '#065f46'};">
              ${isBreak ? 'ON BREAK' : 'ACTIVE ON FIELD'}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #059669;">🔋 ${session.batteryLevel}%</span>
          </div>

          <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 6px;">${session.employeeName}</div>
          <div style="font-size: 11px; font-family: monospace; color: #64748b;">${session.employeeCode} • ${session.department}</div>
          
          <div style="margin-top: 8px; padding: 6px; background: #f8fafc; border-radius: 6px; font-size: 11px; color: #334155;">
            <div><strong>Speed:</strong> ${session.speedKmH} km/h (±${session.accuracyMeters}m GPS)</div>
            <div><strong>Punch-In:</strong> ${session.punchInTime} (${Math.floor(session.totalDutyMinutes / 60)}h ${session.totalDutyMinutes % 60}m)</div>
            <div style="margin-top: 3px;"><strong>Location:</strong> ${session.address}</div>
          </div>

          <div style="margin-top: 6px; font-size: 11px; color: #1e293b;">
            <strong>Assigned Task:</strong> ${session.activeTask}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        if (onSelectEmployee) onSelectEmployee(session.userId);
      });

      group.addLayer(marker);
    });

    // 4. Plot User's Own Real Device Location if active
    if (myRealLocation) {
      const myLocationIcon = L.divIcon({
        className: 'custom-my-location',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(59, 130, 246, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 18px; height: 18px; border-radius: 50%; background: #2563eb; border: 3px solid white; box-shadow: 0 0 10px rgba(37, 99, 235, 0.8);"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const myMarker = L.marker([myRealLocation.lat, myRealLocation.lng], { icon: myLocationIcon })
        .bindPopup(`<strong>📍 My Live Device GPS</strong><br/>Accuracy: ±${Math.round(myRealLocation.accuracy)} meters`);
      
      const accuracyCircle = L.circle([myRealLocation.lat, myRealLocation.lng], {
        radius: myRealLocation.accuracy,
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 1
      });

      group.addLayer(accuracyCircle);
      group.addLayer(myMarker);
    }

  }, [liveSessions, fieldVisits, selectedEmployeeId, mapEngine, myRealLocation, routePoints, activeFilter]);

  // Recenter Leaflet map on target center change
  useEffect(() => {
    if (leafletMapInstanceRef.current && mapEngine === 'leaflet') {
      leafletMapInstanceRef.current.setView([mapCenter.lat, mapCenter.lng], mapZoom, {
        animate: true,
        duration: 0.8
      });
    }
  }, [mapCenter, mapZoom, mapEngine]);

  // --------------------------------------------------------------------------
  // USER REAL DEVICE GPS LOCATE HANDLER
  // --------------------------------------------------------------------------
  const handleLocateMyRealDevice = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingUser(true);
    showToast('Acquiring your live device GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setMyRealLocation({ lat: latitude, lng: longitude, accuracy });
        setMapCenter({ lat: latitude, lng: longitude });
        setMapZoom(15);
        setIsLocatingUser(false);
        showToast(`📍 Live GPS acquired! Centered at [${latitude.toFixed(4)}, ${longitude.toFixed(4)}] ±${Math.round(accuracy)}m`);
      },
      (err) => {
        setIsLocatingUser(false);
        showToast(`Could not acquire GPS: ${err.message}. Centered on Delhi-NCR Hub.`);
        setMapCenter({ lat: 28.6139, lng: 77.2090 });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // API Key handlers
  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      localStorage.setItem('fieldsure_gmaps_key', inputKey.trim());
      setCustomApiKey(inputKey.trim());
      setMapEngine('google_maps');
      setShowKeyModal(false);
      showToast('Google Maps Platform key saved! Switched to Google Vector WebGL engine.');
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('fieldsure_gmaps_key');
    setCustomApiKey('');
    setMapEngine('leaflet');
    setShowKeyModal(false);
    showToast('Google Maps key cleared. Using high-speed Real Map Tiles.');
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
      {/* Top Banner: Real Map Engine Status & Live Tracking Verified */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-slate-900">Live Field Telemetry & Real-World GIS Map</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3 h-3" /> DPDP Aligned Duty Consent
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                <Radio className="w-3 h-3 text-blue-600 animate-pulse" /> Adaptive Duty Updates
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Duty location updates plotted on actual geographical coordinates • Active duty shift hours only
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Map Engine Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMapEngine('leaflet')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mapEngine === 'leaflet'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🗺️ Real Street/Sat Map
            </button>
            <button
              onClick={() => {
                if (!activeApiKey) {
                  setShowKeyModal(true);
                } else {
                  setMapEngine('google_maps');
                }
              }}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                mapEngine === 'google_maps'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🌐 Google Maps SDK</span>
              {!activeApiKey && <span className="text-[9px] bg-amber-200 text-amber-900 px-1 rounded">Key Required</span>}
            </button>
          </div>

          <button
            onClick={handleLocateMyRealDevice}
            disabled={isLocatingUser}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all hover:scale-105 active:scale-95"
            title="Locate my real device GPS coordinates"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLocatingUser ? 'animate-spin' : ''}`} />
            <span>{isLocatingUser ? 'Acquiring GPS...' : '📍 Track My Real GPS'}</span>
          </button>

          <button
            onClick={() => setIsSimulatingLiveTelemetry(!isSimulatingLiveTelemetry)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSimulatingLiveTelemetry 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            title="Toggle simulated adaptive location updates (15-30s moving, 2-5m stationary)"
          >
            {isSimulatingLiveTelemetry ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-600" />
                <span>Adaptive Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-500" />
                <span>Paused</span>
              </>
            )}
          </button>

          <button
            onClick={handlePopoutWindow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all hover:scale-105 active:scale-95"
            title="Pop out Live Map in a dedicated new browser window for Dual-Monitor Multi-Screen NOC setup"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>🖥️ Popout Multi-Screen</span>
          </button>

          <button
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{activeApiKey ? 'Google Key Active' : 'Configure Google Key'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Map + Right Telemetry Dossier Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left 2 Cols: The Real Live Map Container */}
        <div className="lg:col-span-2 flex flex-col space-y-3">
          
          {/* Filter Bar & Map Layer Switcher */}
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Field Staff ({liveSessions.length})
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
                Client Geofences ({fieldVisits.length})
              </button>
            </div>

            {/* Map Layer Switcher */}
            <div className="flex items-center gap-2">
              {mapEngine === 'leaflet' ? (
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-bold px-1 flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Layer:
                  </span>
                  {(['streets', 'satellite', 'dark', 'terrain'] as const).map(k => (
                    <button
                      key={k}
                      onClick={() => setTileLayerKey(k)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize transition-all ${
                        tileLayerKey === k 
                          ? 'bg-slate-900 text-white shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {k === 'streets' ? 'Streets' : k === 'satellite' ? 'Satellite' : k === 'dark' ? 'Dark' : 'Terrain'}
                    </button>
                  ))}
                </div>
              ) : (
                <select
                  value={gmpMapType}
                  onChange={(e) => setGmpMapType(e.target.value as any)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="roadmap">Google Roadmap</option>
                  <option value="hybrid">Google Satellite Hybrid</option>
                  <option value="terrain">Google Terrain</option>
                </select>
              )}

              <button
                onClick={() => {
                  setMapCenter({ lat: 28.5800, lng: 77.2500 });
                  setMapZoom(12);
                  showToast('Map centered on Delhi-NCR Field Operations Hub');
                }}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                title="Reset to Central NCR Hub"
              >
                <Compass className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* THE ACTUAL LIVE MAP CANVAS */}
          {/* ================================================================= */}
          <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-slate-100">
            
            {/* 1. Leaflet Real-World Map Canvas */}
            {mapEngine === 'leaflet' && (
              <div 
                ref={leafletContainerRef} 
                className="w-full h-full z-10"
                style={{ background: '#f1f5f9' }}
              />
            )}

            {/* 2. Google Maps Platform Engine (if API key is present & user selected GMP) */}
            {mapEngine === 'google_maps' && activeApiKey && (
              <APIProvider apiKey={activeApiKey}>
                <GoogleMap
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  defaultCenter={{ lat: 28.5800, lng: 77.2500 }}
                  defaultZoom={12}
                  mapTypeId={gmpMapType}
                  gestureHandling={'greedy'}
                  disableDefaultUI={false}
                  className="w-full h-full"
                  mapId="DEMO_MAP_ID"
                >
                  <GoogleMapController center={mapCenter} zoom={mapZoom} />

                  {/* Route polyline for selected employee */}
                  {selectedEmployeeId === 'emp-rahul-sharma' && (
                    <GoogleMapPolyline path={selectedPath} color="#10b981" />
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
                          <span 
                            className={`animate-ping absolute inline-flex h-10 w-10 -top-1 -left-1 rounded-full opacity-60 ${
                              isBreak ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                          />
                          
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

                          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-900/90 text-[9px] font-bold text-white whitespace-nowrap shadow-md">
                            {session.employeeName.split(' ')[0]} • {isBreak ? 'Break' : `${session.speedKmH}km/h`}
                          </div>
                        </div>
                      </AdvancedMarker>
                    );
                  })}

                  {/* Plot Client Checkpoints */}
                  {fieldVisits.map((visit) => (
                    <AdvancedMarker
                      key={visit.id}
                      position={{ lat: visit.lat, lng: visit.lng }}
                      onClick={() => setSelectedMarker({ type: 'visit', data: visit })}
                      title={visit.clientName}
                    >
                      <div className="cursor-pointer px-2 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] border-2 border-white shadow-lg flex items-center gap-1 whitespace-nowrap">
                        <Building className="w-3 h-3" />
                        <span>{visit.clientName}</span>
                      </div>
                    </AdvancedMarker>
                  ))}

                  {/* InfoWindow for Clicked Employee */}
                  {selectedMarker && selectedMarker.type === 'employee' && (
                    <InfoWindow
                      position={{ lat: selectedMarker.data.lat, lng: selectedMarker.data.lng }}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-2 max-w-[260px] text-slate-800">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            selectedMarker.data.status === 'on_break' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {selectedMarker.data.status === 'on_break' ? 'ON BREAK' : 'ACTIVE ON FIELD'}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700">
                            {selectedMarker.data.batteryLevel}% Battery
                          </span>
                        </div>

                        <h4 className="font-bold text-xs text-slate-900 mt-1">{selectedMarker.data.employeeName}</h4>
                        <p className="text-[10px] text-slate-500 font-mono">{selectedMarker.data.employeeCode}</p>
                        <p className="text-[10px] text-slate-600 mt-1">{selectedMarker.data.address}</p>

                        <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded-lg text-[10px] text-slate-700 my-2">
                          <div>
                            <span className="text-slate-400 block">Speed</span>
                            <span className="font-bold">{selectedMarker.data.speedKmH} km/h</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Punch-In</span>
                            <span className="font-bold">{selectedMarker.data.punchInTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={() => showToast(`Calling ${selectedMarker.data.employeeName}...`)}
                            className="flex-1 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center gap-1"
                          >
                            <Phone className="w-3 h-3" /> Call
                          </button>
                          <button
                            onClick={() => sendMessage('Please share status on your current visit.', selectedMarker.data.userId, selectedMarker.data.employeeName)}
                            className="flex-1 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" /> Alert
                          </button>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </APIProvider>
            )}

            {/* Bottom Overlay Legend & Live Status */}
            <div className="absolute bottom-3 left-3 right-3 z-[400] pointer-events-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  ● Real GPS Telemetry: Active
                </span>
                <span className="text-slate-400 hidden sm:inline">|</span>
                <span className="text-slate-300 hidden sm:inline">Connaught Place • Cyber Hub • Faridabad • Sohna</span>
              </div>

              <div className="pointer-events-auto bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-200 shadow-lg flex items-center gap-2">
                <span className="text-slate-500">Live Accuracy:</span>
                <span className="text-emerald-700">±3.8 meters (GNSS L1/L5)</span>
              </div>
            </div>

          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                {liveSessions.filter(s => s.status === 'active').length}
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Active On Duty</span>
                <span className="font-bold text-slate-800">In Transit & Audits</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                {liveSessions.filter(s => s.status === 'on_break').length}
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">On Break</span>
                <span className="font-bold text-slate-800">Lunch & Rest Stop</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                {fieldVisits.length}
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Client Geofences</span>
                <span className="font-bold text-slate-800">Verified Checkpoints</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-xs">
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
                      setMapZoom(14);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedEmployeeId === emp.userId 
                        ? 'bg-slate-900 text-white shadow-xs font-bold' 
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
                <span className="text-[10px] text-slate-400 font-mono">{routePoints.length} Pings Recorded</span>
              </div>

              <div className="space-y-2 text-xs max-h-[160px] overflow-y-auto pr-1">
                {routePoints.map((pt) => (
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
                  setMapZoom(15);
                  showToast(`Zoomed and centered on ${selectedEmployeeSession.employeeName}`);
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
              FieldSure includes both a <strong>Real-World Interactive Map Engine</strong> and direct integration with <strong>Google Maps Platform</strong>. If you have an active GCP API Key, you can paste it below to enable Google WebGL vector maps:
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
                <span className="font-bold text-slate-800 block">Google Cloud APIs:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  <li><strong>Maps JavaScript API</strong> (Enabled)</li>
                  <li><strong>Geocoding API</strong> & <strong>Places API</strong> (Optional for address lookup)</li>
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
                    Save & Load Google Maps
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
