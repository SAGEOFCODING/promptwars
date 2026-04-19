import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import QueueCard from './QueueCard';
import { subscribeToQueues } from '../../services/dataService';
import { logAnalyticsEvent } from '../../config/firebase';

const QueueList = ({ user }) => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logAnalyticsEvent('queue_list_viewed');

    const unsubscribe = subscribeToQueues((data) => {
      setQueues(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Live Wait Times</h2>
      {loading ? (
        <div
          style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}
          aria-busy="true"
        >
          Loading wait times...
        </div>
      ) : queues.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No queue data available.
        </div>
      ) : (
        <div aria-live="polite">
          {queues.map((queue) => (
            <QueueCard
              key={queue.id}
              title={queue.title}
              location={queue.location}
              waitTime={queue.waitTime}
              type={queue.type}
              trend={queue.trend}
            />
          ))}
        </div>
      )}
    </>
  );
};

QueueList.propTypes = {
  user: PropTypes.object,
};

export default QueueList;
