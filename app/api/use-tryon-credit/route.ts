import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { jobId, model, isLowQuality } = body;

    // Get the authenticated user - check session first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }

    const user = session.user;

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - No user found' },
        { status: 401 }
      );
    }

    // console.log('Authenticated user ID:', user.id);

    // Fetch customer
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, tryon_credits, tryon_credits_used')
      .eq('id', user.id)
      .single();

    if (customerError) {
      console.error('Customer fetch error:', customerError);
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // console.log('Customer found:', customer.id, 'Credits:', customer.tryon_credits);

    // Check if customer has credits
    if (customer.tryon_credits <= 0) {
      return NextResponse.json(
        { error: 'No credits remaining' },
        { status: 403 }
      );
    }

    // Deduct credit and update customer
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        tryon_credits: customer.tryon_credits - 1,
        tryon_credits_used: (customer.tryon_credits_used || 0) + 1,
        last_tryon_at: new Date().toISOString()
      })
      .eq('id', customer.id);

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return NextResponse.json(
        { error: 'Failed to deduct credit' },
        { status: 500 }
      );
    }

    // console.log('Credit deducted successfully. Remaining:', customer.tryon_credits - 1);

    // Log the try-on in history
    const { error: historyError } = await supabase
      .from('tryon_history')
      .insert({
        customer_id: customer.id,
        job_id: jobId,
        credits_used: 1,
        model_used: model,
        is_low_quality: isLowQuality || false
      });

    if (historyError) {
      console.error('Error logging try-on history:', historyError);
      // Don't fail the request if history logging fails
    }

    return NextResponse.json({
      success: true,
      creditsRemaining: customer.tryon_credits - 1
    });
  } catch (error) {
    console.error('Use credit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}