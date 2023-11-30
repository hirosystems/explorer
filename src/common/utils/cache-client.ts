import Redis from 'ioredis';
import 'server-only';

import { REDIS_URL } from '../constants/env';

let client: Redis;

export function getCacheClient() {
  if (!REDIS_URL) {
    console.log('[debug] REDIS_URL is not defined');
    return {
      get: () => Promise.resolve(),
      set: () => undefined,
    };
  }

  console.log('[debug] REDIS_URL: ', REDIS_URL);

  if (!client) {
    client = new Redis(REDIS_URL);

    client.on('error', err => {
      console.error('Error connecting to Redis:', err);
    });

    client.on('connect', () => {
      console.log('[debug] Connected to Redis!');
    });
  }

  return client;
}
