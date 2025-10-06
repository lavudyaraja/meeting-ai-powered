import React, { useState } from 'react';

interface AgendaPromptProps {
  promptText: string;
  onSave?: (newPrompt: string) => void;
}

const AgendaPrompt20251006: React.FC<AgendaPromptProps> = ({ promptText, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(promptText);

  const handleSave = () => {
    if (onSave) {
      onSave(editedPrompt);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPrompt(promptText);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Agenda Generation Prompt</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Prompt
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        {isEditing ? (
          <textarea
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
            className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter AI prompt text..."
          />
        ) : (
          <div className="bg-gray-50 p-4 border border-gray-200 rounded-md whitespace-pre-wrap">
            {promptText}
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500 mt-4">
        <p>This prompt was used to generate the meeting agenda. Editing this prompt will not affect the current agenda.</p>
      </div>
    </div>
  );
};

export default AgendaPrompt20251006;