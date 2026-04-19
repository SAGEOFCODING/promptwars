import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QueueList from './QueueList';
import * as dataService from '../../services/dataService';

vi.mock('../../services/dataService', () => ({
  __esModule: true,
  subscribeToQueues: vi.fn(),
}));

vi.mock('../../config/firebase', () => ({
  logAnalyticsEvent: vi.fn(),
}));

describe('QueueList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    dataService.subscribeToQueues.mockReturnValue(() => {});
    render(<QueueList />);
    expect(screen.getByText('Loading wait times...')).toBeInTheDocument();
  });

  it('renders empty state when no queues are returned', async () => {
    dataService.subscribeToQueues.mockImplementation((cb) => {
      cb([]);
      return () => {};
    });
    render(<QueueList />);
    await waitFor(() => expect(screen.getByText('No queue data available.')).toBeInTheDocument());
  });

  it('renders queue cards when data is available', async () => {
    dataService.subscribeToQueues.mockImplementation((cb) => {
      cb([
        {
          id: 1,
          title: 'Food Court A',
          location: 'Sec 1',
          waitTime: '10 mins',
          type: 'food',
          trend: 'stable',
        },
      ]);
      return () => {};
    });
    render(<QueueList />);
    await waitFor(() => {
      expect(screen.getByText('Food Court A')).toBeInTheDocument();
      expect(screen.getByText('10 mins')).toBeInTheDocument();
    });
  });
});
