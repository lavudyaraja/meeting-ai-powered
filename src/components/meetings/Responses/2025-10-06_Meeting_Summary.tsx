import React from 'react';

interface Decision {
  id: string;
  title: string;
  description: string;
  madeBy: string;
}

interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

interface SummaryData {
  meetingTitle: string;
  date: string;
  keyDecisions: Decision[];
  actionItems: ActionItem[];
}

interface MeetingSummaryProps {
  summaryData: SummaryData;
}

const MeetingSummary20251006: React.FC<MeetingSummaryProps> = ({ summaryData }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{summaryData.meetingTitle} Summary</h1>
        <p className="text-gray-600 mt-1">{summaryData.date}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Key Decisions</h2>
        <div className="space-y-4">
          {summaryData.keyDecisions.map((decision) => (
            <div key={decision.id} className="border-l-4 border-blue-500 pl-4 py-1">
              <h3 className="font-medium text-gray-800">{decision.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{decision.description}</p>
              <p className="text-gray-500 text-xs mt-2">Decision made by: {decision.madeBy}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Action Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {summaryData.actionItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.task}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.assignee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status.replace('-', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MeetingSummary20251006;