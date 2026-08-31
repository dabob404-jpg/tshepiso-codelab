'use client';
import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'learn' | 'studio'>('learn');

  // Study Hub States
  const [studyQuery, setStudyQuery] = useState('');
  const [studyLoading, setStudyLoading] = useState(false);
  const [studyContent, setStudyContent] = useState(`
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-sky-400">Welcome to Professor Mode</h1>
      <p class="text-sm text-slate-300 leading-relaxed">
        Type any topic in the search bar above (e.g. <em>"Python 2D arrays & tables"</em>, <em>"C++ Pointers and Memory Allocation"</em>, or <em>"Functions & Scope mechanics"</em>) to generate full textbook notes.
      </p>
    </div>
  `);

  // AI Studio States
  const [prompt, setPrompt] = useState('Build a coffee shop website');
  const [studioLoading, setStudioLoading] = useState(false);
  const [code, setCode] = useState('<!DOCTYPE html>\n<html>\n<body class="bg-slate-950 text-white flex items-center justify-center min-h-screen font-sans">\n  <div class="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center">\n    <h1 class="text-3xl font-bold text-sky-400">Ready to Build</h1>\n  </div>\n</body>\n</html>');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const handleStudySearch = async (queryText?: string) => {
    const q = queryText || studyQuery;
    if (!q.trim()) return;
    setStudyLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q, mode: 'study' }),
      });
      const data = await res.json();
      if (data.content) {
        setStudyContent(data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStudyLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    // Triggers mobile native Save as PDF print dialog without freezing the UI thread
    window.print();
  };

  const handleStudioGenerate = async () => {
    if (!prompt.trim()) return;
    setStudioLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode: 'studio' }),
      });
      const data = await res.json();
      if (data.content) {
        setCode(data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStudioLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* Navigation Bar (Hidden during PDF print export) */}
      <header className="print:hidden border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 py-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500/10 text-sky-400 p-2.5 rounded-xl border border-sky-500/20 font-mono font-bold text-sm">
            &lt;/&gt;
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight">Tshepiso CodeLab</h1>
            <p className="text-xs text-slate-400">University Professor Lecture Hub &amp; Dev Studio</p>
          </div>
        </div>

        <nav className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'learn'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎓 Professor Study Hub
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'studio'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✨ AI App Generator
          </button>
        </nav>
      </header>

      {activeTab === 'learn' ? (
        /* Dynamic Professor Study Hub */
        <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
          {/* Query Bar (Hidden during PDF print export) */}
          <div className="print:hidden bg-slate-900/80 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Ask Professor CodeLab:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={studyQuery}
                onChange={(e) => setStudyQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStudySearch()}
                placeholder="e.g. Python arrays and formatted tables, C++ pointers, Functions & scope..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
              />
              <button
                onClick={() => handleStudySearch()}
                disabled={studyLoading}
                className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-sky-500/20 whitespace-nowrap"
              >
                {studyLoading ? 'Generating Lecture...' : '📖 Generate Lecture Notes'}
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-500 font-medium">Quick Topics:</span>
              {[
                'Python 2D Arrays & Tables',
                'Python Functions & Lambdas',
                'C++ Pointers & Memory Allocation',
                'C++ Dynamic Vectors & Tables'
              ].map((topic, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setStudyQuery(topic);
                    handleStudySearch(topic);
                  }}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Lecture Display Box */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl min-h-[500px] flex flex-col gap-4 print:bg-white print:text-black print:border-none print:shadow-none">
            {/* Top Toolbar with PDF Download Button (Hidden during PDF print export) */}
            <div className="print:hidden flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Interactive Lecture Module
              </span>
              <button
                onClick={handleDownloadPDF}
                disabled={studyLoading}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-2 shadow-md shadow-emerald-500/20"
              >
                📥 Save / Print PDF
              </button>
            </div>

            {studyLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-400">Compiling professor-grade textbook notes &amp; code...</p>
              </div>
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: studyContent }}
                className="prose prose-invert max-w-none text-slate-300 space-y-4 leading-relaxed p-2 print:text-black"
              />
            )}
          </div>
        </main>
      ) : (
        /* AI Generator Studio */
        <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full flex flex-col gap-5">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Web App Requirements
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Describe the website or interface to build..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all resize-none"
            />
            <button
              onClick={handleStudioGenerate}
              disabled={studioLoading}
              className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
            >
              {studioLoading ? 'Generating Web App...' : '✨ Generate Code'}
            </button>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col min-h-[450px]">
            <div className="border-b border-slate-800 px-4 py-2.5 flex justify-between items-center bg-slate-900/90">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'preview' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Live Preview
                </button>
                <button
                  onClick={() => setViewMode('code')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'code' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Code Editor
                </button>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Copy Code
              </button>
            </div>

            <div className="flex-1 bg-slate-950">
              {viewMode === 'preview' ? (
                <iframe
                  title="Live Preview"
                  srcDoc={code}
                  className="w-full h-full min-h-[450px] border-none"
                  sandbox="allow-scripts allow-modals"
                />
              ) : (
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full min-h-[450px] bg-slate-950 text-sky-300 font-mono text-xs p-4 focus:outline-none resize-none"
                />
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
