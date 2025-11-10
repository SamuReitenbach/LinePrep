import React from 'react';
import { Chessboard } from 'react-chessboard';

interface PreviewChessBoardProps {
  fen: string;
  boardOrientation?: 'white' | 'black';
  boardWidth?: number;
}

export const PreviewChessBoard: React.FC<PreviewChessBoardProps> = ({
  fen,
  boardOrientation = 'white',
  boardWidth = 250,
}) => {
  return (
    <div style={{ width: boardWidth, maxWidth: '100%' }}>
      <Chessboard
        options={{
          position: fen,
          id: 'preview-board',
          boardOrientation,
          allowDragging: false,
          allowDrawingArrows: false,
          alphaNotationStyle: { fontSize: 10},
          numericNotationStyle: { fontSize: 10},
        }}
      />
    </div>
  );
};

export default PreviewChessBoard;
