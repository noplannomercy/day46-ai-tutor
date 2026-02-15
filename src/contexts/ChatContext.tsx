'use client';

import { createContext, useState } from 'react';
import { ChatContextType, ChatMessage } from '@/lib/types';
import { sendMessage as sendToN8n } from '@/lib/api/n8n';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
  initialMessages?: ChatMessage[];
}

export function ChatProvider({ children, initialMessages = [] }: ChatProviderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const sendMessage = async (content: string) => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    // Create user message
    const userMessage: ChatMessage = {
      id: `${user.id}-${Date.now()}-user`,
      type: 'human',
      content,
      timestamp: new Date().toISOString(),
    };

    // Optimistically add user message
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Call n8n webhook
      const aiResponse = await sendToN8n(user.id, content);

      // Create AI message
      const aiMessage: ChatMessage = {
        id: `${user.id}-${Date.now()}-ai`,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      // Add AI response
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      // Remove optimistic user message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
      // Error toast is already shown in n8n.ts
    } finally {
      setLoading(false);
    }
  };

  const value = {
    messages,
    loading,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
