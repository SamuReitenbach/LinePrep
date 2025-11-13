"use client";

import { useState, useMemo } from "react";
import { Card, CardBody, CardHeader, Input, Select, SelectItem, Button, Chip } from "@heroui/react";
import { Link as HeroUILink } from "@heroui/link"
import { Link } from "@/lib/navigation";

interface Variation {
  id: string;
  name: string;
  moves: string[];
  branch_at_move: number;
  description: string | null;
}

interface Opening {
  id: string;
  name: string;
  eco: string | null;
  category: string;
  moves: string[];
  description: string | null;
  popularity: number;
  variations: Variation[];
}

interface OpeningsClientProps {
  openings: Opening[];
  categories: string[];
}

export function OpeningsClient({ openings, categories }: OpeningsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter openings based on search and category
  const filteredOpenings = useMemo(() => {
    return openings.filter((opening) => {
      const matchesSearch =
        searchQuery === "" ||
        opening.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opening.eco?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opening.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || opening.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [openings, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Browse Openings</h1>
        <p className="text-default-500">
          Explore and learn from our collection of chess openings
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search openings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          isClearable
          onClear={() => setSearchQuery("")}
        />
        <Select
          label="Category"
          placeholder="All categories"
          selectedKeys={[selectedCategory]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            setSelectedCategory(value);
          }}
          className="sm:w-64"
          items={[{ key: 'all', label: 'All Categories' }, ...categories.map(cat => ({ key: cat, label: cat }))]}
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-default-500">
        Found {filteredOpenings.length} opening{filteredOpenings.length !== 1 ? 's' : ''}
      </div>

      {/* Openings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOpenings.map((opening) => (
          <Card key={opening.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-col items-start gap-2 pb-2">
              <div className="flex justify-between items-start w-full">
                <div className="flex-1">
                  <h3 className="text-lg font-bold line-clamp-1">{opening.name}</h3>
                  <div className="flex gap-2 mt-1">
                    {opening.eco && (
                      <Chip size="sm" variant="flat" color="primary">
                        {opening.eco}
                      </Chip>
                    )}
                    <Chip size="sm" variant="flat">
                      {opening.category}
                    </Chip>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardBody className="gap-3">
              {opening.description && (
                <p className="text-sm text-default-600 line-clamp-2">
                  {opening.description}
                </p>
              )}

              <div className="text-sm">
                <p className="text-default-500 mb-1">First moves:</p>
                <p className="font-mono text-xs bg-default-100 p-2 rounded">
                  {opening.moves.slice(0, 6).join(' ')}
                  {opening.moves.length > 6 ? '...' : ''}
                </p>
              </div>

              {opening.variations.length > 0 && (
                <div className="text-sm">
                  <p className="text-default-500 mb-1">
                    {opening.variations.length} variation{opening.variations.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {opening.variations.slice(0, 3).map((variation) => (
                      <Chip key={variation.id} size="sm" variant="dot">
                        {variation.name}
                      </Chip>
                    ))}
                    {opening.variations.length > 3 && (
                      <Chip size="sm" variant="dot">
                        +{opening.variations.length - 3} more
                      </Chip>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <Button
                  as={Link}
                  href={`/openings/${opening.id}`}
                  color="primary"
                  size="sm"
                  className="flex-1"
                >
                  View Details
                </Button>
                <Button
                  as={Link}
                  href={`/practice/opening/${opening.id}`}
                  variant="flat"
                  size="sm"
                  className="flex-1"
                >
                  Practice
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {filteredOpenings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-default-400 text-lg">No openings found</p>
          <p className="text-default-300 text-sm mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}