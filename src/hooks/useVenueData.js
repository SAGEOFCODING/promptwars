import { useState, useEffect } from 'react';
import { subscribeToZones } from '@/services/dataService';
import { logger } from '@/services/logger';
import { startTrace, stopTrace } from '@/services/telemetry';

/**
 * useVenueData Hook
 * Centralized logic for venue zone synchronization.
 */
export const useVenueData = () => {
  const [zonesData, setZonesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isFirstUpdate = true;
    const mapTrace = startTrace('venue_data_sync');

    const unsubscribe = subscribeToZones((zones) => {
      setZonesData(zones);
      if (isFirstUpdate) {
        stopTrace(mapTrace);
        setLoading(false);
        isFirstUpdate = false;
        logger.info('Venue data synchronized', { zoneCount: zones.length });
      }
    });

    return () => unsubscribe();
  }, []);

  return { zonesData, loading };
};
