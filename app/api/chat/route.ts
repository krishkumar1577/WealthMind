import { NextRequest, NextResponse } from 'next/server';
import { generateResponse } from '@/lib/gemini-client';

export async function POST(request: NextRequest) {
  try {
    const { message, context, conversationHistory } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build conversation context
    let fullContext = context || '';
    if (conversationHistory && Array.isArray(conversationHistory)) {
      fullContext = conversationHistory
        .map((msg: any) => `${msg.role}: ${msg.content}`)
        .join('\n\n');
    }

    const response = await generateResponse(message, fullContext);

    return NextResponse.json({
      success: true,
      message: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process message' },
      { status: 500 }
    );
  }
}
