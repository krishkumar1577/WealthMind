import { NextRequest, NextResponse } from 'next/server';
import { generateResponse, generateResponseStream } from '@/lib/gemini-client';

export async function POST(request: NextRequest) {
  try {
    const { message, context, conversationHistory, stream } = await request.json();

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

    // If client requests streaming, use streaming response
    if (stream === true) {
      const encoder = new TextEncoder();
      let streamClosed = false;

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of generateResponseStream(message, fullContext)) {
              if (streamClosed) break;
              const encoded = encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`);
              controller.enqueue(encoded);
            }
            if (!streamClosed) {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            }
          } catch (error: any) {
            console.error('Streaming error:', error);
            if (!streamClosed) {
              const errorData = encoder.encode(
                `data: ${JSON.stringify({ error: error.message })}\n\n`
              );
              controller.enqueue(errorData);
              controller.close();
            }
          }
        },
      });

      return new NextResponse(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    // Fallback: non-streaming response
    const response = await generateResponse(message, fullContext);

    return NextResponse.json({
      success: true,
      message: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Chat API Error:', error?.message || error);
    
    // If Gemini API quota exceeded, return helpful message
    if (error?.message?.includes('quota') || error?.message?.includes('429')) {
      return NextResponse.json({
        success: false,
        message: '⏸️ Gemini API quota exceeded for today. Your quota resets at midnight. Try again in a few hours!',
        error: 'QUOTA_EXCEEDED',
        timestamp: new Date().toISOString(),
      }, { status: 429 });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to process message' },
      { status: 500 }
    );
  }
}
