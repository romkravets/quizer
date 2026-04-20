import { NextResponse } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region') || 'Україна';
  const score = searchParams.get('score') || '0';
  const correct = searchParams.get('correct') || '0';
  const total = searchParams.get('total') || '0';
  const userName = searchParams.get('name') || 'Гравець';

  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200',
            height: '630',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #e6b740 0%, #99af5d 50%, #62a1a9 100%)',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '24px',
              padding: '48px 64px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              maxWidth: '900px',
            }}
          >
            <div style={{ fontSize: '72px', marginBottom: '16px', display: 'flex' }}>🇺🇦</div>
            <div
              style={{
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '8px',
                display: 'flex',
              }}
            >
              Квізи України
            </div>
            <div
              style={{
                fontSize: '28px',
                color: '#666',
                marginBottom: '24px',
                display: 'flex',
              }}
            >
              {userName} — {region}
            </div>
            <div
              style={{
                display: 'flex',
                gap: '32px',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px 32px',
                  background: '#e6b740',
                  borderRadius: '16px',
                }}
              >
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#333', display: 'flex' }}>
                  {score}%
                </div>
                <div style={{ fontSize: '18px', color: '#555', display: 'flex' }}>Результат</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px 32px',
                  background: '#99af5d',
                  borderRadius: '16px',
                  color: 'white',
                }}
              >
                <div style={{ fontSize: '48px', fontWeight: 'bold', display: 'flex' }}>
                  {correct}/{total}
                </div>
                <div style={{ fontSize: '18px', display: 'flex' }}>Правильних</div>
              </div>
            </div>
            <div
              style={{
                marginTop: '24px',
                fontSize: '20px',
                color: '#999',
                display: 'flex',
              }}
            >
              uaquiz.vercel.app
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
