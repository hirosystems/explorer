import { createApiKeyMiddleware, createFetchFn } from '@stacks/network';
import { X_API_KEY } from '@/common/constants';

const apiMiddleware = createApiKeyMiddleware({ apiKey: X_API_KEY });
export const fetchWithApiKey = createFetchFn(apiMiddleware);
