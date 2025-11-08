export interface Opening {
  id: string
  name: string
  eco: string | null
  category: string
  moves: string[] // Array of moves in SAN notation
  description: string | null
  popularity: number
  created_at: string
}

export interface Variation {
  id: string
  opening_id: string
  name: string
  moves: string[]
  branch_at_move: number
  description: string | null
  created_at: string
}

export interface CustomOpening {
  id: string
  user_id: string
  name: string
  description: string | null
  moves: string[]
  color: 'white' | 'black'
  created_at: string
  updated_at: string
}

export interface LearningStack {
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface StackOpening {
  id: string
  stack_id: string
  opening_id: string | null
  custom_opening_id: string | null
  variation_id: string | null
  practice_move_numbers: number[] // e.g., [3, 5, 7]
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  opening_id: string | null
  custom_opening_id: string | null
  variation_id: string | null
  move_number: number
  position_fen: string
  correct_move: string
  correct_count: number
  incorrect_count: number
  last_practiced: string
  created_at: string
}

// Helper type for practice positions
export interface PracticePosition {
  moveNumber: number
  fen: string
  correctMove: string
  previousMoves: string[]
  openingName: string
  openingId?: string
  customOpeningId?: string
  variationId?: string
  variationName?: string
}