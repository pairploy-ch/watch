import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { selling_price, cost_price } = await request.json();
    
    if (typeof selling_price !== 'number' || typeof cost_price !== 'number') {
      return NextResponse.json(
        { error: 'selling_price and cost_price must be numbers' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase.rpc('calculate_watch_profit_margin', {
      p_selling_price: selling_price,
      p_cost_price: cost_price
    });

    if (error) {
      console.error('Error calculating profit/margin:', error);
      return NextResponse.json(
        { error: 'Failed to calculate profit/margin' },
        { status: 500 }
      );
    }

    interface ProfitMarginResult {
      profit: number | null;
      margin_percent: number | null;
      profit_status: string;
    }

    if (!data || (data as ProfitMarginResult[]).length === 0) {
      return NextResponse.json(
        { error: 'No calculation result' },
        { status: 500 }
      );
    }

    const result = (data as ProfitMarginResult[])[0];
    
    return NextResponse.json({
      profit: result.profit,
      margin_percent: result.margin_percent,
      profit_status: result.profit_status
    });

  } catch (error) {
    console.error('Error in calculate-profit-margin API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
