import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QueueList from './QueueList';
import * as dataService from '../../services/dataService';

vi.mock('../../services/dataService', () => ({
  getQueues: vi.fn(),
}));

describe('QueueList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders loading state initially', () => {
    dataService.getQueues.mockReturnValue(new Promise(() => {}));
    render(<QueueList />);
    expect(screen.getByText('Loading wait times...')).toBeInTheDocument();
  });

  it('renders empty state when no queues are returned', async () => {
    dataService.getQueues.mockResolvedValue([]);
    render(<QueueList />);
    await waitFor(() => expect(screen.getByText('No queue data available.')).toBeInTheDocument());
  });

  it('renders queue cards when data is available', async () => {
    dataService.getQueues.mockResolvedValue([
      { id: 1, title: 'Food Court A', location: 'Sec 1', waitTime: '10 mins', type: 'food', trend: 'stable' },
    ]);
    render(<QueueList />);
    await waitFor(() => {
      expect(screen.getByText('Food Court A')).toBeInTheDocument();
      expect(screen.getByText('10 mins')).toBeInTheDocument();
    });
  });

  it('handles fetch error gracefully and hides loading spinner', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    dataService.getQueues.mockRejectedValue(new Error('Network error'));
    render(<QueueList />);
    await waitFor(() => expect(screen.queryByText('Loading wait times...')).not.toBeInTheDocument());
    expect(screen.getByText('No queue data available.')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});

