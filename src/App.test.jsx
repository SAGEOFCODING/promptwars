import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// ─── Browser API stubs ───────────────────────────────────────────────────────
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ─── Module mocks ────────────────────────────────────────────────────────────

// Firebase config — no real SDK calls
vi.mock('@/config/firebase', () => ({
  auth: null,
  db: null,
  storage: null,
  loginWithGoogle: vi
    .fn()
    .mockResolvedValue({
      uid: 'google-sim-user',
      email: 'google-user@example.com',
      displayName: 'Google Explorer',
      photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
    }),
  loginWithEmail: vi.fn(),
  registerWithEmail: vi.fn(),
  logout: vi.fn(),
  logAnalyticsEvent: vi.fn().mockResolvedValue(undefined),
  setAnalyticsUser: vi.fn().mockResolvedValue(undefined),
  incrementCounter: vi.fn().mockResolvedValue(undefined),
  upsertUserProfile: vi.fn().mockResolvedValue(undefined),
  logUserSession: vi.fn().mockResolvedValue('session-id'),
  logUserAction: vi.fn().mockResolvedValue(undefined),
  subscribeToCollection: vi.fn().mockReturnValue(() => {}),
  getRemoteConfigValue: vi.fn().mockReturnValue(null),
  perf: null,
  remoteConfig: null,
  logBrowserCapabilities: vi.fn(),
  messaging: null,
  requestNotificationPermission: vi.fn().mockResolvedValue('test-token'),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_auth, cb) => {
    cb(null);
    return vi.fn();
  }),
  getAuth: vi.fn(),
}));

// Data Service — mock Firestore listeners
vi.mock('@/services/dataService', () => ({
  getVenueZones: vi.fn().mockResolvedValue([
    { id: 'north', name: 'North Gate', crowd: 'low', wait: '5 mins' },
    { id: 'south', name: 'South Gate', crowd: 'high', wait: '25 mins' },
    { id: 'field', name: 'Main Field', crowd: 'low', wait: 'No Queue' },
    { id: 'food1', name: 'Food Court', crowd: 'medium', wait: '12 mins' },
    { id: 'merch', name: 'Merch Store', crowd: 'high', wait: '30 mins' },
  ]),
  getNotifications: vi.fn().mockResolvedValue([
    {
      id: 1,
      type: 'danger',
      title: 'High Crowd',
      message: 'South Gate congested',
      time: '2 mins ago',
    },
    {
      id: 2,
      type: 'info',
      title: 'Merch Drop',
      message: 'New jerseys available',
      time: '15 mins ago',
    },
  ]),
  getQueues: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: 'Food Court A',
      location: 'Sec 102',
      waitTime: '12 mins',
      type: 'food',
      trend: 'up',
    },
    {
      id: 2,
      title: 'Main Merch',
      location: 'Gate C',
      waitTime: '30 mins',
      type: 'merch',
      trend: 'stable',
    },
  ]),
  getVenueStats: vi
    .fn()
    .mockResolvedValue({ capacityPercentage: 78, highTrafficZones: ['South Gate'] }),
  subscribeToZones: vi.fn((cb) => {
    cb([
      { id: 'north', name: 'North Gate', crowd: 'low', wait: '5 mins' },
      { id: 'south', name: 'South Gate', crowd: 'high', wait: '25 mins' },
      { id: 'field', name: 'Main Field', crowd: 'low', wait: 'No Queue' },
      { id: 'food1', name: 'Food Court', crowd: 'medium', wait: '12 mins' },
      { id: 'merch', name: 'Merch Store', crowd: 'high', wait: '30 mins' },
    ]);
    return vi.fn();
  }),
  subscribeToNotifications: vi.fn((cb) => {
    cb([
      {
        id: 1,
        type: 'danger',
        title: 'High Crowd',
        message: 'South Gate congested',
        time: '2 mins ago',
      },
    ]);
    return vi.fn();
  }),
  subscribeToQueues: vi.fn((cb) => {
    cb([
      {
        id: 1,
        title: 'Food Court A',
        location: 'Sec 102',
        waitTime: '12 mins',
        type: 'food',
        trend: 'up',
      },
      {
        id: 2,
        title: 'Main Merch',
        location: 'Gate C',
        waitTime: '30 mins',
        type: 'merch',
        trend: 'stable',
      },
    ]);
    return vi.fn();
  }),
  logZoneInteraction: vi.fn().mockResolvedValue(undefined),
  logNavigationAction: vi.fn().mockResolvedValue(undefined),
  submitCrowdReport: vi.fn().mockResolvedValue('report-id'),
  saveUserPreferences: vi.fn().mockResolvedValue(undefined),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────
const renderApp = () => render(<App />);

// ─── Test Suite ──────────────────────────────────────────────────────────────
describe('App — Integration & Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Core render
  it('renders the Map tab by default', async () => {
    renderApp();
    await waitFor(() => expect(screen.getByText('Interactive Map')).toBeInTheDocument());
  });

  // Navigation flow
  it('navigates through all bottom-nav tabs', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByText('Wait Times'));
    expect(screen.getByText('Live Wait Times')).toBeInTheDocument();

    await user.click(screen.getByText('Alerts'));
    expect(screen.getByText('Live Updates')).toBeInTheDocument();

    await user.click(screen.getByText('Navigate'));
    expect(screen.getByText('Venue Location')).toBeInTheDocument();

    await user.click(screen.getByText('Live Crowd'));
    expect(screen.getByText('Live Crowd Heatmap')).toBeInTheDocument();

    await user.click(screen.getByText('Venue Map'));
    expect(screen.getByText('Interactive Map')).toBeInTheDocument();
  });

  // Login page
  it('shows Login page when profile icon is clicked (unauthenticated)', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByLabelText('Login'));
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('Login toggles between Sign In and Sign Up mode', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByLabelText('Login'));
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    await user.click(screen.getByText('Sign up'));
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    await user.click(screen.getByText('Log in'));
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('Login shows Guest Mode option when auth is null', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByLabelText('Login'));
    expect(screen.getByText(/Use our Guest Mode/i)).toBeInTheDocument();
  });

  it('Login shows validation error when submitting empty fields', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByLabelText('Login'));
    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Please fill in all fields.');
  });

  // Google Maps embed on Navigate tab
  it('renders Google Maps iframe on Navigate tab', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByText('Navigate'));
    const iframe = screen.getByTitle('Venue location on Google Maps');
    expect(iframe).toBeInTheDocument();
    expect(iframe.src).toContain('maps.google.com');
  });

  // Data loading states
  it('shows queues after data loads', async () => {
    renderApp();
    const user = userEvent.setup();
    await user.click(screen.getByText('Wait Times'));
    await waitFor(() => expect(screen.getByText('Food Court A')).toBeInTheDocument());
    expect(screen.getByText('Main Merch')).toBeInTheDocument();
  });

  it('shows notifications after data loads', async () => {
    renderApp();
    const user = userEvent.setup();
    await user.click(screen.getByText('Alerts'));
    await waitFor(() => expect(screen.getByText('High Crowd')).toBeInTheDocument());
  });
});
