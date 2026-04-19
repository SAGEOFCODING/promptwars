/**
 * Eventlytics Cloud Logger
 * Optimized for Google Cloud Logging (Stackdriver)
 * Standardizes stdout/stderr output into structured JSON for seamless log analysis.
 */

const isProd = import.meta.env.PROD;

/**
 * Log a message with a specific severity level.
 * @param {string} severity - DEBUG, INFO, NOTICE, WARNING, ERROR, CRITICAL
 * @param {string} message - The main log message
 * @param {Object} [metadata={}] - Additional context
 */
const log = (severity, message, metadata = {}) => {
  const logEntry = {
    severity,
    message,
    timestamp: new Date().toISOString(),
    serviceContext: {
      service: 'eventlytics-web',
      version: '1.2.0',
    },
    ...metadata,
  };

  if (isProd) {
    // In production, we output structured JSON for Google Cloud Logging to parse
    console.log(JSON.stringify(logEntry));
  } else {
    // In development, we use standard console methods for better readability
    const consoleMethod =
      severity.toLowerCase() === 'error' || severity.toLowerCase() === 'critical'
        ? 'error'
        : severity.toLowerCase() === 'warning'
          ? 'warn'
          : 'log';

    console[consoleMethod](`[${severity}] ${message}`, metadata);
  }
};

export const logger = {
  debug: (msg, meta) => log('DEBUG', msg, meta),
  info: (msg, meta) => log('INFO', msg, meta),
  notice: (msg, meta) => log('NOTICE', msg, meta),
  warn: (msg, meta) => log('WARNING', msg, meta),
  error: (msg, meta) => log('ERROR', msg, meta),
  critical: (msg, meta) => log('CRITICAL', msg, meta),
};
