import { NextRequest, NextResponse } from 'next/server';
import { GradingRequest, GradingResponse } from '@/lib/types';

const GRADING_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_GRADING_URL!;

export async function POST(request: NextRequest) {
  try {
    const body: GradingRequest = await request.json();

    // Validate request
    if (!body.student_id || !body.problems || body.problems.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Debug logging
    console.log('🔍 [Grading API] Webhook URL:', GRADING_WEBHOOK_URL);
    console.log('🔍 [Grading API] Request body:', JSON.stringify(body, null, 2));

    // Call n8n grading webhook
    const response = await fetch(GRADING_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error('❌ [Grading API] n8n webhook failed');
      console.error('   Status:', response.status);
      console.error('   Response:', responseText);
      throw new Error(`Grading webhook failed with status ${response.status}`);
    }

    const data: GradingResponse = await response.json();

    // Validate response
    if (!Array.isArray(data) || data.length === 0 || !data[0].output) {
      throw new Error('Invalid grading response format');
    }

    return NextResponse.json({ output: data[0].output });
  } catch (error) {
    console.error('Grading API error:', error);
    return NextResponse.json(
      {
        error: 'Grading failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
