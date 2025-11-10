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
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Board */}
      <Card>
        <CardBody>
          <ChessBoard
            key={moves.length}
            initialFen={getFenFromMoves()}
            onMove={handleMove}
            showMoveHistory={false}
            allowUndo={false}
            boardOrientation={color}
          />
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <Button
                color="warning"
                variant="flat"
                onPress={handleUndo}
                isDisabled={moves.length === 0}
                className="flex-1"
              >
                Undo Last Move
              </Button>
              <Button
                color="danger"
                variant="flat"
                onPress={handleReset}
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
              maxRows={3}
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

            {/* Move Table */}
            <div className="overflow-auto flex-1 mb-4 scrollbar-hide max-h-80">
              <table className="table-fixed">
                <thead className="sticky top-0 bg-default-100 z-10">
                  <tr>
                    <th className="text-left p-2 text-sm font-semibold text-default-600 w-18">#</th>
                    <th className="text-left p-2 text-sm font-semibold text-default-600 w-32">White</th>
                    <th className="text-left p-2 text-sm font-semibold text-default-600 w-32">Black</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, pairIndex) => {
                    const whiteIndex = pairIndex * 2;
                    const blackIndex = pairIndex * 2 + 1;
                    const whiteMove = moves[whiteIndex];
                    const blackMove = moves[blackIndex];

                    return (
                      <tr key={pairIndex} className="border-b border-divider">
                        <td className="p-2 text-sm text-default-500">{pairIndex + 1}</td>
                        <td
                          className="p-2 text-sm font-mono cursor-pointer hover:bg-default-100 rounded"
                        >
                          {whiteMove}
                        </td>
                        <td
                          className={`p-2 text-sm font-mono ${blackMove
                              ? `cursor-pointer hover:bg-default-100 rounded `
                              : "text-default-300"
                            }`}
                        >
                          {blackMove || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
                onPress={() => router.back()}
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