import { useState, useCallback, useRef } from 'react';

/**
 * useRateLimit Hook
 * Prevents rapid-fire actions (spam/brute-force) on the client side.
 * @param {number} limitMs - Minimum time between actions in milliseconds.
 * @returns {Function} checkRateLimit - Returns true if action is allowed, false if rate limited.
 */
export const useRateLimit = (limitMs = 1000) => {
  const lastActionRef = useRef(0);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    if (now - lastActionRef.current < limitMs) {
      setIsRateLimited(true);
      setTimeout(() => setIsRateLimited(false), limitMs);
      return false;
    }
    lastActionRef.current = now;
    return true;
  }, [limitMs]);

  return { checkRateLimit, isRateLimited };
};
