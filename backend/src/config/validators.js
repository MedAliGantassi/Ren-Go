// ===== config/validators.js =====
const escapeRegex = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const validateDate = (dateStr) => {
  const date = new Date(dateStr);
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error('Invalid date format. Use ISO8601 format.');
  }
  return date;
};

const validateNumber = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num < min || num > max) {
    throw new Error(`Value must be a number between ${min} and ${max}`);
  }
  return num;
};

const validatePositiveInteger = (value, fieldName = 'Value') => {
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return num;
};

const validateLocalisation = (loc) => {
  if (!loc || typeof loc !== 'object') {
    throw new Error('Localisation must be an object');
  }
  if (!loc.gouvernorat || typeof loc.gouvernorat !== 'string') {
    throw new Error('Localisation must contain a valid gouvernorat');
  }
  if (!loc.delegation || typeof loc.delegation !== 'string') {
    throw new Error('Localisation must contain a valid delegation');
  }
  return true;
};

const validateImages = (imgs) => {
  if (!imgs) return [];
  if (!Array.isArray(imgs)) {
    throw new Error('Images must be an array');
  }
  return imgs.filter(img => {
    try {
      new URL(img);
      return true;
    } catch {
      return false;
    }
  });
};

const validatePaymentMethod = (method) => {
  if (!method || !['CASH', 'ONLINE'].includes(method)) {
    throw new Error('Payment method must be CASH or ONLINE');
  }
  return method;
};

const sendErrorResponse = (res, error, statusCode = 500) => {
  console.error('Error:', error);

  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }

  res.status(statusCode).json({
    success: false,
    message: 'An error occurred. Please try again later.'
  });
};

module.exports = {
  escapeRegex,
  validateDate,
  validateNumber,
  validatePositiveInteger,
  validateLocalisation,
  validateImages,
  validatePaymentMethod,
  sendErrorResponse
};
