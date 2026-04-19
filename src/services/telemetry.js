import { trace } from 'firebase/performance';
import { perf } from '@/config/firebase';
import { logger } from '@/services/logger';

/**
 * Performance Telemetry Service
 * High-level wrapper for Google Cloud Performance Monitoring.
 */
export const startTrace = (name) => {
  if (!perf) return null;
  try {
    const t = trace(perf, name);
    t.start();
    logger.debug(`[Telemetry] Started trace: ${name}`);
    return t;
  } catch (err) {
    logger.error(`[Telemetry] Failed to start trace: ${name}`, { error: err.message });
    return null;
  }
};

export const stopTrace = (t) => {
  if (t) {
    try {
      t.stop();
      logger.debug(`[Telemetry] Stopped trace`);
    } catch {
      // Non-critical
    }
  }
};
