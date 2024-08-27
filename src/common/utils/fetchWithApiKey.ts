'use client';

import { createApiKeyMiddleware, createFetchFn } from '@stacks/network';

const apiMiddleware = createApiKeyMiddleware({ apiKey: '' });
export const fetchWithApiKey = createFetchFn(apiMiddleware);
