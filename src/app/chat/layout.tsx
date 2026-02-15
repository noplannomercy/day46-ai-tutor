import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getChatHistory } from '@/lib/api/supabase';
import { ChatProvider } from '@/contexts/ChatContext';

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  // Load chat history server-side
  const chatHistory = await getChatHistory(session.user.id);

  // Use user.id as key to force remount when user changes
  return (
    <ChatProvider key={session.user.id} initialMessages={chatHistory}>
      {children}
    </ChatProvider>
  );
}
