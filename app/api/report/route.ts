import { NextRequest, NextResponse } from 'next/server';
import { generateReport } from '@/lib/gemini-client';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data) {
      return NextResponse.json(
        { error: 'Data is required' },
        { status: 400 }
      );
    }

    const report = await generateReport(data);

    return NextResponse.json({
      success: true,
      report,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Report API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    );
  }
}
