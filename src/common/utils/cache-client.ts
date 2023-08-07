// import 'server-only';
import Redis from 'ioredis';
import { REDIS_URL } from '@/common/constants';

let client: Redis;

export function getCacheClient() {
  if (!REDIS_URL) {
    console.log('REDIS_URL is not defined');
    return {
      get: () => Promise.resolve(),
      set: () => undefined,
    };
  }

  console.log('REDIS_URL: ', REDIS_URL);

  if (!client) {
    client = new Redis(REDIS_URL);

    client.on('error', err => {
      console.error('Error connecting to Redis:', err);
    });

    client.on('connect', () => {
      console.log('Connected to Redis!');
    });
  }

  return client;
}
