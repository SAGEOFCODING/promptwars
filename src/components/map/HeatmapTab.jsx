import React from 'react';
import PropTypes from 'prop-types';
import { Activity } from 'lucide-react';
import VenueMap from './VenueMap';
import { venueStats } from '../../data/mockData';

const HeatmapTab = ({ setCurrentTab }) => {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <Activity
        size={48}
        className="text-gradient"
        style={{ margin: '0 auto 1rem', display: 'block' }}
      />
      <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
        Live Crowd Heatmap
      </h2>
      <p style={{ color: 'var(--text-muted)' }}>
        The venue is currently at <strong>{venueStats.capacityPercentage}% capacity</strong>.<br />
        Please avoid the {venueStats.highTrafficZones.join(', ')} area.
      </p>
      <div style={{ marginTop: '2rem' }}>
        <VenueMap setCurrentTab={setCurrentTab} />
      </div>
    </div>
  );
};

HeatmapTab.propTypes = {
  setCurrentTab: PropTypes.func.isRequired,
};

export default HeatmapTab;
