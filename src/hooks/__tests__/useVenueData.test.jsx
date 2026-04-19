import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useVenueData } from '../useVenueData';
import * as dataService from '@/services/dataService';

vi.mock('@/services/dataService', () => ({
  subscribeToZones: vi.fn(),
}));

vi.mock('@/services/logger', () => ({
  logger: {
    info: vi.fn(),
  },
}));

vi.mock('@/services/telemetry', () => ({
  startTrace: vi.fn(() => ({})),
  stopTrace: vi.fn(),
}));

describe('useVenueData Hook', () => {
  it('initializes with loading state', () => {
    dataService.subscribeToZones.mockReturnValue(() => {});
    const { result } = renderHook(() => useVenueData());
    expect(result.current.loading).toBe(true);
    expect(result.current.zonesData).toEqual([]);
  });

  it('updates state and stops loading when data is received', async () => {
    const mockZones = [{ id: '1', name: 'Test Zone' }];
    dataService.subscribeToZones.mockImplementation((cb) => {
      cb(mockZones);
      return () => {};
    });

    const { result } = renderHook(() => useVenueData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.zonesData).toEqual(mockZones);
    });
  });
});
