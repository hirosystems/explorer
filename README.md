# Stacks 2.0 Explorer

![An image of the Stacks Explorer](/explorer-image.png 'Stacks Explorer')

### Getting started

The Stacks Explorer is built with react, [next.js](https://github.com/zeit/next.js) and [@blockstack/ui](https://github.com/blockstack/ux/tree/master/packages/ui). To run the explorer locally, you can copy this repo and install the dependencies needed. Make sure you have `yarn` installed.

```sh
yarn
```

### Env variables

The application needs a couple of env variables to work properly:

```
MOCKNET_API_SERVER=https://crashy-stacky.zone117x.com
TESTNET_API_SERVER=https://sidecar.staging.blockstack.xyz
```

### Run in development mode

To build and run the application, you can run this yarn task which will launch the application at http://localhost:3000.

```sh
yarn dev
```

### Using a local mocknet

The Stacks Explorer connects to the [Stacks Blockchain](https://github.com/blockstack/stacks-blockchain) via an API server found here: [`stacks-blockchain-sidecar`](https://github.com/blockstack/stacks-blockchain-sidecar).
The Explorer can connect and switch between a few different versions of the network: testnet, mocknet, and a local instance. To run a local instance of the Sidecar API, [please read this](https://github.com/blockstack/stacks-blockchain-sidecar/blob/master/readme.md#quick-start).
Once you have the Sidecar API running, it should be located at `http://localhost:3999`. You can then from within your local version of the Explorer switch between the three network options:

![A gif of the network switcher found within the explorer](/localhost-switch.gif 'Switching networks in the explorer')

### Building for production

To build for production, run `yarn build` which will run the default next.js build task.
