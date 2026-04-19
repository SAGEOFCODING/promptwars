import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Activity } from 'lucide-react';
import VenueMap from './VenueMap';
import { getVenueStats } from '../../services/dataService';

const HeatmapTab = ({ setCurrentTab, user }) => {
  const [stats, setStats] = useState({ capacityPercentage: 0, highTrafficZones: [] });

  useEffect(() => {
    let mounted = true;
    import('../../config/firebase').then((m) => m.logAnalyticsEvent('heatmap_view'));
    getVenueStats().then((data) => {
      if (mounted) setStats(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

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
        The venue is currently at <strong>{stats.capacityPercentage}% capacity</strong>.<br />
        Please avoid the {stats.highTrafficZones.join(', ')} area.
      </p>
      <div style={{ marginTop: '2rem' }}>
        <VenueMap setCurrentTab={setCurrentTab} user={user} />
      </div>
    </div>
  );
};

HeatmapTab.propTypes = {
  setCurrentTab: PropTypes.func.isRequired,
  user: PropTypes.object,
};


export default HeatmapTab;

