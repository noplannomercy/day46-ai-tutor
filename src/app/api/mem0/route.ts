import { NextRequest, NextResponse } from 'next/server';

const MEM0_API_URL = process.env.NEXT_PUBLIC_MEM0_API_URL!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

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
    });

    if (!response.ok) {
      throw new Error(`Mem0 API failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Mem0 API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Mem0' },
      { status: 500 }
    );
  }
}
