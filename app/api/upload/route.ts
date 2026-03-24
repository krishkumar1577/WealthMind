import { NextRequest, NextResponse } from 'next/server';
import { analyzeDocument, generateReport } from '@/lib/gemini-client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const action = formData.get('action') as string || 'analyze';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file content
    const content = await file.text();
    const filename = file.name;

    let result;
    if (action === 'analyze') {
      result = await analyzeDocument(filename, content);
    } else {
      result = await analyzeDocument(filename, content);
    }

    return NextResponse.json({
      success: true,
      filename,
      analysis: result,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process file' },
      { status: 500 }
    );
  }
}
