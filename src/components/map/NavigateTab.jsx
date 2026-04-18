import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Compass, Car } from 'lucide-react';
import styles from './NavigateTab.module.css';

const NavigateTab = () => {
  const [distance, setDistance] = useState('Calculating...');
  const [eta, setEta] = useState('-- mins');
  const [isCalculating, setIsCalculating] = useState(true);

  // Simulate calculating route via geolocation
  useEffect(() => {
    const timer = setTimeout(() => {
      setDistance('2.4 mi');
      setEta('12 mins');
      setIsCalculating(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
        Venue Location
      </h2>

      <div className={styles.mapContainer}>
        {/* Using a generic google maps iframe. We apply a CSS filter to make it look dark mode! */}
        <iframe
          title="Venue Map"
          className={styles.iframe}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.3854129524025!2d-73.99596662402526!3d40.75043697138766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259af18317c2f%3A0x67396a56ecda05b7!2sMadison%20Square%20Garden!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus`}
        ></iframe>
      </div>

      <div className={styles.routeCard}>
        <div className={styles.routeHeader}>
          <div className={styles.routeTitle}>
            <MapPin className="text-gradient" size={22} />
            Your Route
          </div>
          <div className={styles.statusIndicator}>
            <Compass size={14} />
            {isCalculating ? 'Locating...' : 'Live GPS Active'}
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Distance from Venue</span>
            <span className={`${styles.statValue} ${isCalculating ? '' : 'text-gradient'}`}>
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

        <button className={styles.actionButton}>
          <Car size={20} />
          Open in Maps App
        </button>
      </div>
    </div>
  );
};

export default NavigateTab;
