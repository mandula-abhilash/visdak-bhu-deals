export const AREA_CONVERSIONS = {
  SQ_FEET_TO_SQ_YARDS: 1 / 9,
  SQ_FEET_TO_GUNTAS: 1 / 1089,
  SQ_FEET_TO_ACRES: 1 / 43560,
};

export interface Coordinate {
  lat: number;
  lng: number;
}

export function calculatePolygonArea(coordinates: Coordinate[]): number {
  if (!coordinates || coordinates.length < 3) {
    return 0;
  }

  const earthRadius = 6371000;
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  let area = 0;
  const points = coordinates.map(coord => ({
    lat: toRadians(coord.lat),
    lng: toRadians(coord.lng),
  }));

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    area += (p2.lng - p1.lng) * (2 + Math.sin(p1.lat) + Math.sin(p2.lat));
  }

  area = Math.abs(area * earthRadius * earthRadius / 2);
  const areaInSqFeet = area * 10.7639;

  return areaInSqFeet;
}

export function formatArea(sqFeet: number) {
  return {
    sq_feet: Math.round(sqFeet * 100) / 100,
    sq_yards: Math.round(sqFeet * AREA_CONVERSIONS.SQ_FEET_TO_SQ_YARDS * 100) / 100,
    guntas: Math.round(sqFeet * AREA_CONVERSIONS.SQ_FEET_TO_GUNTAS * 100) / 100,
    acres: Math.round(sqFeet * AREA_CONVERSIONS.SQ_FEET_TO_ACRES * 100) / 100,
  };
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} meters`;
  }
  return `${Math.round(km * 100) / 100} km`;
}
