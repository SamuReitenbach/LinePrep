import { Chess } from 'chess.js';
import type { Opening, Variation, CustomOpening, StackOpening, PracticePosition } from './supabase/types';

/**
 * Generate all practice positions from an opening's moves
 * @param moves - Array of moves in SAN notation
 * @param practiceMoveNumbers - Specific move numbers to practice (e.g., [3, 5, 7])
 * @param color - Which side the user is learning ('white' or 'black')
 * @returns Array of practice positions
 */
export function generatePracticePositions(
  moves: string[],
  practiceMoveNumbers: number[],
  color: 'white' | 'black'
): Array<{ moveNumber: number; fen: string; correctMove: string; previousMoves: string[] }> {
  const positions: Array<{ moveNumber: number; fen: string; correctMove: string; previousMoves: string[] }> = [];
  const game = new Chess();

  // If no specific move numbers provided, generate positions for all user moves
  let moveNumbersToGenerate = practiceMoveNumbers;
  if (moveNumbersToGenerate.length === 0) {
    moveNumbersToGenerate = [];
    // Generate positions where it's the user's turn to move
    for (let i = 0; i < moves.length; i++) {
      const isWhiteTurn = i % 2 === 0;
      if ((color === 'white' && isWhiteTurn) || (color === 'black' && !isWhiteTurn)) {
        moveNumbersToGenerate.push(i);
      }
    }
  }

  // Play through the moves and capture positions
  for (let i = 0; i < moves.length; i++) {
    const moveNumber = i;
    
    // Check if we should capture this position
    if (moveNumbersToGenerate.includes(moveNumber)) {
      const fen = game.fen();
      const correctMove = moves[i];
      const previousMoves = moves.slice(0, i);
      
      positions.push({
        moveNumber,
        fen,
        correctMove,
        previousMoves,
      });
    }

    // Make the move
    try {
      game.move(moves[i]);
    } catch (error) {
      console.error(`Invalid move at position ${i}: ${moves[i]}`);
      break;
    }
  }

  return positions;
}

/**
 * Get a random practice position from an opening
 */
export function getRandomPosition(
  opening: Opening,
  variation: Variation | null,
  practiceMoveNumbers: number[],
  color: 'white' | 'black' = 'white'
): PracticePosition | null {
  // Determine which moves to use
  let moves = opening.moves;
  let openingName = opening.name;
  let variationId = "";
  let variationName = "";

  // If variation exists, combine opening moves with variation moves
  if (variation) {
    moves = [...opening.moves.slice(0, variation.branch_at_move), ...variation.moves];
    openingName = `${opening.name}: ${variation.name}`;
    variationId = variation.id;
    variationName = variation.name;
  }

  const positions = generatePracticePositions(moves, practiceMoveNumbers, color);
  
  if (positions.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * positions.length);
  const position = positions[randomIndex];

  return {
    ...position,
    openingName,
    openingId: opening.id,
    variationId,
    variationName,
  };
}

/**
 * Get a random practice position from a custom opening
 */
export function getRandomCustomOpeningPosition(
  customOpening: CustomOpening,
  practiceMoveNumbers: number[]
): PracticePosition | null {
  const positions = generatePracticePositions(
    customOpening.moves,
    practiceMoveNumbers,
    customOpening.color
  );

  if (positions.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * positions.length);
  const position = positions[randomIndex];

  return {
    ...position,
    openingName: customOpening.name,
    customOpeningId: customOpening.id,
  };
}

/**
 * Get a random position from a learning stack
 */
export async function getRandomStackPosition(
  stackOpenings: Array<{
    opening?: Opening;
    custom_opening?: CustomOpening;
    variation?: Variation | null;
    practice_move_numbers: number[];
  }>
): Promise<PracticePosition | null> {
  if (stackOpenings.length === 0) return null;

  // Pick a random opening from the stack
  const randomStackOpening = stackOpenings[Math.floor(Math.random() * stackOpenings.length)];

  // Generate position based on whether it's a database opening or custom opening
  if (randomStackOpening.opening) {
    return getRandomPosition(
      randomStackOpening.opening,
      randomStackOpening.variation || null,
      randomStackOpening.practice_move_numbers,
      'white' // Default to white, could be stored in stack_openings
    );
  } else if (randomStackOpening.custom_opening) {
    return getRandomCustomOpeningPosition(
      randomStackOpening.custom_opening,
      randomStackOpening.practice_move_numbers
    );
  }

  return null;
}

/**
 * Validate if a move is correct for a given position
 */
export function validateMove(
  fen: string,
  userMove: string,
  correctMove: string
): { isCorrect: boolean; message: string } {
  const game = new Chess(fen);

  try {
    const move = game.move(userMove);
    
    if (!move) {
      return { isCorrect: false, message: 'Invalid move' };
    }

    // Compare the SAN notation
    if (move.san === correctMove) {
      return { isCorrect: true, message: 'Correct!' };
    } else {
      return { 
        isCorrect: false, 
        message: `Incorrect. The correct move was ${correctMove}` 
      };
    }
  } catch (error) {
    return { isCorrect: false, message: 'Invalid move' };
  }
}

/**
 * Calculate the next review date based on spaced repetition
 */
export function calculateNextReview(
  correctCount: number,
  incorrectCount: number
): Date {
  const now = new Date();
  const totalAttempts = correctCount + incorrectCount;
  
  if (totalAttempts === 0) {
    // First time: review in 1 day
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }

  const successRate = correctCount / totalAttempts;

  // Calculate interval based on success rate
  let intervalDays: number;
  if (successRate >= 0.9) {
    intervalDays = 7; // Review in a week
  } else if (successRate >= 0.7) {
    intervalDays = 3; // Review in 3 days
  } else if (successRate >= 0.5) {
    intervalDays = 1; // Review tomorrow
  } else {
    intervalDays = 0.25; // Review in 6 hours
  }

  return new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
}