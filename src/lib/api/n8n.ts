import { N8nResponse } from '@/lib/types';
import { toast } from 'sonner';

const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!;

export async function sendMessage(
  userId: string,
  message: string
): Promise<string> {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        message,
      }),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.status}`);
    }

    const data: N8nResponse = await response.json();

    // Response is an ARRAY with one element
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid n8n response format');
    }

    return data[0].output;
  } catch (error) {
    console.error('n8n API error:', error);
    toast.error('AI 튜터 응답에 실패했습니다. 다시 시도해주세요.');
    throw error;
  }
}
