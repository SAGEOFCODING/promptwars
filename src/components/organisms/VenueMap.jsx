import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Navigation } from 'lucide-react';
import styles from './VenueMap.module.css';
import {
  logZoneInteraction,
  submitCrowdReport,
} from '@/services/dataService';
import { logAnalyticsEvent } from '@/config/firebase';
import { logger } from '@/services/logger';
import DOMPurify from 'dompurify';
import { useRateLimit } from '@/hooks/useRateLimit';

import { useVenueData } from '@/hooks/useVenueData';

const VenueMap = ({ setCurrentTab, user }) => {
  const [activeZone, setActiveZone] = useState(null);
  const { zonesData, loading } = useVenueData();
  const { checkRateLimit } = useRateLimit(3000); // 3s cooldown

  const handleZoneClick = (id) => {
    const newActive = activeZone === id ? null : id;
    setActiveZone(newActive);

    if (newActive) {
      const zone = zonesData.find((z) => z.id === newActive);
      if (zone) {
        logZoneInteraction(user?.uid, zone.id, zone.name, 'click');
      }
    }
  };

  const handleCrowdReport = async (level) => {
    if (!activeZoneData) return;
    if (!checkRateLimit()) {
      logger.warn('Crowd report rate limited', { zoneId: activeZoneData.id });
      return;
    }
    await submitCrowdReport(user?.uid, activeZoneData.id, level);
  };

  const activeZoneData = zonesData.find((z) => z.id === activeZone);

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
          onClick={() => {
            logAnalyticsEvent('navigate_to_directions');
            setCurrentTab && setCurrentTab('navigate');
          }}
          aria-label="Navigate to venue"
          role="button"
        />
      </div>

      <div className={styles.mapArea}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading live map data...
          </div>
        ) : (
          <>
            <svg viewBox="0 0 300 300" className={styles.svgMap} aria-label="Interactive venue map">
              {/* Main Field */}
              <rect
                x="60"
                y="80"
                width="180"
                height="140"
                rx="16"
                className={`${styles.zone} ${activeZone === 'field' ? styles.active : ''}`}
                onClick={() => handleZoneClick('field')}
                role="button"
                aria-label="Main Field zone"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleZoneClick('field')}
              />
              <text
                x="150"
                y="155"
                className={styles.zoneText}
                onClick={() => handleZoneClick('field')}
              >
                Main Field
              </text>

              {/* North Gate */}
              <path
                d="M 110 30 L 190 30 L 170 70 L 130 70 Z"
                className={`${styles.zone} ${activeZone === 'north' ? styles.active : ''}`}
                onClick={() => handleZoneClick('north')}
                role="button"
                aria-label="North Gate zone"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleZoneClick('north')}
              />
              <text
                x="150"
                y="48"
                className={styles.zoneText}
                onClick={() => handleZoneClick('north')}
              >
                North Gate
              </text>

              {/* South Gate */}
              <path
                d="M 110 270 L 190 270 L 170 230 L 130 230 Z"
                className={`${styles.zone} ${activeZone === 'south' ? styles.active : ''}`}
                onClick={() => handleZoneClick('south')}
                role="button"
                aria-label="South Gate zone"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleZoneClick('south')}
              />
              <text
                x="150"
                y="255"
                className={styles.zoneText}
                onClick={() => handleZoneClick('south')}
              >
                South Gate
              </text>

              {/* Food Court A */}
              <circle
                cx="35"
                cy="150"
                r="22"
                className={`${styles.zone} ${activeZone === 'food1' ? styles.active : ''}`}
                onClick={() => handleZoneClick('food1')}
                role="button"
                aria-label="Food Court zone"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleZoneClick('food1')}
              />
              <text
                x="35"
                y="155"
                className={styles.zoneText}
                onClick={() => handleZoneClick('food1')}
              >
                Food
              </text>

              {/* Merch Store */}
              <circle
                cx="265"
                cy="150"
                r="22"
                className={`${styles.zone} ${activeZone === 'merch' ? styles.active : ''}`}
                onClick={() => handleZoneClick('merch')}
                role="button"
                aria-label="Merch Store zone"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleZoneClick('merch')}
              />
              <text
                x="265"
                y="155"
                className={styles.zoneText}
                onClick={() => handleZoneClick('merch')}
              >
                Merch
              </text>
            </svg>

            {activeZone && activeZoneData && (
              <div className={styles.zoneDetails} role="region" aria-label="Zone details">
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

                <div className={styles.reportSection}>
                  <p className={styles.reportTitle}>Is it crowded? Help others!</p>
                  <div className={styles.reportButtons}>
                    <button
                      className={styles.reportBtn}
                      onClick={() => handleCrowdReport('low')}
                      title="Report Low Crowd"
                    >
                      🟢 Low
                    </button>
                    <button
                      className={styles.reportBtn}
                      onClick={() => handleCrowdReport('medium')}
                      title="Report Medium Crowd"
                    >
                      🟡 Mid
                    </button>
                    <button
                      className={styles.reportBtn}
                      onClick={() => handleCrowdReport('high')}
                      title="Report High Crowd"
                    >
                      🔴 High
                    </button>
                  </div>

                  <div
                    className={styles.uploadContainer}
                    style={{
                      marginTop: '1rem',
                      borderTop: '1px solid var(--glass-border)',
                      paddingTop: '1rem',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Add a photo to help others verify (Optional)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      id="report-photo"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const { uploadIncidentImage } =
                            await import('@/services/storageService');
                          const url = await uploadIncidentImage(file, activeZoneData.id);
                          if (url) alert('Photo uploaded successfully!');
                        }
                      }}
                    />
                    <label
                      htmlFor="report-photo"
                      className={styles.reportBtn}
                      style={{
                        width: '100%',
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'block',
                      }}
                    >
                      📷 Upload Photo
                    </label>
                  </div>
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
  user: PropTypes.object,
};

export default VenueMap;
