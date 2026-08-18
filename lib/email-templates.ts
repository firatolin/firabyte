import { Resend } from 'resend';

interface NewPostEmailData {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  author: string;
  date: string;
}

interface WelcomeEmailData {
  email: string;
  name?: string;
  token: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://firabyte.tech';
  }
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
};

export function getNewPostEmailHTML(data: NewPostEmailData, unsubscribeToken: string): string {
  const baseUrl = getBaseUrl();
  const postUrl = `${baseUrl}/posts/${data.slug}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Post: ${data.title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f7f7f7;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 580px;
          margin: 0 auto;
          padding: 40px 30px;
          background-color: #ffffff;
        }
        .header {
          padding-bottom: 20px;
          border-bottom: 1px solid #eaeaea;
        }
        .header h1 {
          font-size: 26px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .header .subtitle {
          font-size: 14px;
          color: #8a8a8a;
          margin: 4px 0 0;
        }
        .divider {
          height: 1px;
          background-color: #eaeaea;
          margin: 32px 0;
        }
        .divider-light {
          height: 1px;
          background-color: #f0f0f0;
          margin: 20px 0;
        }
        .content {
          padding: 8px 0;
        }
        .post-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px;
          text-decoration: none;
          line-height: 1.3;
          letter-spacing: -0.3px;
        }
        .post-title a {
          color: #1a1a1a;
          text-decoration: none;
        }
        .post-title a:hover {
          color: #0A1128;
        }
        .post-meta {
          color: #8a8a8a;
          font-size: 13px;
          margin-bottom: 16px;
        }
        .post-excerpt {
          font-size: 16px;
          line-height: 1.7;
          color: #3a3a3a;
          margin: 0 0 24px;
        }
        .cover-image {
          width: 100%;
          max-height: 320px;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 24px;
        }
        .btn {
          display: inline-block;
          padding: 12px 32px;
          background-color: #0A1128;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
          font-size: 15px;
          letter-spacing: 0.2px;
          border: 1px solid #0A1128;
        }
        .btn:hover {
          background-color: #1a2a4a;
          border-color: #1a2a4a;
        }
        .footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #eaeaea;
        }
        .footer-brand {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: -0.3px;
          margin: 0 0 4px;
        }
        .footer-tagline {
          font-size: 13px;
          color: #8a8a8a;
          margin: 0 0 16px;
        }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 16px 0 20px;
          flex-wrap: wrap;
        }
        .footer-links a {
          color: #4a4a4a;
          text-decoration: none;
          font-size: 13px;
        }
        .footer-links a:hover {
          color: #0A1128;
          text-decoration: underline;
        }
        .contact-section {
          background-color: #f8f8f8;
          padding: 20px 24px;
          border-radius: 6px;
          margin: 16px 0 20px;
        }
        .contact-section h3 {
          font-size: 13px;
          font-weight: 600;
          color: #4a4a4a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 12px;
        }
        .contact-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          font-size: 13px;
          color: #3a3a3a;
        }
        .contact-item .label {
          color: #8a8a8a;
          font-weight: 400;
        }
        .contact-item .value {
          color: #1a1a1a;
        }
        .contact-item .value a {
          color: #0A1128;
          text-decoration: none;
        }
        .contact-item .value a:hover {
          text-decoration: underline;
        }
        .footer-divider {
          width: 40px;
          height: 1px;
          background-color: #d0d0d0;
          margin: 20px auto;
        }
        .footer-about {
          font-size: 13px;
          color: #6a6a6a;
          line-height: 1.6;
          max-width: 420px;
          margin: 0 auto 12px;
          text-align: center;
        }
        .footer-about strong {
          color: #1a1a1a;
        }
        .social-links {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin: 12px 0 16px;
        }
        .social-links a {
          color: #6a6a6a;
          text-decoration: none;
          font-size: 13px;
        }
        .social-links a:hover {
          color: #0A1128;
          text-decoration: underline;
        }
        .button-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin: 8px 0 4px;
        }
        .btn-secondary {
          display: inline-block;
          padding: 10px 24px;
          background-color: transparent;
          color: #0A1128 !important;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
          font-size: 14px;
          border: 1px solid #d0d0d0;
        }
        .btn-secondary:hover {
          background-color: #f5f5f5;
          border-color: #b0b0b0;
        }
        .footer-unsubscribe {
          font-size: 12px;
          color: #b0b0b0;
          margin: 16px 0 0;
          text-align: center;
        }
        .footer-unsubscribe a {
          color: #8a8a8a;
          text-decoration: underline;
        }
        .footer-unsubscribe a:hover {
          color: #4a4a4a;
        }
        @media only screen and (max-width: 480px) {
          .container {
            padding: 24px 16px;
          }
          .post-title {
            font-size: 20px;
          }
          .btn {
            display: block;
            text-align: center;
          }
          .footer-links {
            gap: 14px;
          }
          .contact-item {
            flex-direction: column;
            align-items: flex-start;
            padding: 6px 0;
          }
          .contact-item .value {
            font-size: 13px;
            word-break: break-word;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Firabyte</h1>
          <p class="subtitle">New post from the blog</p>
        </div>

        <div class="content">
          ${data.coverImage ? `<img src="${data.coverImage}" alt="${data.title}" class="cover-image" />` : ''}

          <h2 class="post-title">
            <a href="${postUrl}">${data.title}</a>
          </h2>

          <div class="post-meta">
            ${data.author} &middot; ${new Date(data.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>

          <p class="post-excerpt">${data.excerpt}</p>

          <a href="${postUrl}" class="btn">Read the full post</a>
        </div>

        <div class="divider"></div>

        <div class="footer">
          <p class="footer-brand">Firabyte</p>
          <p class="footer-tagline">Tech insights for modern developers</p>

          <div class="footer-links">
            <a href="${baseUrl}/posts">Posts</a>
            <a href="${baseUrl}/about">About</a>
            <a href="https://firatolin.tech" target="_blank" rel="noopener">Portfolio</a>
            <a href="mailto:contact@firabyte.tech">Contact Blog</a>
          </div>

          <div class="divider-light"></div>

          <p class="footer-about">
            Firabyte is a tech blog by <strong>Firatol Esayas Tefera</strong>, a Full-Stack Software Engineer and AI Automation Engineer. I write about software development, artificial intelligence, cloud computing, and the future of technology.
          </p>

          <p class="footer-about" style="font-size: 12px; color: #8a8a8a;">
            Available for freelance projects, startup collaborations, and technical consulting.
          </p>

          <div class="contact-section">
            <h3>Contact & Connect</h3>
            
            <div class="contact-item">
              <span class="label">Blog Email</span>
              <span class="value"><a href="mailto:contact@firabyte.tech">contact@firabyte.tech</a></span>
            </div>
            <div class="contact-item">
              <span class="label">Personal Email</span>
              <span class="value"><a href="mailto:teferafiratolesayas@gmail.com">teferafiratolesayas@gmail.com</a></span>
            </div>
            <div class="contact-item">
              <span class="label">Alternative Email</span>
              <span class="value"><a href="mailto:contact@firatolin.tech">contact@firatolin.tech</a></span>
            </div>
            <div class="contact-item">
              <span class="label">WhatsApp</span>
              <span class="value"><a href="https://wa.me/251963535322">+251 963 535 322</a></span>
            </div>
          </div>

          <div class="social-links">
            <a href="https://www.linkedin.com/in/firatol-esayas-tefera" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://github.com/firatolin" target="_blank" rel="noopener">GitHub</a>
            <a href="https://firatolin.tech" target="_blank" rel="noopener">Portfolio</a>
            <a href="https://www.upwork.com/freelancers/~013702dbb39e143318" target="_blank" rel="noopener">Upwork</a>
          </div>

          <div class="button-group">
            <a href="https://firatolin.tech" target="_blank" rel="noopener" class="btn-secondary">View Portfolio</a>
            <a href="https://www.upwork.com/freelancers/~013702dbb39e143318" target="_blank" rel="noopener" class="btn-secondary">Hire on Upwork</a>
          </div>

          <div class="footer-divider"></div>

          <div class="footer-unsubscribe">
            You received this email because you subscribed to the Firabyte newsletter.
            <br>
            <a href="${baseUrl}/newsletter/unsubscribe/${unsubscribeToken}">Unsubscribe</a> &middot; 
            <a href="${baseUrl}">Visit the blog</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Get welcome email HTML
 */
export function getWelcomeEmailHTML(data: WelcomeEmailData): string {
  const baseUrl = getBaseUrl();
  const name = data.name || 'there';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Firabyte</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f7f7f7;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 580px;
          margin: 0 auto;
          padding: 40px 30px;
          background-color: #ffffff;
        }
        .header {
          padding-bottom: 20px;
          border-bottom: 1px solid #eaeaea;
          text-align: center;
        }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .header .subtitle {
          font-size: 14px;
          color: #8a8a8a;
          margin: 4px 0 0;
        }
        .divider {
          height: 1px;
          background-color: #eaeaea;
          margin: 32px 0;
        }
        .divider-light {
          height: 1px;
          background-color: #f0f0f0;
          margin: 20px 0;
        }
        .content {
          padding: 8px 0;
        }
        .welcome-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 16px;
          line-height: 1.3;
        }
        .welcome-text {
          font-size: 16px;
          line-height: 1.7;
          color: #3a3a3a;
          margin: 0 0 16px;
        }
        .welcome-text strong {
          color: #1a1a1a;
        }
        .btn {
          display: inline-block;
          padding: 12px 32px;
          background-color: #0A1128;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
          font-size: 15px;
          letter-spacing: 0.2px;
          border: 1px solid #0A1128;
        }
        .btn:hover {
          background-color: #1a2a4a;
          border-color: #1a2a4a;
        }
        .footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #eaeaea;
        }
        .footer-brand {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: -0.3px;
          margin: 0 0 4px;
        }
        .footer-tagline {
          font-size: 13px;
          color: #8a8a8a;
          margin: 0 0 16px;
        }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 16px 0 20px;
          flex-wrap: wrap;
        }
        .footer-links a {
          color: #4a4a4a;
          text-decoration: none;
          font-size: 13px;
        }
        .footer-links a:hover {
          color: #0A1128;
          text-decoration: underline;
        }
        .contact-section {
          background-color: #f8f8f8;
          padding: 20px 24px;
          border-radius: 6px;
          margin: 16px 0 20px;
        }
        .contact-section h3 {
          font-size: 13px;
          font-weight: 600;
          color: #4a4a4a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 12px;
        }
        .contact-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          font-size: 13px;
          color: #3a3a3a;
        }
        .contact-item .label {
          color: #8a8a8a;
          font-weight: 400;
        }
        .contact-item .value {
          color: #1a1a1a;
        }
        .contact-item .value a {
          color: #0A1128;
          text-decoration: none;
        }
        .contact-item .value a:hover {
          text-decoration: underline;
        }
        .footer-divider {
          width: 40px;
          height: 1px;
          background-color: #d0d0d0;
          margin: 20px auto;
        }
        .footer-about {
          font-size: 13px;
          color: #6a6a6a;
          line-height: 1.6;
          max-width: 420px;
          margin: 0 auto 12px;
          text-align: center;
        }
        .footer-about strong {
          color: #1a1a1a;
        }
        .social-links {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin: 12px 0 16px;
        }
        .social-links a {
          color: #6a6a6a;
          text-decoration: none;
          font-size: 13px;
        }
        .social-links a:hover {
          color: #0A1128;
          text-decoration: underline;
        }
        .button-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin: 8px 0 4px;
        }
        .btn-secondary {
          display: inline-block;
          padding: 10px 24px;
          background-color: transparent;
          color: #0A1128 !important;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
          font-size: 14px;
          border: 1px solid #d0d0d0;
        }
        .btn-secondary:hover {
          background-color: #f5f5f5;
          border-color: #b0b0b0;
        }
        .footer-unsubscribe {
          font-size: 12px;
          color: #b0b0b0;
          margin: 16px 0 0;
          text-align: center;
        }
        .footer-unsubscribe a {
          color: #8a8a8a;
          text-decoration: underline;
        }
        .footer-unsubscribe a:hover {
          color: #4a4a4a;
        }
        @media only screen and (max-width: 480px) {
          .container {
            padding: 24px 16px;
          }
          .btn {
            display: block;
            text-align: center;
          }
          .footer-links {
            gap: 14px;
          }
          .contact-item {
            flex-direction: column;
            align-items: flex-start;
            padding: 6px 0;
          }
          .contact-item .value {
            font-size: 13px;
            word-break: break-word;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Firabyte</h1>
          <p class="subtitle">Welcome to the community</p>
        </div>

        <div class="content">
          <h2 class="welcome-title">Hello, ${name}! 👋</h2>

          <p class="welcome-text">
            Thank you for subscribing to <strong>Firabyte</strong> — a tech blog dedicated to exploring software development, artificial intelligence, cloud computing, and the future of technology.
          </p>

          <p class="welcome-text">
            You'll now receive updates whenever I publish new posts, tutorials, and insights. I'm excited to have you on this journey!
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${baseUrl}" class="btn">Explore the Blog</a>
          </div>
        </div>

        <div class="divider"></div>

        <div class="footer">
          <p class="footer-brand">Firabyte</p>
          <p class="footer-tagline">Tech insights for modern developers</p>

          <div class="footer-links">
            <a href="${baseUrl}/posts">Posts</a>
            <a href="${baseUrl}/about">About</a>
            <a href="https://firatolin.tech" target="_blank" rel="noopener">Portfolio</a>
            <a href="mailto:contact@firabyte.tech">Contact Blog</a>
          </div>

          <div class="divider-light"></div>

          <p class="footer-about">
            Firabyte is a tech blog by <strong>Firatol Esayas Tefera</strong>, a Full-Stack Software Engineer and AI Automation Engineer. I write about software development, artificial intelligence, cloud computing, and the future of technology.
          </p>

          <p class="footer-about" style="font-size: 12px; color: #8a8a8a;">
            Available for freelance projects, startup collaborations, and technical consulting.
          </p>

          <div class="contact-section">
            <h3>Contact & Connect</h3>
            
            <div class="contact-item">
              <span class="label">Blog Email</span>
              <span class="value"><a href="mailto:contact@firabyte.tech">contact@firabyte.tech</a></span>
            </div>
            <div class="contact-item">
              <span class="label">Personal Email</span>
              <span class="value"><a href="mailto:teferafiratolesayas@gmail.com">teferafiratolesayas@gmail.com</a></span>
            </div>
            <div class="contact-item">
              <span class="label">Alternative Email</span>
              <span class="value"><a href="mailto:contact@firatolin.tech">contact@firatolin.tech</a></span>
            </div>
            <div class="contact-item">
              <span class="label">WhatsApp</span>
              <span class="value"><a href="https://wa.me/251963535322">+251 963 535 322</a></span>
            </div>
          </div>

          <div class="social-links">
            <a href="https://www.linkedin.com/in/firatol-esayas-tefera" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://github.com/firatolin" target="_blank" rel="noopener">GitHub</a>
            <a href="https://firatolin.tech" target="_blank" rel="noopener">Portfolio</a>
            <a href="https://www.upwork.com/freelancers/~013702dbb39e143318" target="_blank" rel="noopener">Upwork</a>
          </div>

          <div class="button-group">
            <a href="https://firatolin.tech" target="_blank" rel="noopener" class="btn-secondary">View Portfolio</a>
            <a href="https://www.upwork.com/freelancers/~013702dbb39e143318" target="_blank" rel="noopener" class="btn-secondary">Hire on Upwork</a>
          </div>

          <div class="footer-divider"></div>

          <div class="footer-unsubscribe">
            You received this email because you subscribed to the Firabyte newsletter.
            <br>
            <a href="${baseUrl}/newsletter/unsubscribe/${data.token}">Unsubscribe</a> &middot; 
            <a href="${baseUrl}">Visit the blog</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send welcome email to new subscriber
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  try {
    const html = getWelcomeEmailHTML(data);
    const fromEmail = process.env.NEWSLETTER_EMAIL || 'newsletter@firabyte.tech';

    await resend.emails.send({
      from: `Firabyte <${fromEmail}>`,
      to: data.email,
      subject: 'Welcome to Firabyte!',
      html: html,
    });
    
    console.log(` Welcome email sent to ${data.email}`);
  } catch (error) {
    console.error(` Failed to send welcome email to ${data.email}:`, error);
    throw error;
  }
}

/**
 * Send new post notification to all active subscribers
 */
export async function sendNewPostNotification(postData: NewPostEmailData): Promise<void> {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    const subscribers = await prisma.subscriber.findMany({
      where: { status: 'ACTIVE' },
    });

    if (subscribers.length === 0) {
      console.log('No active subscribers to notify');
      return;
    }

    console.log(`Sending new post notification to ${subscribers.length} subscribers...`);

    const emailPromises = subscribers.map(async (subscriber) => {
      if (!subscriber.token) return;

      const html = getNewPostEmailHTML(postData, subscriber.token);
      const fromEmail = process.env.NEWSLETTER_EMAIL || 'newsletter@firabyte.tech';

      try {
        await resend.emails.send({
          from: `Firabyte <${fromEmail}>`,
          to: subscriber.email,
          subject: `New post: ${postData.title}`,
          html: html,
        });
        console.log(` Email sent to ${subscriber.email}`);
      } catch (error) {
        console.error(` Failed to send email to ${subscriber.email}:`, error);
      }
    });

    await Promise.all(emailPromises);
    console.log(` New post notification sent to ${subscribers.length} subscribers`);
  } catch (error) {
    console.error('Error sending newsletter:', error);
    throw error;
  }
}