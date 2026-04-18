import React from 'react';
import { Info, AlertTriangle, ShieldAlert } from 'lucide-react';
import styles from './NotificationFeed.module.css';

import { notificationsData as notifications } from '../../data/mockData';

const getIcon = (type) => {
  switch (type) {
    case 'info':
      return <Info size={20} />;
    case 'warning':
      return <AlertTriangle size={20} />;
    case 'danger':
      return <ShieldAlert size={20} />;
    default:
      return <Info size={20} />;
  }
};

const getIconClass = (type) => {
  switch (type) {
    case 'info':
      return styles.iconInfo;
    case 'warning':
      return styles.iconWarning;
    case 'danger':
      return styles.iconDanger;
    default:
      return styles.iconInfo;
  }
};

const NotificationFeed = () => {
  return (
    <div className={styles.feed}>
      {notifications.map((notif) => (
        <div key={notif.id} className={styles.alertCard}>
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
      ))}
    </div>
  );
};

export default NotificationFeed;
