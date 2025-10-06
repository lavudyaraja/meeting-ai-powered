import React, { useState } from 'react';

interface ArchivedMeeting {
  id: string;
  title: string;
  date: string;
  attendees: number;
  status: 'completed' | 'cancelled' | 'rescheduled';
  summary: string;
  duration: string;
  meetingType: string;
}

interface ArchiveData {
  quarter: string;
  year: string;
  meetings: ArchivedMeeting[];
}

interface ArchivedMeetingsProps {
  archiveData: ArchiveData;
}

const ArchivedMeetings2024Q4: React.FC<ArchivedMeetingsProps> = ({ archiveData }) => {
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const toggleExpand = (id: string) => {
    setExpandedMeetingId(expandedMeetingId === id ? null : id);
  };

  const filteredMeetings = archiveData.meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          meeting.meetingType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || meeting.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Archived Meetings</h1>
        <p className="text-gray-600 mt-1">{archiveData.quarter} {archiveData.year}</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search meetings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No meetings found matching your criteria.</p>
          </div>
        ) : (
          filteredMeetings.map((meeting) => (
            <div key={meeting.id} className="border border-gray-200 rounded-lg">
              <div 
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(meeting.id)}
              >
                <div>
                  <h3 className="font-medium text-gray-800">{meeting.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {meeting.meetingType}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {meeting.date}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {meeting.duration}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
                      meeting.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {meeting.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-4">{meeting.attendees} attendees</span>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedMeetingId === meeting.id ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {expandedMeetingId === meeting.id && (
                <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Meeting Summary</h4>
                  <p className="text-gray-600">{meeting.summary}</p>
                  <div className="mt-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ArchivedMeetings2024Q4;