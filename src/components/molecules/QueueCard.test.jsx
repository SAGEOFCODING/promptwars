import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import QueueCard from './QueueCard';

const baseProps = {
  title: 'Main Merch Store',
  location: 'Gate C',
  waitTime: '30 mins',
  type: 'merch',
  trend: 'stable',
};

describe('QueueCard', () => {
  it('renders all core details', () => {
    render(<QueueCard {...baseProps} />);
    expect(screen.getByText('Main Merch Store')).toBeInTheDocument();
    expect(screen.getByText('Gate C')).toBeInTheDocument();
    expect(screen.getByText('30 mins')).toBeInTheDocument();
    expect(screen.getByText('Stable')).toBeInTheDocument();
  });

  it('shows Increasing for trend=up', () => {
    render(<QueueCard {...baseProps} trend="up" />);
    expect(screen.getByText('Increasing')).toBeInTheDocument();
  });

  it('shows Decreasing for trend=down', () => {
    render(<QueueCard {...baseProps} trend="down" />);
    expect(screen.getByText('Decreasing')).toBeInTheDocument();
  });

  it.each(['food', 'merch', 'restroom'])('renders without crashing for type=%s', (type) => {
    render(<QueueCard {...baseProps} type={type} />);
    expect(screen.getByText('Main Merch Store')).toBeInTheDocument();
  });
});
