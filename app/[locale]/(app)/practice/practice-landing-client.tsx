"use client";

import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";

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
  const tPractice = useTranslations("practice");
  const tCustom = useTranslations("customOpenings");
  const tCommon = useTranslations("common");
  const tOpenings = useTranslations("openings");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{tPractice("title")}</h1>
        <p className="text-default-500">
          {tPractice("landing.subtitle")}
        </p>
      </div>

      {/* Quick Practice Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
          <CardBody className="text-center py-8">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-xl font-bold mb-2">
              {tPractice("landing.cards.stacks.title")}
            </h3>
            <p className="text-sm text-default-600 mb-4">
              {tPractice("landing.cards.stacks.description")}
            </p>
            <Button
              as={Link}
              href="#stacks"
              color="primary"
              variant="shadow"
            >
              {tPractice("landing.cards.stacks.action")}
            </Button>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20">
          <CardBody className="text-center py-8">
            <div className="text-4xl mb-3">♟️</div>
            <h3 className="text-xl font-bold mb-2">
              {tPractice("landing.cards.custom.title")}
            </h3>
            <p className="text-sm text-default-600 mb-4">
              {tPractice("landing.cards.custom.description")}
            </p>
            <Button
              as={Link}
              href="#custom"
              color="secondary"
              variant="shadow"
            >
              {tPractice("landing.cards.custom.action")}
            </Button>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-tertiary-50 to-tertiary-100 dark:from-tertiary-900/20 dark:to-tertiary-800/20">
          <CardBody className="text-center py-8">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-xl font-bold mb-2">
              {tPractice("landing.cards.openings.title")}
            </h3>
            <p className="text-sm text-default-600 mb-4">
              {tPractice("landing.cards.openings.description")}
            </p>
            <Button
              as={Link}
              href="/openings"
              className="bg-tertiary"
              variant="shadow"
            >
              {tPractice("landing.cards.openings.action")}
            </Button>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-quaternary-50 to-quaternary-100 dark:from-quaternary-900/20 dark:to-quaternary-800/20">
          <CardBody className="text-center py-8">
            <div className="text-4xl mb-3">🔄</div>
            <h3 className="text-xl font-bold mb-2">
              {tPractice("landing.cards.recent.title")}
            </h3>
            <p className="text-sm text-default-600 mb-4">
              {tPractice("landing.cards.recent.description")}
            </p>
            <Button
              as={Link}
              href="#recent"
              className="bg-quaternary dark:text-black"
              variant="shadow"
            >
              {tPractice("landing.cards.recent.action")}
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Learning Stacks */}
      <div id="stacks">
        <h2 className="text-2xl font-bold mb-4">
          {tPractice("landing.sections.stacks.title")}
        </h2>
        {stacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stacks.map((stack) => (
              <Card key={stack.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-start gap-2">
                  <div className="flex justify-between items-start w-full">
                    <h3 className="text-lg font-bold">{stack.name}</h3>
                    <Chip size="sm" variant="flat" color="primary">
                      {tCommon("openingsCount", { count: stack.openingCount })}
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
                    {stack.openingCount === 0
                      ? tPractice("landing.sections.stacks.buttonEmpty")
                      : tPractice("landing.sections.stacks.buttonStart")}
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="text-center py-8">
              <p className="text-default-500 mb-4">
                {tPractice("landing.sections.stacks.emptyDescription")}
              </p>
              <Button as={Link} href="/stacks/new" color="primary">
                {tPractice("landing.sections.stacks.emptyCta")}
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Custom Openings */}
      <div id="custom">
        <h2 className="text-2xl font-bold mb-4">
          {tPractice("landing.sections.custom.title")}
        </h2>
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
                      {opening.color === 'white' ? '⚪' : '⚫'} {tCustom(opening.color)}
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
                      {tCommon("movesCount", {
                        count: Math.ceil(opening.moves.length / 2),
                      })}
                    </Chip>
                  </div>
                  <Button
                    as={Link}
                    href={`/practice/custom-opening/${opening.id}`}
                    color="primary"
                    size="sm"
                    className="w-full"
                  >
                    {tPractice("startSession")}
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="text-center py-8">
              <p className="text-default-500 mb-4">
                {tPractice("landing.sections.custom.emptyDescription")}
              </p>
              <Button as={Link} href="/custom-openings/new" color="primary">
                {tPractice("landing.sections.custom.emptyCta")}
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Recent Openings */}
      <div id="recent">
        <h2 className="text-2xl font-bold mb-4">
          {tPractice("landing.sections.recent.title")}
        </h2>
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
                      {tOpenings("practice")}
                    </Button>
                    <Button
                      as={Link}
                      href={`/openings/${opening.id}`}
                      variant="flat"
                      size="sm"
                      className="flex-1"
                    >
                      {tCommon("view")}
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
                {tPractice("landing.sections.recent.emptyDescription")}
              </p>
              <Button as={Link} href="/openings" color="primary">
                {tPractice("landing.sections.recent.emptyCta")}
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
