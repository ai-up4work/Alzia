import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user from Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch customer's try-on credits using user ID
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('tryon_credits, tryon_credits_used, last_tryon_at')
      .eq('id', user.id)
      .single();

    if (customerError) {
      console.error('Error fetching customer credits:', customerError);
      return NextResponse.json(
        { error: 'Failed to fetch credits' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      credits: customer?.tryon_credits || 0,
      creditsUsed: customer?.tryon_credits_used || 0,
      lastTryonAt: customer?.last_tryon_at || null,
      hasCredits: (customer?.tryon_credits || 0) > 0
    });
  } catch (error) {
    console.error('Check credits error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}