import React from 'react';

interface ProjectData {
  projectName: string;
  startDate: string;
  endDate: string;
  objective: string;
  goals: string[];
  timeline: {
    phase: string;
    duration: string;
    description: string;
  }[];
}

interface ProjectXBackgroundProps {
  projectData: ProjectData;
}

const ProjectXBackground: React.FC<ProjectXBackgroundProps> = ({ projectData }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{projectData.projectName} Background</h1>
        <p className="text-gray-600 mt-1">
          Duration: {projectData.startDate} - {projectData.endDate}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Objective</h2>
        <p className="text-gray-600">{projectData.objective}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Key Goals</h2>
        <ul className="list-disc list-inside space-y-2">
          {projectData.goals.map((goal, index) => (
            <li key={index} className="text-gray-600">{goal}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Project Timeline</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phase</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projectData.timeline.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.phase}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.duration}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectXBackground;