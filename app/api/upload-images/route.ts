import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const garmentFile = formData.get('garment') as File;
    const personFile = formData.get('person') as File;

    if (!garmentFile || !personFile) {
      return NextResponse.json(
        { error: 'Both garment and person images are required' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const garmentBuffer = Buffer.from(await garmentFile.arrayBuffer());
    const personBuffer = Buffer.from(await personFile.arrayBuffer());

    // Upload garment to Cloudinary
    const garmentUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'virtual-tryon/garments',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(garmentBuffer);
    });

    // Upload person to Cloudinary
    const personUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'virtual-tryon/persons',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(personBuffer);
    });

    console.log('✅ Images uploaded to Cloudinary');

    return NextResponse.json({
      garmentUrl: (garmentUpload as any).secure_url,
      personUrl: (personUpload as any).secure_url,
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}