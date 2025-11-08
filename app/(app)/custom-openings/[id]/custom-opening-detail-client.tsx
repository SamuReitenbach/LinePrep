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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const supabase = createClient();

  // Calculate FEN position from moves
  const getFinalPosition = () => {
    const game = new Chess();
    opening.moves.forEach((move) => {
      try {
        game.move(move);
      } catch (e) {
        console.error("Invalid move:", move);
      }
    });
    return game.fen();
  };

  const finalPosition = getFinalPosition();

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
            onClick={onOpen}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Board */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">{opening.name}</h2>
          </CardHeader>
          <CardBody>
            <ChessBoard
              initialFen={finalPosition}
              showMoveHistory={false}
              allowUndo={false}
            />
          </CardBody>
        </Card>

        {/* Moves */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Moves</h2>
          </CardHeader>
          <CardBody>
            <div className="font-mono text-sm bg-default-100 p-4 rounded-lg">
              {opening.moves.map((move, index) => (
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