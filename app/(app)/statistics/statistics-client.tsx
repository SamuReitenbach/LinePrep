"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader, Button, Progress, Chip } from "@heroui/react";
import { Link } from "@heroui/link";

interface OverallStats {
  totalAttempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  overallAccuracy: number;
  currentStreak: number;
  totalOpeningsPracticed: number;
}

interface OpeningStats {
  opening_id: string | null;
  custom_opening_id: string | null;
  opening_name: string;
  total_attempts: number;
  correct_attempts: number;
  accuracy: number;
  last_practiced: string;
}

interface StatisticsClientProps {
  overallStats: OverallStats;
  openingStats: OpeningStats[];
}

export function StatisticsClient({ overallStats, openingStats }: StatisticsClientProps) {
  const [sortBy, setSortBy] = useState<'attempts' | 'accuracy' | 'recent'>('attempts');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Sort openings based on selected criteria
  const sortedOpenings = [...openingStats].sort((a, b) => {
    if (sortBy === 'attempts') {
      return b.total_attempts - a.total_attempts;
    } else if (sortBy === 'accuracy') {
      return b.accuracy - a.accuracy;
    } else {
      return new Date(b.last_practiced).getTime() - new Date(a.last_practiced).getTime();
    }
  });

  const getAccuracyColor = (accuracy: number): "success" | "warning" | "danger" => {
    if (accuracy >= 80) return "success";
    if (accuracy >= 60) return "warning";
    return "danger";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Statistics</h1>
        <p className="text-default-500">
          Track your progress and performance across all openings
        </p>
      </div>

      {/* Overall Statistics */}
      <div>
        <h2 className="text-xl font-bold mb-4">Overall Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardBody className="text-center py-6">
              <p className="text-3xl font-bold text-primary">{overallStats.totalAttempts}</p>
              <p className="text-sm text-default-500">Total Attempts</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center py-6">
              <p className="text-3xl font-bold text-success">{overallStats.correctAttempts}</p>
              <p className="text-sm text-default-500">Correct</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center py-6">
              <p className="text-3xl font-bold text-danger">{overallStats.incorrectAttempts}</p>
              <p className="text-sm text-default-500">Incorrect</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center py-6">
              <p className="text-3xl font-bold text-warning">{overallStats.overallAccuracy}%</p>
              <p className="text-sm text-default-500">Accuracy</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center py-6">
              <p className="text-3xl font-bold text-secondary">{overallStats.currentStreak}</p>
              <p className="text-sm text-default-500">Day Streak 🔥</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center py-6">
              <p className="text-3xl font-bold">{overallStats.totalOpeningsPracticed}</p>
              <p className="text-sm text-default-500">Openings</p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Opening Statistics */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Performance by Opening</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={sortBy === 'attempts' ? 'solid' : 'flat'}
              color={sortBy === 'attempts' ? 'primary' : 'default'}
              onPress={() => setSortBy('attempts')}
            >
              Most Practiced
            </Button>
            <Button
              size="sm"
              variant={sortBy === 'accuracy' ? 'solid' : 'flat'}
              color={sortBy === 'accuracy' ? 'primary' : 'default'}
              onPress={() => setSortBy('accuracy')}
            >
              Best Accuracy
            </Button>
            <Button
              size="sm"
              variant={sortBy === 'recent' ? 'solid' : 'flat'}
              color={sortBy === 'recent' ? 'primary' : 'default'}
              onPress={() => setSortBy('recent')}
            >
              Most Recent
            </Button>
          </div>
        </div>

        {sortedOpenings.length > 0 ? (
          <div className="space-y-3">
            {sortedOpenings.map((opening) => (
              <Card key={opening.opening_id || opening.custom_opening_id}>
                <CardBody>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold truncate">
                          {opening.opening_name}
                        </h3>
                        {opening.custom_opening_id && (
                          <Chip size="sm" color="secondary" variant="flat">
                            Custom
                          </Chip>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-default-600">
                        <span>
                          <strong>{opening.total_attempts}</strong> attempts
                        </span>
                        <span>
                          <strong className="text-success">{opening.correct_attempts}</strong> correct
                        </span>
                        <span>
                          <strong className="text-danger">
                            {opening.total_attempts - opening.correct_attempts}
                          </strong> incorrect
                        </span>
                        <span className="text-default-500">
                          • {formatDate(opening.last_practiced)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[100px]">
                        <div className="mb-1">
                          <span className={`text-2xl font-bold text-${getAccuracyColor(opening.accuracy)}`}>
                            {opening.accuracy}%
                          </span>
                        </div>
                        <Progress
                          value={opening.accuracy}
                          color={getAccuracyColor(opening.accuracy)}
                          size="sm"
                          className="max-w-[100px]"
                        />
                      </div>

                      <Button
                        as={Link}
                        href={
                          opening.custom_opening_id
                            ? `/practice/custom-opening/${opening.custom_opening_id}`
                            : `/practice/opening/${opening.opening_id}`
                        }
                        color="primary"
                        size="sm"
                      >
                        Practice
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="text-center py-12">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">No statistics yet</h3>
              <p className="text-default-500 mb-6">
                Start practicing openings to see your progress here
              </p>
              <Button as={Link} href="/practice" color="primary">
                Start Practicing
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Motivational Message */}
      {overallStats.totalAttempts > 0 && (
        <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
          <CardBody className="text-center py-8">
            {overallStats.overallAccuracy >= 80 ? (
              <>
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-lg font-semibold mb-2">Excellent work!</p>
                <p className="text-default-600">
                  You're mastering your openings with {overallStats.overallAccuracy}% accuracy. Keep it up!
                </p>
              </>
            ) : overallStats.overallAccuracy >= 60 ? (
              <>
                <div className="text-4xl mb-2">💪</div>
                <p className="text-lg font-semibold mb-2">Great progress!</p>
                <p className="text-default-600">
                  You're doing well with {overallStats.overallAccuracy}% accuracy. Keep practicing to improve further!
                </p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">🚀</div>
                <p className="text-lg font-semibold mb-2">Keep going!</p>
                <p className="text-default-600">
                  Every master was once a beginner. Practice makes perfect!
                </p>
              </>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}