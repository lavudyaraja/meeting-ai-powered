import React from 'react';
import MeetingsList from '@/components/dashboard/MeetingsList';

const Meetings: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <MeetingsList />
    </div>
  );
};

export default Meetings;