'use client';

import React, { useState } from 'react';

interface JsonViewerProps {
  data: Record<string, unknown> | unknown[];
}

export default function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden text-xs font-mono">
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-zinc-800">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="font-sans font-medium text-xs">
            {isExpanded ? 'Collapse Payload' : 'Expand Payload'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
        >
          {copied ? 'Copied!' : 'Copy JSON'}
        </button>
      </div>

      {isExpanded && (
        <pre className="p-3 overflow-x-auto max-h-[380px] leading-relaxed text-zinc-300">
          <code>{jsonString}</code>
        </pre>
      )}
    </div>
  );
}

