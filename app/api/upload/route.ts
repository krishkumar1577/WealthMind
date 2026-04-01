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
    console.error('Upload API Error:', error?.message || error);
    
    // If Gemini API quota exceeded, return mock response for testing
    if (error?.message?.includes('quota') || error?.message?.includes('429')) {
      console.warn('Gemini quota exceeded - returning mock analysis for testing');
      return NextResponse.json({
        success: true,
        filename,
        analysis: `[Mock Analysis] This is a placeholder analysis for ${filename}. 
Gemini API quota has been exceeded. 

Document Type: Financial Report
Key Dates: FY 2025-26
Status: Document received and indexed

Your quota will reset at midnight. In the meantime, you can test the upload flow with this mock response.`,
        uploadedAt: new Date().toISOString(),
      });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to process file' },
      { status: 500 }
    );
  }
}
