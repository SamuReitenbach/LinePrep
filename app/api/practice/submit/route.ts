// This submits the result of a practice attempt

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      openingId, 
      customOpeningId, 
      variationId,
      moveNumber, 
      positionFen, 
      correctMove, 
      wasCorrect 
    } = body;

    // Check if progress record exists
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('opening_id', openingId || null)
      .eq('custom_opening_id', customOpeningId || null)
      .eq('move_number', moveNumber)
      .maybeSingle();

    if (existingProgress) {
      // Update existing progress
      const { error: updateError } = await supabase
        .from('user_progress')
        .update({
          correct_count: existingProgress.correct_count + (wasCorrect ? 1 : 0),
          incorrect_count: existingProgress.incorrect_count + (wasCorrect ? 0 : 1),
          last_practiced: new Date().toISOString(),
        })
        .eq('id', existingProgress.id);

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update progress' },
          { status: 500 }
        );
      }
    } else {
      // Create new progress record
      const { error: insertError } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          opening_id: openingId || null,
          custom_opening_id: customOpeningId || null,
          variation_id: variationId || null,
          move_number: moveNumber,
          position_fen: positionFen,
          correct_move: correctMove,
          correct_count: wasCorrect ? 1 : 0,
          incorrect_count: wasCorrect ? 0 : 1,
          last_practiced: new Date().toISOString(),
        });

      if (insertError) {
        return NextResponse.json(
          { error: 'Failed to create progress record' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting practice result:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}