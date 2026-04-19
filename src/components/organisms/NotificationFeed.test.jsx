import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NotificationFeed from './NotificationFeed';
import * as dataService from '../../services/dataService';

vi.mock('../../services/dataService', () => ({
  subscribeToNotifications: vi.fn(),
  getNotifications: vi.fn(),
}));

vi.mock('../../config/firebase', () => ({
  logAnalyticsEvent: vi.fn(),
  getRemoteConfigValue: vi.fn().mockReturnValue(false),
}));

describe('NotificationFeed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders notifications from real-time listener', async () => {
    dataService.subscribeToNotifications.mockImplementation((cb) => {
      cb([{ id: '1', type: 'info', title: 'Test Notif', message: 'Hello', time: 'now' }]);
      return () => {};
    });
    render(<NotificationFeed />);
    await waitFor(() => expect(screen.getByText('Test Notif')).toBeInTheDocument());
  });
});
