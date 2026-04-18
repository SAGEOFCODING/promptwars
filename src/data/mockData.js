// Mock Data for Eventlytics Prototype

export const venueZonesData = [
  { id: 'north', name: 'North Gate',  crowd: 'low',    wait: '5 mins'  },
  { id: 'south', name: 'South Gate',  crowd: 'high',   wait: '25 mins' },
  { id: 'food1', name: 'Food Court A', crowd: 'medium', wait: '12 mins' },
  { id: 'merch', name: 'Merch Store', crowd: 'high',   wait: '30 mins' },
  { id: 'field', name: 'Main Field',  crowd: 'low',    wait: 'No Queue' },
];

export const notificationsData = [
  {
    id: 1,
    type: 'danger',
    title: 'High Crowd Density',
    message:
      'South Gate is currently experiencing heavy congestion. Please use North Gate for faster entry.',
    time: '2 mins ago',
  },
  {
    id: 2,
    type: 'info',
    title: 'Merch Drop',
    message:
      'Exclusive limited-edition team jerseys are now available at the Main Store! Wait time: 30 mins.',
    time: '15 mins ago',
  },
  {
    id: 3,
    type: 'warning',
    title: 'Weather Alert',
    message: 'Light rain expected in 45 minutes. Ponchos available at all merch stalls.',
    time: '1 hour ago',
  },
];

export const queueData = [
  {
    id: 1,
    title: 'Food Court A',
    location: 'Section 102',
    waitTime: '12 mins',
    type: 'food',
    trend: 'up',
  },
  {
    id: 2,
    title: 'Main Merch Store',
    location: 'Gate C',
    waitTime: '30 mins',
    type: 'merch',
    trend: 'stable',
  },
  {
    id: 3,
    title: 'Restroom North',
    location: 'Section 204',
    waitTime: '5 mins',
    type: 'restroom',
    trend: 'down',
  },
  {
    id: 4,
    title: 'Beer Station',
    location: 'Section 110',
    waitTime: '18 mins',
    type: 'food',
    trend: 'up',
  },
];

export const venueStats = {
  capacityPercentage: 78,
  highTrafficZones: ['South Gate'],
};
