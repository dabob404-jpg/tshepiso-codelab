import { NextResponse } from 'next/server';

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
  <div style="padding:2rem;border:1px solid #334155;border-radius:1rem;background:#1e293b;max-width:400px;">
    <h2 style="color:#ef4444;margin-top:0;">API Key Missing</h2>
    <p style="color:#94a3b8;font-size:0.875rem;">Please set <strong>GEMINI_API_KEY</strong> in your Vercel Project Settings and redeploy.</p>
  </div>
</body>
</html>`
        }]
      });
    }

    const systemPrompt = `You are an expert front-end web developer.
Build a complete, single-file responsive Web Interface based on the user's prompt using HTML, Tailwind CSS (via CDN), and JavaScript.
RULES:
- Return ONLY the raw HTML code. Do NOT wrap output in markdown code blocks like \`\`\`html or \`\`\`.
- Always include <script src="https://cdn.tailwindcss.com"></script> inside the <head>.
- Include working, interactive vanilla JavaScript inside <script> tags for any buttons, forms, calculations, or dashboard logic.
- Deliver a modern, polished dark-theme UI with neat spacing, cards, and smooth interactions.`;

    // Try primary recommended model first, then fallback models if needed
    const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-pro'];
    let generatedCode = '';
    let lastError = '';

    for (const model of candidateModels) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nUser Request: ${prompt}` }]
              }
            ],
            generationConfig: {
              temperature: 0.3
            }
          })
        });

        const data = await res.json();

        if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          generatedCode = data.candidates[0].content.parts[0].text;
          break;
        } else {
          lastError = data.error?.message || JSON.stringify(data);
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    if (!generatedCode) {
      throw new Error(lastError || 'Unable to generate content across available models.');
    }

    // Clean any accidental markdown wrappers
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
  <div style="padding:2rem;border:1px solid #ef4444;border-radius:1rem;background:#1e293b;max-width:440px;">
    <h2 style="color:#ef4444;margin-top:0;">Generation Notice</h2>
    <p style="color:#94a3b8;font-size:0.875rem;">${error?.message || 'Server error occurred.'}</p>
  </div>
</body>
</html>`
      }]
    });
  }
}
