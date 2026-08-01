'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const code = children?.toString() || '';
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper relative">
      <pre className={className}>{children}</pre>
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded-md bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity hover:bg-gray-600 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </button>
    </div>
  );
}