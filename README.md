# LinePrep

A modern, interactive chess opening practice application designed to help chess players master their opening repertoire through spaced repetition and active recall.

## Features

### Opening Practice
- **Standard Openings Database**: Practice from a comprehensive collection of chess openings and variations
- **Custom Openings**: Create and practice your own opening lines
- **Interactive Chess Board**: Make moves on a fully functional chess board with instant feedback
- **Smart Practice Algorithm**: Focus on specific move numbers and positions you want to master

### Organization & Management
- **Stacks**: Organize multiple openings into custom collections for focused practice sessions
- **Opening Library**: Browse and manage your opening repertoire
- **Variation Support**: Practice specific variations within openings

### Performance Tracking
- **Detailed Statistics**: Track your accuracy, total attempts, and progress across all openings
- **Current Streak**: Monitor your consecutive correct moves
- **Opening-Specific Metrics**: View performance data for each opening individually
- **Progress History**: See when you last practiced each opening

### User Experience
- **User Authentication**: Secure login and signup powered by Supabase
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Dark Mode Support**: Easy on the eyes during late-night training sessions
- **Intuitive Navigation**: Streamlined sidebar navigation for quick access to all features

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Chess Engine**: [chess.js](https://github.com/jhlywa/chess.js)
- **Chess Board**: [react-chessboard](https://github.com/Clariity/react-chessboard)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **UI Components**: [HeroUI v2](https://heroui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd LinePrep
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
LinePrep/
├── app/
│   ├── (app)/                 # Protected app routes
│   │   ├── custom-openings/   # Custom opening management
│   │   ├── openings/          # Standard openings library
│   │   ├── practice/          # Practice interface
│   │   ├── stacks/            # Stack management
│   │   ├── statistics/        # Performance statistics
│   │   └── dashboard/         # User dashboard
│   ├── (auth)/                # Authentication routes
│   │   ├── login/
│   │   └── signup/
│   └── api/                   # API routes
│       └── practice/          # Practice session endpoints
├── components/                # Reusable React components
│   ├── ChessBoard.tsx         # Chess board component
│   └── app-sidebar.tsx        # Navigation sidebar
└── lib/                       # Utility libraries
    └── supabase/              # Supabase client configuration
```

## Usage

1. **Sign Up/Login**: Create an account or log in to start practicing
2. **Browse Openings**: Explore the opening library and select openings to practice
3. **Create Custom Openings**: Add your own opening lines to your repertoire
4. **Organize with Stacks**: Group related openings together for focused practice
5. **Practice**: Enter practice mode and make the correct moves in your chosen openings
6. **Track Progress**: Monitor your improvement through the statistics dashboard

## Development

### Linting

```bash
npm run lint
```

### Using pnpm

If you prefer `pnpm`, add the following to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

Then run:
```bash
pnpm install
```

## License

MIT License - feel free to use this project for learning or as a base for your own chess training application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with passion for chess improvement and modern web development.
