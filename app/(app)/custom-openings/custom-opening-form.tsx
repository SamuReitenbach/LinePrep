"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Input, Textarea, Button, Select, SelectItem } from "@heroui/react";
import { ChessBoard } from "@/components/ChessBoard";
import { createClient } from "@/lib/supabase/client";
import { Chess } from "chess.js";

interface CustomOpeningFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    moves: string[];
    color: 'white' | 'black';
  };
}

export function CustomOpeningForm({ mode, initialData }: CustomOpeningFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [color, setColor] = useState<'white' | 'black'>(initialData?.color || 'white');
  const [moves, setMoves] = useState<string[]>(initialData?.moves || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  // Create a FEN from the moves for the board
  const getFenFromMoves = () => {
    const game = new Chess();
    moves.forEach((move) => {
      try {
        game.move(move);
      } catch (e) {
        console.error("Invalid move:", move);
      }
    });
    return game.fen();
  };

  const handleMove = (move: { from: string; to: string; promotion?: string }) => {
    const game = new Chess(getFenFromMoves());
    const madeMove = game.move({
      from: move.from,
      to: move.to,
      promotion: move.promotion || "q",
    });

    if (madeMove) {
      setMoves([...moves, madeMove.san]);
    }
  };

  const handleUndo = () => {
    if (moves.length > 0) {
      setMoves(moves.slice(0, -1));
    }
  };

  const handleReset = () => {
    setMoves([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Opening name is required");
      return;
    }

    if (moves.length === 0) {
      setError("Please add at least one move");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in");
      }

      if (mode === "create") {
        const { data, error: insertError } = await supabase
          .from("custom_openings")
          .insert({
            user_id: user.id,
            name: name.trim(),
            description: description.trim() || null,
            moves,
            color,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        router.push(`/custom-openings/${data.id}`);
      } else {
        const { error: updateError } = await supabase
          .from("custom_openings")
          .update({
            name: name.trim(),
            description: description.trim() || null,
            moves,
            color,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData!.id);

        if (updateError) throw updateError;

        router.push(`/custom-openings/${initialData!.id}`);
      }

      router.refresh();
    } catch (error: any) {
      console.error("Error saving custom opening:", error);
      setError(error.message || "Failed to save custom opening");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Board */}
      <Card>
        <CardBody>
          <ChessBoard
            key={moves.length}
            initialFen={getFenFromMoves()}
            onMove={handleMove}
            showMoveHistory={false}
            allowUndo={false}
          />
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-sm font-semibold mb-2">Moves ({moves.length}):</p>
              <div className="font-mono text-sm bg-default-100 p-3 rounded-lg min-h-[60px] max-h-[120px] overflow-y-auto">
                {moves.length === 0 ? (
                  <span className="text-default-400">Start making moves...</span>
                ) : (
                  moves.map((move, index) => (
                    <span key={index} className="mr-2">
                      {index % 2 === 0 && (
                        <span className="text-default-500">
                          {Math.floor(index / 2) + 1}.{" "}
                        </span>
                      )}
                      <span className="font-semibold">{move}</span>
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                color="warning"
                variant="flat"
                onClick={handleUndo}
                isDisabled={moves.length === 0}
                className="flex-1"
              >
                Undo Last Move
              </Button>
              <Button
                color="danger"
                variant="flat"
                onClick={handleReset}
                isDisabled={moves.length === 0}
                className="flex-1"
              >
                Reset Board
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Form */}
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Opening Name"
              placeholder="e.g., My Sicilian Variation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isRequired
              maxLength={100}
            />

            <Textarea
              label="Description"
              placeholder="Describe your opening (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minRows={3}
              maxLength={500}
            />

            <Select
              label="Learning as"
              placeholder="Select color"
              selectedKeys={[color]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as 'white' | 'black';
                setColor(value);
              }}
            >
              <SelectItem key="white">White</SelectItem>
              <SelectItem key="black">Black</SelectItem>
            </Select>

            <div className="bg-default-100 p-4 rounded-lg">
              <p className="text-sm text-default-600">
                <strong>Instructions:</strong>
                <br />
                1. Make moves on the board to build your opening
                <br />
                2. Use "Undo" to correct mistakes
                <br />
                3. Select which color you're learning
                <br />
                4. Save when you're done
              </p>
            </div>

            {error && (
              <div className="text-danger text-sm bg-danger-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                color="primary"
                isLoading={loading}
                isDisabled={moves.length === 0}
                className="flex-1"
              >
                {mode === "create" ? "Create Opening" : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="flat"
                onClick={() => router.back()}
                isDisabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}