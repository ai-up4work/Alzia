// app/api/save-tryon-results/route.ts
// Save virtual try-on results to Cloudinary with Alzia/{jobId} structure
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Supabase for metadata
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📦 Received save request');
    
    const { garmentFile, personFile, outputImage, combinedImage, model, isLowQuality } = body;

    if (!garmentFile || !personFile || !outputImage || !combinedImage) {
      return NextResponse.json(
        { 
          error: 'Missing required images',
          receivedFields: Object.keys(body)
        },
        { status: 400 }
      );
    }

    // Generate unique job ID
    const jobId = uuidv4();
    const folderPath = `Alzia/${jobId}`;

    console.log(`☁️ Uploading to Cloudinary: ${folderPath}`);

    // Upload all images to the same folder with specific names
    console.log('1/4 Uploading garment...');
    const garmentUpload = await cloudinary.uploader.upload(garmentFile, {
      folder: folderPath,
      public_id: 'garment',
      resource_type: 'image',
      overwrite: true,
    });

    console.log('2/4 Uploading person...');
    const personUpload = await cloudinary.uploader.upload(personFile, {
      folder: folderPath,
      public_id: 'person',
      resource_type: 'image',
      overwrite: true,
    });

    console.log('3/4 Uploading output...');
    const outputUpload = await cloudinary.uploader.upload(outputImage, {
      folder: folderPath,
      public_id: 'output',
      resource_type: 'image',
      overwrite: true,
    });

    console.log('4/4 Uploading combined...');
    const combinedUpload = await cloudinary.uploader.upload(combinedImage, {
      folder: folderPath,
      public_id: 'combined',
      resource_type: 'image',
      overwrite: true,
    });

    const cloudinaryUrls = {
      garment: garmentUpload.secure_url,
      person: personUpload.secure_url,
      output: outputUpload.secure_url,
      combined: combinedUpload.secure_url,
    };

    console.log('✅ All 4 images uploaded to Cloudinary');

    // Create metadata object
    const metadata = {
      jobId,
      model,
      isLowQuality,
      timestamp: new Date().toISOString(),
      cloudinaryUrls,
      folderPath,
    };

    // Upload metadata as JSON file
    console.log('📄 Uploading metadata...');
    await cloudinary.uploader.upload(
      `data:application/json;base64,${Buffer.from(JSON.stringify(metadata, null, 2)).toString('base64')}`,
      {
        folder: folderPath,
        public_id: 'metadata',
        resource_type: 'raw',
        overwrite: true,
      }
    );

    // Save to Supabase database - matching your exact schema
    try {
      const { error: dbError } = await supabase
        .from('tryon_results')
        .insert({
          job_id: jobId,
          result_image_url: cloudinaryUrls.output,
          garment_url: cloudinaryUrls.garment,
          person_url: cloudinaryUrls.person,
          combined_url: cloudinaryUrls.combined,
          cloudinary_public_id: outputUpload.public_id,
          model_used: model || 'unknown',
          is_low_quality: isLowQuality || false,
          user_id: null, // Set this if you have auth
          garment_id: null, // Set if you have product tracking
          product_id: null, // Set if you have product tracking
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (dbError) {
        console.error('⚠️ Database error:', dbError.message);
        // Don't fail the request if database save fails
      } else {
        console.log('✅ Metadata saved to Supabase');
      }
    } catch (dbErr) {
      console.error('⚠️ Database save failed:', dbErr);
      // Continue even if database fails - images are already saved
    }

    console.log(`🎉 Complete! Job ID: ${jobId}`);

    return NextResponse.json({
      success: true,
      jobId,
      cloudinaryUrls,
      folderPath,
    });

  } catch (error) {
    console.error('❌ Save error:', error);
    
    // Check if it's a Cloudinary config error
    if (error instanceof Error && error.message.includes('cloud_name')) {
      return NextResponse.json(
        { 
          error: 'Cloudinary not configured',
          details: 'Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env.local'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to save try-on result',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export const maxDuration = 120;