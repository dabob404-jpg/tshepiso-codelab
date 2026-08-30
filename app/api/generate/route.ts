import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        files: [{
          name: 'index.html',
          content: `<!DOCTYPE html>
<html>
<body style="background:#0f172a;color:#f8fafc;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;text-align:center;">
  <div style="padding:2rem;border:1px solid #334155;border-radius:1rem;background:#1e293b;max-w:400px;">
    <h2 style="color:#ef4444;margin-top:0;">API Key Missing</h2>
    <p style="color:#94a3b8;font-size:0.875rem;">Please set <strong>GEMINI_API_KEY</strong> in your Vercel Project Settings and redeploy.</p>
  </div>
</body>
</html>`
        }]
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
      You are an expert front-end web developer.
      Your task is to build a complete, single-file responsive Web Interface using raw HTML, Tailwind CSS (via CDN script tag), and JavaScript.
      IMPORTANT RULES:
      - Return ONLY raw HTML inside your output. Do not include markdown code block backticks.
      - Include <script src="https://cdn.tailwindcss.com"></script> inside the <head>.
      - Make sure all JavaScript features and interactive elements work seamlessly inside a single document.
      - Ensure modern aesthetics: dark theme, rounded borders, clean spacing, and clear typography.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    let generatedCode = response.text || '';
    generatedCode = generatedCode.replace(/^```html/i, '').replace(/^```/, '').replace(/```$/, '').trim();

    return NextResponse.json({
      files: [{ name: 'index.html', content: generatedCode }]
    });

  } catch (error: any) {
    console.error('Generation Error:', error);
    return NextResponse.json({
      files: [{
        name: 'index.html',
        content: `<!DOCTYPE html>
<html>
<body style="background:#0f172a;color:#f8fafc;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;text-align:center;">
  <div style="padding:2rem;border:1px solid #334155;border-radius:1rem;background:#1e293b;max-w:400px;">
    <h2 style="color:#ef4444;margin-top:0;">Generation Failed</h2>
    <p style="color:#94a3b8;font-size:0.875rem;">${error?.message || 'An unknown server error occurred.'}</p>
  </div>
</body>
</html>`
      }]
    });
  }
}
