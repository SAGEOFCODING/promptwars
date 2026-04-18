import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Info, AlertTriangle, ShieldAlert } from 'lucide-react';
import styles from './NotificationFeed.module.css';
import { getNotifications } from '../../services/dataService';

// ─── Icon helpers ─────────────────────────────────────────────────────────────
const ICON_MAP = {
  info:    <Info size={20} />,
  warning: <AlertTriangle size={20} />,
  danger:  <ShieldAlert size={20} />,
};

const CLASS_MAP = {
  info:    styles.iconInfo,
  warning: styles.iconWarning,
  danger:  styles.iconDanger,
};

const getIcon      = (type) => ICON_MAP[type]    ?? ICON_MAP.info;
const getIconClass = (type) => CLASS_MAP[type]   ?? CLASS_MAP.info;

// ─── Sub-component ────────────────────────────────────────────────────────────
const NotificationCard = ({ notif }) => (
  <div className={styles.alertCard}>
    <div className={`${styles.iconWrapper} ${getIconClass(notif.type)}`}>
      {getIcon(notif.type)}
    </div>
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
    id:      PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type:    PropTypes.oneOf(['info', 'warning', 'danger']).isRequired,
    title:   PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    time:    PropTypes.string.isRequired,
  }).isRequired,
};

// ─── Main component ───────────────────────────────────────────────────────────
const NotificationFeed = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    getNotifications()
      .then((data) => { if (mounted) { setNotifications(data); setLoading(false); } })
      .catch(() => { if (mounted) { setError(true); setLoading(false); } });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className={styles.feed}>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading live updates...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.feed}>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>
          Failed to load updates. Please try again.
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className={styles.feed}>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No recent updates.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.feed}>
      {notifications.map((notif) => (
        <NotificationCard key={notif.id} notif={notif} />
      ))}
    </div>
  );
};

export default NotificationFeed;

