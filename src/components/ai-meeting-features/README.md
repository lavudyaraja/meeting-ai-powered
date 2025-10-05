# AI Meeting Features

This directory contains the implementation of world-first practical AI meeting features designed to automate and optimize meeting workflows.

## Features Implemented

### Quick Wins (Easy + High Impact)

1. **Auto-Calendar Block Optimizer**
   - Automatically blocks focus time on calendars based on meeting patterns
   - Analyzes when team has back-to-back meetings
   - Auto-blocks 30-min breaks after 3+ consecutive meetings
   - Syncs with project management tools to reserve deep work time before deadlines
   - Coordinates "meeting-free zones" across teams using shared calendar APIs
   - Sends calendar invites for focus time that others can't override

2. **Post-Meeting Task Automation**
   - Automatically creates and assigns tasks in your project management tool
   - Extracts action items from transcript
   - Creates tickets in Jira/Asana/Monday with relevant context
   - Auto-assigns based on who committed to the task
   - Sets deadlines based on urgency mentioned in meeting
   - Links related documents/decisions from meeting
   - Sends Slack/Teams reminders before deadlines

3. **Smart Document Generator**
   - Creates required documents automatically from meeting discussions
   - Generates PRDs from product meetings
   - Creates RFPs from vendor requirement discussions
   - Produces technical specs from engineering planning
   - Builds project charters from kickoff meetings
   - Formats meeting minutes in company template
   - Auto-shares to relevant stakeholders and folders

## Features Planned (Coming Soon)

### Game Changers (Hard + High Impact)

1. **Vendor/Client Portal Integration**
   - Automatically updates external stakeholders after meetings
   - Updates client portal with meeting decisions
   - Sends approved information to vendor dashboards
   - Creates client-facing status reports
   - Schedules follow-up meetings across organizations
   - Syncs deliverable timelines to shared project boards
   - Handles NDA-compliant information sharing

2. **Hardware Integration Suite**
   - Connects meeting AI to physical devices
   - Auto-starts video recording when meeting begins (smart camera)
   - Adjusts room lighting based on presentation needs
   - Controls smart displays to show agenda/notes/timer
   - Mutes participant mics when others speaking (smart microphone system)
   - Sends transcripts to smart glasses for deaf participants
   - Vibrates smartwatches when someone's mentioned or needs to speak

3. **Meeting Cost Tracker & Budget Alert**
   - Real-world budget impact tracking
   - Integrates with HR system for salary data
   - Calculates actual meeting cost (participant hours × rates)
   - Sends alerts when meeting series exceeds budget threshold
   - Suggests shorter/smaller meetings to reduce costs
   - Tracks ROI by comparing meeting cost to decisions/revenue generated
   - Generates executive reports on meeting spend by department

### Unique Differentiators (Nobody else has)

1. **Instant Meeting Room Cleanup**
   - Automatically resets meeting rooms after each session
   - Connects to IoT devices to turn off displays, reset HDMI, clear whiteboards (photo capture first)
   - Auto-emails whiteboard photos to participants
   - Resets room temperature to default
   - Updates room availability status in booking system
   - Orders cleaning if meeting exceeded room capacity

2. **Auto-Cancel Optimizer**
   - Suggests canceling unnecessary meetings
   - Detects recurring meetings with <50% attendance
   - Identifies meetings with no decisions in last 3 sessions
   - Suggests async alternatives for update-only meetings
   - Auto-cancels if key stakeholder unavailable
   - Polls attendees: "Is this still necessary?" before recurring meetings
   - Reclaims meeting time to focus time

## Technical Implementation

### Components

- `AIMeetingDashboard.tsx` - Main dashboard component
- `AutoCalendarBlockOptimizer.tsx` - Calendar blocking feature
- `PostMeetingTaskAutomation.tsx` - Task automation feature
- `SmartDocumentGenerator.tsx` - Document generation feature

### Hooks

- `use-ai-meeting.ts` - Custom hook for managing AI meeting settings

### Pages

- `AIMeetingAssistant.tsx` - Main page for the AI meeting assistant

## Integration Points

- Supabase for data storage and real-time updates
- Calendar APIs for scheduling
- Project management tools (Jira, Asana, Monday.com)
- Cloud storage for document generation
- IoT devices for hardware integration
- Translation APIs for multilingual support