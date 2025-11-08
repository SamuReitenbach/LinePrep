// Get a random position from a custom opening

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getRandomCustomOpeningPosition } from '@/lib/opening-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = params;

    // Fetch the custom opening
    const { data: customOpening, error: openingError } = await supabase
      .from('custom_openings')
      .select('*')
      .eq('id', id)
      .single();

    if (openingError || !customOpening) {
      return NextResponse.json(
        { error: 'Custom opening not found' },
        { status: 404 }
      );
    }

    // Generate random position (practice all moves by default)
    const position = getRandomCustomOpeningPosition(customOpening, []);

    if (!position) {
      return NextResponse.json(
        { error: 'Could not generate practice position' },
        { status: 500 }
      );
    }

    return NextResponse.json({ position });
  } catch (error) {
    console.error('Error getting practice position:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}