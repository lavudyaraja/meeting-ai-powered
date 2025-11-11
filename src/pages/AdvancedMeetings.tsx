import React from 'react';
import { AdvancedMeetingsDashboard } from '@/components/dashboard/advanced-meetings/AdvancedMeetingsDashboard';

const AdvancedMeetingsPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AdvancedMeetingsDashboard />
    </div>
  );
};

export default AdvancedMeetingsPage;