'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Terminal, Cpu, ArrowRight, Play } from 'lucide-react';

export default function Home() {
  return (
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <nav class="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center font-mono font-bold text-slate-950">
            &lt;/&gt;
          </div>
          <span class="font-bold text-lg tracking-tight text-white">Tshepiso <span class="text-sky-400">CodeLab</span></span>
        </div>
        <div class="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <Link href="/" class="text-white hover:text-sky-400 transition">Home</Link>
          <Link href="/generator" class="hover:text-sky-400 transition">Code Generator</Link>
        </div>
        <div class="flex items-center gap-3">
          <Link href="/generator" class="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-sm font-semibold transition flex items-center gap-2">
            Get Started <ArrowRight class="w-4 h-4" />
          </Link>
        </div>
      </nav>

      <main class="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 max-w-5xl mx-auto">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-medium mb-6">
          <Sparkles class="w-3.5 h-3.5" /> Next-Gen AI Code Workspace
        </div>
        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Turn Your Ideas Into <br class="hidden sm:block" />
          <span class="bg-gradient-to-r from-sky-400 via-indigo-400 to-teal-300 bg-clip-text text-transparent">
            Working Code.
          </span>
        </h1>
        <p class="text-slate-400 text-base sm:text-lg max-w-2xl mb-10 leading-relaxed">
          Describe what you want. Tshepiso CodeLab generates clean, syntactically correct,
          responsive code ready for your editor or immediate browser preview.
        </p>

        <div class="w-full max-w-xl p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            readOnly
            placeholder="e.g. Create a responsive student marks dashboard..."
            class="w-full bg-transparent px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600"
          />
          <Link href="/generator" class="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 whitespace-nowrap">
            Generate Code <ArrowRight class="w-4 h-4" />
          </Link>
        </div>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div class="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <Terminal class="w-6 h-6 text-sky-400 mb-3" />
            <h3 class="font-semibold text-white mb-2">1. Describe</h3>
            <p class="text-slate-400 text-sm">Use natural language or voice commands to define your requirements.</p>
          </div>
          <div class="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <Cpu class="w-6 h-6 text-indigo-400 mb-3" />
            <h3 class="font-semibold text-white mb-2">2. Generate & Fix</h3>
            <p class="text-slate-400 text-sm">Receive clean, validated code with automatic syntax checking.</p>
          </div>
          <div class="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <Play class="w-6 h-6 text-teal-400 mb-3" />
            <h3 class="font-semibold text-white mb-2">3. Live Preview</h3>
            <p class="text-slate-400 text-sm">Test and execute your code in an isolated live browser sandbox.</p>
          </div>
        </section>
      </main>

      <footer class="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Tshepiso CodeLab. Describe it. Generate it. Run it.
      </footer>
    </div>
  );
}
