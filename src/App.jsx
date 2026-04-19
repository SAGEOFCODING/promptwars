import React, { useState, useCallback, useEffect } from 'react';
import Layout from '@/components/templates/Layout';
import VenueMap from '@/components/organisms/VenueMap';
import NavigateTab from '@/components/organisms/NavigateTab';
import HeatmapTab from '@/components/organisms/HeatmapTab';
import QueueList from '@/components/organisms/QueueList';
import NotificationFeed from '@/components/organisms/NotificationFeed';
import Login from '@/components/organisms/Login';
import { logAnalyticsEvent, logBrowserCapabilities } from '@/config/firebase';
import { logNavigationAction } from '@/services/dataService';
import { useAuthSession } from '@/hooks/useAuthSession';

function App() {
  const [currentTab, setCurrentTab] = useState('map');
  const { user, setUser } = useAuthSession();

  useEffect(() => {
    logBrowserCapabilities();
  }, []);

  useEffect(() => {
    const titles = {
      map: 'Interactive Venue Map',
      queues: 'Live Wait Times',
      navigate: 'Venue Directions',
      heatmap: 'Live Crowd Density',
      alerts: 'Security & Info Alerts',
      login: 'Account Portal',
    };
    document.title = `Eventlytics | ${titles[currentTab] || 'Real-Time Intelligence'}`;
  }, [currentTab]);

  const handleTabChange = useCallback(
    (newTab) => {
      if (newTab === currentTab) return;
      setCurrentTab(newTab);
      logNavigationAction(user?.uid, currentTab, newTab);
    },
    [currentTab, user]
  );

  const renderContent = useCallback(() => {
    switch (currentTab) {
      case 'navigate':
        return <NavigateTab user={user} />;
      case 'map':
        return (
          <>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>
              Interactive Map
            </h2>
            <VenueMap setCurrentTab={handleTabChange} user={user} />
          </>
        );
      case 'queues':
        return <QueueList user={user} />;
      case 'heatmap':
        return <HeatmapTab setCurrentTab={handleTabChange} user={user} />;
      case 'login':
        return (
          <Login
            user={user}
            onSuccess={(mockUser) => {
              if (mockUser && typeof mockUser === 'object') setUser(mockUser);
              handleTabChange('map');
            }}
          />
        );
      case 'alerts':
        return (
          <>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>
              Live Updates
            </h2>
            <NotificationFeed user={user} />
          </>
        );
      default:
        return <VenueMap setCurrentTab={handleTabChange} user={user} />;
    }
  }, [currentTab, user, handleTabChange, setUser]);

  return (
    <Layout currentTab={currentTab} setCurrentTab={handleTabChange} user={user}>
      <div style={{ animation: 'fadeIn 0.3s ease-out' }}>{renderContent()}</div>
    </Layout>
  );
}

export default App;
