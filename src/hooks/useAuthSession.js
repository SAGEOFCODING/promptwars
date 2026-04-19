import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  logAnalyticsEvent,
  upsertUserProfile,
  setAnalyticsUser,
} from '@/config/firebase';

/**
 * useAuthSession Hook
 * Manages Firebase authentication state and user profile synchronization.
 */
export const useAuthSession = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ?? null);
      setLoading(false);

      if (currentUser) {
        upsertUserProfile(currentUser);
        setAnalyticsUser(currentUser.uid, {
          email: currentUser.email,
          user_type: currentUser.isAnonymous ? 'guest' : 'registered',
          last_login: new Date().toISOString(),
        });
        logAnalyticsEvent('user_session_resumed', { uid: currentUser.uid });
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, setUser, loading };
};
