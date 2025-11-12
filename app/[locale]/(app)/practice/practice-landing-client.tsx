"use client";

import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { Link } from "@heroui/link";

interface Stack {
  id: string;
  name: string;
  description: string | null;
  openingCount: number;
}

interface Opening {
  id: string;
  name: string;
  eco: string | null;
  category: string;
}

interface CustomOpening {
  id: string;
  name: string;
  description: string | null;
  color: 'white' | 'black';
  moves: string[];
}

interface PracticeLandingClientProps {
  stacks: Stack[];
  recentOpenings: Opening[];
  customOpenings: CustomOpening[];
}

export function PracticeLandingClient({
  stacks,
  recentOpenings,
  customOpenings,
}: PracticeLandingClientProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Practice</h1>
        <p className="text-default-500">
          Choose how you want to practice your openings
        </p>
      </div>

      {/* Quick Practice Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
          <CardBody className="text-center py-8">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-xl font-bold mb-2">Practice Stacks</h3>
            <p className="text-sm text-default-600 mb-4">
              Practice from your organized collections
            </p>
            <Button
              as={Link}
              href="#stacks"
              color="primary"
              variant="shadow"
            >
              Choose Stack
            </Button>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20">
          <CardBody className="text-center py-8">
            <div className="text-4xl mb-3">♟️</div>
            <h3 className="text-xl font-bold mb-2">Custom Openings</h3>
            <p className="text-sm text-default-600 mb-4">
              Practice your own repertoire
            </p>
            <Button
              as={Link}
              href="#custom"
              color="secondary"
              variant="shadow"
            >
              Choose Opening
            </Button>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-tertiary-50 to-tertiary-100 dark:from-tertiary-900/20 dark:to-tertiary-800/20">
          <CardBody className="text-center py-8">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-xl font-bold mb-2">Browse Openings</h3>
            <p className="text-sm text-default-600 mb-4">
              Practice any specific opening
            </p>
            <Button
              as={Link}
              href="/openings"
              className="bg-tertiary"
              variant="shadow"
            >
              Browse
            </Button>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-quaternary-50 to-quaternary-100 dark:from-quaternary-900/20 dark:to-quaternary-800/20">
          <CardBody className="text-center py-8">
            <div className="text-4xl mb-3">🔄</div>
            <h3 className="text-xl font-bold mb-2">Continue Recent</h3>
            <p className="text-sm text-default-600 mb-4">
              Pick up where you left off
            </p>
            <Button
              as={Link}
              href="#recent"
              className="bg-quaternary dark:text-black"
              variant="shadow"
            >
              View Recent
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Learning Stacks */}
      <div id="stacks">
        <h2 className="text-2xl font-bold mb-4">Your Learning Stacks</h2>
        {stacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stacks.map((stack) => (
              <Card key={stack.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-start gap-2">
                  <div className="flex justify-between items-start w-full">
                    <h3 className="text-lg font-bold">{stack.name}</h3>
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
                  <Button
                    as={Link}
                    href={`/practice/stack/${stack.id}`}
                    color="primary"
                    size="sm"
                    className="w-full"
                    isDisabled={stack.openingCount === 0}
                  >
                    {stack.openingCount === 0 ? "No Openings" : "Start Practice"}
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="text-center py-8">
              <p className="text-default-500 mb-4">
                You don't have any learning stacks yet
              </p>
              <Button as={Link} href="/stacks/new" color="primary">
                Create Your First Stack
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Custom Openings */}
      <div id="custom">
        <h2 className="text-2xl font-bold mb-4">Your Custom Openings</h2>
        {customOpenings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customOpenings.map((opening) => (
              <Card key={opening.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-start gap-2">
                  <div className="flex justify-between items-start w-full">
                    <h3 className="text-lg font-bold">{opening.name}</h3>
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
                  <div className="flex items-center gap-2">
                    <Chip size="sm" variant="flat">
                      {Math.ceil(opening.moves.length / 2)} move{Math.ceil(opening.moves.length / 2) !== 1 ? 's' : ''}
                    </Chip>
                  </div>
                  <Button
                    as={Link}
                    href={`/practice/custom-opening/${opening.id}`}
                    color="primary"
                    size="sm"
                    className="w-full"
                  >
                    Start Practice
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="text-center py-8">
              <p className="text-default-500 mb-4">
                You don't have any custom openings yet
              </p>
              <Button as={Link} href="/custom-openings/new" color="primary">
                Create Your First Custom Opening
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Recent Openings */}
      <div id="recent">
        <h2 className="text-2xl font-bold mb-4">Recently Practiced</h2>
        {recentOpenings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentOpenings.map((opening) => (
              <Card key={opening.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-start gap-2">
                  <h3 className="text-lg font-bold">{opening.name}</h3>
                  <div className="flex gap-2">
                    {opening.eco && (
                      <Chip size="sm" variant="flat" color="primary">
                        {opening.eco}
                      </Chip>
                    )}
                    <Chip size="sm" variant="flat">
                      {opening.category}
                    </Chip>
                  </div>
                </CardHeader>
                <CardBody className="gap-2">
                  <div className="flex gap-2">
                    <Button
                      as={Link}
                      href={`/practice/opening/${opening.id}`}
                      color="primary"
                      size="sm"
                      className="flex-1"
                    >
                      Practice
                    </Button>
                    <Button
                      as={Link}
                      href={`/openings/${opening.id}`}
                      variant="flat"
                      size="sm"
                      className="flex-1"
                    >
                      View
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="text-center py-8">
              <p className="text-default-500 mb-4">
                You haven't practiced any openings yet
              </p>
              <Button as={Link} href="/openings" color="primary">
                Start Practicing
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}