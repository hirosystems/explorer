import { useContractById } from '@/app/common/queries/useContractById';
import { useApi } from '@/common/api/client';
import { getTransactionStatus } from '@/common/utils/transactions';
import { ContractSource } from '@/components/contract-source';
import { FunctionSummarySection } from '@/components/function-summary/function-summary';
import { PostConditions } from '@/components/post-conditions';
import { FC, useMemo } from 'react';

import {
  Block,
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TxPage } from '../TxPage';
import { TxDetails } from './TxDetails';

export const ContractCallPage: FC<{
  tx: ContractCallTransaction | MempoolContractCallTransaction;
  block?: Block;
  contractId?: string;
  claritySyntax: Record<string, any>;
}> = ({ tx, block, contractId = '', claritySyntax }) => {
  const api = useApi();

  const { data: contract } = useContractById(api, { contractId }, { enabled: !!contractId });

  const txStatus = useMemo(() => getTransactionStatus(tx), [tx]);
  const result = 'tx_result' in tx && tx.tx_result;

  const source = contract?.source_code;
  if (!contractId) return null;
  return (
    <TxPage
      tx={tx}
      block={block}
      contractId={contractId}
      txDetails={<TxDetails tx={tx} block={block} />}
    >
      <FunctionSummarySection
        result={result}
        summary={tx.contract_call}
        btc={null}
        txStatus={txStatus}
      />
      <PostConditions tx={tx} />
      <ContractSource
        sourceTx={tx.contract_call.contract_id}
        source={source}
        contractCall={tx.contract_call}
        claritySyntax={claritySyntax}
      />
    </TxPage>
  );
};
