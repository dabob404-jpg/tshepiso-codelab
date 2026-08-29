import { NextRequest, NextResponse } from 'next/server';
import { generateCode } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { prompt, mode, existingCode } = await req.json();

    if (!prompt && mode === 'generate') {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    const data = await generateCode(prompt || '', mode, existingCode);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
