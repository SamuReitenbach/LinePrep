import { useMemo, useRef, useState } from "react";
import { Chess, Move, Square } from "chess.js";

export type EngineMove = Move & { san: string };

export function useChessEngine(initialFen?: string) {
  const engineRef = useRef(new Chess(initialFen));
  const [fen, setFen] = useState(engineRef.current.fen());
  const [history, setHistory] = useState<EngineMove[]>([]);
  const redoStackRef = useRef<EngineMove[]>([]);

  const api = useMemo(() => {
    const sync = () => setFen(engineRef.current.fen());

    return {
      fen,
      turn: () => engineRef.current.turn(), // 'w' | 'b'
      inCheck: () => engineRef.current.inCheck(),
      orientation: "white" as "white" | "black",

      load: (nextFen: string) => {
        engineRef.current.load(nextFen);
        redoStackRef.current = [];
        setHistory(engineRef.current.history({ verbose: true }) as EngineMove[]);
        sync();
      },

      reset: (startFen?: string) => {
        engineRef.current = new Chess(startFen);
        redoStackRef.current = [];
        setHistory([]);
        sync();
      },

      legalMovesFrom: (from: Square) =>
        engineRef.current.moves({ square: from, verbose: true }) as EngineMove[],

      move: (m: Parameters<Chess["move"]>[0]) => {
        const res = engineRef.current.move(m) as EngineMove | null;
        if (res) {
          redoStackRef.current = [];
          setHistory((h) => [...h, res]);
          sync();
        }
        return res;
      },

      undo: () => {
        const undone = engineRef.current.undo() as EngineMove | null;
        if (undone) {
          redoStackRef.current.push(undone);
          setHistory(engineRef.current.history({ verbose: true }) as EngineMove[]);
          sync();
        }
      },

      redo: () => {
        const next = redoStackRef.current.pop();
        if (!next) return;
        const res = engineRef.current.move(next);
        if (res) {
          setHistory(engineRef.current.history({ verbose: true }) as EngineMove[]);
          sync();
        }
      },
    };
  }, [fen]);

  return api;
}
