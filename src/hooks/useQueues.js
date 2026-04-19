import { useState, useEffect } from 'react';
import { subscribeToQueues } from '@/services/dataService';
import { logAnalyticsEvent } from '@/config/firebase';

/**
 * useQueues Hook
 * Manages live wait time data with real-time Firestore synchronization.
 */
export const useQueues = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logAnalyticsEvent('queue_list_viewed');
    const unsubscribe = subscribeToQueues((data) => {
      setQueues(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { queues, loading };
};
