import React from 'react';
import { AILessonPlanner, AIWhiteboard } from './index';

export function TestAIComponents() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Components Test</h1>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">AI Lesson Planner</h2>
        <AILessonPlanner />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">AI Whiteboard</h2>
        <AIWhiteboard />
      </div>
    </div>
  );
}