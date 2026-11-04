import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Firabyte - how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
      <h1 className="text-4xl font-serif font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        <strong>Last updated:</strong> November 2026
      </p>

      <p>
        This Privacy Policy describes how <strong>Firabyte</strong> (&quot;we&quot;,
        &quot;us&quot;, or &quot;our&quot;) collects, uses, and shares information
        about you when you visit{' '}
        <a href="https://firabyte.tech" className="text-primary">
          https://firabyte.tech
        </a>{' '}
        (the &quot;Site&quot;).
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We collect two types of information: information you provide directly to
        us, and information collected automatically when you use the Site.
      </p>

      <h3>Information you provide directly</h3>
      <ul>
        <li>
          <strong>Newsletter subscription:</strong> If you subscribe to our
          newsletter, we collect your <strong>email address</strong> and
          optionally your <strong>name</strong>. This information is stored
          securely and used only to send you updates about new blog posts.
        </li>
        <li>
          <strong>Comments:</strong> When you leave a comment on a blog post, we
          collect your <strong>name</strong>, <strong>email address</strong>, and
          optionally your <strong>website URL</strong>. If you are signed in, we
          also associate the comment with your account.
        </li>
      </ul>

      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Cookies and similar technologies:</strong> We use cookies to
          remember your theme preference (dark or light mode), keep you signed
          in, and support analytics and advertising.
        </li>
        <li>
          <strong>Usage data:</strong> We may collect information such as your
          IP address, browser type, device type, pages visited, and time spent on
          pages to understand how the Site is used.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Deliver blog posts, comments, and newsletters you have requested</li>
        <li>Improve and maintain the Site</li>
        <li>Display relevant advertising (see Section 4 below)</li>
        <li>Respond to your comments, questions, or requests</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>3. Cookies</h2>
      <p>
        Cookies are small text files stored on your device. We use cookies for
        the following purposes:
      </p>
      <ul>
        <li>
          <strong>Essential cookies:</strong> Required for the Site to function
          (e.g. remembering your theme preference, keeping you signed in).
        </li>
        <li>
          <strong>Analytics cookies:</strong> Help us understand how visitors
          interact with the Site.
        </li>
        <li>
          <strong>Advertising cookies:</strong> Used by Google AdSense to serve
          relevant ads.
        </li>
      </ul>
      <p>
        You can disable cookies in your browser settings. Note that disabling
        cookies may affect certain features of the Site.
      </p>

      <h2>4. Third-Party Advertising (Google AdSense)</h2>
      <p>
        We participate in the <strong>Google AdSense</strong> program. Google, as
        a third-party vendor, uses cookies to serve ads on the Site.
      </p>
      <ul>
        <li>
          Google&apos;s use of advertising cookies enables it and its partners to
          serve ads to you based on your visit to this Site and/or other sites on
          the internet.
        </li>
        <li>
          You may opt out of personalized advertising by visiting{' '}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            Google Ads Settings
          </a>
          .
        </li>
        <li>
          You may also opt out of some third-party vendors&apos; use of cookies
          for personalized advertising by visiting{' '}
          <a
            href="https://www.aboutads.info"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            www.aboutads.info
          </a>
          .
        </li>
      </ul>

      <h2>5. Third-Party Services</h2>
      <p>
        We use the following third-party services that may collect information
        about you:
      </p>
      <ul>
        <li>
          <strong>Google AdSense</strong> — advertising (see{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            Google&apos;s Privacy Policy
          </a>
          )
        </li>
        <li>
          <strong>Cloudinary</strong> — image hosting
        </li>
        <li>
          <strong>Resend</strong> — email delivery for newsletters
        </li>
        <li>
          <strong>Vercel</strong> — hosting and analytics
        </li>
      </ul>

      <h2>6. Data Retention</h2>
      <p>
        We retain your information for as long as needed to provide our services
        or as required by law. Newsletter subscriber data is retained until you
        unsubscribe. Comment data is retained until the associated post or the
        comment is deleted.
      </p>

      <h2>7. Your Rights</h2>
      <p>Depending on your location, you may have the right to:</p>
      <ul>
        <li>Access the personal information we hold about you</li>
        <li>Request correction or deletion of your personal information</li>
        <li>Unsubscribe from our newsletter at any time</li>
        <li>Opt out of personalized advertising (see Section 4)</li>
      </ul>
      <p>
        To exercise any of these rights, please contact us at{' '}
        <a href="mailto:contact@firabyte.tech" className="text-primary">
          contact@firabyte.tech
        </a>
        .
      </p>

      <h2>8. Children&apos;s Privacy</h2>
      <p>
        The Site is not directed at children under the age of 13. We do not
        knowingly collect personal information from children under 13. If you
        believe we have collected such information, please contact us so we can
        delete it.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The &quot;Last
        updated&quot; date at the top of this page reflects the most recent
        revision. Continued use of the Site after changes are posted constitutes
        your acceptance of the updated policy.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us:
      </p>
      <ul>
        <li>
          Email:{' '}
          <a href="mailto:contact@firabyte.tech" className="text-primary">
            contact@firabyte.tech
          </a>
        </li>
        <li>
          Website:{' '}
          <a href="https://firabyte.tech" className="text-primary">
            https://firabyte.tech
          </a>
        </li>
      </ul>

      <hr className="my-12 border-border" />

      <p className="text-center">
        <Link href="/" className="text-primary no-underline hover:underline">
          ← Back to Home
        </Link>
      </p>
    </article>
  );
}