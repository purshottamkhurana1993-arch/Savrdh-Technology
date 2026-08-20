/**
 * Real-Time Geospatial & En-Route Telemetry Navigation Utilities
 * Calculates accurate Haversine distances, bearings, ETAs, and heading convergence.
 */

export interface EnRouteStatus {
  currentDistanceMeters: number;
  formattedDistance: string;
  etaMinutes: number;
  formattedEta: string;
  bearingDegrees: number;
  cardinalDirection: string;
  headingStatus: 'approaching' | 'stationary' | 'diverging' | 'arrived';
  statusText: string;
  statusColor: string;
  isInsideGeofence: boolean;
  proximityProgressPercentage: number;
}

/**
 * Calculates Great-Circle distance in meters between two lat/lng coordinates
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Formats distance into human-friendly string (e.g. "85 m", "1.4 km")
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

/**
 * Computes forward azimuth bearing in degrees (0 - 360) from point 1 to point 2
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  return ((θ * 180) / Math.PI + 360) % 360;
}

/**
 * Converts bearing angle to 8-point cardinal compass string
 */
export function bearingToCardinal(bearing: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

/**
 * Estimates arrival time based on current speed or typical urban field speed (20 km/h)
 */
export function estimateTripEta(
  distanceMeters: number,
  speedKmH: number = 20
): { minutes: number; formattedEta: string } {
  const effectiveSpeed = Math.max(10, speedKmH || 20); // Min 10 km/h baseline in traffic
  const speedMetersPerSec = (effectiveSpeed * 1000) / 3600;
  const seconds = distanceMeters / speedMetersPerSec;
  const minutes = Math.max(1, Math.round(seconds / 60));

  if (distanceMeters <= 100) {
    return { minutes: 0, formattedEta: 'Arrived at Site (< 1 min)' };
  }
  if (minutes < 60) {
    return { minutes, formattedEta: `~${minutes} mins (at ${Math.round(effectiveSpeed)} km/h)` };
  }
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return { minutes, formattedEta: `~${hours}h ${remMinutes}m` };
}

/**
 * Analyzes whether the employee is moving towards the task destination
 */
export function evaluateEnRouteTelemetry(
  employeeLat: number,
  employeeLng: number,
  employeeSpeedKmH: number,
  targetLat: number,
  targetLng: number,
  initialTripDistanceMeters?: number,
  geofenceRadiusMeters: number = 100
): EnRouteStatus {
  const currentDistanceMeters = calculateDistanceMeters(
    employeeLat,
    employeeLng,
    targetLat,
    targetLng
  );

  const isInsideGeofence = currentDistanceMeters <= geofenceRadiusMeters;
  const bearingDegrees = calculateBearing(
    employeeLat,
    employeeLng,
    targetLat,
    targetLng
  );
  const cardinalDirection = bearingToCardinal(bearingDegrees);
  const { minutes: etaMinutes, formattedEta } = estimateTripEta(
    currentDistanceMeters,
    employeeSpeedKmH
  );

  let headingStatus: 'approaching' | 'stationary' | 'diverging' | 'arrived' = 'approaching';
  let statusText = 'Approaching Client Destination';
  let statusColor = '#10b981'; // emerald

  if (isInsideGeofence) {
    headingStatus = 'arrived';
    statusText = `Inside ${geofenceRadiusMeters}m Geofence (Arrived)`;
    statusColor = '#059669';
  } else if (employeeSpeedKmH < 3) {
    headingStatus = 'stationary';
    statusText = `Stationary / Idle (${formatDistance(currentDistanceMeters)} away)`;
    statusColor = '#f59e0b'; // amber
  } else {
    headingStatus = 'approaching';
    statusText = `Moving towards site (${employeeSpeedKmH} km/h • ${cardinalDirection})`;
    statusColor = '#10b981';
  }

  // Calculate progress relative to baseline (e.g. 5 km trip)
  const baselineDistance = initialTripDistanceMeters || Math.max(currentDistanceMeters, 3500);
  const traveled = Math.max(0, baselineDistance - currentDistanceMeters);
  const proximityProgressPercentage = Math.min(
    100,
    Math.max(5, Math.round((traveled / baselineDistance) * 100))
  );

  return {
    currentDistanceMeters,
    formattedDistance: formatDistance(currentDistanceMeters),
    etaMinutes,
    formattedEta,
    bearingDegrees,
    cardinalDirection,
    headingStatus,
    statusText,
    statusColor,
    isInsideGeofence,
    proximityProgressPercentage: isInsideGeofence ? 100 : proximityProgressPercentage
  };
}
