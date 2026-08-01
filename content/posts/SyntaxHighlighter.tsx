'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  className?: string;
  children: string;
}

export function CodeBlock({ className, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  // Extract language from className (e.g., "language-tsx")
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';

  // Choose theme based on dark/light mode
  const codeStyle = theme === 'dark' ? vscDarkPlus : vs;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <div className="absolute right-2 top-2 z-10 flex gap-2">
        <button
          onClick={handleCopy}
          className="rounded-md bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity hover:bg-gray-600 group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={codeStyle}
        customStyle={{
          borderRadius: '8px',
          padding: '16px',
          fontSize: '14px',
          margin: 0,
        }}
        showLineNumbers
      >
        {children.trim()}
      </SyntaxHighlighter>
    </div>
  );
}