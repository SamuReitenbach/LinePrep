"use client";

import { useState } from "react";
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
  useDisclosure,
} from "@heroui/react";
import { Link } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLocale, useTranslations } from "next-intl";

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
  const locale = useLocale();
  const tStacks = useTranslations("stacks");
  const tCommon = useTranslations("common");

  const handleRemoveOpening = async (stackOpeningId: string) => {
    if (!confirm(tStacks("detail.alerts.removeConfirm"))) return;

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
      alert(tStacks("detail.alerts.removeFailed"));
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
      alert(tStacks("detail.alerts.deleteFailed"));
      setDeletingStack(false);
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
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-default-500">
        <Link href="/stacks" className="hover:text-default-700">
          {tStacks("title")}
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
            {tCommon("createdAt", { date: formatDate(stack.created_at) })} •{" "}
            {tCommon("updatedAt", { date: formatDate(stack.updated_at) })}
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
            {tStacks("detail.buttons.practice")}
          </Button>
          <Button
            as={Link}
            href={`/stacks/${stack.id}/edit`}
            variant="bordered"
            size="lg"
          >
            {tStacks("detail.buttons.edit")}
          </Button>
          <Button
            color="danger"
            variant="flat"
            size="lg"
            onPress={onOpen}
          >
            {tStacks("detail.buttons.delete")}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <Card>
        <CardBody>
          <div className="flex gap-8">
            <div>
              <p className="text-2xl font-bold text-primary">{stackOpenings.length}</p>
              <p className="text-sm text-default-500">
                {tStacks("detail.stats.totalOpenings")}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Openings List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {tStacks("detail.openings.title")}
          </h2>
          <Button
            as={Link}
            href="/openings"
            color="primary"
            variant="flat"
          >
            {tStacks("detail.openings.addMore")}
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
                            {opening?.name || tStacks("detail.openings.unknown")}
                          </h3>
                          {isCustom && (
                            <Chip size="sm" color="secondary" variant="flat">
                              {tStacks("detail.openings.custom")}
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
                            ? tStacks("detail.openings.practicingSpecific", {
                                count: so.practice_move_numbers.length,
                              })
                            : tStacks("detail.openings.practicingAll")}
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
                          {tStacks("detail.openings.view")}
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="light"
                          onPress={() => handleRemoveOpening(so.id)}
                          isLoading={deletingId === so.id}
                        >
                          {tStacks("detail.openings.remove")}
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
              <h3 className="text-xl font-bold mb-2">
                {tStacks("detail.empty.title")}
              </h3>
              <p className="text-default-500 mb-6">
                {tStacks("detail.empty.description")}
              </p>
              <Button
                as={Link}
                href="/openings"
                color="primary"
              >
                {tStacks("detail.empty.cta")}
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{tStacks("detail.deleteModal.title")}</ModalHeader>
          <ModalBody>
            <p>
              {tStacks("detail.deleteModal.description", { name: stack.name })}
            </p>
            <p className="text-sm text-default-500 mt-2">
              {tStacks("detail.deleteModal.warning")}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose} isDisabled={deletingStack}>
              {tStacks("detail.deleteModal.cancel")}
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteStack}
              isLoading={deletingStack}
            >
              {tStacks("detail.deleteModal.confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
