import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { selling_price, commission_rate } = await request.json();
    
    if (!selling_price || !commission_rate) {
      return NextResponse.json(
        { error: 'Missing required fields: selling_price and commission_rate' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase.rpc('calculate_commission_amount', {
      p_selling_price: selling_price,
      p_commission_rate: commission_rate
    });

    if (error) {
      console.error('Commission calculation error:', error);
      return NextResponse.json(
        { error: 'Failed to calculate commission' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      commission_amount: data,
      commission_rate: commission_rate,
      selling_price: selling_price
    });

  } catch (error) {
    console.error('Commission calculation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
