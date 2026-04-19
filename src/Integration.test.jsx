import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as dataService from './services/dataService';

// ─── Module mocks ────────────────────────────────────────────────────────────
vi.mock('./config/firebase', () => ({
  auth: null,
  db: null,
  storage: null,
  loginWithGoogle: vi.fn().mockResolvedValue({ uid: 'g-1' }),
  loginWithEmail: vi.fn(),
  registerWithEmail: vi.fn(),
  logout: vi.fn(),
  logAnalyticsEvent: vi.fn(),
  setAnalyticsUser: vi.fn(),
  incrementCounter: vi.fn(),
  upsertUserProfile: vi.fn(),
  logUserSession: vi.fn(),
  logUserAction: vi.fn(),
  subscribeToCollection: vi.fn(),
  getRemoteConfigValue: vi.fn(),
  perf: null,
  logBrowserCapabilities: vi.fn(),
  messaging: null,
  requestNotificationPermission: vi.fn().mockResolvedValue('test-token'),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_auth, cb) => {
    cb(null);
    return vi.fn();
  }),
  getAuth: vi.fn(),
}));

vi.mock('./services/dataService', () => ({
  getVenueZones: vi.fn(),
  getNotifications: vi.fn(),
  getQueues: vi.fn(),
  getVenueStats: vi.fn(),
  subscribeToZones: vi.fn((cb) => {
    cb([{ id: 'field', name: 'Main Field', crowd: 'low', wait: 'No Queue' }]);
    return vi.fn();
  }),
  subscribeToNotifications: vi.fn((cb) => {
    cb([]);
    return vi.fn();
  }),
  subscribeToQueues: vi.fn((cb) => {
    cb([]);
    return vi.fn();
  }),
  logZoneInteraction: vi.fn(),
  logNavigationAction: vi.fn(),
  submitCrowdReport: vi.fn().mockResolvedValue('ok'),
}));

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes the "Zone Discovery" journey', async () => {
    const user = userEvent.setup();
    render(<App />);
    const fieldZone = await screen.findByText('Main Field');
    await user.click(fieldZone);
    expect(await screen.findByText(/Estimated Wait Time/i)).toBeInTheDocument();
  });

  it('completes the "Crowd Reporting" flow', async () => {
    const user = userEvent.setup();
    render(<App />);
    const fieldZone = await screen.findByText('Main Field');
    await user.click(fieldZone);
    const lowBtn = await screen.findByTitle('Report Low Crowd');
    fireEvent.click(lowBtn);
    await waitFor(() => {
      expect(dataService.submitCrowdReport).toHaveBeenCalled();
    });
  });

  it('handles Login flow', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByLabelText('Login'));
    expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument();
  });
});
