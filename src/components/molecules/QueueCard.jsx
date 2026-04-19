import React from 'react';
import PropTypes from 'prop-types';
import { Utensils, ShoppingBag, Droplets, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import styles from './QueueCard.module.css';

const getIcon = (type) => {
  switch (type) {
    case 'food':
      return <Utensils size={24} />;
    case 'merch':
      return <ShoppingBag size={24} />;
    case 'restroom':
      return <Droplets size={24} />;
    default:
      return <Utensils size={24} />;
  }
};

const getTrendIcon = (trend) => {
  switch (trend) {
    case 'down':
      return <TrendingDown size={14} />;
    case 'up':
      return <TrendingUp size={14} />;
    default:
      return <Minus size={14} />;
  }
};

const getTrendClass = (trend) => {
  switch (trend) {
    case 'down':
      return styles.trendDown;
    case 'up':
      return styles.trendUp;
    default:
      return styles.trendStable;
  }
};

const QueueCard = ({ title, location, waitTime, type, trend }) => {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <div className={styles.iconWrapper}>{getIcon(type)}</div>
        <div className={styles.details}>
          <span className={styles.title}>{title}</span>
          <span className={styles.location}>{location}</span>
        </div>
      </div>
      <div className={styles.waitInfo}>
        <span className={`${styles.time} text-gradient`}>{waitTime}</span>
        <div className={`${styles.trend} ${getTrendClass(trend)}`}>
          {getTrendIcon(trend)}
          <span>{trend === 'down' ? 'Decreasing' : trend === 'up' ? 'Increasing' : 'Stable'}</span>
        </div>
      </div>
    </div>
  );
};

QueueCard.propTypes = {
  title: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  waitTime: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(['up', 'down', 'stable']).isRequired,
};

export default QueueCard;
