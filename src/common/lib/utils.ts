import type { MempoolTransactionsOptions, ConfirmedTransactionsOptions } from './types';
import { generateTypesQueryString } from '@common/api/utils';

type GenerateQueryPathOptions = MempoolTransactionsOptions | ConfirmedTransactionsOptions;

export function generateTransactionsQueryPath(options: GenerateQueryPathOptions): string {
  const { limit, page, txTypes } = options;

  let string = '';

  if ('mempool' in options && options.mempool) {
    string += '/mempool';
  }

  if (limit) {
    string += `?limit=${limit}`;
    if (page) {
      string += `&offset=${page}`;
    }
  }

  if (txTypes) {
    string += generateTypesQueryString(txTypes);
  }

  return string;
}
