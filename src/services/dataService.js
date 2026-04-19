import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  doc,
  setDoc,
} from 'firebase/firestore';
import { db, logAnalyticsEvent, incrementCounter } from '../config/firebase';
import { venueZonesData, notificationsData, queueData, venueStats } from '../data/mockData';

// Whether we have a real Firebase project configured
const hasFirebase =
  Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID) &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'mock-project-id';

/**
 * @typedef {Object} Zone
 * @property {string} id - Unique identifier for the zone
 * @property {string} name - Display name of the zone
 * @property {string} crowd - Crowd level (low|medium|high)
 * @property {string} wait - Human-readable wait time (e.g. "5 mins")
 * @property {string} [status] - Optional status message
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - Unique identifier
 * @property {string} title - Notification title
 * @property {string} message - Notification body
 * @property {string} type - info|warning|danger
 * @property {import('firebase/firestore').Timestamp} timestamp - Firestore timestamp
 */

/**
 * @typedef {Object} VenueStats
 * @property {number} totalCrowd - Total estimated attendance
 * @property {number} entryCapacity - Percentage of entry capacity utilized
 * @property {number} activeAlerts - Count of high-severity alerts
 */

/**
 * Generic Firestore collection fetch with mock fallback.
 * @param {string} collectionName  - Firestore collection
 * @param {import('firebase/firestore').QueryConstraint[]} constraints
 * @param {*} fallback - data to return when Firestore is unavailable
 */
const fetchCollection = async (collectionName, constraints = [], fallback) => {
  if (hasFirebase && db) {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }
      // Collection empty — seed it with fallback data
      await seedCollection(collectionName, fallback);
    } catch {
      console.warn(`[dataService] ${collectionName} fetch failed, using local data.`);
    }
  }
  return fallback;
};

/**
 * Seed an empty Firestore collection with local fallback data.
 * Only runs once — subsequent fetches will find real data.
 */
const seedCollection = async (collectionName, data) => {
  if (!db || !Array.isArray(data)) return;
  try {
    const writes = data.map((item) =>
      addDoc(collection(db, collectionName), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );
    await Promise.allSettled(writes);
    console.info(`[dataService] Seeded ${collectionName} with ${data.length} records.`);
  } catch {
    // Non-critical
  }
};

// ─── Public Data Fetching API ─────────────────────────────────────────────────

export const getVenueZones = () => fetchCollection('zones', [], venueZonesData);

export const getNotifications = () =>
  fetchCollection('notifications', [orderBy('timestamp', 'desc')], notificationsData);

export const getQueues = () => fetchCollection('queues', [], queueData);

export const getVenueStats = async () => {
  if (hasFirebase && db) {
    try {
      const snapshot = await getDocs(collection(db, 'stats'));
      if (!snapshot.empty) return snapshot.docs[0].data();
    } catch {
      console.warn('[dataService] stats fetch failed, using local data.');
    }
  }
  return venueStats;
};

// ─── Real-Time Firestore Listeners ─────────────────────────────────────────────

/**
 * Subscribe to real-time zone updates from Firestore.
 * Falls back gracefully if Firebase is unavailable.
 * @param {Function} callback - called with zones array on every update
 * @returns {Function} unsubscribe function
 */
export const subscribeToZones = (callback) => {
  if (!hasFirebase || !db) {
    // Return mock data immediately, no real-time updates
    callback(venueZonesData);
    return () => {};
  }
  try {
    const q = query(collection(db, 'zones'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          callback(venueZonesData);
        } else {
          callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      },
      () => callback(venueZonesData)
    );
  } catch {
    callback(venueZonesData);
    return () => {};
  }
};

/**
 * Subscribe to real-time notification updates from Firestore.
 * @param {Function} callback
 * @returns {Function} unsubscribe
 */
export const subscribeToNotifications = (callback) => {
  if (!hasFirebase || !db) {
    callback(notificationsData);
    return () => {};
  }
  try {
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          callback(notificationsData);
        } else {
          callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      },
      () => callback(notificationsData)
    );
  } catch {
    callback(notificationsData);
    return () => {};
  }
};

/**
 * Subscribe to real-time queue updates from Firestore.
 * @param {Function} callback
 * @returns {Function} unsubscribe
 */
export const subscribeToQueues = (callback) => {
  if (!hasFirebase || !db) {
    callback(queueData);
    return () => {};
  }
  try {
    const q = query(collection(db, 'queues'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          callback(queueData);
        } else {
          callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      },
      () => callback(queueData)
    );
  } catch {
    callback(queueData);
    return () => {};
  }
};

// ─── Write Operations ─────────────────────────────────────────────────────────

/**
 * Submit a user crowd report for a specific zone.
 * Writes to Firestore `crowd_reports` collection.
 */
export const submitCrowdReport = async (uid, zoneId, crowdLevel) => {
  if (!db) return null;
  try {
    const ref = await addDoc(collection(db, 'crowd_reports'), {
      uid: uid ?? 'anonymous',
      zoneId,
      crowdLevel,
      reportedAt: serverTimestamp(),
      source: 'user_report',
    });
    await logAnalyticsEvent('crowd_report_submitted', { zoneId, crowdLevel });
    await incrementCounter('crowd_reports_total');
    return ref.id;
  } catch {
    return null;
  }
};

/**
 * Log a zone interaction (click/view) to Firestore for analytics enrichment.
 */
export const logZoneInteraction = async (uid, zoneId, zoneName, interactionType = 'view') => {
  if (!db) return;
  try {
    await addDoc(collection(db, 'zone_interactions'), {
      uid: uid ?? 'anonymous',
      zoneId,
      zoneName,
      interactionType,
      interactedAt: serverTimestamp(),
    });
    await logAnalyticsEvent('zone_interaction', {
      zone_id: zoneId,
      zone_name: zoneName,
      interaction_type: interactionType,
    });
    await incrementCounter(`zone_${zoneId}_views`);
  } catch {
    // Non-critical
  }
};

/**
 * Log a navigation action to Firestore.
 */
export const logNavigationAction = async (uid, fromTab, toTab) => {
  if (!db) return;
  try {
    await addDoc(collection(db, 'navigation_events'), {
      uid: uid ?? 'anonymous',
      fromTab,
      toTab,
      navigatedAt: serverTimestamp(),
    });
    await logAnalyticsEvent('tab_navigation', { from_tab: fromTab, to_tab: toTab });
  } catch {
    // Non-critical
  }
};

/**
 * Save user preferences to Firestore.
 */
export const saveUserPreferences = async (uid, preferences) => {
  if (!db || !uid) return;
  try {
    await setDoc(
      doc(db, 'user_preferences', uid),
      { ...preferences, updatedAt: serverTimestamp() },
      { merge: true }
    );
    await logAnalyticsEvent('preferences_saved', { uid });
  } catch {
    // Non-critical
  }
};
