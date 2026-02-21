import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, jobId } = body;

    if (!imageUrl || !jobId) {
      return NextResponse.json(
        { error: 'Image URL and jobId are required' },
        { status: 400 }
      );
    }

    // console.log('📤 Uploading output image to Cloudinary...');

    // Upload output image from URL to Cloudinary with jobId folder structure
    const upload = await cloudinary.uploader.upload(imageUrl, {
      folder: `Alzia/${jobId}`,
      public_id: 'output',
      resource_type: 'image',
    });

    // console.log('✅ Output uploaded:', upload.secure_url);

    return NextResponse.json({
      url: upload.secure_url,
    });
  } catch (error) {
    console.error('❌ Upload output image error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload output image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}