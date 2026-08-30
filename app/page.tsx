'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center font-bold text-slate-950 text-xl">
            &lt;/&gt;
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Tshepiso CodeLab</h1>
            <p className="text-xs text-slate-400">AI-Powered Developer Studio</p>
          </div>
        </div>
        <Link
          href="/generator"
          className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
        >
          Get Started &rarr;
        </Link>
      </header>

      <main className="max-w-3xl mx-auto w-full text-center space-y-6 my-auto py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-sky-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          Next-Gen AI Code Workspace
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Turn Your Ideas Into <span className="text-sky-400">Working Code.</span>
        </h1>

        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
          Describe what you want. Tshepiso CodeLab generates clean, syntactically correct, responsive code ready for your editor or immediate browser preview.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (prompt.trim()) {
              window.location.href = `/generator?prompt=${encodeURIComponent(prompt)}`;
            }
          }}
          className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl shadow-xl space-y-3"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Create a responsive student marks dashboard..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <span>Generate Code</span>
            <span>&rarr;</span>
          </button>
        </form>
      </main>

      <footer className="text-center text-slate-600 text-xs py-4 border-t border-slate-900">
        &copy; {new Date().getFullYear()} Tshepiso CodeLab. All rights reserved.
      </footer>
    </div>
  );
}
