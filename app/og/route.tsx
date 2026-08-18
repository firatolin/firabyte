import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const title = url.searchParams.get('title') || 'Firabyte';
    const excerpt = url.searchParams.get('excerpt') || 'Tech insights for modern developers';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#0A1128',
            padding: '60px 80px',
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: '#ffffff',
              opacity: 0.6,
              marginBottom: 20,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Firabyte
          </div>

          <div
            style={{
              fontSize: 56,
              fontWeight: 'bold',
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: 20,
              maxWidth: '80%',
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 26,
              color: '#a0aec0',
              maxWidth: '70%',
              lineHeight: 1.4,
            }}
          >
            {excerpt}
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 40,
              left: 80,
              right: 80,
              height: 3,
              background: 'linear-gradient(90deg, #ffffff 0%, #1a2a4a 100%)',
              opacity: 0.3,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image error:', error);
    return new Response('OG Image generation failed', { status: 500 });
  }
}