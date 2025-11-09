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
import { createClient } from "@/lib/supabase/client";

interface Stack {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface StackOpening {
  id: string;
  practice_move_numbers: number[];
  opening: any;
  custom_opening: any;
  variation: any;
}

interface StackDetailClientProps {
  stack: Stack;
  stackOpenings: StackOpening[];
  userId: string;
}

export function StackDetailClient({
  stack,
  stackOpenings: initialStackOpenings,
  userId,
}: StackDetailClientProps) {
  const [stackOpenings, setStackOpenings] = useState(initialStackOpenings);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingStack, setDeletingStack] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const supabase = createClient();

  const handleRemoveOpening = async (stackOpeningId: string) => {
    if (!confirm("Remove this opening from the stack?")) return;

    setDeletingId(stackOpeningId);
    try {
      const { error } = await supabase
        .from("stack_openings")
        .delete()
        .eq("id", stackOpeningId);

      if (error) throw error;

      setStackOpenings(stackOpenings.filter((so) => so.id !== stackOpeningId));
      router.refresh();
    } catch (error: any) {
      console.error("Error removing opening:", error);
      alert("Failed to remove opening");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteStack = async () => {
    setDeletingStack(true);
    try {
      const { error } = await supabase
        .from("learning_stacks")
        .delete()
        .eq("id", stack.id)
        .eq("user_id", userId);

      if (error) throw error;

      router.push("/stacks");
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting stack:", error);
      alert("Failed to delete stack");
      setDeletingStack(false);
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
        <Link href="/stacks" className="hover:text-default-700">
          Learning Stacks
        </Link>
        {" / "}
        <span className="text-default-900">{stack.name}</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">{stack.name}</h1>
          {stack.description && (
            <p className="text-default-600 mb-2">{stack.description}</p>
          )}
          <p className="text-sm text-default-400">
            Created {formatDate(stack.created_at)} • Updated {formatDate(stack.updated_at)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            as={Link}
            href={`/practice/stack/${stack.id}`}
            color="primary"
            size="lg"
            isDisabled={stackOpenings.length === 0}
          >
            Start Practice
          </Button>
          <Button
            as={Link}
            href={`/stacks/${stack.id}/edit`}
            variant="bordered"
            size="lg"
          >
            Edit Stack
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

      {/* Stats */}
      <Card>
        <CardBody>
          <div className="flex gap-8">
            <div>
              <p className="text-2xl font-bold text-primary">{stackOpenings.length}</p>
              <p className="text-sm text-default-500">Total Openings</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Openings List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Openings in this Stack</h2>
          <Button
            as={Link}
            href="/openings"
            color="primary"
            variant="flat"
          >
            Add More Openings
          </Button>
        </div>

        {stackOpenings.length > 0 ? (
          <div className="space-y-3">
            {stackOpenings.map((so) => {
              const opening = so.opening || so.custom_opening;
              const isCustom = !!so.custom_opening;
              
              return (
                <Card key={so.id}>
                  <CardBody>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            {opening?.name || "Unknown Opening"}
                          </h3>
                          {isCustom && (
                            <Chip size="sm" color="secondary" variant="flat">
                              Custom
                            </Chip>
                          )}
                          {so.variation && (
                            <Chip size="sm" variant="dot">
                              {so.variation.name}
                            </Chip>
                          )}
                          {!isCustom && opening?.eco && (
                            <Chip size="sm" variant="flat">
                              {opening.eco}
                            </Chip>
                          )}
                        </div>
                        
                        {opening?.description && (
                          <p className="text-sm text-default-600 mb-2">
                            {opening.description}
                          </p>
                        )}

                        <p className="text-sm text-default-500">
                          {so.practice_move_numbers.length > 0
                            ? `Practicing ${so.practice_move_numbers.length} specific positions`
                            : "Practicing all positions"}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          as={Link}
                          href={
                            isCustom
                              ? `/custom-openings/${opening.id}`
                              : `/openings/${opening.id}`
                          }
                          size="sm"
                          variant="flat"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="light"
                          onPress={() => handleRemoveOpening(so.id)}
                          isLoading={deletingId === so.id}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardBody className="text-center py-12">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">No openings yet</h3>
              <p className="text-default-500 mb-6">
                Add openings to this stack to start practicing
              </p>
              <Button
                as={Link}
                href="/openings"
                color="primary"
              >
                Browse Openings
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Delete Stack</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete "{stack.name}"? This action cannot be undone.
            </p>
            <p className="text-sm text-default-500 mt-2">
              This will remove the stack and all its associated openings from your collection.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose} isDisabled={deletingStack}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteStack}
              isLoading={deletingStack}
            >
              Delete Stack
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}