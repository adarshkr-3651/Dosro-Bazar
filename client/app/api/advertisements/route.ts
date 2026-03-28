import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

export async function GET() {
  try {
    // 1. Try to fetch from backend first
    try {
      const response = await fetch(`${BACKEND_URL}/advertisements?status=running&placement=main_banner`, {
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      const data = await response.json();

      if (data.success && data.ads && data.ads.length > 0) {
        // Transform backend ads to simple image array for current HeroBanner compatibility
        const images = data.ads.map((ad: any) => ad.imageUrl);
        return NextResponse.json({ images, ads: data.ads });
      }
    } catch (apiError) {
      console.warn('Backend advertisement fetch failed, falling back to local files:', apiError);
    }

    // 2. Fallback to local 'public/advertisement' directory
    const adDirectory = path.join(process.cwd(), 'public', 'advertisement');

    if (!fs.existsSync(adDirectory)) {
      return NextResponse.json({ images: [] });
    }

    const files = fs.readdirSync(adDirectory);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.jfif', '.avif'];

    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map(file => `/advertisement/${file}`);

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error in advertisement route:', error);
    return NextResponse.json({ error: 'Failed to load advertisements', images: [] }, { status: 500 });
  }
}
