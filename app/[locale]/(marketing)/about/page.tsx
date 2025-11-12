"use client";

import { Link } from "@heroui/link";
import { Button, Card, CardBody } from "@heroui/react";
import { title } from "@/components/primitives";

export default function AboutPage() {
  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className={title()}>About LinePrep</h1>
        <p className="text-xl text-default-600 max-w-2xl mx-auto">
          Master chess openings through interactive practice and spaced repetition
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">Our Mission</h2>
        <p className="text-lg text-default-600">
          LinePrep was created to help chess players of all levels build a solid opening
          repertoire through effective practice. We believe that mastering openings doesn't
          have to be tedious or overwhelming.
        </p>
        <p className="text-lg text-default-600">
          By combining interactive practice with spaced repetition algorithms, we make
          learning chess openings engaging, efficient, and fun.
        </p>
      </section>

      {/* Features Section */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardBody className="space-y-2">
              <div className="text-3xl">📚</div>
              <h3 className="text-xl font-bold">Comprehensive Opening Database</h3>
              <p className="text-default-600">
                Access a curated collection of popular chess openings with detailed
                variations and explanations.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2">
              <div className="text-3xl">♟️</div>
              <h3 className="text-xl font-bold">Interactive Practice</h3>
              <p className="text-default-600">
                Learn by doing. Practice positions from your chosen openings with
                instant feedback on every move.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2">
              <div className="text-3xl">📦</div>
              <h3 className="text-xl font-bold">Learning Stacks</h3>
              <p className="text-default-600">
                Organize openings into themed collections. Build your own repertoire
                tailored to your playing style.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2">
              <div className="text-3xl">📈</div>
              <h3 className="text-xl font-bold">Progress Tracking</h3>
              <p className="text-default-600">
                Monitor your performance with detailed statistics. See which openings
                need more work and track your improvement.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2">
              <div className="text-3xl">✨</div>
              <h3 className="text-xl font-bold">Custom Openings</h3>
              <p className="text-default-600">
                Create and practice your own opening lines. Perfect for studying
                specific variations or preparing for opponents.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2">
              <div className="text-3xl">🎯</div>
              <h3 className="text-xl font-bold">Spaced Repetition</h3>
              <p className="text-default-600">
                Smart algorithms ensure you review positions at optimal intervals
                for maximum retention.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <div className="space-y-8">
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Choose Your Openings</h3>
              <p className="text-default-600">
                Browse our opening database or create your own. Select openings that
                match your playing style and add them to learning stacks.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Practice Positions</h3>
              <p className="text-default-600">
                The app presents you with positions from your chosen openings. Make
                the correct move and receive instant feedback.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Track Your Progress</h3>
              <p className="text-default-600">
                View detailed statistics on your performance. The spaced repetition
                system ensures you review difficult positions more frequently.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              4
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Master Your Repertoire</h3>
              <p className="text-default-600">
                With consistent practice, you'll build deep knowledge of your chosen
                openings and play them confidently over the board.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">Built With Modern Technology</h2>
        <p className="text-lg text-default-600">
          LinePrep is built with cutting-edge web technologies to provide a fast,
          reliable, and beautiful user experience:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="text-center py-6">
              <p className="font-bold">Next.js</p>
              <p className="text-sm text-default-500">React Framework</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center py-6">
              <p className="font-bold">Supabase</p>
              <p className="text-sm text-default-500">Database & Auth</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center py-6">
              <p className="font-bold">HeroUI</p>
              <p className="text-sm text-default-500">UI Components</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center py-6">
              <p className="font-bold">Chess.js</p>
              <p className="text-sm text-default-500">Chess Logic</p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-8">
        <h2 className="text-3xl font-bold">Ready to Master Your Openings?</h2>
        <p className="text-lg text-default-600 max-w-2xl mx-auto">
          Join LinePrep today and start building a solid opening repertoire
          that will improve your chess game.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            as={Link}
            href="/signup"
            color="primary"
            size="lg"
            className="font-semibold"
          >
            Get Started Free
          </Button>
          <Button
            as={Link}
            href="/openings"
            variant="bordered"
            size="lg"
          >
            Browse Openings
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-4xl mx-auto space-y-6 text-center">
        <h2 className="text-3xl font-bold">Get In Touch</h2>
        <p className="text-lg text-default-600">
          Have questions or feedback? We'd love to hear from you!
        </p>
        <p className="text-default-600">
          Created by <span className="font-semibold">Samuel Reitenbach</span>
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            as={Link}
            href="https://github.com/SamuReitenbach/LinePrep"
            isExternal
            variant="flat"
          >
            View on GitHub
          </Button>
        </div>
      </section>
    </div>
  );
}