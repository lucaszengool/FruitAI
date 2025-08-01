import { NextRequest, NextResponse } from 'next/server';

interface ShareData {
  id: string;
  results: any[];
  capturedImage?: string;
  timestamp: string;
  expiresAt: string;
}

// In-memory storage for demo (in production, use a database)
const shareStorage = new Map<string, ShareData>();

// Clean up expired shares periodically
setInterval(() => {
  const now = new Date().getTime();
  for (const [id, data] of shareStorage.entries()) {
    if (new Date(data.expiresAt).getTime() < now) {
      shareStorage.delete(id);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour

export async function POST(request: NextRequest) {
  try {
    const { results, capturedImage } = await request.json();
    
    if (!results || !Array.isArray(results)) {
      return NextResponse.json({ error: 'Invalid results data' }, { status: 400 });
    }

    // Generate a unique share ID
    const shareId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Set expiration to 7 days from now
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const shareData: ShareData = {
      id: shareId,
      results,
      capturedImage,
      timestamp: new Date().toISOString(),
      expiresAt
    };
    
    shareStorage.set(shareId, shareData);
    
    console.log(`📤 Created share link: ${shareId}`);
    
    return NextResponse.json({ 
      shareId, 
      shareUrl: `${request.nextUrl.origin}/shared/${shareId}`,
      expiresAt 
    });
    
  } catch (error) {
    console.error('Error creating share:', error);
    return NextResponse.json({ error: 'Failed to create share' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get('id');
    
    if (!shareId) {
      return NextResponse.json({ error: 'Share ID required' }, { status: 400 });
    }
    
    const shareData = shareStorage.get(shareId);
    
    if (!shareData) {
      return NextResponse.json({ error: 'Share not found or expired' }, { status: 404 });
    }
    
    // Check if expired
    if (new Date(shareData.expiresAt).getTime() < new Date().getTime()) {
      shareStorage.delete(shareId);
      return NextResponse.json({ error: 'Share has expired' }, { status: 410 });
    }
    
    console.log(`📥 Retrieved share: ${shareId}`);
    
    return NextResponse.json(shareData);
    
  } catch (error) {
    console.error('Error retrieving share:', error);
    return NextResponse.json({ error: 'Failed to retrieve share' }, { status: 500 });
  }
}