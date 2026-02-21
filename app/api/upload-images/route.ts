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
    const garmentFile = formData.get('garment') as File;
    const personFile = formData.get('person') as File;
    const jobId = formData.get('jobId') as string;

    if (!garmentFile || !personFile || !jobId) {
      return NextResponse.json(
        { error: 'Garment, person images and jobId are required' },
        { status: 400 }
      );
    }

    // console.log('📤 Uploading garment and person images to Cloudinary...');

    // Convert File to Buffer
    const garmentBuffer = Buffer.from(await garmentFile.arrayBuffer());
    const personBuffer = Buffer.from(await personFile.arrayBuffer());

    // Upload garment to Cloudinary with jobId folder structure
    const garmentUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: `Alzia/${jobId}`,
          public_id: 'garment',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('❌ Garment upload error:', error);
            reject(error);
          } else {
            // console.log('✅ Garment uploaded:', result?.secure_url);
            resolve(result);
          }
        }
      );
      uploadStream.end(garmentBuffer);
    });

    // Upload person to Cloudinary with jobId folder structure
    const personUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: `Alzia/${jobId}`,
          public_id: 'person',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('❌ Person upload error:', error);
            reject(error);
          } else {
            // console.log('✅ Person uploaded:', result?.secure_url);
            resolve(result);
          }
        }
      );
      uploadStream.end(personBuffer);
    });

    return NextResponse.json({
      garmentUrl: (garmentUpload as any).secure_url,
      personUrl: (personUpload as any).secure_url,
    });
  } catch (error) {
    console.error('❌ Upload images error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}