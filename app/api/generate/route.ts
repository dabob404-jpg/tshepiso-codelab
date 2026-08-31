import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, mode } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
    }

    let systemPrompt = '';

    if (mode === 'study') {
      systemPrompt = `You are a distinguished Computer Science and Engineering Professor lecturing university students.
The student will ask you to explain a programming concept (e.g., in Python, C++, Java, or Data Structures).

Generate an exhaustive, textbook-grade, in-depth lecture guide structured in clean HTML (using Tailwind CSS classes).
DO NOT wrap the output in markdown code blocks like \`\`\`html. Return ONLY raw HTML code.

Structure your response with:
1. <h1 class="text-2xl font-bold text-sky-400 mb-2">: Topic Title & Language Specification
2. <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-4 mb-6">: 
   - <h3 class="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Theoretical Architecture & Core Intuition</h3>
   - Deep explanation of the memory model, execution flow, dynamic vs static rules, and pitfalls.
3. <table class="w-full text-xs text-left border border-slate-800 rounded-xl overflow-hidden mb-6">:
   - Include comparison tables, complexity charts (O(1), O(n)), or data type byte sizes.
4. <div class="space-y-2 mb-6">:
   - <h3 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Exhaustive Code Implementations (with inline comments)</h3>
   - Full, working code block inside <pre class="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto">.
5. <div class="bg-sky-500/10 border border-sky-500/20 rounded-xl p-4">:
   - <h4 class="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">Professor's Exam Warnings & Engineering Best Practices</h4>
   - Crucial edge cases, memory leak prevention, pointer arithmetic warnings, and common student bugs.`;
    } else {
      systemPrompt = `You are an expert front-end web developer.
Build a complete, single-file responsive Web Interface based on the user's prompt using HTML, Tailwind CSS (via CDN), and JavaScript.
Return ONLY the raw HTML code without markdown wrapping.`;
    }

    const candidateModels = [
      'gemini-3.6-flash',
      'gemini-3.1-pro-preview',
      'gemini-2.5-flash',
      'gemini-2.0-flash'
    ];

    let generatedText = '';
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
            generationConfig: { temperature: 0.2 }
          })
        });

        const data = await res.json();
        if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          generatedText = data.candidates[0].content.parts[0].text;
          break;
        } else {
          lastError = data.error?.message || JSON.stringify(data);
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    if (!generatedText) {
      throw new Error(lastError || 'Unable to generate notes.');
    }

    generatedText = generatedText.replace(/^```html/i, '').replace(/^```/, '').replace(/```$/, '').trim();

    return NextResponse.json({ content: generatedText });

  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
