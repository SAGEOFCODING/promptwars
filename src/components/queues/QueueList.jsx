import React from 'react';
import QueueCard from './QueueCard';
import { queueData } from '../../data/mockData';

const QueueList = () => {
  return (
    <>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Live Wait Times</h2>
      {queueData.map((queue) => (
        <QueueCard
          key={queue.id}
          title={queue.title}
          location={queue.location}
          waitTime={queue.waitTime}
          type={queue.type}
          trend={queue.trend}
        />
      ))}
    </>
  );
};

export default QueueList;
