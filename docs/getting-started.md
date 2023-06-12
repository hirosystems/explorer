---
Title: Getting Started
---

# Getting Started

The Explorer is built with [React](https://reactjs.org/), [next.js](https://github.com/vercel/next.js) and [@stacks/ui](https://github.com/hirosystems/ui).

## Prerequisites

To run the explorer locally, you must first clone the [Explorer repository](https://github.com/hirosystems/explorer).

You must also enusre you have installed the project dependencies listed below.

- [NodeJS](https://nodejs.dev/en/) that includes `npm`
- [PNPM](https://pnpm.io/installation/)

It is also highly recommended you install [Homebrew](https://brew.sh/).

## Installing Project Dependencies

To install project dependencies:

1. Open your terminal window and make sure you are in the `/explorer` folder.
2. Run the `pnpm i` command to install the project dependencies.

## Setting Environment Variables

The Explorer application needs the environment variables listed below to work properly. 

```
NEXT_PUBLIC_MAINNET_API_SERVER=https://api.hiro.so
NEXT_PUBLIC_TESTNET_API_SERVER=https://api.testnet.hiro.so
NEXT_PUBLIC_LEGACY_EXPLORER_API_SERVER=https://explorer-api.legacy.blockstack.org
NEXT_PUBLIC_DEPLOYMENT_URL=https://explorer.hiro.so
NEXT_PUBLIC_MAINNET_ENABLED="true"
NEXT_PUBLIC_DEFAULT_POLLING_INTERVAL="10000"
```

> **_NOTE:_**
>
> If you are working in a macOS environment, you will need to add these variable to `/etc/paths`.
