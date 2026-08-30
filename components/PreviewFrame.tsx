'use client';

import React from 'react';

interface PreviewFrameProps {
  htmlContent: string;
}

export default function PreviewFrame({ htmlContent }: PreviewFrameProps) {
  const defaultHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-slate-900 text-slate-100 min-h-screen flex items-center justify-center p-6 text-center font-sans">
        <div>
          <h2 class="text-xl font-bold text-sky-400 mb-2">No Content Yet</h2>
          <p class="text-sm text-slate-400">Enter a prompt and click "Generate Code" to render the live UI.</p>
        </div>
      </body>
    </html>
  `;

  return (
    <div className="w-full h-full bg-white rounded-xl overflow-hidden border border-slate-800 shadow-inner">
      <iframe
        title="Live Application Preview"
        srcDoc={htmlContent?.trim() ? htmlContent : defaultHtml}
        sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
        className="w-full h-full min-h-[550px] border-none"
      />
    </div>
  );
}
