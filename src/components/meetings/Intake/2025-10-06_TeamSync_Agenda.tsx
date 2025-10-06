import React from 'react';

interface AgendaItem {
  id: string;
  title: string;
  time: string;
  presenter: string;
  description: string;
}

interface Attendee {
  id: string;
  name: string;
  role: string;
  status: 'confirmed' | 'tentative' | 'declined';
}

interface AgendaData {
  date: string;
  title: string;
  agendaItems: AgendaItem[];
  attendees: Attendee[];
}

interface TeamSyncAgendaProps {
  agendaData: AgendaData;
}

const TeamSyncAgenda: React.FC<TeamSyncAgendaProps> = ({ agendaData }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{agendaData.title}</h1>
        <p className="text-gray-600 mt-1">{agendaData.date}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Agenda Items</h2>
        <div className="space-y-4">
          {agendaData.agendaItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {item.time}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{item.presenter}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Attendees</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agendaData.attendees.map((attendee) => (
            <div key={attendee.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{attendee.name}</p>
                <p className="text-sm text-gray-500">{attendee.role}</p>
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  attendee.status === 'confirmed' ? 'bg-green-500' :
                  attendee.status === 'tentative' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></span>
                <span className="text-xs text-gray-500 capitalize">{attendee.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSyncAgenda;