import { createClient } from '@/lib/supabase/server';
import { ChatMessage, DatabaseMessage, StudentProfile } from '@/lib/types';

export async function getChatHistory(userId: string): Promise<ChatMessage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('n8n_chat_histories')
    .select('message')
    .eq('session_id', userId)
    .order('id', { ascending: true }); // Use id instead of created_at

  if (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }

  if (!data) return [];

  // Parse JSONB messages and convert to ChatMessage format
  const messages: ChatMessage[] = [];
  let messageCounter = 0;

  for (const row of data) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dbMessage = row.message as any;

      // Safely extract content - handle multiple possible formats
      const content = dbMessage?.data?.content || dbMessage?.content || '';

      if (content && dbMessage?.type) {
        messages.push({
          id: `${userId}-${messageCounter++}`,
          type: dbMessage.type,
          content,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error parsing message:', row.message, error);
    }
  }

  return messages;
}

export async function getStudentProfile(
  userId: string
): Promise<StudentProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching student profile:', error);
    return null;
  }

  return data;
}
