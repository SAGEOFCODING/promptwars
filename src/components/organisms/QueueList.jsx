import React from 'react';
import PropTypes from 'prop-types';
import QueueCard from '@/components/molecules/QueueCard';
import { useQueues } from '@/hooks/useQueues';

const QueueList = () => {
  const { queues, loading } = useQueues();

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

QueueList.propTypes = {};

export default QueueList;
