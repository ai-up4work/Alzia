// app/api/save-tryon-metadata/route.ts
// Save only metadata to database (images already uploaded from client)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, cloudinaryUrls, model, isLowQuality } = body;

    if (!jobId || !cloudinaryUrls) {
      return NextResponse.json(
        { error: 'Job ID and Cloudinary URLs required' },
        { status: 400 }
      );
    }

    // console.log('💾 Saving metadata for job:', jobId);

    const { error: dbError } = await supabase
      .from('tryon_results')
      .insert({
        job_id: jobId,
        result_image_url: cloudinaryUrls.output,
        garment_url: cloudinaryUrls.garment,
        person_url: cloudinaryUrls.person,
        combined_url: cloudinaryUrls.combined,
        model_used: model || 'unknown',
        is_low_quality: isLowQuality || false,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Database error:', dbError.message);
      return NextResponse.json(
        { error: 'Failed to save metadata', details: dbError.message },
        { status: 500 }
      );
    }

    // console.log('✅ Metadata saved successfully');

    return NextResponse.json({
      success: true,
      jobId,
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to save metadata' },
      { status: 500 }
    );
  }
}

export const maxDuration = 10;