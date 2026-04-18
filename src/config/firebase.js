import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getAnalytics, logEvent as _logEvent, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Only initialize if we have a real project ID
const isConfigured = Boolean(firebaseConfig.projectId);

const app = isConfigured
  ? getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0]
  : null;

export const db             = isConfigured ? getFirestore(app) : null;
export const auth           = isConfigured ? getAuth(app)      : null;
export const googleProvider = isConfigured ? new GoogleAuthProvider() : null;

// Firebase Analytics — initialize async (requires browser environment)
let analyticsInstance = null;
if (isConfigured) {
  isSupported().then((supported) => {
    if (supported) analyticsInstance = getAnalytics(app);
  });
}

/**
 * Log an Analytics event — no-ops gracefully when Analytics isn't ready.
 * @param {string} eventName
 * @param {object} params
 */
export const logAnalyticsEvent = (eventName, params = {}) => {
  if (analyticsInstance) _logEvent(analyticsInstance, eventName, params);
};

// Re-export auth functions so consumers don't import firebase/auth directly
export { signInWithEmailAndPassword, createUserWithEmailAndPassword };

// --- Auth helpers ---

export const loginWithGoogle = async () => {
  if (!auth || !googleProvider) throw new Error('Firebase not configured.');
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const logout = async () => {
  if (!auth) throw new Error('Firebase not configured.');
  await signOut(auth);
};

export default app;


