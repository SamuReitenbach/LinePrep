// Get a random position from a single opening

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getRandomPosition } from '@/lib/opening-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ openingId: string }>; }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { openingId } = await params;
    const { searchParams } = new URL(request.url);
    const variationId = searchParams.get('variationId');

    // Fetch the opening
    const { data: opening, error: openingError } = await supabase
      .from('openings')
      .select('*')
      .eq('id', openingId)
      .single();

    if (openingError || !opening) {
      return NextResponse.json(
        { error: 'Opening not found' },
        { status: 404 }
      );
    }

    let variation = null;
    if (variationId) {
      const { data: variationData } = await supabase
        .from('variations')
        .select('*')
        .eq('id', variationId)
        .single();
      
      variation = variationData;
    }

    // Generate random position (practice all moves by default)
    const position = getRandomPosition(opening, variation, [], 'white');

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