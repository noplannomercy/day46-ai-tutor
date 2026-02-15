import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatAreaProps {
  studentName: string;
}

export function ChatArea({ studentName }: ChatAreaProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">
          {studentName}님의 AI Tutor
        </h1>
      </div>

      {/* Messages */}
      <MessageList />

      {/* Input */}
      <MessageInput />
    </div>
  );
}
