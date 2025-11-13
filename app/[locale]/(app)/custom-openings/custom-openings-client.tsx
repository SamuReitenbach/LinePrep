"use client";

import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { Link } from "@/lib/navigation";
import { PreviewChessBoard } from "@/components/PreviewChessBoard";
import { Chess } from "chess.js";
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

interface CustomOpeningsClientProps {
  openings: CustomOpening[];
}

export function CustomOpeningsClient({ openings }: CustomOpeningsClientProps) {
  const locale = useLocale();
  const tCustom = useTranslations("customOpenings");
  const tCommon = useTranslations("common");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFinalPosition = (moves: string[]): string => {
    const game = new Chess();
    for (const move of moves) {
      try {
        game.move(move);
      } catch (e) {
        console.error("Invalid move:", move);
      }
    }
    return game.fen();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{tCustom("title")}</h1>
          <p className="text-default-500">
            {tCustom("list.subtitle")}
          </p>
        </div>
        <Button
          as={Link}
          href="/custom-openings/new"
          color="primary"
          size="lg"
        >
          {tCustom("list.createButton")}
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

                <div className="flex justify-center">
                  <PreviewChessBoard
                    fen={getFinalPosition(opening.moves)}
                    boardOrientation={opening.color}
                    boardWidth={250}
                  />
                </div>

                <div className="text-sm">
                  <p className="text-default-500 text-center">
                    {tCommon("movesCount", {
                      count: Math.ceil(opening.moves.length / 2),
                    })}
                  </p>
                </div>

                <div className="text-xs text-default-400 text-center">
                  {tCommon("updatedAt", { date: formatDate(opening.updated_at) })}
                </div>

                <div className="flex gap-2 mt-2">
                  <Button
                    as={Link}
                    href={`/custom-openings/${opening.id}`}
                    color="primary"
                    size="sm"
                    className="flex-1"
                  >
                    {tCustom("list.viewDetails")}
                  </Button>
                  <Button
                    as={Link}
                    href={`/custom-openings/${opening.id}/edit`}
                    variant="flat"
                    size="sm"
                    className="flex-1"
                  >
                    {tCustom("list.edit")}
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
            <h2 className="text-xl font-bold mb-2">
              {tCustom("list.empty.title")}
            </h2>
            <p className="text-default-500 mb-6">
              {tCustom("list.empty.description")}
            </p>
            <Button
              as={Link}
              href="/custom-openings/new"
              color="primary"
              size="lg"
            >
              {tCustom("list.empty.cta")}
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
