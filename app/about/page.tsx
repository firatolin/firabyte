
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiUpwork } from 'react-icons/si';
import { FaGlobe } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold mb-4">About Firabyte</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A tech blog exploring software development, AI, cloud computing, and everything in between.
        </p>
      </header>

      {/* About the Blog */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif font-bold mb-4">What is Firabyte?</h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>
            <strong>Firabyte</strong> is a technology blog dedicated to sharing insights, 
            tutorials, and thoughts about the ever-evolving world of software development 
            and technology.
          </p>
          <p>
            Whether you&apos;re a seasoned developer or just starting your journey, 
            you&apos;ll find content here to help you learn, grow, and stay inspired.
          </p>
        </div>
      </section>

      {/* What We Write About */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif font-bold mb-4">What We Write About</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold mb-1">Web Development</h3>
            <p className="text-sm text-muted-foreground">
              React, Next.js, TypeScript, and modern frontend practices.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold mb-1">AI & Machine Learning</h3>
            <p className="text-sm text-muted-foreground">
              LLMs, AI agents, RAG, and practical AI applications.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold mb-1">Cloud & DevOps</h3>
            <p className="text-sm text-muted-foreground">
              Deployment, CI/CD, Docker, and cloud infrastructure.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold mb-1">Software Architecture</h3>
            <p className="text-sm text-muted-foreground">
              Design patterns, system design, and best practices.
            </p>
          </div>
        </div>
      </section>

      {/* About the Author */}
      <section className="mb-12 p-6 border border-border rounded-xl bg-accent/10">
        <h2 className="text-2xl font-serif font-bold mb-3">About the Author</h2>
        <p className="text-muted-foreground mb-4">
          Hi, I&apos;m <strong className="text-foreground">Firatol Esayas Tefera</strong> — 
          a Full-Stack Software Engineer passionate about building AI-powered web applications 
          and sharing knowledge with the developer community.
        </p>
        <p className="text-muted-foreground mb-4">
          I created Firabyte to document my learning journey, share insights from my projects, 
          and contribute to the tech community. When I&apos;m not coding, I&apos;m exploring new 
          technologies, contributing to open source, or writing about tech.
        </p>
        
        <div className="flex flex-wrap gap-3">
        <a
            href="https://firatolin.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
          >
            <FaGlobe className="h-4 w-4" />
            Portfolio
          </a>
          <a
            href="https://github.com/firatolin"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
          >
            <FaGithub className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/firatol-esayas-tefera"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
          >
            <FaLinkedin className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href="https://x.com/firatolin_"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
          >
            <FaXTwitter className="h-4 w-4" />
            X
          </a>
          <a
            href="mailto:contact@firatolin.tech"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
          >
            <FaEnvelope className="h-4 w-4" />
            Email
          </a>
        </div>
      </section>

      {/* Hire Me / Work Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif font-bold mb-4">Work With Me</h2>
        <div className="p-6 border border-border rounded-lg">
          <p className="text-muted-foreground mb-4">
            I&apos;m available for freelance projects, startup collaborations, and technical consulting. 
            Let&apos;s build something amazing together.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.upwork.com/freelancers/~013702dbb39e143318"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <SiUpwork className="h-4 w-4" />
              Hire me on Upwork
            </a>
            <a
              href="mailto:contact@firatolin.tech"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
            >
              <FaEnvelope className="h-4 w-4" />
              Contact me directly
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="text-center p-4 border border-border rounded-lg">
          <div className="text-3xl font-serif font-bold text-primary">1</div>
          <div className="text-sm text-muted-foreground">Posts Published</div>
        </div>
        <div className="text-center p-4 border border-border rounded-lg">
          <div className="text-3xl font-serif font-bold text-primary">0</div>
          <div className="text-sm text-muted-foreground">Monthly Readers</div>
        </div>
        <div className="text-center p-4 border border-border rounded-lg">
          <div className="text-3xl font-serif font-bold text-primary">0</div>
          <div className="text-sm text-muted-foreground">Subscribers</div>
        </div>
      </section>
    </div>
  );
}