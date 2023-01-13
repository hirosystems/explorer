import { X_API_KEY } from '@/common/constants';

import { createApiKeyMiddleware, createFetchFn } from '@stacks/network';

const apiMiddleware = createApiKeyMiddleware({ apiKey: X_API_KEY });
export const fetchWithApiKey = createFetchFn(apiMiddleware);
