import { useState, useEffect } from 'react';
import { subscribeToNotifications } from '@/services/dataService';
import { logAnalyticsEvent } from '@/config/firebase';

/**
 * useNotifications Hook
 * Real-time synchronization for security and informational alerts.
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logAnalyticsEvent('notification_feed_viewed');
    const unsubscribe = subscribeToNotifications((data) => {
      setNotifications(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { notifications, loading };
};
