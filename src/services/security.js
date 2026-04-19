/**
 * Eventlytics Security Service
 * Implements defensive checks and data sanitization for common risk vectors.
 */

/**
 * Sanitize a string for Firestore storage.
 * Prevents common injection patterns.
 */
export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  // Remove potential script tags or HTML
  return str.replace(/<[^>]*>?/gm, '').trim();
};

/**
 * Validate an email address before sending to Auth.
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Audit log for security-sensitive operations.
 * Logs to Firestore for non-repudiation.
 */
export const logSecurityEvent = async (action, metadata = {}) => {
  const { logUserAction } = await import('../config/firebase');
  const { auth } = await import('../config/firebase');
  const uid = auth?.currentUser?.uid || 'anonymous';
  
  await logUserAction(uid, `SECURITY_${action}`, {
    ...metadata,
    ua: navigator.userAgent,
    ts: Date.now(),
  });
};

/**
 * Simple rate limiting simulation for client-side protection.
 * In a real app, this would be handled server-side/Firebase Functions.
 */
const rateLimitMap = new Map();
export const checkRateLimit = (key, limit = 5, windowMs = 60000) => {
  const now = Date.now();
  const userData = rateLimitMap.get(key) || { count: 0, start: now };
  
  if (now - userData.start > windowMs) {
    userData.count = 1;
    userData.start = now;
  } else {
    userData.count++;
  }
  
  rateLimitMap.set(key, userData);
  return userData.count <= limit;
};
