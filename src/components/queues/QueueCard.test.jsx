import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import QueueCard from './QueueCard';

describe('QueueCard Component', () => {
  it('renders queue details correctly', () => {
    render(
      <QueueCard
        title="Main Merch Store"
        location="Gate C"
        waitTime="30 mins"
        type="merch"
        trend="stable"
      />
    );

    expect(screen.getByText('Main Merch Store')).toBeInTheDocument();
    expect(screen.getByText('Gate C')).toBeInTheDocument();
    expect(screen.getByText('30 mins')).toBeInTheDocument();
    expect(screen.getByText('Stable')).toBeInTheDocument();
  });
});
