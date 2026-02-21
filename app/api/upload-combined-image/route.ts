import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobId = formData.get('jobId') as string;

    if (!file || !jobId) {
      return NextResponse.json(
        { error: 'Combined image file and jobId are required' },
        { status: 400 }
      );
    }

    // console.log('📤 Uploading combined image to Cloudinary...');

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload combined image to Cloudinary with jobId folder structure
    const upload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: `Alzia/${jobId}`,
          public_id: 'combined',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('❌ Combined upload error:', error);
            reject(error);
          } else {
            console.log('✅ Combined uploaded:', result?.secure_url);
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      url: (upload as any).secure_url,
    });
  } catch (error) {
    console.error('❌ Upload combined image error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload combined image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}