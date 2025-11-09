"use client";

import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { Link } from "@heroui/link";

interface DashboardData {
  stacks: any[];
  stacksCount: number;
  customOpenings: any[];
  customOpeningsCount: number;
  totalAttempts: number;
  accuracy: number;
}

interface DashboardClientProps {
  data: DashboardData;
  username: string;
}

export function DashboardClient({ data, username }: DashboardClientProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {username}! ♟️
        </h1>
        <p className="text-default-500">
          Ready to improve your opening repertoire?
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-4xl font-bold text-primary mb-2">
              {data.stacksCount}
            </p>
            <p className="text-sm text-default-500">Learning Stacks</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center py-6">
            <p className="text-4xl font-bold text-secondary mb-2">
              {data.customOpeningsCount}
            </p>
            <p className="text-sm text-default-500">Custom Openings</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center py-6">
            <p className="text-4xl font-bold text-success mb-2">
              {data.totalAttempts}
            </p>
            <p className="text-sm text-default-500">Total Attempts</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center py-6">
            <p className="text-4xl font-bold text-warning mb-2">
              {data.accuracy}%
            </p>
            <p className="text-sm text-default-500">Accuracy</p>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Stacks */}
        <Card>
          <CardHeader className="flex justify-between">
            <h2 className="text-xl font-bold">Your Learning Stacks</h2>
            <Button
              as={Link}
              href="/stacks"
              size="sm"
              variant="light"
              color="primary"
            >
              View All
            </Button>
          </CardHeader>
          <CardBody>
            {data.stacks && data.stacks.length > 0 ? (
              <div className="space-y-3">
                {data.stacks.slice(0, 3).map((stack) => (
                  <Link
                    key={stack.id}
                    href={`/stacks/${stack.id}`}
                    className="block p-3 rounded-lg hover:bg-default-100 transition-colors"
                  >
                    <p className="font-medium">{stack.name}</p>
                    {stack.description && (
                      <p className="text-sm text-default-500 line-clamp-1">
                        {stack.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-default-400">
                <p className="mb-3">No learning stacks yet</p>
                <Button
                  as={Link}
                  href="/stacks/new"
                  color="primary"
                  variant="flat"
                  size="sm"
                >
                  Create Your First Stack
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Custom Openings */}
        <Card>
          <CardHeader className="flex justify-between">
            <h2 className="text-xl font-bold">Custom Openings</h2>
            <Button
              as={Link}
              href="/custom-openings"
              size="sm"
              variant="light"
              color="primary"
            >
              View All
            </Button>
          </CardHeader>
          <CardBody>
            {data.customOpenings && data.customOpenings.length > 0 ? (
              <div className="space-y-3">
                {data.customOpenings.slice(0, 3).map((opening) => (
                  <Link
                    key={opening.id}
                    href={`/custom-openings/${opening.id}`}
                    className="block p-3 rounded-lg hover:bg-default-100 transition-colors"
                  >
                    <p className="font-medium">{opening.name}</p>
                    <p className="text-sm text-default-500">
                      {opening.moves.length} moves • Playing as {opening.color}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-default-400">
                <p className="mb-3">No custom openings yet</p>
                <Button
                  as={Link}
                  href="/custom-openings/new"
                  color="primary"
                  variant="flat"
                  size="sm"
                >
                  Create Your First Opening
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">💡 Quick Tips</h2>
        </CardHeader>
        <CardBody>
          <ul className="space-y-2 text-sm text-default-600">
            <li>• Practice positions you got wrong to improve retention</li>
            <li>• Create learning stacks to organize openings by theme</li>
            <li>• Review your statistics to identify weak spots</li>
            <li>• Try to practice a little bit every day for best results</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}