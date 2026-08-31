'use client';
import React, { useState } from 'react';

interface Topic {
  id: string;
  name: string;
  category: string;
  theory: string;
  syntax: string;
  code: string;
  tableExample?: { headers: string[]; rows: string[][] };
  rules: string[];
}

const comprehensiveCourses: Record<string, { title: string; topics: Topic[] }> = {
  python: {
    title: "Complete Python Engineering Curriculum",
    topics: [
      {
        id: "py-vars-types",
        name: "1. Variables, Data Types & Formatting",
        category: "Basics & Fundamentals",
        theory: "Python variables do not require explicit type declarations; types are resolved dynamically at runtime. Standard primitives include integers, floating-point numbers, booleans, and strings.",
        syntax: `variable_name = value\nf_string = f"Formatted text {variable_name}"`,
        code: `# Basic Types & Modern f-string formatting\nage = 20\nheight = 1.82\nstudent_name = "Tshepiso"\nis_enrolled = True\n\n# Multi-line formatted console table\nprint(f"{'Student':<15} | {'Age':<5} | {'Height (m)':<10} | {'Status':<8}")\nprint("-" * 48)\nprint(f"{student_name:<15} | {age:<5} | {height:<10.2f} | {str(is_enrolled):<8}")`,
        tableExample: {
          headers: ["Type", "Example", "Description", "Mutability"],
          rows: [
            ["int", "42, -10", "Arbitrary precision integers", "Immutable"],
            ["float", "3.14159, 1e-4", "64-bit IEEE 754 floating point", "Immutable"],
            ["str", "'Hello', \"Wits\"", "UTF-8 Unicode text sequence", "Immutable"],
            ["bool", "True, False", "Boolean logic flags", "Immutable"]
          ]
        },
        rules: [
          "Variable names cannot start with numbers and are snake_case by convention.",
          "Use round(val, n) or f-string format specifiers (e.g., {:.2f}) for decimal precision."
        ]
      },
      {
        id: "py-arrays-lists",
        name: "2. Arrays, Lists & 2D Matrices (Tables)",
        category: "Data Structures & Collections",
        theory: "Python provides built-in dynamic arrays called Lists. Lists can store mixed types, shrink or grow dynamically, and support matrix manipulation via nested arrays.",
        syntax: `single_dim = [item1, item2, item3]\ntwo_dim_matrix = [[r1c1, r1c2], [r2c1, r2c2]]`,
        code: `# 1D Array Operations\nmarks = [72, 85, 91, 64, 78]\nmarks.append(88)\nmarks.sort()\n\n# 2D Array / Matrix Table (3x3 Grid)\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\n\n# Accessing rows and columns\nprint("Element at row 1, col 2:", grid[1][2]) # Output: 6\n\n# Dynamic Matrix Table Generator using List Comprehension\nmultiplication_table = [[r * c for c in range(1, 6)] for r in range(1, 6)]\nfor row in multiplication_table:\n    print(" ".join(f"{val:3}" for val in row))`,
        tableExample: {
          headers: ["Method", "Syntax", "Time Complexity", "Action"],
          rows: [
            ["Append", "list.append(x)", "O(1)", "Adds element to end of array"],
            ["Insert", "list.insert(i, x)", "O(n)", "Inserts at specific index, shifting items"],
            ["Pop", "list.pop() / list.pop(i)", "O(1) / O(n)", "Removes and returns element"],
            ["Slice", "list[start:stop:step]", "O(k)", "Extracts sub-array slice"]
          ]
        },
        rules: [
          "Indices are zero-based (0 to len - 1). Negative indices start from the tail (-1).",
          "For high-speed numerical matrices in engineering, import numpy as np."
        ]
      },
      {
        id: "py-control-loops",
        name: "3. Control Flow, Loops & Conditionals",
        category: "Basics & Fundamentals",
        theory: "Conditionals evaluate truthiness to branch execution. Loops execute blocks repeatedly across ranges, arrays, or until a sentinel condition breaks.",
        syntax: `if condition:\n    pass\nelif other_condition:\n    pass\nelse:\n    pass\n\nfor item in iterable:\n    pass\n\nwhile condition:\n    pass`,
        code: `# Iterating with enumerate() and zip() for structured table iteration\nstudents = ["Alice", "Bob", "Charlie"]\nscores = [88, 92, 79]\n\nprint(f"{'Index':<6} {'Name':<10} {'Score':<6} {'Grade'}")\nprint("-" * 32)\nfor idx, (name, score) in enumerate(zip(students, scores), start=1):\n    grade = 'A' if score >= 85 else ('B' if score >= 75 else 'C')\n    print(f"{idx:<6} {name:<10} {score:<6} {grade}")`,
        rules: [
          "Indentation (4 spaces) is strictly enforced for block scope.",
          "Use 'break' to exit loops immediately and 'continue' to skip to the next iteration."
        ]
      },
      {
        id: "py-functions-scope",
        name: "4. Functions, Return Values & Scope",
        category: "Modular Programming",
        theory: "Functions encapsulate reusable logic, accept positional/keyword arguments, support default parameters, and can return multiple values packed inside tuples.",
        syntax: `def function_name(param1: type, param2: type = default) -> return_type:\n    return result`,
        code: `# Function with type hints, default arguments, and multi-return\ndef compute_kinetics(mass_kg: float, velocity_ms: float = 0.0) -> tuple[float, float]:\n    \"\"\"Calculates momentum and kinetic energy.\"\"\"\n    momentum = mass_kg * velocity_ms\n    kinetic_energy = 0.5 * mass_kg * (velocity_ms ** 2)\n    return momentum, kinetic_energy\n\np, ke = compute_kinetics(mass_kg=1200.0, velocity_ms=25.0)\nprint(f"Momentum: {p} kg·m/s | Kinetic Energy: {ke:.2f} Joules")`,
        rules: [
          "Arguments without defaults must precede arguments with defaults.",
          "Variables created inside a function are local unless declared with 'global' or 'nonlocal'."
        ]
      },
      {
        id: "py-oop-classes",
        name: "5. Object-Oriented Programming (Classes & Objects)",
        category: "Advanced Architecture",
        theory: "Classes bind data (attributes) and behavior (methods) together into blueprints. Supports inheritance, encapsulation, and special dunder methods.",
        syntax: `class ClassName:\n    def __init__(self, param):\n        self.param = param`,
        code: `class RockSample:\n    def __init__(self, sample_id: str, mineral: str, density: float):\n        self.sample_id = sample_id\n        self.mineral = mineral\n        self.density = density  # g/cm^3\n\n    def get_mass_for_volume(self, volume_cm3: float) -> float:\n        return self.density * volume_cm3\n\n    def __str__(self) -> str:\n        return f"Sample[{self.sample_id}]: {self.mineral} ({self.density} g/cm³)"\n\ns1 = RockSample("RS-104", "Quartz", 2.65)\nprint(s1)\nprint("Mass for 50cm³ volume:", s1.get_mass_for_volume(50), "grams")`,
        rules: [
          "The first parameter of an instance method is always 'self'.",
          "Use '__init__' to initialize state when instantiating new objects."
        ]
      }
    ]
  },
  cpp: {
    title: "Complete C++ Systems Curriculum",
    topics: [
      {
        id: "cpp-basics-io",
        name: "1. Syntax, Primitive Types & Table Output",
        category: "Basics & Fundamentals",
        theory: "C++ is a compiled, statically-typed systems language. Execution always begins in the main() function. Use iostream with iomanip for formatted tabular data streams.",
        syntax: `#include <iostream>\n#include <iomanip>\n\nint main() {\n    // logic\n    return 0;\n}`,
        code: `#include <iostream>\n#include <iomanip>\n#include <string>\n\nint main() {\n    std::string student = "Tshepiso";\n    int studentId = 3087003;\n    double gpa = 3.92;\n\n    // Printing formatted table using std::setw\n    std::cout << std::left << std::setw(15) << "STUDENT" \n              << std::setw(12) << "STUDENT ID" \n              << std::setw(8)  << "GPA" << "\\n";\n    std::cout << std::string(35, '-') << "\\n";\n    std::cout << std::left << std::setw(15) << student \n              << std::setw(12) << studentId \n              << std::fixed << std::setprecision(2) << std::setw(8) << gpa << "\\n";\n\n    return 0;\n}`,
        tableExample: {
          headers: ["Type", "Typical Size", "Range / Precision", "Standard Keyword"],
          rows: [
            ["Integer", "4 Bytes (32-bit)", "-2,147,483,648 to 2,147,483,647", "int"],
            ["Floating Point", "4 Bytes", "~7 decimal digits", "float"],
            ["Double Precision", "8 Bytes", "~15 decimal digits", "double"],
            ["Character", "1 Byte", "Single ASCII character", "char"],
            ["Boolean", "1 Byte", "true (1) or false (0)", "bool"]
          ]
        },
        rules: [
          "Every statement must terminate with a semicolon (;).",
          "Types cannot be changed after declaration."
        ]
      },
      {
        id: "cpp-arrays-vectors",
        name: "2. Static Arrays, Dynamic std::vector & 2D Tables",
        category: "Data Structures & Collections",
        theory: "C++ supports fixed-size contiguous memory blocks (static arrays) and dynamic, heap-backed expandable arrays (std::vector). std::vector automatically handles resizing and memory cleanup.",
        syntax: `int staticArray[5] = {1, 2, 3, 4, 5};\nstd::vector<int> dynamicVec = {1, 2, 3};\nstd::vector<std::vector<int>> matrix2D(rows, std::vector<int>(cols));`,
        code: `#include <iostream>\n#include <vector>\n#include <iomanip>\n\nint main() {\n    // Dynamic std::vector\n    std::vector<int> sensorReadings = {105, 112, 108};\n    sensorReadings.push_back(120); // Adds element\n\n    // 2D Array / Vector Table (Matrix Representation)\n    int rows = 3, cols = 3;\n    std::vector<std::vector<int>> grid(rows, std::vector<int>(cols));\n\n    // Populate 2D Table\n    for (int r = 0; r < rows; ++r) {\n        for (int c = 0; c < cols; ++c) {\n            grid[r][c] = (r + 1) * (c + 1);\n        }\n    }\n\n    // Print Matrix Table\n    std::cout << "--- 2D Generated Matrix ---\\n";\n    for (const auto& row : grid) {\n        for (int val : row) {\n            std::cout << std::setw(4) << val;\n        }\n        std::cout << "\\n";\n    }\n\n    return 0;\n}`,
        rules: [
          "Accessing out-of-bounds indices in raw arrays causes undefined behavior or segmentation faults.",
          "Use vector.at(index) for bounds checking with exception safety."
        ]
      },
      {
        id: "cpp-functions-params",
        name: "3. Functions, Pass-by-Value vs Pass-by-Reference",
        category: "Modular Programming",
        theory: "C++ passes arguments by value (copy) by default. To modify arguments in place or avoid expensive memory copies of large arrays/objects, pass by reference (&) or const reference (const &).",
        syntax: `void modify(int& refParam);\nvoid readOnly(const std::vector<int>& data);`,
        code: `#include <iostream>\n#include <vector>\n\n// Pass by reference (&) modifies original variable directly\nvoid applyBonus(double& score, double bonus) {\n    score += bonus;\n}\n\n// Pass by const reference avoids copying large vectors\ndouble calculateAverage(const std::vector<double>& values) {\n    double sum = 0.0;\n    for (double v : values) sum += v;\n    return values.empty() ? 0.0 : sum / values.size();\n}\n\nint main() {\n    double examMark = 68.5;\n    applyBonus(examMark, 5.0);\n    std::cout << "Updated Exam Mark: " << examMark << "\\n"; // 73.5\n\n    std::vector<double> marks = {75.0, 82.5, 90.0};\n    std::cout << "Class Average: " << calculateAverage(marks) << "\\n";\n    return 0;\n}`,
        rules: [
          "Pass primitives (int, double, char) by value or reference if mutation is needed.",
          "Pass complex structs, classes, and vectors by 'const Type&' to eliminate memory copying overhead."
        ]
      },
      {
        id: "cpp-pointers-memory",
        name: "4. Pointers, Memory Addresses & Dynamic Allocation",
        category: "Low-Level Memory Architecture",
        theory: "A pointer holds the virtual memory address of another variable. C++ gives manual control over heap allocation using 'new' and 'delete', which forms the basis for custom data structures like linked lists and trees.",
        syntax: `int* ptr = &variable;\n*ptr = 100; // Dereference\nint* heapArray = new int[size];\ndelete[] heapArray;`,
        code: `#include <iostream>\n\nint main() {\n    int originalValue = 42;\n    int* addressOfOriginal = &originalValue; // Store address\n\n    std::cout << "Original Value: " << originalValue << "\\n";\n    std::cout << "Memory Address: " << addressOfOriginal << "\\n";\n    std::cout << "Value via Pointer Dereference: " << *addressOfOriginal << "\\n";\n\n    // Modify value directly through pointer dereference\n    *addressOfOriginal = 99;\n    std::cout << "Value after pointer edit: " << originalValue << "\\n";\n\n    // Dynamic array allocation on Heap\n    int size = 3;\n    int* dynamicArr = new int[size]{10, 20, 30};\n    \n    std::cout << "Heap element 1: " << dynamicArr[1] << "\\n";\n    \n    // Critical: Free memory to avoid memory leaks\n    delete[] dynamicArr;\n    dynamicArr = nullptr;\n\n    return 0;\n}`,
        rules: [
          "Always pair every 'new' with 'delete' and every 'new[]' with 'delete[]'.",
          "Set pointers to 'nullptr' after deletion to prevent dangling pointer bugs."
        ]
      }
    ]
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'learn' | 'studio'>('learn');

  // AI Studio State
  const [prompt, setPrompt] = useState('Create a modern coffee shop dashboard');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('<!DOCTYPE html>\n<html>\n<body class="bg-slate-950 text-white flex items-center justify-center min-h-screen font-sans">\n  <div class="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center">\n    <h1 class="text-3xl font-bold text-sky-400">Ready to Build</h1>\n    <p class="text-slate-400 mt-2">Enter your requirements above and tap Generate Code.</p>\n  </div>\n</body>\n</html>');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  // Learning Hub State
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'cpp'>('python');
  const [currentTopicId, setCurrentTopicId] = useState<string>(comprehensiveCourses.python.topics[0].id);

  const activeCourse = comprehensiveCourses[selectedLanguage];
  const activeTopic = activeCourse.topics.find((t) => t.id === currentTopicId) || activeCourse.topics[0];

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 py-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500/10 text-sky-400 p-2.5 rounded-xl border border-sky-500/20 font-mono font-bold text-sm">
            &lt;/&gt;
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight">Tshepiso CodeLab</h1>
            <p className="text-xs text-slate-400">Engineering Curriculum &amp; Software Studio</p>
          </div>
        </div>

        {/* View Switcher */}
        <nav className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'learn'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📚 Student Textbook &amp; Guides
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'studio'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✨ AI Generator Studio
          </button>
        </nav>
      </header>

      {/* Main Container */}
      {activeTab === 'learn' ? (
        /* Student Comprehensive Textbook View */
        <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 md:p-6 gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-6 h-fit">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Course Selection
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  const lang = e.target.value as 'python' | 'cpp';
                  setSelectedLanguage(lang);
                  setCurrentTopicId(comprehensiveCourses[lang].topics[0].id);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="python">🐍 Python (Full Engineering Course)</option>
                <option value="cpp">⚡ C++ (Systems &amp; Memory Course)</option>
              </select>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-extrabold text-sky-400 uppercase tracking-wider block border-b border-slate-800/80 pb-1">
                Chapters &amp; Modules
              </span>
              <div className="space-y-1.5">
                {activeCourse.topics.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setCurrentTopicId(t.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs leading-snug transition-all ${
                      activeTopic.id === t.id
                        ? 'bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/30 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Detailed Chapter Reading Area */}
          <section className="flex-1 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col gap-6">
            <div className="border-b border-slate-800 pb-5 space-y-2">
              <div className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {activeTopic.category}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{activeTopic.name}</h2>
              <p className="text-sm text-slate-300 leading-relaxed pt-2">{activeTopic.theory}</p>
            </div>

            {/* Quick Syntax Pattern */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Syntax &amp; Blueprint</h3>
              <pre className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-xs font-mono text-amber-300 overflow-x-auto">
                <code>{activeTopic.syntax}</code>
              </pre>
            </div>

            {/* Full Executable Code Snippet */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Complete Executable Example</span>
                <button
                  onClick={() => navigator.clipboard.writeText(activeTopic.code)}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Copy Snippet
                </button>
              </div>
              <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed shadow-inner">
                <code>{activeTopic.code}</code>
              </pre>
            </div>

            {/* Reference Table If Available */}
            {activeTopic.tableExample && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">Quick Reference Table</h3>
                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-bold">
                        {activeTopic.tableExample.headers.map((h, i) => (
                          <th key={i} className="p-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                      {activeTopic.tableExample.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-800/30">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 text-slate-300 font-mono text-[11px]">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Engineering Best Practices / Rules */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Exam &amp; Engineering Key Rules</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                {activeTopic.rules.map((rule, idx) => (
                  <li key={idx}><span className="text-slate-300">{rule}</span></li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      ) : (
        /* AI Generator Studio View */
        <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full flex flex-col gap-5">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Project Requirements
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Describe what you want to generate..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all resize-none"
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
            >
              {loading ? 'Generating Code...' : '✨ Generate Code'}
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
