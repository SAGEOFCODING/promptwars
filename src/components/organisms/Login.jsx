import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Login.module.css';
import {
  auth,
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logout,
  logAnalyticsEvent,
  incrementCounter,
} from '../../config/firebase';
import {
  sanitizeInput,
  isValidEmail,
  checkRateLimit,
  logSecurityEvent,
} from '../../services/security';

const FIREBASE_NOT_CONFIGURED = !auth;

/** Map Firebase auth error codes to user-friendly messages */
const friendlyError = (code) => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'That email is already registered. Try logging in.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

const Login = ({ user, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in — show profile + sign out option
  if (user) {
    return (
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <div className={styles.header}>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                referrerPolicy="no-referrer"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  margin: '0 auto 1rem',
                  display: 'block',
                }}
              />
            )}
            <h2 className={styles.title}>You&apos;re signed in</h2>
            <p className={styles.subtitle}>{user.displayName ?? user.email}</p>
          </div>
          <button
            className={styles.submitBtn}
            onClick={async () => {
              await logout();
            }}
            style={{ marginTop: '1rem' }}
          >
            Sign Out
          </button>
          <button
            className={styles.toggleBtn}
            style={{ display: 'block', margin: '1rem auto 0', color: 'var(--text-muted)' }}
            onClick={onSuccess}
          >
            ← Back to App
          </button>
        </div>
      </div>
    );
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = sanitizeInput(email).toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!checkRateLimit(trimmedEmail)) {
      setError('Too many attempts. Please try again later.');
      logSecurityEvent('BRUTE_FORCE_ATTEMPT', { email: trimmedEmail });
      return;
    }

    if (FIREBASE_NOT_CONFIGURED) {
      // Simulate success in dev mode
      setLoading(true);
      setTimeout(() => {
        onSuccess?.({
          uid: 'sim-user-' + Math.random().toString(36).substr(2, 9),
          email: trimmedEmail,
          displayName: trimmedEmail.split('@')[0],
        });
        setLoading(false);
      }, 100);
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await loginWithEmail(trimmedEmail, trimmedPassword);
      } else {
        await registerWithEmail(trimmedEmail, trimmedPassword);
      }
      onSuccess?.();
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');

    if (FIREBASE_NOT_CONFIGURED) {
      // Simulate Google login success in dev mode
      setLoading(true);
      setTimeout(() => {
        onSuccess?.({
          uid: 'google-sim-user',
          email: 'google-user@example.com',
          displayName: 'Google Explorer',
          photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
        });
        setLoading(false);
      }, 100);
      return;
    }

    setLoading(true);
    try {
      await loginWithGoogle();
      onSuccess?.();
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className={styles.subtitle}>
            {isLogin
              ? 'Enter your credentials to access Eventlytics'
              : 'Sign up to get real-time venue insights'}
          </p>
        </div>

        {FIREBASE_NOT_CONFIGURED && !error && (
          <div className={styles.guestContainer}>
            <p className={styles.guestText}>
              Testing the app? Use our Guest Mode to explore all features instantly.
            </p>
            <button
              type="button"
              className={styles.guestBtn}
              onClick={async () => {
                const guestUser = {
                  uid: 'guest-user',
                  email: 'guest@eventlytics.io',
                  displayName: 'Guest Explorer',
                  photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
                };
                await Promise.allSettled([
                  logAnalyticsEvent('login', { method: 'guest' }),
                  incrementCounter('guest_logins'),
                ]);
                onSuccess?.(guestUser);
              }}
            >
              👤 Sign in as Guest
            </button>
            <div className={styles.divider}>or</div>
          </div>
        )}

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="login-email" className={styles.label}>
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              className={styles.input}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="login-password" className={styles.label}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing…' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.divider}>or</div>

        <button
          className={styles.googleBtn}
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <div className={styles.toggleAuth}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  user: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default Login;
