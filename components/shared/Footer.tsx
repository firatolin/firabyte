'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaEnvelope, FaXTwitter } from 'react-icons/fa6';
import { SiUpwork } from 'react-icons/si';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('✅ ' + data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage('❌ ' + data.error);
      }
    } catch (error) {
      setStatus('error');
      setMessage('❌ Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="mt-20 bg-gray-50 dark:bg-black border-t border-gray-200/50 dark:border-white/5">
      {/* Newsletter Banner */}
      <div className="border-b border-gray-200/50 dark:border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-lg font-serif font-semibold text-gray-900 dark:text-white">Stay in the loop</h4>
              <p className="text-sm text-gray-500 dark:text-white/60">
                Get the latest posts delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1128] dark:focus:ring-white/30 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 text-sm"
                required
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-5 py-2.5 bg-[#0A1128] dark:bg-white text-white dark:text-[#0A1128] rounded-lg hover:bg-[#1a2a4a] dark:hover:bg-white/90 transition-colors text-sm font-medium whitespace-nowrap disabled:opacity-50"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
          {message && (
            <p className={`mt-3 text-sm text-center ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand - 5 columns */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="text-2xl font-serif font-bold tracking-tight text-gray-900 dark:text-white">
              Firabyte
            </Link>
            <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed max-w-sm">
              Tech insights for modern developers. Exploring software, AI, cloud, and everything in between.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/firatolin"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-[#0A1128]/10 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-white/60 hover:text-[#0A1128] dark:hover:text-white"
                aria-label="GitHub"
              >
                <FaGithub className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/firatol-esayas-tefera"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-[#0A1128]/10 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-white/60 hover:text-[#0A1128] dark:hover:text-white"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://x.com/firatolin_"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-[#0A1128]/10 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-white/60 hover:text-[#0A1128] dark:hover:text-white"
                aria-label="X"
              >
                <FaXTwitter className="h-4.5 w-4.5" />
              </a>
              <a
                href="mailto:contact@firatolin.tech"
                className="p-2 rounded-lg hover:bg-[#0A1128]/10 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-white/60 hover:text-[#0A1128] dark:hover:text-white"
                aria-label="Email"
              >
                <FaEnvelope className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://www.upwork.com/freelancers/~013702dbb39e143318"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-[#0A1128]/10 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-white/60 hover:text-[#0A1128] dark:hover:text-white"
                aria-label="Upwork"
              >
                <SiUpwork className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Quick Links - 2.5 columns */}
          <div className="md:col-span-2.5">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-4">
              Explore
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/posts" className="text-gray-600 dark:text-white/60 hover:text-[#0A1128] dark:hover:text-white transition-colors">
                  All Posts
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 dark:text-white/60 hover:text-[#0A1128] dark:hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/tags" className="text-gray-600 dark:text-white/60 hover:text-[#0A1128] dark:hover:text-white transition-colors">
                  Tags
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-white/60 hover:text-[#0A1128] dark:hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect - 2.5 columns */}
          <div className="md:col-span-2.5">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-4">
              Connect
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="https://github.com/firatolin" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-white/60 hover:text-[#0A1128] dark:hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/firatol-esayas-tefera" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-white/60 hover:text-[#0A1128] dark:hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://x.com/firatolin_" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-white/60 hover:text-[#0A1128] dark:hover:text-white transition-colors">
                  X
                </a>
              </li>
              <li>
                <a href="mailto:contact@firatolin.tech" className="text-gray-600 dark:text-white/60 hover:text-[#0A1128] dark:hover:text-white transition-colors">
                  Email
                </a>
              </li>
            </ul>
          </div>

          {/* Work With Me - 2 columns */}
          <div className="md:col-span-2">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-4">
              Work With Me
            </h5>
            <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed mb-4">
              Available for freelance projects, startup collaborations, and technical consulting.
            </p>
            <a
              href="https://www.upwork.com/freelancers/~013702dbb39e143318"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium text-white dark:text-[#0A1128] bg-[#0A1128] dark:bg-white px-4 py-2 rounded-lg hover:bg-[#1a2a4a] dark:hover:bg-white/90 transition-all"
            >
              <SiUpwork className="h-3.5 w-3.5" />
              Hire me
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200/50 dark:border-white/5 mt-12 pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 dark:text-white/40">
          <p>© {currentYear} Firabyte. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built by{' '}
            <a
              href="https://firatolin.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0A1128] dark:text-white/80 hover:underline transition-colors font-medium"
            >
              Firatol Esayas Tefera
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}