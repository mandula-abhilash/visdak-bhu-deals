export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 8;
};

export const validateCoordinates = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  return (
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

export const validatePolygon = (coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length < 3) {
    return false;
  }

  return coordinates.every(coord => {
    return (
      coord &&
      typeof coord.lat === 'number' &&
      typeof coord.lng === 'number' &&
      validateCoordinates(coord.lat, coord.lng)
    );
  });
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

export const validatePriceRange = (priceRange) => {
  const ranges = ['0-10L', '10L-25L', '25L-50L', '50L-1Cr', '1Cr+'];
  return ranges.includes(priceRange);
};
