'use client';

import * as React from 'react';
import { use } from 'react';

import { SmartContract } from './SmartContract/SmartContract';
import { Tx } from './Tx';

function TransactionPage(props: { params: Promise<{ txId: string }> }) {
  const { txId } = use(props.params);
  const isContractId = txId.includes('.');

  if (isContractId) {
    return <SmartContract contractId={txId} />;
  }

  return <Tx txId={txId} />;
}

export default TransactionPage;
