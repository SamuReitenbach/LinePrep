"use client";

import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { Link } from "@heroui/link";

interface Stack {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  openingCount: number;
}

interface StacksClientProps {
  stacks: Stack[];
}

export function StacksClient({ stacks }: StacksClientProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Learning Stacks</h1>
          <p className="text-default-500">
            Organize your openings into themed collections
          </p>
        </div>
        <Button
          as={Link}
          href="/stacks/new"
          color="primary"
          size="lg"
        >
          Create New Stack
        </Button>
      </div>

      {/* Stacks Grid */}
      {stacks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stacks.map((stack) => (
            <Card key={stack.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-col items-start gap-2 pb-2">
                <div className="flex justify-between items-start w-full">
                  <h3 className="text-lg font-bold line-clamp-1">{stack.name}</h3>
                  <Chip size="sm" variant="flat" color="primary">
                    {stack.openingCount} opening{stack.openingCount !== 1 ? 's' : ''}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody className="gap-3">
                {stack.description && (
                  <p className="text-sm text-default-600 line-clamp-2">
                    {stack.description}
                  </p>
                )}

                <div className="text-xs text-default-400">
                  Updated {formatDate(stack.updated_at)}
                </div>

                <div className="flex gap-2 mt-2">
                  <Button
                    as={Link}
                    href={`/stacks/${stack.id}`}
                    color="primary"
                    size="sm"
                    className="flex-1"
                  >
                    View Details
                  </Button>
                  <Button
                    as={Link}
                    href={`/practice/stack/${stack.id}`}
                    variant="flat"
                    size="sm"
                    className="flex-1"
                    isDisabled={stack.openingCount === 0}
                  >
                    Practice
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <h2 className="text-xl font-bold mb-2">No learning stacks yet</h2>
            <p className="text-default-500 mb-6">
              Create your first stack to organize openings and start practicing
            </p>
            <Button
              as={Link}
              href="/stacks/new"
              color="primary"
              size="lg"
            >
              Create Your First Stack
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}