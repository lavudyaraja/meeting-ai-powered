import React from 'react';
import * as MeetingComponents from './index';

const MeetingShowcase: React.FC = () => {
  // Sample data for the components
  const agendaData = {
    date: "October 6, 2025",
    title: "Team Sync Meeting",
    agendaItems: [
      {
        id: "1",
        title: "Project X Update",
        time: "10:00 AM",
        presenter: "Alex Johnson",
        description: "Status update on Project X deliverables and timeline"
      },
      {
        id: "2",
        title: "Q4 Planning Discussion",
        time: "10:30 AM",
        presenter: "Sarah Williams",
        description: "Review of Q4 objectives and resource allocation"
      }
    ],
    attendees: [
      {
        id: "1",
        name: "Alex Johnson",
        role: "Project Manager",
        status: "confirmed" as const
      },
      {
        id: "2",
        name: "Sarah Williams",
        role: "Team Lead",
        status: "confirmed" as const
      }
    ]
  };

  const summaryData = {
    meetingTitle: "Team Sync Meeting",
    date: "October 6, 2025",
    keyDecisions: [
      {
        id: "1",
        title: "Project X Timeline Extension",
        description: "Team agreed to extend Project X timeline by 2 weeks to ensure quality deliverables",
        madeBy: "Alex Johnson"
      }
    ],
    actionItems: [
      {
        id: "1",
        task: "Update Project X documentation",
        assignee: "Mike Chen",
        dueDate: "Oct 15, 2025",
        status: "not-started" as const
      },
      {
        id: "2",
        task: "Schedule client review meeting",
        assignee: "Sarah Williams",
        dueDate: "Oct 10, 2025",
        status: "in-progress" as const
      }
    ]
  };

  const projectData = {
    projectName: "Project X",
    startDate: "September 1, 2025",
    endDate: "December 15, 2025",
    objective: "Develop a new customer onboarding platform to improve user retention by 25%",
    goals: [
      "Design and implement intuitive onboarding flow",
      "Integrate with existing CRM system",
      "Achieve 90% user completion rate",
      "Reduce support tickets by 30%"
    ],
    timeline: [
      {
        phase: "Discovery",
        duration: "2 weeks",
        description: "Research and requirements gathering"
      },
      {
        phase: "Design",
        duration: "3 weeks",
        description: "UI/UX design and prototyping"
      }
    ]
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Meeting Components Showcase</h1>
      
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Agenda Component</h2>
        <MeetingComponents.TeamSyncAgenda20251006 agendaData={agendaData} />
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Meeting Summary Component</h2>
        <MeetingComponents.MeetingSummary20251006 summaryData={summaryData} />
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Project Context Component</h2>
        <MeetingComponents.ProjectXBackground projectData={projectData} />
      </div>
    </div>
  );
};

export default MeetingShowcase;