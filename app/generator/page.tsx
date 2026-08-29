'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import JSZip from 'jszip';
import { 
  Play, Copy, Download, Sparkles, Mic, MicOff, Check, 
  RotateCcw, HelpCircle, Wrench, CheckCircle2, AlertCircle
} from 'lucide-react';
import { GenerationResponse } from '@/types';
import { validateCode, ValidationResult } from '@/lib/validation';

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'explain'>('code');
  const [isRecording, setIsRecording] = useState(false);
  const [copied, setCopied] = useState(false);

  const [response, setResponse] = useState<GenerationResponse | null>(null);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [codeContent, setCodeContent] = useState('');
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  const previewFrameRef = useRef<HTMLIFrameElement>(null);

  const triggerGeneration = async (mode: 'generate' | 'fix' | 'explain' = 'generate') => {
    if (!prompt.trim() && mode === 'generate') return;
    setIsLoading(true);

    const steps = [
      'Understanding your request...',
      'Designing the solution...',
      'Generating code...',
      'Validating syntax...'
    ];

    let stepIndex = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setLoadingStep(steps[stepIndex]);
      }
    }, 700);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          mode,
          existingCode: codeContent
        })
      });

      const data: GenerationResponse = await res.json();
      clearInterval(stepInterval);

      if (data.success && data.files.length > 0) {
        setResponse(data);
        setActiveFileIndex(0);
        setCodeContent(data.files[0].content);
        setValidation(validateCode(data.files[0].content, data.files[0].language));
        if (data.runnable) setActiveTab('preview');
      } else {
        alert(data.error || 'Generation failed.');
      }
    } catch (err) {
      clearInterval(stepInterval);
      alert('Network error connecting to API.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    if (!response) return;
    const zip = new JSZip();
    response.files.forEach((file) => {
      zip.file(file.name, file.content);
    });
    zip.file('README.md', `# ${response.title}\n\n${response.explanation}`);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${response.title.toLowerCase().replace(/\s+/g, '-')}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (activeTab === 'preview' && previewFrameRef.current) {
      const doc = previewFrameRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(codeContent);
        doc.close();
      }
    }
  }, [codeContent, activeTab]);

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      <header className="h-14 border-b border-slate-800/80 px-4 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-sky-500 flex items-center justify-center font-mono font-bold text-xs text-slate-950">
              &lt;/&gt;
            </div>
            <span className="font-bold text-sm text-white">Tshepiso CodeLab</span>
          </Link>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">Studio</span>
        </div>

        {response && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownloadZip}
              className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" /> Export .ZIP
            </button>
          </div>
        )}
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <section className="w-full md:w-5/12 border-r border-slate-800/80 flex flex-col bg-slate-950/40 p-4 gap-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your Requirements</label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    triggerGeneration('generate');
                  }
                }}
                placeholder="e.g. Build a student marks dashboard with a table, bar chart and pass/fail summary..."
                className="w-full h-36 bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 outline-none focus:border-sky-500 resize-none font-sans"
              />
              <button
                onClick={toggleVoiceInput}
                className={`absolute bottom-3 right-3 p-2 rounded-lg border transition ${
                  isRecording ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title="Voice Input"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Press Ctrl + Enter to generate</span>
              {isRecording && <span className="text-rose-400 animate-pulse">🎤 Listening...</span>}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              disabled={isLoading || !prompt.trim()}
              onClick={() => triggerGeneration('generate')}
              className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> {loadingStep}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Code
                </>
              )}
            </button>
            <button
              onClick={() => { setPrompt(''); setResponse(null); }}
              className="px-3 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded-xl text-sm"
              title="Clear"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Starter Ideas</span>
            <div className="flex flex-col gap-1.5">
              {[
                'Create a student marks dashboard with table and bar charts',
                'Build a modern responsive calculator in HTML, CSS & JS',
                'Create a SaaS landing page hero section with glassmorphic cards'
              ].map((text, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(text)}
                  className="text-left text-xs bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 p-2.5 rounded-lg text-slate-400 hover:text-slate-200 transition"
                >
                  &rarr; <div className="inline">{text}</div>
                </button>
              ))}
            </div>
          </div>

          {response && (
            <div className="mt-auto border-t border-slate-800 pt-4 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Code Health & AI Actions</span>
              
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="flex items-center gap-2 font-medium text-slate-300">
                  {validation?.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  )}
                  <span>{validation?.valid ? 'Automated checks passed' : 'Syntax anomalies detected'}</span>
                </div>
                {!validation?.valid && validation?.errors.map((err, idx) => (
                  <p key={idx} className="text-rose-400 pl-6 text-[11px]">{err}</p>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => triggerGeneration('fix')}
                  className="px-3 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-400" /> Fix Issues
                </button>
                <button
                  onClick={() => setActiveTab('explain')}
                  className="px-3 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-sky-400" /> Explain Logic
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="w-full md:w-7/12 flex flex-col bg-slate-950 overflow-hidden">
          <div className="h-10 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/40">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${activeTab === 'code' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-white'}`}
              >
                Code Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${activeTab === 'preview' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-white'}`}
              >
                Live Preview
              </button>
              <button
                onClick={() => setActiveTab('explain')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${activeTab === 'explain' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-white'}`}
              >
                Documentation
              </button>
            </div>

            {response && (
              <span className="text-[11px] text-slate-500 font-mono">
                {response.files[activeFileIndex]?.name}
              </span>
            )}
          </div>

          <div className="flex-1 relative overflow-hidden bg-slate-950">
            {activeTab === 'code' && (
              <textarea
                value={codeContent}
                onChange={(e) => {
                  setCodeContent(e.target.value);
                  setValidation(validateCode(e.target.value, response?.files[activeFileIndex]?.language || 'html'));
                }}
                className="w-full h-full bg-slate-950 text-slate-200 font-mono text-xs p-4 outline-none resize-none selection:bg-sky-500/30"
                placeholder="// Generated source code will appear here..."
                spellCheck={false}
              />
            )}

            {activeTab === 'preview' && (
              <iframe
                ref={previewFrameRef}
                title="Live Sandbox Preview"
                sandbox="allow-scripts allow-modals"
                className="w-full h-full bg-white border-0"
              />
            )}

            {activeTab === 'explain' && (
              <div className="p-6 text-sm text-slate-300 leading-relaxed overflow-y-auto h-full space-y-4">
                <h3 className="text-lg font-semibold text-white">Project Overview</h3>
                <p className="whitespace-pre-wrap">{response?.explanation || "Generate code first to read its technical architecture documentation."}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
