import { createClient } from '@/lib/supabase/server';
import {
  ChatMessage,
  DatabaseMessage,
  StudentProfile,
  PendingAssignment,
  StudentAnswer,
} from '@/lib/types';

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

/**
 * Get pending assignment for a student
 */
export async function getPendingAssignment(
  userId: string
): Promise<PendingAssignment | null> {
  const supabase = await createClient();

  // Try explicit foreign key relationship
  const { data, error } = await supabase
    .from('student_submissions')
    .select(
      `
      id,
      assignment_id,
      status,
      teacher_assignments!assignment_id (
        id,
        teacher_id,
        exam_id,
        exam_content,
        student_ids,
        status,
        due_date,
        created_at
      )
    `
    )
    .eq('student_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // No pending assignment is not an error
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching pending assignment:', error);
    return null;
  }

  // Transform the data to match PendingAssignment type
  const rawData = data as any;

  // Debug logging
  console.log('Raw data from Supabase:', JSON.stringify(rawData, null, 2));

  // Check if teacher_assignments exists
  if (!rawData.teacher_assignments) {
    console.error('Invalid teacher_assignments data:', rawData);
    return null;
  }

  // Handle both array and object formats
  let teacherAssignment;
  if (Array.isArray(rawData.teacher_assignments)) {
    // If it's an array, take the first element
    if (rawData.teacher_assignments.length === 0) {
      console.error('Empty teacher_assignments array');
      return null;
    }
    teacherAssignment = rawData.teacher_assignments[0];
  } else {
    // If it's an object, use it directly
    teacherAssignment = rawData.teacher_assignments;
  }

  return {
    id: rawData.id,
    assignment_id: rawData.assignment_id,
    status: rawData.status,
    teacher_assignments: teacherAssignment,
  } as PendingAssignment;
}

/**
 * Submit student answers
 */
export async function submitAnswers(
  submissionId: number,
  answers: StudentAnswer[]
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('student_submissions')
    .update({
      answers,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    })
    .eq('id', submissionId);

  if (error) {
    console.error('Error submitting answers:', error);
    return false;
  }

  return true;
}

/**
 * Save grading result
 */
export async function saveGradingResult(
  submissionId: number,
  gradingResult: string,
  status: 'graded' | 'submitted' = 'graded'
): Promise<boolean> {
  const supabase = await createClient();

  const updateData: {
    grading_result: string;
    status: 'graded' | 'submitted';
    graded_at?: string;
  } = {
    grading_result: gradingResult,
    status,
  };

  // Only set graded_at if status is 'graded'
  if (status === 'graded') {
    updateData.graded_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('student_submissions')
    .update(updateData)
    .eq('id', submissionId);

  if (error) {
    console.error('Error saving grading result:', error);
    return false;
  }

  return true;
}
