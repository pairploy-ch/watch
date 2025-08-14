import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const { notes } = await request.json();

    // Validate input
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Invalid watch ID' },
        { status: 400 }
      );
    }

    // Update the watch notes
    const { error } = await supabase
      .from('watches')
      .update({ notes: notes })
      .eq('id', parseInt(id));

    if (error) {
      console.error('Error updating watch notes:', error);
      return NextResponse.json(
        { error: 'Failed to update watch notes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PATCH /api/admin/watches/[id]/note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 