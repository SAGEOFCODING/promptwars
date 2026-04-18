import React from 'react';
import PropTypes from 'prop-types';
import { Map, Clock, Zap, MessageSquare, Navigation } from 'lucide-react';
import styles from './BottomNav.module.css';

const tabs = [
  { id: 'map', label: 'Venue Map', icon: Map },
  { id: 'queues', label: 'Wait Times', icon: Clock },
  { id: 'navigate', label: 'Navigate', icon: Navigation },
  { id: 'heatmap', label: 'Live Crowd', icon: Zap },
  { id: 'alerts', label: 'Alerts', icon: MessageSquare },
];

const BottomNav = ({ currentTab, setCurrentTab }) => {
  return (
    <nav className={styles.bottomNav}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            onClick={() => setCurrentTab(tab.id)}
            aria-label={tab.label}
          >
            <div className={styles.iconWrapper}>
              <Icon size={24} />
            </div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

BottomNav.propTypes = {
  currentTab: PropTypes.string.isRequired,
  setCurrentTab: PropTypes.func.isRequired,
};

export default BottomNav;
