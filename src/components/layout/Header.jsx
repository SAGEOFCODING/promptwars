import React from 'react';
import PropTypes from 'prop-types';
import { Ticket, Bell, User, LogOut } from 'lucide-react';
import styles from './Header.module.css';
import { logout } from '../../config/firebase';

const Header = ({ setCurrentTab, user }) => {
  const handleAuthAction = () => {
    setCurrentTab?.('login');
  };

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
          onClick={() => setCurrentTab?.('alerts')}
        >
          <Bell size={20} />
        </button>
        <button
          className={styles.iconButton}
          aria-label={user ? 'Profile' : 'Login'}
          onClick={handleAuthAction}
          title={user ? `Logged in as ${user.displayName ?? user.email}` : 'Sign in to Eventlytics'}
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              style={{ width: 24, height: 24, borderRadius: '50%' }}
              referrerPolicy="no-referrer"
            />
          ) : user ? (
            <LogOut size={20} />
          ) : (
            <User size={20} />
          )}
        </button>
      </div>
    </header>
  );
};

Header.propTypes = {
  setCurrentTab: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default Header;

