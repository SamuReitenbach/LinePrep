"use client";

import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { Link } from "@heroui/link";

interface CustomOpening {
  id: string;
  name: string;
  description: string | null;
  moves: string[];
  color: 'white' | 'black';
  created_at: string;
  updated_at: string;
}

interface CustomOpeningsClientProps {
  openings: CustomOpening[];
}

export function CustomOpeningsClient({ openings }: CustomOpeningsClientProps) {
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
          <h1 className="text-3xl font-bold mb-2">Custom Openings</h1>
          <p className="text-default-500">
            Create and manage your own opening lines
          </p>
        </div>
        <Button
          as={Link}
          href="/custom-openings/new"
          color="primary"
          size="lg"
        >
          Create New Opening
        </Button>
      </div>

      {/* Openings Grid */}
      {openings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {openings.map((opening) => (
            <Card key={opening.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-col items-start gap-2 pb-2">
                <div className="flex justify-between items-start w-full">
                  <h3 className="text-lg font-bold line-clamp-1">{opening.name}</h3>
                  <Chip 
                    size="sm" 
                    variant="flat" 
                    color={opening.color === 'white' ? 'default' : 'primary'}
                  >
                    {opening.color === 'white' ? '⚪' : '⚫'} {opening.color}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody className="gap-3">
                {opening.description && (
                  <p className="text-sm text-default-600 line-clamp-2">
                    {opening.description}
                  </p>
                )}

                <div className="text-sm">
                  <p className="text-default-500 mb-1">
                    {opening.moves.length} moves
                  </p>
                  <p className="font-mono text-xs bg-default-100 p-2 rounded line-clamp-2">
                    {opening.moves.slice(0, 8).join(' ')}
                    {opening.moves.length > 8 ? '...' : ''}
                  </p>
                </div>

                <div className="text-xs text-default-400">
                  Updated {formatDate(opening.updated_at)}
                </div>

                <div className="flex gap-2 mt-2">
                  <Button
                    as={Link}
                    href={`/custom-openings/${opening.id}`}
                    color="primary"
                    size="sm"
                    className="flex-1"
                  >
                    View Details
                  </Button>
                  <Button
                    as={Link}
                    href={`/custom-openings/${opening.id}/edit`}
                    variant="flat"
                    size="sm"
                    className="flex-1"
                  >
                    Edit
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <div className="text-4xl mb-4">✨</div>
            <h2 className="text-xl font-bold mb-2">No custom openings yet</h2>
            <p className="text-default-500 mb-6">
              Create your first custom opening to start practicing your own lines
            </p>
            <Button
              as={Link}
              href="/custom-openings/new"
              color="primary"
              size="lg"
            >
              Create Your First Opening
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}