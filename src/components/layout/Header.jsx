import React from 'react';
import PropTypes from 'prop-types';
import { Ticket, Bell, User } from 'lucide-react';
import styles from './Header.module.css';

const Header = ({ setCurrentTab }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Ticket className={styles.logoIcon} size={28} />
        <span className="text-gradient">Eventlytics</span>
      </div>
      <div className={styles.actions}>
        <button
          className={`${styles.iconButton} ${styles.notificationBadge}`}
          aria-label="Notifications"
          onClick={() => setCurrentTab && setCurrentTab('alerts')}
        >
          <Bell size={20} />
        </button>
        <button className={styles.iconButton} aria-label="Profile">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

Header.propTypes = {
  setCurrentTab: PropTypes.func.isRequired,
};

export default Header;
