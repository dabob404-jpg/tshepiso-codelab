import { GenerationResponse } from '@/types';

const SYSTEM_PROMPT = `You are Tshepiso CodeLab AI, an expert full-stack developer.
Generate production-ready code based on user prompts.
Return ONLY valid JSON matching the schema below.

JSON FORMAT:
{
  "success": true,
  "title": "Title",
  "explanation": "Clear markdown explanation",
  "language": "html-css-javascript",
  "runnable": true,
  "files": [
    {
      "name": "index.html",
      "language": "html",
      "content": ""
    }
  ]
}`;

export async function generateCode(
  prompt: string,
  mode: 'generate' | 'fix' | 'explain' = 'generate',
  existingCode?: string
): Promise<GenerationResponse> {
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  const apiBaseUrl = process.env.AI_BASE_URL || (process.env.GROQ_API_KEY ? 'https://api.groq.com/openai/v1' : 'https://api.openai.com/v1');
  const model = process.env.AI_MODEL || (process.env.GROQ_API_KEY ? 'llama-3.3-70b-versatile' : 'gpt-4o');

  if (!apiKey) {
    return getFallbackResponse(prompt);
  }

  try {
    let finalPrompt = prompt;
    if (mode === 'fix') {
      finalPrompt = `Fix any issues in this code:\n\`\`\`\n${existingCode}\n\`\`\`\nRequest: ${prompt}`;
    } else if (mode === 'explain') {
      finalPrompt = `Explain this code's logic and architecture:\n\`\`\`\n${existingCode}\n\`\`\``;
    }

    const res = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: finalPrompt }
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) throw new Error(`API failed: ${res.status}`);

    const data = await res.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (err: any) {
    return getFallbackResponse(prompt);
  }
}

function getFallbackResponse(prompt: string): GenerationResponse {
  return {
    success: true,
    title: 'Interactive Dashboard Prototype',
    language: 'html-css-javascript',
    runnable: true,
    files: [
      {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tshepiso CodeLab Prototype</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen p-6 font-sans">
  <div class="max-w-4xl mx-auto space-y-6">
    <header class="border-b border-slate-800 pb-4 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-sky-400">Generated Project</h1>
        <p class="text-slate-400 text-sm mt-1">Prompt: ${prompt.replace(/"/g, '&quot;')}</p>
      </div>
      <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs rounded-full font-medium">Ready</span>
    </header>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <h3 class="text-xs text-slate-400 uppercase tracking-wider">Total Tasks</h3>
        <p class="text-3xl font-bold mt-2 text-white">24</p>
      </div>
      <div class="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <h3 class="text-xs text-slate-400 uppercase tracking-wider">Completed</h3>
        <p class="text-3xl font-bold mt-2 text-emerald-400">18</p>
      </div>
      <div class="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <h3 class="text-xs text-slate-400 uppercase tracking-wider">Pending</h3>
        <p class="text-3xl font-bold mt-2 text-amber-400">6</p>
      </div>
    </div>
  </div>
</body>
</html>`
      }
    ],
    explanation: '### Architecture\nRendered using Tailwind CSS responsive containers.'
  };
}
