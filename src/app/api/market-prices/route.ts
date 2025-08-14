import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      brand, 
      ref, 
      model, 
      watch_year, 
      product_type, 
      set_type, 
      selling_price, 
      currency, 
      notes,
      source_text 
    } = body;

    // Validate required fields
    if (!brand || !ref || !selling_price) {
      return NextResponse.json(
        { error: 'Brand, reference, and price are required' },
        { status: 400 }
      );
    }

    // Insert market price data
    const { data, error } = await supabase
      .from('market_prices')
      .insert({
        brand,
        ref,
        model,
        watch_year,
        product_type,
        set_type,
        selling_price,
        currency: currency || 'THB',
        notes,
        source_text,
        user_id: user.id,
        user_email: user.email
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting market price:', error);
      return NextResponse.json(
        { error: 'Failed to save market data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in POST /api/market-prices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const ref = searchParams.get('ref');

    let query = supabase
      .from('market_prices')
      .select('*')
      .order('created_at', { ascending: false });

    if (brand) {
      query = query.eq('brand', brand);
    }
    if (ref) {
      query = query.eq('ref', ref);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching market prices:', error);
      return NextResponse.json(
        { error: 'Failed to fetch market data' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/market-prices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 