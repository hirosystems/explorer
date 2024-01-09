'use client';

import * as React from 'react';

import { SmartContract } from './SmartContract/SmartContract';
import { Tx } from './Tx';

function TransactionPage({ params: { txId } }: { params: { txId: string } }) {
  const isContractId = txId.includes('.');

  if (isContractId) {
    return <SmartContract contractId={txId} />;
  }

  return <Tx txId={txId} />;
}

export default TransactionPage;
