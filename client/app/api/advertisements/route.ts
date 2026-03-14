import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const adDirectory = path.join(process.cwd(), 'public', 'advertisement');
    
    // Check if directory exists
    if (!fs.existsSync(adDirectory)) {
      return NextResponse.json({ images: [] });
    }

    const files = fs.readdirSync(adDirectory);
    
    // Supported image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.jfif', '.avif'];
    
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map(file => `/advertisement/${file}`);

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error reading advertisement directory:', error);
    return NextResponse.json({ error: 'Failed to load advertisements', images: [] }, { status: 500 });
  }
}
