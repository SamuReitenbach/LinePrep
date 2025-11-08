"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
  Accordion,
  AccordionItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { Link } from "@heroui/link";
import { ChessBoard } from "@/components/ChessBoard";
import { Chess } from "chess.js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Variation {
  id: string;
  name: string;
  moves: string[];
  branch_at_move: number;
  description: string | null;
}

interface Opening {
  id: string;
  name: string;
  eco: string | null;
  category: string;
  moves: string[];
  description: string | null;
  popularity: number;
  variations: Variation[];
}

interface UserStack {
  id: string;
  name: string;
  description: string | null;
}

interface UserProgress {
  id: string;
  user_id: string;
  opening_id: string | null;
  move_number: number;
  position_fen: string;
  correct_move: string;
  correct_count: number;
  incorrect_count: number;
  last_practiced: string;
}

interface OpeningDetailClientProps {
  opening: Opening;
  userProgress: UserProgress[];
  userStacks: UserStack[];
  userId: string | null;
}

export function OpeningDetailClient({
  opening,
  userProgress,
  userStacks,
  userId,
}: OpeningDetailClientProps) {
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
  const [selectedStack, setSelectedStack] = useState<string>("");
  const [addingToStack, setAddingToStack] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const supabase = createClient();

  // Calculate FEN position from moves
  const getFinalPosition = (moves: string[]) => {
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

  // Get moves to display (either main line or variation)
  const displayMoves = selectedVariation
    ? [
        ...opening.moves.slice(0, selectedVariation.branch_at_move),
        ...selectedVariation.moves,
      ]
    : opening.moves;

  const finalPosition = getFinalPosition(displayMoves);

  // Calculate statistics
  const totalAttempts = userProgress.reduce(
    (sum, p) => sum + p.correct_count + p.incorrect_count,
    0
  );
  const correctAttempts = userProgress.reduce((sum, p) => sum + p.correct_count, 0);
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  const handleAddToStack = async () => {
    if (!selectedStack || !userId) return;

    setAddingToStack(true);
    try {
      const { error } = await supabase.from("stack_openings").insert({
        stack_id: selectedStack,
        opening_id: opening.id,
        variation_id: selectedVariation?.id || null,
        practice_move_numbers: [], // Default: practice all moves
      });

      if (error) throw error;

      alert("Opening added to stack!");
      onClose();
      router.refresh();
    } catch (error: any) {
      console.error("Error adding to stack:", error);
      alert(error.message || "Failed to add opening to stack");
    } finally {
      setAddingToStack(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-default-500">
        <Link href="/openings" className="hover:text-default-700">
          Openings
        </Link>
        {" / "}
        <span className="text-default-900">{opening.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{opening.name}</h1>
          <div className="flex gap-2 flex-wrap">
            {opening.eco && (
              <Chip color="primary" variant="flat">
                {opening.eco}
              </Chip>
            )}
            <Chip variant="flat">{opening.category}</Chip>
            <Chip variant="flat">
              {opening.moves.length} moves
            </Chip>
            {opening.variations.length > 0 && (
              <Chip variant="flat">
                {opening.variations.length} variation{opening.variations.length !== 1 ? "s" : ""}
              </Chip>
            )}
          </div>
        </div>

        {opening.description && (
          <p className="text-default-600">{opening.description}</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            as={Link}
            href={`/practice/opening/${opening.id}`}
            color="primary"
            size="lg"
          >
            Practice This Opening
          </Button>
          <Button variant="bordered" size="lg" onClick={onOpen}>
            Add to Learning Stack
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {userProgress.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Your Statistics</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl font-bold text-primary">{totalAttempts}</p>
                <p className="text-sm text-default-500">Total Attempts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{correctAttempts}</p>
                <p className="text-sm text-default-500">Correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-danger">
                  {totalAttempts - correctAttempts}
                </p>
                <p className="text-sm text-default-500">Incorrect</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{accuracy}%</p>
                <p className="text-sm text-default-500">Accuracy</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Board */}
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">
                {selectedVariation ? `${opening.name}: ${selectedVariation.name}` : opening.name}
              </h2>
            </CardHeader>
            <CardBody>
              <ChessBoard
                initialFen={finalPosition}
                showMoveHistory={false}
                allowUndo={false}
              />
            </CardBody>
          </Card>
        </div>

        {/* Moves and Variations */}
        <div className="space-y-6">
          {/* Moves */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">Moves</h2>
            </CardHeader>
            <CardBody>
              <div className="font-mono text-sm bg-default-100 p-4 rounded-lg">
                {displayMoves.map((move, index) => (
                  <span key={index} className="mr-2">
                    {index % 2 === 0 && (
                      <span className="text-default-500">{Math.floor(index / 2) + 1}. </span>
                    )}
                    <span className="font-semibold">{move}</span>
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Variations */}
          {opening.variations.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Variations</h2>
              </CardHeader>
              <CardBody>
                <Accordion>
                  {opening.variations.map((variation) => (
                    <AccordionItem
                      key={variation.id}
                      title={variation.name}
                      subtitle={`Branches at move ${variation.branch_at_move}`}
                    >
                      {variation.description && (
                        <p className="text-sm text-default-600 mb-3">
                          {variation.description}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color={selectedVariation?.id === variation.id ? "primary" : "default"}
                          onClick={() => setSelectedVariation(variation)}
                        >
                          {selectedVariation?.id === variation.id ? "Selected" : "View on Board"}
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          as={Link}
                          href={`/practice/opening/${opening.id}?variationId=${variation.id}`}
                        >
                          Practice
                        </Button>
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
                {selectedVariation && (
                  <Button
                    size="sm"
                    variant="light"
                    className="mt-3"
                    onClick={() => setSelectedVariation(null)}
                  >
                    Show Main Line
                  </Button>
                )}
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* Add to Stack Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Add to Learning Stack</ModalHeader>
          <ModalBody>
            {userStacks.length > 0 ? (
              <>
                <p className="text-sm text-default-500 mb-4">
                  Select a stack to add this opening to:
                </p>
                <Select
                  label="Learning Stack"
                  placeholder="Select a stack"
                  selectedKeys={selectedStack ? [selectedStack] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    setSelectedStack(value || "");
                  }}
                >
                  {userStacks.map((stack) => (
                    <SelectItem key={stack.id}>
                      {stack.name}
                    </SelectItem>
                  ))}
                </Select>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-default-500 mb-4">
                  You don't have any learning stacks yet.
                </p>
                <Button as={Link} href="/stacks/new" color="primary">
                  Create Your First Stack
                </Button>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleAddToStack}
              isDisabled={!selectedStack || addingToStack}
              isLoading={addingToStack}
            >
              Add to Stack
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}