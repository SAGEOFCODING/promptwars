import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NotificationFeed from './NotificationFeed';
import * as dataService from '../../services/dataService';

vi.mock('../../services/dataService', () => ({
  getNotifications: vi.fn(),
}));

describe('NotificationFeed', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading state initially', () => {
    dataService.getNotifications.mockReturnValue(new Promise(() => {}));
    render(<NotificationFeed />);
    expect(screen.getByText('Loading live updates...')).toBeInTheDocument();
  });

  it('shows empty state when no notifications are returned', async () => {
    dataService.getNotifications.mockResolvedValue([]);
    render(<NotificationFeed />);
    await waitFor(() => expect(screen.getByText('No recent updates.')).toBeInTheDocument());
  });

  it('renders notification cards when data is available', async () => {
    dataService.getNotifications.mockResolvedValue([
      { id: 1, type: 'danger',  title: 'High Crowd', message: 'South Gate congested', time: '2 mins ago' },
      { id: 2, type: 'info',    title: 'Merch Drop', message: 'New jerseys available', time: '15 mins ago' },
      { id: 3, type: 'warning', title: 'Rain Alert', message: 'Light rain expected',  time: '1 hour ago' },
    ]);
    render(<NotificationFeed />);
    await waitFor(() => {
      expect(screen.getByText('High Crowd')).toBeInTheDocument();
      expect(screen.getByText('Merch Drop')).toBeInTheDocument();
      expect(screen.getByText('Rain Alert')).toBeInTheDocument();
    });
  });

  it('shows error state on fetch failure', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    dataService.getNotifications.mockRejectedValue(new Error('Network error'));
    render(<NotificationFeed />);
    await waitFor(() =>
      expect(screen.getByText(/Failed to load updates/i)).toBeInTheDocument()
    );
    spy.mockRestore();
  });

  it('renders correct icon for each notification type', async () => {
    dataService.getNotifications.mockResolvedValue([
      { id: 1, type: 'info',    title: 'Info',    message: 'msg', time: '1m' },
      { id: 2, type: 'warning', title: 'Warning', message: 'msg', time: '2m' },
      { id: 3, type: 'danger',  title: 'Danger',  message: 'msg', time: '3m' },
    ]);
    render(<NotificationFeed />);
    await waitFor(() => {
      expect(screen.getByText('Info')).toBeInTheDocument();
      expect(screen.getByText('Warning')).toBeInTheDocument();
      expect(screen.getByText('Danger')).toBeInTheDocument();
    });
  });
});
