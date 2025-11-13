"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "@/lib/navigation";
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
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { Link } from "@/lib/navigation";
import { ChessBoard } from "@/components/ChessBoard";
import { Chess } from "chess.js";
import { createClient } from "@/lib/supabase/client";
import {
  SkipBack,
  ChevronLeft,
  Play,
  Pause,
  ChevronRight,
  SkipForward,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

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

interface UserStack {
  id: string;
  name: string;
  description: string | null;
}

interface CustomOpeningDetailClientProps {
  opening: CustomOpening;
  userProgress: UserProgress[];
  userStacks: UserStack[];
  userId: string;
}

export function CustomOpeningDetailClient({
  opening,
  userProgress,
  userStacks,
  userId,
}: CustomOpeningDetailClientProps) {
  const [deleting, setDeleting] = useState(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(opening.moves.length);
  const [selectedStack, setSelectedStack] = useState<string>("");
  const [addingToStack, setAddingToStack] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isAddStackOpen, onOpen: onAddStackOpen, onClose: onAddStackClose } = useDisclosure();
  const router = useRouter();
  const supabase = createClient();
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const locale = useLocale();
  const tCustom = useTranslations("customOpenings");
  const tCustomDetail = useTranslations("customOpenings.detail");
  const tCommon = useTranslations("common");

  // Auto-play effect
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentMoveIndex((prev) => {
          if (prev >= opening.moves.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    };
  }, [isPlaying, opening.moves.length]);

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
  const colorLabel = tCustom(opening.color);

  const toggleAutoPlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      // If at the end, restart from beginning
      if (currentMoveIndex >= opening.moves.length) {
        setCurrentMoveIndex(0);
      }
      setIsPlaying(true);
    }
  };

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
      alert(tCustomDetail("alerts.deleteFailed"));
      setDeleting(false);
    }
  };

  const handleAddToStack = async () => {
    if (!selectedStack) return;

    setAddingToStack(true);
    try {
      const { error } = await supabase.from("stack_openings").insert({
        stack_id: selectedStack,
        custom_opening_id: opening.id,
        practice_move_numbers: [], // Default: practice all moves
      });

      if (error) throw error;

      alert(tCustomDetail("addToStackModal.success"));
      onAddStackClose();
      router.refresh();
    } catch (error: any) {
      console.error("Error adding to stack:", error);
      alert(error.message || tCustomDetail("alerts.addToStackFailed"));
    } finally {
      setAddingToStack(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-full space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-default-500">
        <Link href="/custom-openings" className="hover:text-default-700">
          {tCustom("title")}
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
              {opening.color === 'white' ? '⚪' : '⚫'} {tCustomDetail("chip.playingAs", { color: colorLabel })}
            </Chip>
            <Chip variant="flat">
              {tCommon("movesCount", { count: opening.moves.length })}
            </Chip>
            <Chip color="secondary" variant="flat">
              {tCustomDetail("chip.custom")}
            </Chip>
          </div>
        </div>

        {opening.description && (
          <p className="text-default-600">{opening.description}</p>
        )}

        <p className="text-sm text-default-400">
          {tCommon("createdAt", { date: formatDate(opening.created_at) })} •{" "}
          {tCommon("updatedAt", { date: formatDate(opening.updated_at) })}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            as={Link}
            href={`/practice/custom-opening/${opening.id}`}
            color="primary"
            size="lg"
          >
            {tCustomDetail("buttons.practice")}
          </Button>
          <Button
            variant="bordered"
            size="lg"
            onPress={onAddStackOpen}
          >
            {tCustomDetail("buttons.addToStack")}
          </Button>
          <Button
            as={Link}
            href={`/custom-openings/${opening.id}/edit`}
            variant="bordered"
            size="lg"
          >
            {tCustomDetail("buttons.edit")}
          </Button>
          <Button
            color="danger"
            variant="flat"
            size="lg"
            onPress={onDeleteOpen}
          >
            {tCustomDetail("buttons.delete")}
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {userProgress.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">
              {tCustomDetail("statistics.title")}
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl font-bold text-primary">{totalAttempts}</p>
                <p className="text-sm text-default-500">
                  {tCustomDetail("statistics.totalAttempts")}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{correctAttempts}</p>
                <p className="text-sm text-default-500">
                  {tCustomDetail("statistics.correct")}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-danger">
                  {totalAttempts - correctAttempts}
                </p>
                <p className="text-sm text-default-500">
                  {tCustomDetail("statistics.incorrect")}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{accuracy}%</p>
                <p className="text-sm text-default-500">
                  {tCustomDetail("statistics.accuracy")}
                </p>
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
            <h2 className="text-xl font-bold">{tCustomDetail("position")}</h2>
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
            <h2 className="text-xl font-bold">{tCustomDetail("moves")}</h2>
          </CardHeader>
          <CardBody className="flex flex-col h-[600px]">
            {/* Move Table */}
            <div className="overflow-auto flex-1 mb-4 scrollbar-hide">
              <table className="table-fixed">
                <thead className="sticky top-0 bg-default-100 z-10">
                  <tr>
                    <th className="text-left p-2 text-sm font-semibold text-default-600 w-18">
                      {tCustomDetail("table.number")}
                    </th>
                    <th className="text-left p-2 text-sm font-semibold text-default-600 w-32">
                      {tCustomDetail("table.white")}
                    </th>
                    <th className="text-left p-2 text-sm font-semibold text-default-600 w-32">
                      {tCustomDetail("table.black")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.ceil(opening.moves.length / 2) }).map((_, pairIndex) => {
                    const whiteIndex = pairIndex * 2;
                    const blackIndex = pairIndex * 2 + 1;
                    const whiteMove = opening.moves[whiteIndex];
                    const blackMove = opening.moves[blackIndex];

                    return (
                      <tr key={pairIndex} className="border-b border-divider">
                        <td className="p-2 text-sm text-default-500">{pairIndex + 1}</td>
                        <td
                          className={`p-2 text-sm font-mono cursor-pointer hover:bg-default-100 rounded ${
                            currentMoveIndex === whiteIndex + 1
                              ? "bg-default text-primary-foreground font-bold"
                              : ""
                          }`}
                          onClick={() => setCurrentMoveIndex(whiteIndex + 1)}
                        >
                          {whiteMove}
                        </td>
                        <td
                          className={`p-2 text-sm font-mono ${
                            blackMove
                              ? `cursor-pointer hover:bg-default-100 rounded ${
                                  currentMoveIndex === blackIndex + 1
                                    ? "bg-default text-primary-foreground font-bold"
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

            {/* Navigation Controls */}
            <div className="flex gap-3 justify-center items-center">
              <Button
                size="lg"
                variant="flat"
                isIconOnly
                onPress={() => {
                  setIsPlaying(false);
                  setCurrentMoveIndex(0);
                }}
                isDisabled={currentMoveIndex === 0}
                title={tCustomDetail("controls.first")}
              >
                <SkipBack size={20} />
              </Button>
              <Button
                size="lg"
                variant="flat"
                isIconOnly
                onPress={() => {
                  setIsPlaying(false);
                  setCurrentMoveIndex(Math.max(0, currentMoveIndex - 1));
                }}
                isDisabled={currentMoveIndex === 0}
                title={tCustomDetail("controls.previous")}
              >
                <ChevronLeft size={20} />
              </Button>
              <Button
                size="lg"
                variant="flat"
                isIconOnly
                onPress={toggleAutoPlay}
                title={isPlaying ? tCustomDetail("controls.pause") : tCustomDetail("controls.autoplay")}
                className={isPlaying ? "bg-default-200" : ""}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>
              <Button
                size="lg"
                variant="flat"
                isIconOnly
                onPress={() => {
                  setIsPlaying(false);
                  setCurrentMoveIndex(Math.min(opening.moves.length, currentMoveIndex + 1));
                }}
                isDisabled={currentMoveIndex === opening.moves.length}
                title={tCustomDetail("controls.next")}
              >
                <ChevronRight size={20} />
              </Button>
              <Button
                size="lg"
                variant="flat"
                isIconOnly
                onPress={() => {
                  setIsPlaying(false);
                  setCurrentMoveIndex(opening.moves.length);
                }}
                isDisabled={currentMoveIndex === opening.moves.length}
                title={tCustomDetail("controls.last")}
              >
                <SkipForward size={20} />
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Add to Stack Modal */}
      <Modal isOpen={isAddStackOpen} onClose={onAddStackClose}>
        <ModalContent>
          <ModalHeader>{tCustomDetail("addToStackModal.title")}</ModalHeader>
          <ModalBody>
            {userStacks.length > 0 ? (
              <>
                <p className="text-sm text-default-500 mb-4">
                  {tCustomDetail("addToStackModal.description")}
                </p>
                <Select
                  label={tCustomDetail("addToStackModal.selectLabel")}
                  placeholder={tCustomDetail("addToStackModal.selectPlaceholder")}
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
                  {tCustomDetail("addToStackModal.empty")}
                </p>
                <Button as={Link} href="/stacks/new" color="primary">
                  {tCustomDetail("addToStackModal.emptyCta")}
                </Button>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onAddStackClose}>
              {tCustomDetail("addToStackModal.cancel")}
            </Button>
            <Button
              color="primary"
              onPress={handleAddToStack}
              isDisabled={!selectedStack || addingToStack}
              isLoading={addingToStack}
            >
              {tCustomDetail("addToStackModal.confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>{tCustomDetail("deleteModal.title")}</ModalHeader>
          <ModalBody>
            <p>
              {tCustomDetail("deleteModal.description", { name: opening.name })}
            </p>
            <p className="text-sm text-default-500 mt-2">
              {tCustomDetail("deleteModal.warning")}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose} isDisabled={deleting}>
              {tCustomDetail("deleteModal.cancel")}
            </Button>
            <Button
              color="danger"
              onPress={handleDelete}
              isLoading={deleting}
            >
              {tCustomDetail("deleteModal.confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
