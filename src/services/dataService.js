import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { venueZonesData, notificationsData, queueData, venueStats } from '../data/mockData';

// Whether we have a real Firebase project configured
const hasFirebase =
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'mock-project-id';

/**
 * Generic Firestore collection fetch with mock fallback.
 * @param {string} collectionName  - Firestore collection
 * @param {import('firebase/firestore').QueryConstraint[]} constraints - optional query constraints
 * @param {*} fallback - data to return when Firestore is unavailable
 */
const fetchCollection = async (collectionName, constraints, fallback) => {
  if (hasFirebase) {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }
    } catch (err) {
      // Log minimal context – don't expose internal error details
      console.warn(`[dataService] ${collectionName} fetch failed, using local data.`);
    }
  }
  return fallback;
};

export const getVenueZones     = () => fetchCollection('zones',         [],                            venueZonesData);
export const getNotifications  = () => fetchCollection('notifications', [orderBy('timestamp', 'desc')], notificationsData);
export const getQueues         = () => fetchCollection('queues',        [],                            queueData);
export const getVenueStats     = async () => {
  if (hasFirebase) {
    try {
      const snapshot = await getDocs(collection(db, 'stats'));
      if (!snapshot.empty) return snapshot.docs[0].data();
    } catch {
      console.warn('[dataService] stats fetch failed, using local data.');
    }
  }
  return venueStats;
};

