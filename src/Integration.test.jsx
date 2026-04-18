import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as dataService from './services/dataService';

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
vi.mock('./config/firebase', () => ({
  auth: null,
  db: null,
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_auth, cb) => { cb(null); return vi.fn(); }),
  getAuth: vi.fn(),
}));

// We'll mock dataService specifically per test
vi.mock('./services/dataService', () => ({
  getVenueZones: vi.fn(),
  getNotifications: vi.fn(),
  getQueues: vi.fn(),
  getVenueStats: vi.fn(),
}));

describe('App Integration & Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default success mocks
    dataService.getVenueZones.mockResolvedValue([
      { id: 'field', name: 'Main Field', crowd: 'low', wait: 'No Queue' }
    ]);
    dataService.getNotifications.mockResolvedValue([]);
    dataService.getQueues.mockResolvedValue([]);
    dataService.getVenueStats.mockResolvedValue({ capacityPercentage: 50 });
  });

  it('completes the "Zone Discovery to Navigation" journey', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 1. View Interactive Map (default)
    expect(screen.getByText('Interactive Map')).toBeInTheDocument();

    // 2. Click Main Field zone
    const fieldZone = await screen.findByText('Main Field');
    await user.click(fieldZone);

    // 3. Verify Zone details appear (fixed wait time)
    expect(await screen.findByText(/Estimated Wait Time/i, { exact: false })).toBeInTheDocument();
    expect(screen.getByText('No Queue')).toBeInTheDocument();

    // 4. Click Navigate (via bottom nav)
    await user.click(screen.getByLabelText('Navigate'));
    expect(screen.getByText('Venue Location')).toBeInTheDocument();
    expect(screen.getByTitle('Venue location on Google Maps')).toBeInTheDocument();
  });

  it('handles "Data Fetch Failure" edge case gracefully', async () => {
    dataService.getVenueZones.mockRejectedValue(new Error('Network Failure'));
    render(<App />);

    // Should show loading state initially
    expect(screen.getByText(/Loading live map data/i)).toBeInTheDocument();

    // Should stop loading and maintain stability even on failure
    await waitFor(() => {
      expect(screen.queryByText(/Loading live map data/i)).not.toBeInTheDocument();
    });
    // The SVG map should still render (fallback to UI structure)
    expect(screen.getByText('Main Field')).toBeInTheDocument();
  });

  it('completes the "Guest Mode" login flow', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 1. Go to Login
    await user.click(screen.getByLabelText('Login'));
    expect(screen.getByText(/Use our Guest Mode/i)).toBeInTheDocument();

    // 2. Click Guest Sign In
    await user.click(screen.getByText(/Sign in as Guest/i));

    // 3. Verify redirected to map and profile updated
    await waitFor(() => expect(screen.getByText('Interactive Map')).toBeInTheDocument());
    
    // Check Header profile button (indicates logged in)
    expect(screen.getByLabelText('Profile')).toBeInTheDocument();
  });

  it('validates authentication "Empty Fields" edge case', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByLabelText('Login'));
    // Click Sign In without typing anything
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    // Should show validation error
    expect(screen.getByRole('alert')).toHaveTextContent(/Please fill in all fields/i);
  });

  it('completes the "Google Auth" simulation flow', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByLabelText('Login'));
    await user.click(screen.getByText(/Continue with Google/i));

    // Verify success by checking the Header's auth state
    await waitFor(() => expect(screen.getByLabelText('Profile')).toBeInTheDocument());
    
    // Switch back to login tab to verify profile details
    await user.click(screen.getByLabelText('Profile'));
    expect(screen.getByText('Google Explorer')).toBeInTheDocument();
  });
});
