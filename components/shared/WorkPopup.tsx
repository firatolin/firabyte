'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SiUpwork } from 'react-icons/si';
import { FaEnvelope } from 'react-icons/fa';
import { X } from 'lucide-react';

export function WorkPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Show popup immediately on load
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
      setIsInitialLoad(false);
    }, 3000); // Show after 3 seconds on load

    return () => clearTimeout(initialTimer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    
    // Set timer to show again after 5 minutes
    if (!isInitialLoad) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300000); // 5 minutes
      
      return () => clearTimeout(timer);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative max-w-md w-full bg-background border border-border rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close popup"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Profile Image */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary/20">
            <Image
              src="/images/man.jpg"
              alt="Firatol Esayas Tefera"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          
          <h2 className="text-2xl font-serif font-bold mb-2">Let&apos;s Build Together</h2>
          <p className="text-muted-foreground mb-6">
            I&apos;m available for freelance projects, startup collaborations, and technical consulting. 
            Let&apos;s build something amazing together.
          </p>

          <div className="space-y-3">
            <a
              href="https://www.upwork.com/freelancers/~013702dbb39e143318"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <SiUpwork className="h-5 w-5" />
              Hire me on Upwork
            </a>
            
            <a
              href="mailto:teferafiratolesayas@gmail.com"
              className="flex items-center justify-center gap-3 w-full px-6 py-3 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
            >
              <FaEnvelope className="h-5 w-5" />
              Contact me directly
            </a>
          </div>

          <button
            onClick={handleClose}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}