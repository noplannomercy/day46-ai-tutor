import { Mem0Memory, Mem0Response } from '@/lib/types';

const MEM0_API_URL = process.env.NEXT_PUBLIC_MEM0_API_URL!;

export async function fetchLearningStatus(
  userId: string
): Promise<Mem0Memory[]> {
  try {
    const response = await fetch(`${MEM0_API_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '학생 학습 상태',
        user_id: userId,
        limit: 10,
      }),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`Mem0 API failed: ${response.status}`);
    }

    const data: Mem0Response = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Mem0 API error:', error);
    // Graceful failure - return empty array instead of throwing
    // This allows chat to work even if Mem0 is down
    return [];
  }
}
