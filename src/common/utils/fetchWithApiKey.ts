'use client';

import { createApiKeyMiddleware, createFetchFn } from '@stacks/common';

const apiMiddleware = createApiKeyMiddleware({ apiKey: '' });
export const fetchWithApiKey = createFetchFn(apiMiddleware);
