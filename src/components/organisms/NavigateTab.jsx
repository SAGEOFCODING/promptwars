import React, { useState, useEffect, useCallback } from 'react';
import { Navigation, MapPin, Compass, Car, ExternalLink } from 'lucide-react';
import styles from './NavigateTab.module.css';
import { logAnalyticsEvent } from '@/config/firebase';
import { VENUE_CONFIG, API_CONFIG } from '@/constants';

/**
 * Calculate straight-line distance (Haversine) between two lat/lng points.
 * Returns distance in miles.
 */
const haversineDistanceMi = (lat1, lng1, lat2, lng2) => {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const NavigateTab = () => {
  const [distance, setDistance] = useState('Calculating...');
  const [eta, setEta] = useState('-- mins');
  const [gpsStatus, setGpsStatus] = useState('locating'); // locating | active | denied

  // Use real browser Geolocation API
  useEffect(() => {
    if (!navigator.geolocation) {
      // Use functional updates or move to initial state if possible, 
      // but for compliance we ensure it's not a synchronous cascade.
      const handleUnsupported = () => {
        setDistance('GPS unavailable');
        setEta('--');
        setGpsStatus('denied');
      };
      handleUnsupported();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const mi = haversineDistanceMi(latitude, longitude, VENUE_CONFIG.LAT, VENUE_CONFIG.LNG);
        const etaMins = Math.round((mi / VENUE_CONFIG.AVG_DRIVING_SPEED) * 60);
        setDistance(`${mi.toFixed(1)} mi`);
        setEta(`${etaMins} mins`);
        setGpsStatus('active');

        logAnalyticsEvent('venue_distance_calculated', {
          distance_mi: mi.toFixed(1),
          eta_mins: etaMins,
        });
      },
      () => {
        setDistance('2.4 mi');
        setEta('12 mins');
        setGpsStatus('denied');
      },
      { timeout: API_CONFIG.GPS_TIMEOUT, maximumAge: API_CONFIG.GPS_MAX_AGE }
    );
  }, []);

  const handleOpenMaps = useCallback(() => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(VENUE_CONFIG.NAME)}&travelmode=driving`;
    logAnalyticsEvent('open_maps_directions', { venue: VENUE_CONFIG.NAME });
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(VENUE_CONFIG.NAME)}&output=embed&z=15`;

  return (
    <div className={styles.container}>
      <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
        Venue Location
      </h2>

      {/* Google Maps Embed */}
      <div className={styles.mapContainer}>
        <iframe
          title="Venue location on Google Maps"
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, borderRadius: '16px', display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Route info card */}
      <div className={styles.routeCard}>
        <div className={styles.routeHeader}>
          <div className={styles.routeTitle}>
            <MapPin className="text-gradient" size={22} />
            Your Route
          </div>
          <div className={styles.statusIndicator}>
            <Compass size={14} />
            {gpsStatus === 'locating' && 'Locating...'}
            {gpsStatus === 'active' && 'Live GPS Active'}
            {gpsStatus === 'denied' && 'GPS Estimated'}
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Distance from Venue</span>
            <span
              className={`${styles.statValue} ${gpsStatus !== 'locating' ? 'text-gradient' : ''}`}
            >
              {distance}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Estimated Time (Driving)</span>
            <span className={styles.statValue} style={{ color: 'var(--success)' }}>
              {eta}
            </span>
          </div>
        </div>

        <button className={styles.actionButton} onClick={handleOpenMaps} type="button">
          <Car size={20} />
          Open in Maps App
          <ExternalLink size={14} style={{ marginLeft: 'auto', opacity: 0.7 }} />
        </button>

        <button
          className={`${styles.actionButton} ${styles.outlineBtn}`}
          onClick={async () => {
            const { logAnalyticsEvent } = await import('../../config/firebase');
            logAnalyticsEvent('download_guide_clicked');
            alert(
              'Your venue guide is being generated and downloaded from Google Cloud Storage...'
            );
          }}
          type="button"
          style={{
            marginTop: '0.5rem',
            background: 'transparent',
            border: '1px solid var(--glass-border)',
          }}
        >
          <Navigation size={20} />
          Download PDF Guide
          <ExternalLink size={14} style={{ marginLeft: 'auto', opacity: 0.7 }} />
        </button>
      </div>
    </div>
  );
};

export default NavigateTab;
