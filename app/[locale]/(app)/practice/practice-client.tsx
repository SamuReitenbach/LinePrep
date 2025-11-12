"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardBody, CardHeader, Button, Chip, Progress } from "@heroui/react";
import { Link } from "@heroui/link";
import { ChessBoard } from "@/components/ChessBoard";
import { Chess } from "chess.js";

interface PracticePosition {
  moveNumber: number;
  fen: string;
  correctMove: string;
  previousMoves: string[];
  openingName: string;
  openingId?: string;
  customOpeningId?: string;
  variationId?: string;
}

interface PracticeClientProps {
  mode: "stack" | "opening" | "custom-opening";
  stackId?: string;
  stackName?: string;
  openingId?: string;
  openingName?: string;
  variationId?: string;
  variationName?: string;
  customOpeningId?: string;
  customOpeningName?: string;
  userId: string;
}

export function PracticeClient({
  mode,
  stackId,
  stackName,
  openingId,
  openingName,
  variationId,
  variationName,
  customOpeningId,
  customOpeningName,
  userId,
}: PracticeClientProps) {
  const [position, setPosition] = useState<PracticePosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
  });

  const fetchPosition = useCallback(async () => {
    setLoading(true);
    setFeedback({ type: null, message: "" });
    setShowAnswer(false);

    try {
      let endpoint = "";
      
      if (mode === "stack") {
        endpoint = `/api/practice/stack/${stackId}`;
      } else if (mode === "opening") {
        endpoint = `/api/practice/opening/${openingId}${variationId ? `?variationId=${variationId}` : ""}`;
      } else if (mode === "custom-opening") {
        endpoint = `/api/practice/custom-opening/${customOpeningId}`;
      }

      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setPosition(data.position);
    } catch (error: any) {
      console.error("Error fetching position:", error);
      setFeedback({
        type: "error",
        message: error.message || "Failed to load practice position",
      });
    } finally {
      setLoading(false);
    }
  }, [mode, stackId, openingId, variationId, customOpeningId]);

  useEffect(() => {
    fetchPosition();
  }, [fetchPosition]);

  const handleMove = async (move: { from: string; to: string; promotion?: string }) => {
    if (!position) return;

    const game = new Chess(position.fen);
    const madeMove = game.move({
      from: move.from,
      to: move.to,
      promotion: move.promotion || "q",
    });

    if (!madeMove) {
      setFeedback({
        type: "error",
        message: "Invalid move",
      });
      return;
    }

    const isCorrect = madeMove.san === position.correctMove;

    // Update stats
    setStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      total: prev.total + 1,
    }));

    // Submit result to backend
    try {
      await fetch("/api/practice/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          openingId: position.openingId,
          customOpeningId: position.customOpeningId,
          variationId: position.variationId,
          moveNumber: position.moveNumber,
          positionFen: position.fen,
          correctMove: position.correctMove,
          wasCorrect: isCorrect,
        }),
      });
    } catch (error) {
      console.error("Error submitting practice result:", error);
    }

    if (isCorrect) {
      setFeedback({
        type: "success",
        message: `Correct! ${position.correctMove}`,
      });
      // Auto-advance after 1.5 seconds
      setTimeout(() => {
        fetchPosition();
      }, 1500);
    } else {
      setFeedback({
        type: "error",
        message: `Incorrect. The correct move was ${position.correctMove}`,
      });
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setFeedback({
      type: null,
      message: `The correct move is: ${position?.correctMove}`,
    });
  };

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  const title =
    mode === "stack"
      ? `Practice: ${stackName}`
      : mode === "custom-opening"
      ? `Practice: ${customOpeningName}`
      : `Practice: ${openingName}${variationName ? ` - ${variationName}` : ""}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-sm text-default-500 mb-2">
          <Link 
            href={mode === "stack" ? "/stacks" : mode === "custom-opening" ? "/custom-openings" : "/openings"} 
            className="hover:text-default-700"
          >
            {mode === "stack" ? "Learning Stacks" : mode === "custom-opening" ? "Custom Openings" : "Openings"}
          </Link>
          {" / "}
          <Link
            href={
              mode === "stack" 
                ? `/stacks/${stackId}` 
                : mode === "custom-opening"
                ? `/custom-openings/${customOpeningId}`
                : `/openings/${openingId}`
            }
            className="hover:text-default-700"
          >
            {mode === "stack" ? stackName : mode === "custom-opening" ? customOpeningName : openingName}
          </Link>
          {" / "}
          <span className="text-default-900">Practice</span>
        </div>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-success">{stats.correct}</p>
            <p className="text-sm text-default-500">Correct</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-danger">{stats.incorrect}</p>
            <p className="text-sm text-default-500">Incorrect</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-primary">{stats.total}</p>
            <p className="text-sm text-default-500">Total</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-warning">{accuracy}%</p>
            <p className="text-sm text-default-500">Accuracy</p>
          </CardBody>
        </Card>
      </div>

      {/* Practice Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Board */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center w-full">
                <h2 className="text-xl font-bold">
                  {position ? position.openingName : "Loading..."}
                </h2>
                {position && (
                  <Chip color="primary" variant="flat">
                    Move {Math.floor(position.moveNumber / 2) + 1}
                  </Chip>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <Progress
                    size="sm"
                    isIndeterminate
                    aria-label="Loading..."
                    className="max-w-md"
                  />
                </div>
              ) : position ? (
                <ChessBoard
                  key={position.fen}
                  initialFen={position.fen}
                  onMove={handleMove}
                  showMoveHistory={false}
                  allowUndo={false}
                  boardOrientation={position.fen.split(' ')[1] === 'w' ? 'white' : 'black'}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-default-500">No positions available</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Instructions & Feedback */}
        <div className="space-y-4">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <h3 className="font-bold">Instructions</h3>
            </CardHeader>
            <CardBody className="text-sm space-y-2">
              <p>• Make the correct move for this position</p>
              <p>• Click or drag pieces to move</p>
              <p>• Get instant feedback</p>
              <p>• Track your progress</p>
            </CardBody>
          </Card>

          {/* Feedback */}
          {feedback.message && (
            <Card className={feedback.type === "success" ? "bg-success-50" : feedback.type === "error" ? "bg-danger-50" : ""}>
              <CardBody>
                <p className={`font-semibold ${feedback.type === "success" ? "text-success" : feedback.type === "error" ? "text-danger" : ""}`}>
                  {feedback.message}
                </p>
              </CardBody>
            </Card>
          )}

          {/* Previous Moves */}
          {position && position.previousMoves.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="font-bold">Previous Moves</h3>
              </CardHeader>
              <CardBody>
                <div className="font-mono text-sm">
                  {position.previousMoves.map((move, index) => (
                    <span key={index} className="mr-2">
                      {index % 2 === 0 && (
                        <span className="text-default-500">
                          {Math.floor(index / 2) + 1}.{" "}
                        </span>
                      )}
                      <span>{move}</span>
                    </span>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <Button
              color="primary"
              className="w-full"
              onPress={fetchPosition}
              isDisabled={loading}
            >
              Skip / Next Position
            </Button>
            <Button
              variant="flat"
              className="w-full"
              onPress={handleShowAnswer}
              isDisabled={loading || showAnswer}
            >
              Show Answer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}