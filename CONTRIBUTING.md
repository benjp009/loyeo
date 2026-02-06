# Contributing to Loyeo

Thank you for your interest in contributing to Loyeo! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork and clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/loyeo.git
cd loyeo
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

4. **Start development**

```bash
pnpm dev
```

## Branch Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/<ticket>-<description>` | `feature/TS-002-user-auth` |
| Bug Fix | `fix/<ticket>-<description>` | `fix/TS-015-login-error` |
| Hotfix | `hotfix/<description>` | `hotfix/critical-security-patch` |

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, no code change
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `perf` - Performance improvement
- `test` - Adding tests
- `build` - Build system or dependencies
- `ci` - CI/CD configuration
- `chore` - Maintenance tasks
- `revert` - Revert a previous commit

### Scopes

- `web` - Web app changes
- `api` - API changes
- `docs` - Documentation app changes
- `ui` - UI package changes
- `config` - Config package changes
- `types` - Types package changes
- `root` - Root-level changes

### Examples

```bash
feat(web): add user profile page
fix(api): resolve authentication token expiry issue
docs: update API reference documentation
chore(root): upgrade Turborepo to v2.3
```

## Pull Request Process

1. **Create a feature branch** from `main`

```bash
git checkout -b feature/TS-XXX-description
```

2. **Make your changes** and commit following the commit convention

3. **Push your branch** and create a Pull Request

4. **Fill out the PR template** with all relevant information

5. **Wait for review** - at least one approval is required

6. **Address feedback** if requested

7. **Merge** once approved and CI passes

## Code Style

- **TypeScript** - All code should be typed
- **ESLint** - Run `pnpm lint` to check for issues
- **Prettier** - Code is auto-formatted on save
- **Tailwind CSS** - Use utility classes for styling

## Testing

```bash
# Run all tests
pnpm test

# Run tests for a specific package
pnpm --filter @loyeo/web test
```

## Documentation

- Update documentation when adding new features
- Keep the docs app (`apps/docs`) up to date
- Add JSDoc comments for exported functions and types

## Questions?

Feel free to open an issue for any questions or concerns.
