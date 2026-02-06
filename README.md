# Loyeo

Modern SaaS platform built with Next.js, Firebase, and TypeScript.

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Backend:** Firebase Functions, Hono
- **Database:** Cloud Firestore
- **Monorepo:** Turborepo, pnpm
- **CI/CD:** GitHub Actions, Vercel

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

```bash
# Clone the repository
git clone https://github.com/benjp009/loyeo.git
cd loyeo

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start development servers
pnpm dev
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run specific app
pnpm --filter @loyeo/web dev    # Web app (port 3000)
pnpm --filter @loyeo/api dev    # API with Firebase emulators
pnpm --filter @loyeo/docs dev   # Docs (port 3001)

# Build all apps
pnpm build

# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Format code
pnpm format

# Clean build artifacts
pnpm clean
```

## Project Structure

```
loyeo/
├── apps/
│   ├── web/          # Next.js 15 frontend
│   ├── api/          # Firebase Functions + Hono
│   └── docs/         # Nextra documentation
├── packages/
│   ├── ui/           # Shared React components
│   ├── config/       # Shared ESLint, TypeScript, Tailwind configs
│   └── types/        # Shared TypeScript types
├── firebase/         # Firestore & Storage rules
└── .github/          # GitHub Actions workflows
```

## Apps

| App | Description | Port |
|-----|-------------|------|
| `@loyeo/web` | Next.js frontend | 3000 |
| `@loyeo/api` | Firebase Functions API | 5001 |
| `@loyeo/docs` | Documentation site | 3001 |

## Packages

| Package | Description |
|---------|-------------|
| `@loyeo/ui` | Shared UI components (Button, Card, etc.) |
| `@loyeo/config` | Shared configurations for ESLint, TypeScript, Tailwind |
| `@loyeo/types` | Shared TypeScript types and interfaces |

## Firebase Emulators

```bash
# Start all emulators
pnpm --filter @loyeo/api dev

# Emulator UI: http://localhost:4000
# Functions: http://localhost:5001
# Firestore: http://localhost:8080
# Auth: http://localhost:9099
# Storage: http://localhost:9199
```

## Branch Strategy

- `main` - Production-ready code, protected branch
- `feature/<ticket>-<description>` - Feature branches
- `fix/<ticket>-<description>` - Bug fix branches
- `hotfix/<description>` - Critical production fixes

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(web): add user authentication
fix(api): resolve token validation error
docs: update README with setup instructions
chore(root): update dependencies
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT
