# mise owns tool versions; just owns repository commands.
# This also works when mise is not activated in the caller's shell.
set shell := ["mise", "exec", "--", "sh", "-eu", "-c"]
set positional-arguments

# Show available commands.
default:
    @just --list

# Install JavaScript dependencies and Git hooks using the committed lockfile.
install:
    pnpm install --frozen-lockfile
    pnpm exec lefthook install

# Start the public website on port 4322 (no database required).
alias dev := website-dev

website-dev *args:
    pnpm --filter @mosa/website dev "$@"

website-preview *args:
    pnpm --filter @mosa/website preview "$@"

# Build the public website.
build: website-build

website-build:
    pnpm --filter @mosa/website build

website-check:
    pnpm --filter @mosa/website check

# Validate the Git-backed public collection and all cross-file references.
collection-check:
    pnpm --filter @mosa/website validate:collection

format:
    pnpm exec biome format --write .

format-check:
    pnpm exec biome format .

lint:
    pnpm exec biome lint .

check:
    pnpm exec biome check .

check-fix:
    pnpm exec biome check --write .

# Used by the pre-commit hook; filenames remain separate shell arguments.
check-staged +files:
    pnpm exec biome check --write --no-errors-on-unmatched "$@"

# Check local documentation links, anchors and just recipe references.
docs-check:
    node --import tsx scripts/check-docs.ts

typecheck-scripts:
    pnpm exec tsc --project tsconfig.scripts.json

typecheck: typecheck-scripts website-check

test-unit *args:
    pnpm exec vitest run "$@"

test: test-unit

# All checks that do not require Docker.
verify-static: check docs-check typecheck test-unit build

verify: verify-static

# Build the production website image using the repository root as the build context.
docker-build: website-image

website-image:
    docker build --file apps/website/Dockerfile --tag mosa-website:local .

# Deploy the website and bundled collection from the current main commit.
website-deploy:
    node --import tsx scripts/deploy-website.ts
