// app/api/tryon-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Store temporary tokens in memory (in production, use Redis)
const tempTokens = new Map<string, { 
  imageUrl: string; 
  expiresAt: number; 
  used: boolean;
  downloads: number;
}>();

// Cleanup expired tokens every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [token, data] of tempTokens.entries()) {
      if (data.expiresAt < now || data.used) {
        tempTokens.delete(token);
      }
    }
  }, 5 * 60 * 1000);
}

// GET - Serve image with token
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    // Verify token
    const tokenData = tempTokens.get(token);
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
    }

    if (tokenData.used) {
      return NextResponse.json({ error: 'Token already used' }, { status: 403 });
    }

    if (tokenData.expiresAt < Date.now()) {
      tempTokens.delete(token);
      return NextResponse.json({ error: 'Token expired' }, { status: 403 });
    }

    // Increment download counter and mark as used after first download
    tokenData.downloads++;
    if (tokenData.downloads >= 1) {
      tokenData.used = true;
    }

    // Fetch image from source URL
    const imageResponse = await fetch(tokenData.imageUrl);
    
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    // Return image with proper headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Disposition': 'inline; filename="virtual-tryon-result.png"',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Generate temporary token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, expiresInMinutes = 10 } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL required' }, { status: 400 });
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Token expires in specified minutes (default 10)
    const expiresAt = Date.now() + (expiresInMinutes * 60 * 1000);

    // Store token
    tempTokens.set(token, {
      imageUrl,
      expiresAt,
      used: false,
      downloads: 0,
    });

    const proxyUrl = `/api/tryon-image?token=${token}`;

    console.log('🔒 Generated token for image:', { token: token.substring(0, 8) + '...', expiresAt });

    return NextResponse.json({
      token,
      url: proxyUrl,
      expiresAt,
      expiresIn: `${expiresInMinutes} minutes`,
    });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}