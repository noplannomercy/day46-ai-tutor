import { GradingRequest } from '../types';

/**
 * Submit answers for grading via Next.js API route
 *
 * @param request Grading request with problems and student answers
 * @returns Grading result markdown text
 */
export async function submitForGrading(
  request: GradingRequest
): Promise<string> {
  try {
    const response = await fetch('/api/grading', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Grading failed with status ${response.status}`
      );
    }

    const data = await response.json();

    if (!data.output) {
      throw new Error('Invalid grading response format');
    }

    return data.output;
  } catch (error) {
    console.error('Grading API error:', error);
    throw error;
  }
}
