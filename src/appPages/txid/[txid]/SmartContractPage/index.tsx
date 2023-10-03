import { useQuery } from '@tanstack/react-query';
import {
  Block,
  MempoolSmartContractTransaction,
  SmartContractTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { PostConditions } from '@/components/post-conditions';
import { transactionQK, TransactionQueryKeys } from '@/features/transaction/query-keys';
import { useTransactionQueries } from '@/features/transaction/use-transaction-queries';

import { AddressTxListTabs } from '../../../common/components/tx-lists/tabs/AddressTxListTabs';
import { TxPage } from '../TxPage';
import { ContractTabs } from './ContractTabs';
import { TxDetails } from './TxDetails';

export function SmartContractPage({
  tx,
  block,
  contractId,
  claritySyntax,
}: {
  tx: SmartContractTransaction | MempoolSmartContractTransaction;
  block?: Block;
  contractId?: string;
  claritySyntax: Record<string, any>;
}) {
  const queries = useTransactionQueries();

  const { data: contract } = useQuery(
    transactionQK(TransactionQueryKeys.contract, contractId),
    queries.fetchContract(contractId),
    { enabled: !!contractId }
  );

  const source = contract?.source_code;

  if (!contractId) return null;
  return (
    <TxPage
      tx={tx}
      block={block}
      contractId={contractId}
      txDetails={<TxDetails tx={tx} block={block} />}
    >
      <PostConditions tx={tx} />
      <ContractTabs
        source={source}
        contract={contract}
        contractId={contractId}
        claritySyntax={claritySyntax}
      />
      <AddressTxListTabs address={contractId} />
    </TxPage>
  );
}
