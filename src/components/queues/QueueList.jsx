import React, { useState, useEffect } from 'react';
import QueueCard from './QueueCard';
import { getQueues } from '../../services/dataService';

const QueueList = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchQueues = async () => {
      try {
        const data = await getQueues();
        if (mounted) {
          setQueues(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching queues:", error);
        if (mounted) setLoading(false);
      }
    };
    fetchQueues();
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Live Wait Times</h2>
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading wait times...
        </div>
      ) : queues.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No queue data available.
        </div>
      ) : (
        queues.map((queue) => (
          <QueueCard
            key={queue.id}
            title={queue.title}
            location={queue.location}
            waitTime={queue.waitTime}
            type={queue.type}
            trend={queue.trend}
          />
        ))
      )}
    </>
  );
};

export default QueueList;
