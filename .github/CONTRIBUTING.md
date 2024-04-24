# Contributing to the Stacks Explorer

Thank you for considering contributing to the Stacks Explorer! We welcome any contributions, whether it's bug fixes, new features, or improvements to the existing codebase.

### Your First Pull Request

Working on your first Pull Request? You can learn how from this free video series:

[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

To help you get familiar with our contribution process, we have a list of [good first issues](https://github.com/hirosystems/explorer/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) that contain bugs that have a relatively limited scope. This is a great place to get started.

If you decide to fix an issue, please be sure to check the comment thread in case somebody is already working on a fix. If nobody is working on it at the moment, please leave a comment stating that you intend to work on it so other people don’t accidentally duplicate your effort.

If somebody claims an issue but doesn’t follow up for more than two weeks, it’s fine to take it over but you should still leave a comment. **Issues won't be assigned to anyone outside the core team**.

### Contribution Prerequisites

Before running the Explorer, ensure that you have the following tools installed:

1. Install [NodeJS](https://nodejs.dev/) that includes `npm`
1. Install [Pnpm](https://pnpm.io/installation)

If you are using a mac, we highly recommend using [Homebrew](https://brew.sh/) to install these tools.

You should also be [familiar with Git](https://docs.github.com/en/get-started/quickstart/git-and-github-learning-resources).


### Sending a Pull Request

The Explorer team is monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation.

Before submitting a pull request, please make sure the following is done:

#### Run in development mode 

- Fork [the repository](https://github.com/hirosystems/explorer)
- Navigate to the project folder
- Create your branch from `main` following [Semantic Commit Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
- Run `pnpm i` in the repository root to install dependencies.
- Run `pnpm dev` to run the application at http://localhost:3000
- If you are changing existing functions or creating a new one, make sure to write unit tests.

#### Building for production

Once you are are happy woith your code change, run these commands to be ready to send a PR

- Run `pnpm lint` to lint your code with eslint and run pritter to follow our coding guidelines
- Run `pnpm test:unit` to run unit test
- Run `pnpm build` to build the Stacks Explorer for production

Now you are ready! When you send the PR make sure to sign the Contributor License Agreement and that all the checks are green.

We are looking forward for your PRs and working together!