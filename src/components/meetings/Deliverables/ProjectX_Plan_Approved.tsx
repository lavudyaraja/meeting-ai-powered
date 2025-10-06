import React from 'react';

interface Milestone {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

interface Resource {
  id: string;
  name: string;
  role: string;
  allocation: string; // Percentage or hours
}

interface PlanData {
  projectName: string;
  approvalDate: string;
  version: string;
  milestones: Milestone[];
  resources: Resource[];
}

interface ProjectPlanProps {
  planData: PlanData;
}

const ProjectXPlanApproved: React.FC<ProjectPlanProps> = ({ planData }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{planData.projectName} Approved Plan</h1>
        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-600">Version: {planData.version}</p>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Approved
          </span>
        </div>
        <p className="text-gray-600 text-sm mt-1">Approved on: {planData.approvalDate}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Project Milestones</h2>
        <div className="space-y-4">
          {planData.milestones.map((milestone) => (
            <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-800">{milestone.name}</h3>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                  milestone.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {milestone.status.replace('-', ' ')}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">{milestone.description}</p>
              <div className="flex justify-between mt-3 text-sm text-gray-500">
                <span>{milestone.startDate} - {milestone.endDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Allocated Resources</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {planData.resources.map((resource) => (
                <tr key={resource.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resource.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.allocation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectXPlanApproved;