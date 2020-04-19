import * as React from 'react';
import Router from 'next/router';
import { validateTxId, validateContractName } from '@common/utils';

export const search = (query: string) => async (e: React.FormEvent) => {
  e.preventDefault();

  if (!query.trim().length) {
    console.warn('No query provided');
    return;
  }

  if (query.includes('.') && validateContractName(query)) {
    await Router.push(
      {
        pathname: '/txid/[txid]',
        query: { txid: query },
      },
      `/txid/${query}`
    );
    return;
  }

  if (query.includes('.') && !validateContractName(query)) {
    console.warn('Invalid contract name provided');
    return;
  }

  if (validateTxId(query)) {
    await Router.push(
      {
        pathname: '/txid/[txid]',
        query: { txid: query },
      },
      `/txid/${query}`
    );
    return;
  }

  if (!validateTxId(query)) {
    console.warn('Invalid txid provided');
    return;
  }
};
