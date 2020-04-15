import * as React from 'react';
import Router from 'next/router';
import { validateTxId } from '@common/utils';

export const search = (query: string) => async (e: React.FormEvent) => {
  e.preventDefault();
  if (!query.trim().length) {
    console.warn('No txid provided');
    return;
  }
  if (!validateTxId(query)) {
    console.warn('Invalid txid provided');
    return;
  }
  await Router.push(
    {
      pathname: '/txid/[txid]',
      query: { txid: query },
    },
    `/txid/${query}`
  );
};
