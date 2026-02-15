'use client';

import { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { Loader2 } from 'lucide-react';

export function MessageList() {
  const { messages, loading } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center text-gray-400">
            <p>질문을 입력하여 AI 튜터와 대화를 시작하세요</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}

        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>AI가 풀이 중...</span>
          </div>
        )}

        <div ref={scrollRef} />
      </div>
    </div>
  );
}
