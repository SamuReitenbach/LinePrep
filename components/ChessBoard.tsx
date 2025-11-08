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
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  onMove,
  onGameOver,
  boardWidth = 600,
  showMoveHistory = true,
  allowUndo = true,
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
              }}
            />
          </div>
        </CardBody>
      </Card>

      {/* Game Info Panel */}
      <Card className="flex-1 min-w-[250px]">
        <CardHeader className="flex flex-col items-start gap-2 pb-2">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-xl font-bold">Game Info</h3>
            <Chip color={game.isGameOver() ? 'danger' : 'success'} variant="flat">
              {getTurnColor()} to move
            </Chip>
          </div>
          {gameStatus && (
            <Chip color="warning" variant="solid" className="mt-2">
              {gameStatus}
            </Chip>
          )}
        </CardHeader>
        
        <CardBody className="gap-4">
          {/* Controls */}
          <div className="flex gap-2 flex-wrap">
            <Button color="primary" onClick={resetGame} size="sm">
              Reset Game
            </Button>
            {allowUndo && moveHistory.length > 0 && (
              <Button color="default" onClick={undoMove} size="sm">
                Undo Move
              </Button>
            )}
          </div>

          {/* Move History */}
          {showMoveHistory && (
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold text-sm">Move History</h4>
              <div className="bg-default-100 rounded-lg p-3 max-h-[300px] overflow-y-auto">
                {moveHistory.length === 0 ? (
                  <p className="text-sm text-default-400">No moves yet</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {moveHistory.map((move, index) => (
                      <div key={index} className="text-sm">
                        <span className="text-default-400">{Math.floor(index / 2) + 1}.</span>{' '}
                        <span className="font-mono">{move}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ChessBoard;