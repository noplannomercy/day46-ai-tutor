import { ChatMessage } from '@/lib/types';
import { KaTeXRenderer } from './KaTeXRenderer';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAI = message.type === 'ai';

  return (
    <div className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-blue-100 text-blue-600">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isAI
            ? 'bg-gray-100 text-gray-900'
            : 'bg-blue-600 text-white'
        }`}
      >
        <KaTeXRenderer content={message.content} />
        <p
          className={`mt-1 text-xs ${
            isAI ? 'text-gray-500' : 'text-blue-100'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {!isAI && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-blue-600 text-white">나</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
