'use client';
import React, { useState } from 'react';

// Study guide data for students
const studyGuides: Record<string, { title: string; modules: { level: string; topics: { name: string; summary: string; code: string }[] }[] }> = {
  python: {
    title: "Python Mastery: Basics to Pro",
    modules: [
      {
        level: "Basics",
        topics: [
          {
            name: "1. Variables & Types",
            summary: "Python is dynamically typed. Common primitives include int, float, str, and bool.",
            code: `# Variables & Types\nname = "Tshepiso"\nage = 20\ngpa = 3.85\nis_student = True\n\nprint(f"Student: {name}, Age: {age}")`
          },
          {
            name: "2. Control Flow & Loops",
            summary: "Use if/elif/else for decisions, and for/while loops to iterate over ranges and sequences.",
            code: `# Loops & Branching\ngrades = [75, 88, 92, 64]\n\nfor score in grades:\n    if score >= 75:\n        print(f"{score}: Distinction")\n    else:\n        print(f"{score}: Pass")`
          },
          {
            name: "3. Functions & Lambdas",
            summary: "Define reusable modular logic with def and quick inline expressions using lambda.",
            code: `# Functions\ndef calculate_energy(mass, velocity):\n    return 0.5 * mass * (velocity ** 2)\n\n# Anonymous lambda\nsquare = lambda x: x ** 2\nprint("KE:", calculate_energy(10, 4))`
          }
        ]
      },
      {
        level: "Intermediate",
        topics: [
          {
            name: "4. Data Structures (Lists, Dicts, Sets)",
            summary: "Lists are ordered & mutable, tuples are immutable, sets store unique keys, and dicts store key-value pairs.",
            code: `# Dictionaries & Sets\nstudent = {\n    "name": "Tshepiso",\n    "courses": ["Calculus", "Mining Graphics", "Physics"]\n}\n\nunique_tags = {"engineering", "code", "wits"}\nprint(student["courses"][0])`
          },
          {
            name: "5. Object-Oriented Programming (OOP)",
            summary: "Classes structure data with methods, constructors (__init__), and inheritance.",
            code: `class MineralSample:\n    def __init__(self, name, density):\n        self.name = name\n        self.density = density\n\n    def is_heavy(self):\n        return self.density > 3.0\n\nsample = MineralSample("Pyrite", 5.0)\nprint(sample.name, "Heavy?", sample.is_heavy())`
          }
        ]
      },
      {
        level: "Professional",
        topics: [
          {
            name: "6. Numerical & Scientific Python (NumPy)",
            summary: "High-performance n-dimensional array operations, linear algebra, and vector math.",
            code: `import numpy as np\n\n# Vector dot product & matrix ops\nv1 = np.array([2.0, 4.0, 6.0])\nv2 = np.array([1.0, 0.0, 3.0])\n\ndot_prod = np.dot(v1, v2)\nprint("Vector Dot Product:", dot_prod)`
          }
        ]
      }
    ]
  },
  cpp: {
    title: "C++ Systems Programming",
    modules: [
      {
        level: "Basics",
        topics: [
          {
            name: "1. Basic Structure & I/O",
            summary: "C++ starts execution inside main(). Use std::cout and std::cin for stream operations.",
            code: `#include <iostream>\n\nint main() {\n    int student_id = 3087003;\n    std::cout << "Student ID: " << student_id << std::endl;\n    return 0;\n}`
          },
          {
            name: "2. Pointers & References",
            summary: "Pointers store raw memory addresses (*ptr), while references (&ref) create direct aliases.",
            code: `#include <iostream>\n\nint main() {\n    int val = 42;\n    int* ptr = &val;\n\n    std::cout << "Address: " << ptr << std::endl;\n    std::cout << "Deref Value: " << *ptr << std::endl;\n    return 0;\n}`
          }
        ]
      },
      {
        level: "Professional",
        topics: [
          {
            name: "3. Dynamic Memory & Smart Pointers",
            summary: "Modern C++ avoids raw pointers using std::unique_ptr and std::shared_ptr for automatic memory cleanup.",
            code: `#include <iostream>\n#include <memory>\n\nstruct Sensor {\n    void read() { std::cout << "Reading telemetry..." << std::endl; }\n};\n\nint main() {\n    std::unique_ptr<Sensor> s = std::make_unique<Sensor>();\n    s->read();\n    return 0;\n}`
          }
        ]
      }
    ]
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'learn'>('studio');

  // Studio State
  const [prompt, setPrompt] = useState('Create a modern landing page hero section with glassmorphic cards html');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('<!DOCTYPE html>\n<html>\n<body class="bg-slate-950 text-white flex items-center justify-center min-h-screen font-sans">\n  <div class="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center">\n    <h1 class="text-3xl font-bold text-sky-400">Ready to Build</h1>\n    <p class="text-slate-400 mt-2">Enter your requirements above and tap Generate Code.</p>\n  </div>\n</body>\n</html>');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  // Learning Hub State
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'cpp'>('python');
  const [currentTopic, setCurrentTopic] = useState(studyGuides.python.modules[0].topics[0]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.files?.[0]?.content) {
        setCode(data.files[0].content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-3.5 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500/10 text-sky-400 p-2 rounded-xl border border-sky-500/20 font-mono font-bold text-sm">
            &lt;/&gt;
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight">Tshepiso CodeLab</h1>
            <p className="text-xs text-slate-400">AI Generator &amp; Developer Hub</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <nav className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'studio'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✨ AI Studio
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'learn'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📚 Study Guides
          </button>
        </nav>
      </header>

      {/* Main Body */}
      {activeTab === 'studio' ? (
        /* AI Generator Studio */
        <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full flex flex-col gap-5">
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 md:p-5 shadow-xl space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Your Requirements
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Describe the website, tool, or component you want to build..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all resize-none"
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
            >
              {loading ? 'Generating Code...' : '✨ Generate Code'}
            </button>
          </div>

          {/* Sandbox & Code Output */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col min-h-[450px]">
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
      ) : (
        /* Student Learning Hub */
        <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 md:p-6 gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-80 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Select Curriculum
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  const lang = e.target.value as 'python' | 'cpp';
                  setSelectedLanguage(lang);
                  setCurrentTopic(studyGuides[lang].modules[0].topics[0]);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="python">🐍 Python (Zero to Pro)</option>
                <option value="cpp">⚡ C++ (Systems &amp; Memory)</option>
              </select>
            </div>

            <div className="space-y-4">
              {studyGuides[selectedLanguage].modules.map((mod, mIdx) => (
                <div key={mIdx} className="space-y-1.5">
                  <span className="text-xs font-extrabold text-sky-400 uppercase tracking-wider">{mod.level}</span>
                  <div className="space-y-1">
                    {mod.topics.map((topic, tIdx) => (
                      <button
                        key={tIdx}
                        onClick={() => setCurrentTopic(topic)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all ${
                          currentTopic.name === topic.name
                            ? 'bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/30'
                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                        }`}
                      >
                        {topic.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Guide Content & Example */}
          <section className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{currentTopic.name}</h2>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">{currentTopic.summary}</p>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-slate-400">Interactive Example / Code Snippet</span>
                <button
                  onClick={() => navigator.clipboard.writeText(currentTopic.code)}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Copy Snippet
                </button>
              </div>
              <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <code>{currentTopic.code}</code>
              </pre>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
