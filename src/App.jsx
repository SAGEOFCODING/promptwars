import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/layout/Layout';
import VenueMap from './components/map/VenueMap';
import NavigateTab from './components/map/NavigateTab';
import HeatmapTab from './components/map/HeatmapTab';
import QueueList from './components/queues/QueueList';
import NotificationFeed from './components/alerts/NotificationFeed';
import Login from './components/auth/Login';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [currentTab, setCurrentTab] = useState('map');
  const [user, setUser] = useState(null);

  // Single auth observer at the top – drives the whole app
  useEffect(() => {
    if (!auth) return; // Firebase not configured, skip
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ?? null);
    });
    return unsubscribe;
  }, []);

  const renderContent = useCallback(() => {
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
      case 'login':
        return (
          <Login
            user={user}
            onSuccess={(mockUser) => {
              if (mockUser && typeof mockUser === 'object') {
                setUser(mockUser);
              }
              setCurrentTab('map');
            }}
          />
        );
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
  }, [currentTab, user]);

  return (
    <Layout currentTab={currentTab} setCurrentTab={setCurrentTab} user={user}>
      <div style={{ animation: 'fadeIn 0.3s ease-out' }}>{renderContent()}</div>
    </Layout>
  );
}

export default App;

