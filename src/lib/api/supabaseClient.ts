import { createClient } from '@/lib/supabase/client';
import { StudentAnswer } from '@/lib/types';

/**
 * Client-side Supabase functions
 * These can be called from client components
 */

/**
 * Submit student answers (client-side)
 */
export async function submitAnswersClient(
  submissionId: number,
  answers: StudentAnswer[]
): Promise<boolean> {
  const supabase = createClient();

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
 * Save grading result (client-side)
 */
export async function saveGradingResultClient(
  submissionId: number,
  gradingResult: string,
  status: 'graded' | 'submitted' = 'graded'
): Promise<boolean> {
  const supabase = createClient();

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
