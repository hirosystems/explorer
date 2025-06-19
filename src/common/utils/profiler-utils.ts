import Pyroscope from '@pyroscope/nodejs';

export function initServerProfiling() {
  try {
    console.log('initServerProfiling init...');
    Pyroscope.init({
      tags: {
        environment: process.env.NODE_ENV || 'production',
        network: process.env.NEXT_PUBLIC_DEPLOYMENT_URL?.includes('testnet')
          ? 'testnet'
          : 'mainnet',
        service: 'stacks-explorer',
      },
      flushIntervalMs: 60000,
      wall: {
        collectCpuTime: true,
      },
    });

    console.log('initServerProfiling start...');
    Pyroscope.start();

    console.log('Pyroscope server profiling initialized');
  } catch (err) {
    console.log('failed to run initServerProfiling', err);
  }
}
