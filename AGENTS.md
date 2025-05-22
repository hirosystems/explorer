# AGENTS Instructions for Stacks Explorer

## Overview
The Stacks Explorer is a Next.js (App Router) application used to monitor the Stacks blockchain. It relies heavily on React, Chakra UI, Redux Toolkit and various Stacks packages. Development uses TypeScript throughout and is managed with PNPM.

## Environment setup
1. Install NodeJS and PNPM. Homebrew is recommended on macOS.
2. Install dependencies with `pnpm i` from the repository root.
3. Configure environment variables as documented in `docs/getting-started.md`:
   ```
   NEXT_PUBLIC_MAINNET_API_SERVER=https://api.hiro.so
   NEXT_PUBLIC_TESTNET_API_SERVER=https://api.testnet.hiro.so
   NEXT_PUBLIC_LEGACY_EXPLORER_API_SERVER=https://explorer-api.legacy.blockstack.org
   NEXT_PUBLIC_DEPLOYMENT_URL=https://explorer.hiro.so
   NEXT_PUBLIC_MAINNET_ENABLED="true"
   NEXT_PUBLIC_DEFAULT_POLLING_INTERVAL="10000"
   ```

## Common commands
- `pnpm dev` – run the development server.
- `pnpm lint` – run ESLint and Prettier checks.
- `pnpm test:unit` – execute Jest unit tests.
- `pnpm test:e2e` – run Playwright tests.
- `pnpm build` – build production output (also runs Chakra type generation).

Always run `pnpm lint`, `pnpm test:unit`, and `pnpm build` before committing changes.

## Planning and test-driven development
Always plan work before executing. Write out the problem description, analyze the problem, understand the idiomatic solutions, propose options, and choose the best solution to implement. Planning should be TDD‑driven, including writing tests prior to implementation. Think through verification steps before coding.

## Commit guidelines
- Commit messages must follow Conventional Commits (enforced via commitlint).
- Run `pnpm lint` and `pnpm test:unit` locally to ensure CI success.
- Keep commits focused; prefer a single commit per PR.

## Pull request expectations
A PR description **must**:
1. Summarize the change and its rationale.
2. Reference the related issue or workplan.
3. Explain design decisions and any trade offs.
4. Include instructions to reproduce the change.
5. Provide evidence of testing: mention running `pnpm lint`, `pnpm test:unit`, and `pnpm build` (and `pnpm test:e2e` where relevant). Include screenshots or logs if applicable.
6. Fill out the checklist in `pull_request_template.md`.

Clear, detailed PRs instill confidence in reviewers and maintainers.

## Additional notes
- The project uses Redux slices under `src/features` and a `GlobalContextProvider` in `src/common/context` to manage network state.
- Styling components live in `src/ui` and rely on Chakra UI.
- Tests reside in `src/__tests__` for unit tests and `e2e/` for Playwright tests.
