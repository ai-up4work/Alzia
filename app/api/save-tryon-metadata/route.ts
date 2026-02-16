// app/api/save-tryon-metadata/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, model, isLowQuality } = body;

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }

    const supabase = createClient();

    // Save only metadata, not the actual image URLs for privacy
    const { data, error } = await supabase
      .from('virtual_tryon_results')
      .insert({
        job_id: jobId,
        model: model || 'unknown',
        is_low_quality: isLowQuality || false,
        created_at: new Date().toISOString(),
        // Don't save cloudinary_urls for privacy
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error saving metadata:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}