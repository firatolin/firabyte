import type { Metadata } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './providers';
import SessionProviderWrapper from './session-provider';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Toaster } from '@/components/ui/toaster';
import { BackToTop } from '@/components/ui/BackToTop';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://firabyte.com'),
  title: {
    default: 'Firabyte - Tech Blog by Firatol Esayas',
    template: '%s | Firabyte',
  },
  description: 'Tech insights for modern developers. Exploring software, AI, cloud, and everything in between. Blog by Firatol Esayas, Full-Stack Software Engineer & AI Automation Engineer.',
  keywords: ['tech blog', 'software development', 'AI', 'cloud computing', 'programming', 'Firatol Esayas', 'full-stack developer', 'AI automation'],
  authors: [{ name: 'Firatol Esayas Tefera' }],
  creator: 'Firatol Esayas Tefera',
  publisher: 'Firabyte',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://firabyte.com',
    siteName: 'Firabyte',
    title: 'Firabyte - Tech Blog by Firatol Esayas',
    description: 'Tech insights for modern developers. Exploring software, AI, cloud, and everything in between.',
    images: [
      {
        url: '/og/home?title=Firabyte&excerpt=Tech+insights+for+modern+developers',
        width: 1200,
        height: 630,
        alt: 'Firabyte',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Firabyte - Tech Blog by Firatol Esayas',
    description: 'Tech insights for modern developers.',
    images: ['/og/home?title=Firabyte&excerpt=Tech+insights+for+modern+developers'],
    site: '@firatolin_',
    creator: '@firatolin_',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
  alternates: {
    canonical: 'https://firabyte.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD for Person */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Firatol Esayas Tefera',
              jobTitle: 'Software Engineer, Full-Stack Developer, AI Automation Engineer',
              worksFor: {
                '@type': 'Organization',
                name: 'Firabyte',
              },
              url: 'https://firatolin.tech',
              image: 'https://firatolin.tech/images/man.jpg',
              sameAs: [
                'https://linkedin.com/in/firatol-esayas-tefera',
                'https://github.com/firatolin',
                'https://twitter.com/firatolin_',
                'https://www.upwork.com/freelancers/~013702dbb39e143318',
              ],
            }),
          }}
        />
        
        {/* JSON-LD for Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Firabyte',
              url: 'https://firabyte.com',
              description: 'Tech insights for modern developers',
              author: {
                '@type': 'Person',
                name: 'Firatol Esayas Tefera',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${sourceSerif.variable} antialiased`}>
        <SessionProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col">
              <Header />
              <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
              </main>
              <Footer />
              <BackToTop />
              <Toaster />
            </div>
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}