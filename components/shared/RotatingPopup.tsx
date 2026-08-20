'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaTimes, FaUser, FaEnvelope, FaRocket, FaBrain, FaCode, FaRobot } from 'react-icons/fa';
import { SiUpwork } from 'react-icons/si';

interface PopupContent {
  id: string;
  type: 'profile' | 'subscribe';
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image?: string;
  icon: React.ReactNode;
}

export function RotatingPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentContent, setCurrentContent] = useState<PopupContent | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const contents: PopupContent[] = [
    {
      id: 'subscribe',
      type: 'subscribe',
      title: 'Stay in the Loop',
      subtitle: 'Get the latest tech insights',
      description: 'Subscribe to the Firabyte newsletter and never miss a post. Delivered straight to your inbox.',
      buttonText: 'Subscribe Now',
      buttonLink: '#subscribe',
      icon: <FaEnvelope className="h-6 w-6" />,
    },
    {
      id: 'profile',
      type: 'profile',
      title: 'Firatol Esayas Tefera',
      subtitle: 'Software Engineer | Generative AI | Full-Stack',
      description: 'Building AI-powered web applications with RAG, LLMs, and modern full-stack technologies. Available for freelance projects and technical consulting.',
      buttonText: 'View Portfolio',
      buttonLink: 'https://firatolin.tech',
      icon: <FaUser className="h-6 w-6" />,
      image: '/images/man.jpg',
    },
    {
      id: 'ai-services',
      type: 'profile',
      title: 'AI & Automation Services',
      subtitle: 'Generative AI | RAG | Workflow Automation',
      description: 'I build intelligent AI solutions including RAG systems, AI agents, LLM-powered applications, and automated workflows for businesses.',
      buttonText: 'Learn More',
      buttonLink: 'https://firatolin.tech',
      icon: <FaBrain className="h-6 w-6" />,
    },
    {
      id: 'fullstack',
      type: 'profile',
      title: 'Full-Stack Development',
      subtitle: 'Modern Web Applications',
      description: 'End-to-end development with React, Next.js, Node.js, and PostgreSQL. Scalable, performant, and user-centered digital products.',
      buttonText: 'View Projects',
      buttonLink: 'https://firatolin.tech',
      icon: <FaCode className="h-6 w-6" />,
    },
  ];

  const initialTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initialTimerRef.current = setTimeout(() => {
      setCurrentContent(contents[0]);
      setCurrentIndex(0);
      setIsVisible(true);
      setHasBeenShown(true);
    }, 3000);

    return () => {
      if (initialTimerRef.current) {
        clearTimeout(initialTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !currentContent) return;

    if (rotationTimerRef.current) {
      clearInterval(rotationTimerRef.current);
    }

    rotationTimerRef.current = setInterval(() => {
      setIsClosing(true);
      
      setTimeout(() => {
        const nextIndex = (currentIndex + 1) % contents.length;
        setCurrentContent(contents[nextIndex]);
        setCurrentIndex(nextIndex);
        setIsClosing(false);
      }, 300);
    }, 30000);

    return () => {
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
      }
    };
  }, [isVisible, currentContent, currentIndex, contents]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
      }
    }, 300);
  };

  if (!isVisible || !currentContent) return null;

  return (
    <>
      {/* Full Screen Popup (First Visit) */}
      {!hasBeenShown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative max-w-md w-full bg-background border border-border rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Close popup"
            >
              <FaTimes className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="text-center">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {currentContent.icon}
              </div>
              
              <h2 className="text-2xl font-serif font-bold mb-2">{currentContent.title}</h2>
              <p className="text-sm text-primary font-medium mb-2">{currentContent.subtitle}</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {currentContent.description}
              </p>

              <div className="space-y-3">
                {currentContent.id === 'subscribe' ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
                      if (emailInput?.value) {
                        console.log('Subscribe:', emailInput.value);
                        handleClose();
                      }
                    }}
                    className="space-y-3"
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      Subscribe
                    </button>
                  </form>
                ) : (
                  <>
                    <a
                      href={currentContent.buttonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      <FaRocket className="h-4 w-4" />
                      {currentContent.buttonText}
                    </a>
                    <a
                      href="https://www.upwork.com/freelancers/~013702dbb39e143318"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium text-sm"
                    >
                      <SiUpwork className="h-4 w-4" />
                      Hire me on Upwork
                    </a>
                  </>
                )}
              </div>

              <button
                onClick={handleClose}
                className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Right Popup (After First Visit) */}
      {hasBeenShown && (
        <div
          className={`fixed bottom-6 right-6 z-50 max-w-sm w-full bg-background border border-border rounded-2xl shadow-2xl transition-all duration-300 ${
            isClosing ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
          }`}
          style={{ minWidth: '280px', maxWidth: '380px' }}
        >
          <div className="p-5">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Close popup"
            >
              <FaTimes className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              {/* Avatar/Icon */}
              <div className="shrink-0">
                {currentContent.image ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                    <Image
                      src={currentContent.image}
                      alt={currentContent.title}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {currentContent.icon}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate">
                  {currentContent.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {currentContent.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {currentContent.id === 'subscribe' ? (
                    <button
                      onClick={() => {
                        document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
                        handleClose();
                      }}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Subscribe →
                    </button>
                  ) : (
                    <a
                      href={currentContent.buttonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      {currentContent.id === 'ai-services' ? 'Learn More →' : 'View Portfolio →'}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}