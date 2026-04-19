import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Info, AlertTriangle, ShieldAlert, Zap } from 'lucide-react';
import styles from './NotificationFeed.module.css';
import { subscribeToNotifications } from '../../services/dataService';
import { logAnalyticsEvent, getRemoteConfigValue } from '../../config/firebase';

// ─── Icon helpers ─────────────────────────────────────────────────────────────
const ICON_MAP = {
  info: <Info size={20} aria-hidden="true" />,
  warning: <AlertTriangle size={20} aria-hidden="true" />,
  danger: <ShieldAlert size={20} aria-hidden="true" />,
};

const CLASS_MAP = {
  info: styles.iconInfo,
  warning: styles.iconWarning,
  danger: styles.iconDanger,
};

const getIcon = (type) => ICON_MAP[type] ?? ICON_MAP.info;
const getIconClass = (type) => CLASS_MAP[type] ?? CLASS_MAP.info;

// ─── Sub-component ────────────────────────────────────────────────────────────
const NotificationCard = ({ notif }) => (
  <div className={styles.alertCard} role="alert">
    <div className={`${styles.iconWrapper} ${getIconClass(notif.type)}`}>{getIcon(notif.type)}</div>
    <div className={styles.content}>
      <div className={styles.header}>
        <span className={styles.title}>{notif.title}</span>
        <span className={styles.time}>{notif.time}</span>
      </div>
      <p className={styles.message}>{notif.message}</p>
    </div>
  </div>
);

NotificationCard.propTypes = {
  notif: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(['info', 'warning', 'danger']).isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
};

// ─── Main component ───────────────────────────────────────────────────────────
const NotificationFeed = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const showEmergency = getRemoteConfigValue('emergency_banner_visible');
  const trafficWarning = getRemoteConfigValue('high_traffic_warning');

  useEffect(() => {
    logAnalyticsEvent('notification_feed_viewed');

    const unsubscribe = subscribeToNotifications((data) => {
      setNotifications(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className={styles.feed} aria-busy="true">
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading live updates...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.feedContainer} role="region" aria-label="Notification feed">
      {showEmergency && (
        <div className={styles.emergencyBanner} role="alert">
          <Zap size={18} fill="currentColor" />
          <span>{trafficWarning}</span>
        </div>
      )}

      {notifications.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No recent updates.
        </div>
      ) : (
        <div className={styles.feed} aria-live="polite">
          {notifications.map((notif) => (
            <NotificationCard key={notif.id} notif={notif} />
          ))}
        </div>
      )}
    </div>
  );
};

NotificationFeed.propTypes = {
  user: PropTypes.object,
};

export default NotificationFeed;
