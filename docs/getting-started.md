---
Title: Getting Started
---

# Getting Started

The Explorer is built with [React](https://reactjs.org/), [next.js](https://github.com/vercel/next.js) and [Chakra UI](https://chakra-ui.com/).

## Prerequisites

Before running the Explorer, ensure that you have the following tools installed:
- [NodeJS](https://nodejs.dev/en/) that includes `npm`
- [PNPM](https://pnpm.io/installation/)

If you are using a mac, we highly recommend using [Homebrew](https://brew.sh/) to install these tools.

You should also be [familiar with Git](https://docs.github.com/en/get-started/quickstart/git-and-github-learning-resources).

## Run in development mode
- Fork the [repository](https://github.com/hirosystems/explorer)
- Navigate to the project folder
- Create your branch from `main` following [Semantic Commit Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
- Run `pnpm i` in the repository root to install dependencies.
- Run `pnpm dev` to run the application at http://localhost:3000
- If you are changing existing functions or creating a new one, make sure to write unit tests.

## Building for production
If you want to submit a contribution or suggest a code change, run these commands to be ready to send a PR

Run `pnpm lint` to lint your code with eslint and run pritter to follow our coding guidelines
Run `pnpm test:unit` to run unit test
Run `pnpm build` to build the Stacks Explorer for production
