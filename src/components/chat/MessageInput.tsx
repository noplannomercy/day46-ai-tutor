'use client';

import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export function MessageInput() {
  const [input, setInput] = useState('');
  const { sendMessage, loading } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="shrink-0 border-t bg-white p-4">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="질문을 입력하세요..."
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" disabled={!input.trim() || loading} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
