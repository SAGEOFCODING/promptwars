import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NavigateTab from './NavigateTab';

// Mock Firebase analytics — no real SDK
vi.mock('../../config/firebase', () => ({
  logAnalyticsEvent: vi.fn(),
}));

// Stub window.open for directions test
const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

// Geolocation not available in jsdom — navigator.geolocation is undefined
// NavigateTab gracefully falls back to default values when denied

describe('NavigateTab', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders the venue location heading', () => {
    render(<NavigateTab />);
    expect(screen.getByText('Venue Location')).toBeInTheDocument();
  });

  it('renders the Google Maps embed iframe', () => {
    render(<NavigateTab />);
    const iframe = screen.getByTitle('Venue location on Google Maps');
    expect(iframe).toBeInTheDocument();
    expect(iframe.src).toContain('maps.google.com');
  });

  it('renders distance and ETA (no-GPS fallback in jsdom)', async () => {
    render(<NavigateTab />);
    // jsdom has no geolocation API at all → "GPS unavailable" path
    await waitFor(() => expect(screen.getByText('GPS unavailable')).toBeInTheDocument());
    expect(screen.getByText('--')).toBeInTheDocument();
  });

  it('opens Google Maps directions when button is clicked', async () => {
    const user = userEvent.setup();
    render(<NavigateTab />);
    await waitFor(() => screen.getByText('Open in Maps App'));
    await user.click(screen.getByText('Open in Maps App'));
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('google.com/maps/dir'),
      '_blank',
      'noopener,noreferrer'
    );
  });
});
