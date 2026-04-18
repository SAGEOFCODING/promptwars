import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Navigation } from 'lucide-react';
import styles from './VenueMap.module.css';

import { getVenueZones } from '../../services/dataService';

const VenueMap = ({ setCurrentTab }) => {
  const [activeZone, setActiveZone] = useState(null);
  const [zonesData, setZonesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchZones = async () => {
      try {
        const data = await getVenueZones();
        if (mounted) {
          setZonesData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching venue zones", error);
        if (mounted) setLoading(false);
      }
    };
    fetchZones();
    return () => { mounted = false; };
  }, []);

  const handleZoneClick = (id) => {
    setActiveZone(activeZone === id ? null : id);
  };

  const activeZoneData = useMemo(() => zonesData.find((z) => z.id === activeZone), [activeZone, zonesData]);

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapHeader}>
        <div className={styles.mapTitle}>
          <div className={styles.liveIndicator}></div>
          Live Venue Map
        </div>
        <Navigation
          size={20}
          className="text-gradient"
          style={{ cursor: 'pointer' }}
          onClick={() => setCurrentTab && setCurrentTab('navigate')}
        />
      </div>

      <div className={styles.mapArea}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading live map data...
          </div>
        ) : (
          <>
            <svg viewBox="0 0 300 300" className={styles.svgMap}>
              {/* Main Field */}
              <rect
                x="60"
                y="80"
                width="180"
                height="140"
                rx="16"
                className={`${styles.zone} ${activeZone === 'field' ? styles.active : ''}`}
                onClick={() => handleZoneClick('field')}
              />
              <text x="150" y="155" className={styles.zoneText} onClick={() => handleZoneClick('field')}>
                Main Field
              </text>

              {/* North Gate */}
              <path
                d="M 110 30 L 190 30 L 170 70 L 130 70 Z"
                className={`${styles.zone} ${activeZone === 'north' ? styles.active : ''}`}
                onClick={() => handleZoneClick('north')}
              />
              <text x="150" y="48" className={styles.zoneText} onClick={() => handleZoneClick('north')}>
                North Gate
              </text>

              {/* South Gate */}
              <path
                d="M 110 270 L 190 270 L 170 230 L 130 230 Z"
                className={`${styles.zone} ${activeZone === 'south' ? styles.active : ''}`}
                onClick={() => handleZoneClick('south')}
              />
              <text x="150" y="255" className={styles.zoneText} onClick={() => handleZoneClick('south')}>
                South Gate
              </text>

              {/* Food Court A */}
              <circle
                cx="35"
                cy="150"
                r="22"
                className={`${styles.zone} ${activeZone === 'food1' ? styles.active : ''}`}
                onClick={() => handleZoneClick('food1')}
              />
              <text x="35" y="155" className={styles.zoneText} onClick={() => handleZoneClick('food1')}>
                Food
              </text>

              {/* Merch Store */}
              <circle
                cx="265"
                cy="150"
                r="22"
                className={`${styles.zone} ${activeZone === 'merch' ? styles.active : ''}`}
                onClick={() => handleZoneClick('merch')}
              />
              <text x="265" y="155" className={styles.zoneText} onClick={() => handleZoneClick('merch')}>
                Merch
              </text>
            </svg>

            {activeZone && activeZoneData && (
              <div className={styles.zoneDetails}>
                <div className={styles.detailHeader}>
                  <span className={styles.detailTitle}>{activeZoneData.name}</span>
                  <span
                    className={`${styles.crowdLevel} ${
                      activeZoneData.crowd === 'low'
                        ? styles.crowdLow
                        : activeZoneData.crowd === 'medium'
                          ? styles.crowdMedium
                          : styles.crowdHigh
                    }`}
                  >
                    {activeZoneData.crowd.toUpperCase()} CROWD
                  </span>
                </div>
                <div className={styles.detailInfo}>
                  Estimated Wait Time:{' '}
                  <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>
                    {activeZoneData.wait}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

VenueMap.propTypes = {
  setCurrentTab: PropTypes.func.isRequired,
};

export default VenueMap;
