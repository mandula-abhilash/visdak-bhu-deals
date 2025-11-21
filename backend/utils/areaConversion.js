export const AREA_CONVERSIONS = {
  SQ_FEET_TO_SQ_YARDS: 1 / 9,
  SQ_FEET_TO_GUNTAS: 1 / 1089,
  SQ_FEET_TO_ACRES: 1 / 43560,
  SQ_YARDS_TO_SQ_FEET: 9,
  SQ_YARDS_TO_GUNTAS: 9 / 1089,
  SQ_YARDS_TO_ACRES: 9 / 43560,
  GUNTAS_TO_SQ_FEET: 1089,
  GUNTAS_TO_SQ_YARDS: 1089 / 9,
  GUNTAS_TO_ACRES: 1089 / 43560,
  ACRES_TO_SQ_FEET: 43560,
  ACRES_TO_SQ_YARDS: 43560 / 9,
  ACRES_TO_GUNTAS: 43560 / 1089
};

export const convertArea = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;

  let sqFeet;

  switch (fromUnit) {
    case 'sq_feet':
      sqFeet = value;
      break;
    case 'sq_yards':
      sqFeet = value * AREA_CONVERSIONS.SQ_YARDS_TO_SQ_FEET;
      break;
    case 'guntas':
      sqFeet = value * AREA_CONVERSIONS.GUNTAS_TO_SQ_FEET;
      break;
    case 'acres':
      sqFeet = value * AREA_CONVERSIONS.ACRES_TO_SQ_FEET;
      break;
    default:
      throw new Error('Invalid from unit');
  }

  switch (toUnit) {
    case 'sq_feet':
      return sqFeet;
    case 'sq_yards':
      return sqFeet * AREA_CONVERSIONS.SQ_FEET_TO_SQ_YARDS;
    case 'guntas':
      return sqFeet * AREA_CONVERSIONS.SQ_FEET_TO_GUNTAS;
    case 'acres':
      return sqFeet * AREA_CONVERSIONS.SQ_FEET_TO_ACRES;
    default:
      throw new Error('Invalid to unit');
  }
};

export const formatArea = (sqFeet) => {
  return {
    sq_feet: Math.round(sqFeet * 100) / 100,
    sq_yards: Math.round(sqFeet * AREA_CONVERSIONS.SQ_FEET_TO_SQ_YARDS * 100) / 100,
    guntas: Math.round(sqFeet * AREA_CONVERSIONS.SQ_FEET_TO_GUNTAS * 100) / 100,
    acres: Math.round(sqFeet * AREA_CONVERSIONS.SQ_FEET_TO_ACRES * 100) / 100
  };
};

export const calculatePolygonArea = (coordinates) => {
  if (!coordinates || coordinates.length < 3) {
    return 0;
  }

  const earthRadius = 6371000;

  const toRadians = (degrees) => degrees * (Math.PI / 180);

  let area = 0;
  const points = coordinates.map(coord => ({
    lat: toRadians(coord.lat),
    lng: toRadians(coord.lng)
  }));

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    area += (p2.lng - p1.lng) * (2 + Math.sin(p1.lat) + Math.sin(p2.lat));
  }

  area = Math.abs(area * earthRadius * earthRadius / 2);

  const areaInSqFeet = area * 10.7639;

  return areaInSqFeet;
};
