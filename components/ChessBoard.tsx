import React, { useState, useCallback, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import type { PieceDropHandlerArgs, SquareHandlerArgs } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react';

interface ChessBoardProps {
  initialFen?: string;
  onMove?: (move: { from: string; to: string; promotion?: string }) => void;
  onGameOver?: (result: 'checkmate' | 'draw' | 'stalemate') => void;
  boardWidth?: number;
  showMoveHistory?: boolean;
  allowUndo?: boolean;
  boardOrientation?: 'white' | 'black';
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  onMove,
  onGameOver,
  boardWidth = 600,
  showMoveHistory = true,
  allowUndo = true,
  boardOrientation = 'white',
}) => {
  const gameRef = useRef(new Chess(initialFen));
  const game = gameRef.current;
  const [position, setPosition] = useState(game.fen());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<string>('');
  const [moveFrom, setMoveFrom] = useState('');
  const [optionSquares, setOptionSquares] = useState<Record<string, React.CSSProperties>>({});

  const updateGameStatus = useCallback((chessGame: Chess) => {
    if (chessGame.isCheckmate()) {
      const winner = chessGame.turn() === 'w' ? 'Black' : 'White';
      setGameStatus(`Checkmate! ${winner} wins.`);
      onGameOver?.('checkmate');
    } else if (chessGame.isDraw()) {
      setGameStatus('Draw!');
      onGameOver?.('draw');
    } else if (chessGame.isStalemate()) {
      setGameStatus('Stalemate!');
      onGameOver?.('stalemate');
    } else if (chessGame.isCheck()) {
      setGameStatus('Check!');
    } else {
      setGameStatus('');
    }
  }, [onGameOver]);

  // Get move options for a square to show valid moves
  const getMoveOptions = useCallback((square: Square) => {
    const moves = game.moves({
      square,
      verbose: true,
    });

    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: Record<string, React.CSSProperties> = {};

    for (const move of moves) {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to)?.color !== game.get(square)?.color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)' // larger circle for capturing
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)', // smaller circle for moving
        borderRadius: '50%',
      };
    }

    // Highlight the selected square
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)',
    };

    setOptionSquares(newSquares);
    return true;
  }, [game]);

  const makeMove = useCallback(
    (sourceSquare: Square, targetSquare: Square) => {
      try {
        // Make the move according to chess.js logic
        const move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q', // Always promote to queen for simplicity
        });

        // If move is illegal, return false
        if (move === null) return false;

        // Update position state to trigger re-render
        setPosition(game.fen());
        
        // Update move history
        const moveNotation = move.san;
        setMoveHistory((prev) => [...prev, moveNotation]);
        
        // Update game status
        updateGameStatus(game);
        
        // Notify parent component
        onMove?.({
          from: sourceSquare,
          to: targetSquare,
          promotion: move.promotion,
        });

        return true;
      } catch (error) {
        // Silently handle invalid moves - this is expected behavior
        // when users try illegal moves
        return false;
      }
    },
    [game, onMove, updateGameStatus]
  );

  // Handle square click for click-to-move functionality
  const onSquareClick = ({ square, piece }: SquareHandlerArgs) => {
    // Piece clicked to move
    if (!moveFrom && piece) {
      const hasMoveOptions = getMoveOptions(square as Square);
      if (hasMoveOptions) {
        setMoveFrom(square);
      }
      return;
    }

    // Square clicked to move to, check if valid move
    const moves = game.moves({
      square: moveFrom as Square,
      verbose: true,
    });
    const foundMove = moves.find((m) => m.from === moveFrom && m.to === square);

    // Not a valid move
    if (!foundMove) {
      // Check if clicked on new piece
      const hasMoveOptions = getMoveOptions(square as Square);
      setMoveFrom(hasMoveOptions ? square : '');
      return;
    }

    // Make the move
    const success = makeMove(moveFrom as Square, square as Square);
    
    if (success) {
      // Clear moveFrom and optionSquares
      setMoveFrom('');
      setOptionSquares({});
    } else {
      // If invalid, try to select new piece
      const hasMoveOptions = getMoveOptions(square as Square);
      if (hasMoveOptions) {
        setMoveFrom(square);
      }
    }
  };

  const onPieceDrop = ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
    // Type narrow targetSquare potentially being null (e.g. if dropped off board)
    if (!targetSquare) {
      return false;
    }
    
    const success = makeMove(sourceSquare as Square, targetSquare as Square);
    
    if (success) {
      // Clear moveFrom and optionSquares
      setMoveFrom('');
      setOptionSquares({});
    }
    
    return success;
  };

  const resetGame = () => {
    game.reset();
    if (initialFen !== 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
      game.load(initialFen);
    }
    setPosition(game.fen());
    setMoveHistory([]);
    setGameStatus('');
    setMoveFrom('');
    setOptionSquares({});
  };

  const undoMove = () => {
    game.undo();
    setPosition(game.fen());
    setMoveHistory((prev) => prev.slice(0, -1));
    updateGameStatus(game);
    setMoveFrom('');
    setOptionSquares({});
  };

  const getTurnColor = () => (game.turn() === 'w' ? 'White' : 'Black');

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      {/* ChessBoard */}
      <Card className="flex-shrink-0">
        <CardBody className="p-4">
          <div style={{ width: boardWidth, maxWidth: '100%' }}>
            <Chessboard
              options={{
                position,
                onPieceDrop,
                onSquareClick,
                squareStyles: optionSquares,
                id: 'training-board',
                boardOrientation,
              }}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ChessBoard;