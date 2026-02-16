'use client';

import { useState } from 'react';
import { PendingAssignment } from '@/lib/types';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { AssignmentBanner } from './AssignmentBanner';
import { AssignmentDialog } from './AssignmentDialog';

interface ChatAreaProps {
  studentName: string;
  studentId: string;
  assignment: PendingAssignment | null;
}

export function ChatArea({
  studentName,
  studentId,
  assignment: initialAssignment,
}: ChatAreaProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [assignment, setAssignment] = useState(initialAssignment);

  const handleComplete = () => {
    // Hide assignment banner after completion
    setAssignment(null);
    setShowDialog(false);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">
          {studentName}님의 AI Tutor
        </h1>
      </div>

      {/* Messages Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Assignment Banner */}
        {assignment && (
          <div className="shrink-0 px-6 pt-4">
            <AssignmentBanner onSubmit={() => setShowDialog(true)} />
          </div>
        )}

        {/* Messages */}
        <MessageList />
      </div>

      {/* Input */}
      <MessageInput />

      {/* Assignment Dialog */}
      {assignment && (
        <AssignmentDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          assignment={assignment}
          studentId={studentId}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
