'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PreviewFrame from '@/components/PreviewFrame';

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState('Create a SaaS landing page hero section with glassmorphic cards html');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'docs'>('preview');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SaaS Hero Prototype</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-6">
  <div class="max-w-4xl w-full text-center space-y-6">
    <span class="px-3 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs rounded-full font-medium">✨ Next-Gen Workspace</span>
    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight">Scale Your Engineering With <span class="text-sky-400">Intelligent Workflows</span></h1>
    <p class="text-slate-400 max-w-xl mx-auto text-sm">Build, prototype, and ship full-stack interfaces in seconds with automated design scaffolding.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 text-left">
      <div class="p-6 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl">
        <h3 class="font-bold text-white mb-1">⚡ Lightning Fast</h3>
        <p class="text-xs text-slate-400">Generate responsive modern components on the fly.</p>
      </div>
      <div class="p-6 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl">
        <h3 class="font-bold text-white mb-1">🛠 Production Ready</h3>
        <p class="text-xs text-slate-400">Syntactically validated and self-contained code modules.</p>
      </div>
    </div>
  </div>
</body>
</html>`);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode: 'generate' }),
      });
      const data = await res.json();
      if (data.files && data.files[0]?.content) {
        setCode(data.files[0].content);
        setActiveTab('preview');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="h-14 border-b border-slate-800 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-sky-400">
          <span className="w-7 h-7 bg-sky-500 text-slate-950 rounded-lg flex items-center justify-center text-xs">&lt;/&gt;</span>
          Tshepiso CodeLab <span className="text-xs font-normal text-slate-400">Studio</span>
        </Link>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg"
        >
          Copy Code
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        <div className="lg:col-span-4 p-6 border-r border-slate-800 flex flex-col justify-between gap-6 overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Requirements</h2>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-sky-500"
              placeholder="Describe your app..."
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-xl text-sm transition-all"
            >
              {loading ? 'Generating...' : '✨ Generate Code'}
            </button>
          </div>

          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 text-xs text-slate-400">
            ✅ Automated validation checks active.
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col h-full bg-slate-950">
          <div className="h-12 border-b border-slate-800 px-4 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                activeTab === 'preview' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Preview
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                activeTab === 'editor' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Code Editor
            </button>
          </div>

          <div className="flex-1 p-4 overflow-auto">
            {activeTab === 'preview' ? (
              <PreviewFrame htmlContent={code} />
            ) : (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full min-h-[500px] font-mono text-xs p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
