import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemInstruction = `
      You are an expert front-end web developer.
      Your task is to build a complete, single-file responsive Web Interface using raw HTML, Tailwind CSS (via CDN script tag), and JavaScript.
      IMPORTANT RULES:
      - Return ONLY raw HTML inside your output. Do not include markdown code block backticks (\`\`\`html or \`\`\`).
      - Include <script src="https://cdn.tailwindcss.com"></script> inside the <head>.
      - Make sure all JavaScript features, interactive elements, and UI components described by the user work seamlessly inside a single document.
      - Ensure modern aesthetics: dark/sleek theme, rounded borders, clean spacing, clear typography, and subtle contrast.
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
    return NextResponse.json({ error: error.message || 'Failed to generate code' }, { status: 500 });
  }
}
