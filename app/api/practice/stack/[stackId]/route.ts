// This gets a random position from a learning stack

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getRandomStackPosition } from '@/lib/opening-utils';
import type { Opening, CustomOpening, Variation } from '@/lib/supabase/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stackId: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { stackId } = await params;

    // Fetch the learning stack with all openings
    const { data: stackOpenings, error: stackError } = await supabase
      .from('stack_openings')
      .select(`
        id,
        practice_move_numbers,
        opening:openings(*),
        custom_opening:custom_openings(*),
        variation:variations(*)
      `)
      .eq('stack_id', stackId);

    if (stackError) {
      console.error('Stack error:', stackError);
      return NextResponse.json(
        { error: 'Failed to fetch stack openings' },
        { status: 500 }
      );
    }

    if (!stackOpenings || stackOpenings.length === 0) {
      return NextResponse.json(
        { error: 'No openings found in this stack' },
        { status: 404 }
      );
    }

    // Transform the data to match the expected format
    const transformedOpenings = stackOpenings.map((so: any) => ({
      opening: Array.isArray(so.opening) ? so.opening[0] : so.opening,
      custom_opening: Array.isArray(so.custom_opening) ? so.custom_opening[0] : so.custom_opening,
      variation: Array.isArray(so.variation) ? so.variation[0] : so.variation,
      practice_move_numbers: so.practice_move_numbers || [],
    })).filter((so: any) => so.opening || so.custom_opening);

    // Get a random position from the stack
    const position = await getRandomStackPosition(transformedOpenings);

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