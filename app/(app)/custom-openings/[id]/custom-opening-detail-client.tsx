"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Link } from "@heroui/link";
import { ChessBoard } from "@/components/ChessBoard";
import { Chess } from "chess.js";
import { createClient } from "@/lib/supabase/client";

interface CustomOpening {
  id: string;
  name: string;
  description: string | null;
  moves: string[];
  color: 'white' | 'black';
  created_at: string;
  updated_at: string;
}

interface UserProgress {
  correct_count: number;
  incorrect_count: number;
}

interface CustomOpeningDetailClientProps {
  opening: CustomOpening;
  userProgress: UserProgress[];
  userId: string;
}

export function CustomOpeningDetailClient({
  opening,
  userProgress,
  userId,
}: CustomOpeningDetailClientProps) {
  const [deleting, setDeleting] = useState(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(opening.moves.length);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const supabase = createClient();

  // Calculate FEN position at a given move index
  const getPositionAtMove = (moveIndex: number) => {
    const game = new Chess();
    for (let i = 0; i < moveIndex; i++) {
      try {
        game.move(opening.moves[i]);
      } catch (e) {
        console.error("Invalid move:", opening.moves[i]);
      }
    }
    return game.fen();
  };

  const currentPosition = getPositionAtMove(currentMoveIndex);

  // Calculate statistics
  const totalAttempts = userProgress.reduce(
    (sum, p) => sum + p.correct_count + p.incorrect_count,
    0
  );
  const correctAttempts = userProgress.reduce((sum, p) => sum + p.correct_count, 0);
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("custom_openings")
        .delete()
        .eq("id", opening.id)
        .eq("user_id", userId);

      if (error) throw error;

      router.push("/custom-openings");
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting opening:", error);
      alert("Failed to delete opening");
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-default-500">
        <Link href="/custom-openings" className="hover:text-default-700">
          Custom Openings
        </Link>
        {" / "}
        <span className="text-default-900">{opening.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{opening.name}</h1>
          <div className="flex gap-2 flex-wrap">
            <Chip 
              variant="flat" 
              color={opening.color === 'white' ? 'default' : 'primary'}
            >
              {opening.color === 'white' ? '⚪' : '⚫'} Playing as {opening.color}
            </Chip>
            <Chip variant="flat">
              {opening.moves.length} moves
            </Chip>
            <Chip color="secondary" variant="flat">
              Custom
            </Chip>
          </div>
        </div>

        {opening.description && (
          <p className="text-default-600">{opening.description}</p>
        )}

        <p className="text-sm text-default-400">
          Created {formatDate(opening.created_at)} • Updated {formatDate(opening.updated_at)}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            as={Link}
            href={`/practice/custom-opening/${opening.id}`}
            color="primary"
            size="lg"
          >
            Practice This Opening
          </Button>
          <Button
            as={Link}
            href={`/custom-openings/${opening.id}/edit`}
            variant="bordered"
            size="lg"
          >
            Edit Opening
          </Button>
          <Button
            color="danger"
            variant="flat"
            size="lg"
            onPress={onOpen}
          >
            Delete
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
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Board */}
        <Card className="lg:max-w-fit">
          <CardHeader>
            <h2 className="text-xl font-bold">Position</h2>
          </CardHeader>
          <CardBody>
            <ChessBoard
              key={currentMoveIndex}
              initialFen={currentPosition}
              showMoveHistory={false}
              allowUndo={false}
              boardOrientation={opening.color}
            />
          </CardBody>
        </Card>

        {/* Moves */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Moves</h2>
          </CardHeader>
          <CardBody className="flex flex-col h-[600px]">
            {/* Move Table */}
            <div className="overflow-auto flex-1 mb-4 scrollbar-hide">
              <table className="table-fixed">
                <thead className="sticky top-0 bg-default-100 z-10">
                  <tr className="border-b border-divider">
                    <th className="text-left p-2 text-sm font-semibold text-default-600 w-24">#</th>
                    <th className="text-left p-2 text-sm font-semibold text-default-600 w-48">White</th>
                    <th className="text-left p-2 text-sm font-semibold text-default-600 w-48">Black</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.ceil(opening.moves.length / 2) }).map((_, pairIndex) => {
                    const whiteIndex = pairIndex * 2;
                    const blackIndex = pairIndex * 2 + 1;
                    const whiteMove = opening.moves[whiteIndex];
                    const blackMove = opening.moves[blackIndex];

                    return (
                      <tr key={pairIndex} className="border-b border-divider hover:bg-default-50">
                        <td className="p-2 text-sm text-default-500">{pairIndex + 1}</td>
                        <td
                          className={`p-2 text-sm font-mono cursor-pointer hover:bg-primary-50 rounded ${
                            currentMoveIndex === whiteIndex + 1
                              ? "bg-primary text-primary-foreground font-bold"
                              : ""
                          }`}
                          onClick={() => setCurrentMoveIndex(whiteIndex + 1)}
                        >
                          {whiteMove}
                        </td>
                        <td
                          className={`p-2 text-sm font-mono ${
                            blackMove
                              ? `cursor-pointer hover:bg-primary-50 rounded ${
                                  currentMoveIndex === blackIndex + 1
                                    ? "bg-primary text-primary-foreground font-bold"
                                    : ""
                                }`
                              : "text-default-300"
                          }`}
                          onClick={() => blackMove && setCurrentMoveIndex(blackIndex + 1)}
                        >
                          {blackMove || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Navigation Controls - 20% height */}
            <div className="flex gap-3 justify-center pt-4 border-t border-divider">
              <Button
                size="lg"
                variant="flat"
                isIconOnly
                onPress={() => setCurrentMoveIndex(0)}
                isDisabled={currentMoveIndex === 0}
                title="First move"
              >
                ⏮
              </Button>
              <Button
                size="lg"
                variant="flat"
                isIconOnly
                onPress={() => setCurrentMoveIndex(Math.max(0, currentMoveIndex - 1))}
                isDisabled={currentMoveIndex === 0}
                title="Previous move"
              >
                ◀
              </Button>
              <Button
                size="lg"
                variant="flat"
                isIconOnly
                onPress={() => setCurrentMoveIndex(Math.min(opening.moves.length, currentMoveIndex + 1))}
                isDisabled={currentMoveIndex === opening.moves.length}
                title="Next move"
              >
                ▶
              </Button>
              <Button
                size="lg"
                variant="flat"
                isIconOnly
                onPress={() => setCurrentMoveIndex(opening.moves.length)}
                isDisabled={currentMoveIndex === opening.moves.length}
                title="Last move"
              >
                ⏭
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Delete Custom Opening</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete "{opening.name}"? This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose} isDisabled={deleting}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleDelete}
              isLoading={deleting}
            >
              Delete Opening
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}