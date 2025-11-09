"use client";

import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { Card, CardBody } from "@heroui/react";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 py-8 md:py-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-6">
        <div className="inline-block max-w-2xl text-center justify-center">
          <span className={title({ color: "pink" })}>Line</span>
          <span className={title({ color: "blue" })}>Prep&nbsp;</span>
          <div className={subtitle({ class: "mt-4" })}>
            Master your chess opening repertoire with spaced repetition!
          </div>
          <p className="text-lg text-default-600 mt-6 max-w-xl mx-auto">
            LinePrep helps you learn and memorize chess openings through interactive practice sessions.
            Build your repertoire, track your progress, and never forget your lines again.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
            })}
            href="/signup"
          >
            Get Started Free
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full", size: "lg" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto w-full px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Why LinePrep?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardBody className="p-6">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-3">Spaced Repetition</h3>
              <p className="text-default-600">
                Practice positions you struggle with more often. Our smart algorithm helps you retain openings in long-term memory.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-3">Comprehensive Database</h3>
              <p className="text-default-600">
                Access a complete database of chess openings or create your own custom lines to practice your personal repertoire.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold mb-3">Learning Stacks</h3>
              <p className="text-default-600">
                Organize openings into themed collections. Group by playing style, opponent strength, or tournament preparation.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Track Your Progress</h3>
              <p className="text-default-600">
                Detailed statistics show your accuracy, practice streaks, and areas that need more work. Watch yourself improve over time.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="text-4xl mb-4">♟️</div>
              <h3 className="text-xl font-bold mb-3">Interactive Practice</h3>
              <p className="text-default-600">
                Practice with a real chessboard interface. Get instant feedback on your moves and learn from your mistakes.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">Custom Openings</h3>
              <p className="text-default-600">
                Build and practice your own opening variations. Perfect for preparing against specific opponents or trying new ideas.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto w-full px-6">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="space-y-8">
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Choose Your Openings</h3>
              <p className="text-default-600">
                Browse our opening database or create custom lines. Select the openings you want to learn and add them to your practice queue.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xl font-bold">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Practice Interactively</h3>
              <p className="text-default-600">
                Play through positions on an interactive chessboard. LinePrep presents you with positions and tests your knowledge of the correct moves.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-success text-success-foreground flex items-center justify-center text-xl font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Track & Improve</h3>
              <p className="text-default-600">
                Monitor your accuracy and progress over time. Review statistics to identify weak spots and focus your practice where it matters most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-2xl mx-auto w-full px-6 text-center">
        <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
          <CardBody className="p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Master Your Openings?</h2>
            <p className="text-lg text-default-600 mb-8">
              Join chess players who are improving their opening knowledge with LinePrep
            </p>
            <Link
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
                size: "lg",
              })}
              href="/signup"
            >
              Start Learning Today
            </Link>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}