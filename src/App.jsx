import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import VenueMap from './components/map/VenueMap';
import NavigateTab from './components/map/NavigateTab';
import HeatmapTab from './components/map/HeatmapTab';
import QueueList from './components/queues/QueueList';
import NotificationFeed from './components/alerts/NotificationFeed';

function App() {
  const [currentTab, setCurrentTab] = useState('map');

  const renderContent = () => {
    switch (currentTab) {
      case 'navigate':
        return <NavigateTab />;
      case 'map':
        return (
          <>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>
              Interactive Map
            </h2>
            <VenueMap setCurrentTab={setCurrentTab} />
          </>
        );
      case 'queues':
        return <QueueList />;
      case 'heatmap':
        return <HeatmapTab setCurrentTab={setCurrentTab} />;
      case 'alerts':
        return (
          <>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>
              Live Updates
            </h2>
            <NotificationFeed />
          </>
        );
      default:
        return (
          <>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>
              Interactive Map
            </h2>
            <VenueMap setCurrentTab={setCurrentTab} />
          </>
        );
    }
  };

  return (
    <Layout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      <div style={{ animation: 'fadeIn 0.3s ease-out' }}>{renderContent()}</div>
    </Layout>
  );
}

export default App;
