import * as React from 'react';
import { Grid, Stack } from '@stacks/ui';

import { ContractSource } from '@components/contract-source';
import { PageTop } from '@components/page';
import { TokenTransfers } from '@components/token-transfer';
import { TransactionDetails } from '@components/transaction-details';
import { PostConditions } from '@components/post-conditions';

import { Block, SmartContractTransaction } from '@blockstack/stacks-blockchain-api-types';
import { TxData } from '@common/types/tx';
import { getContractName } from '@common/utils';

const SmartContractPage = ({
  transaction,
  contract,
}: TxData<SmartContractTransaction> & { block?: Block }) => (
  <>
    <PageTop tx={transaction as any} />

    <Stack spacing="extra-loose">
      <TransactionDetails
        contractName={getContractName(contract.contract_id)}
        transaction={transaction}
      />
      {'events' in transaction && <TokenTransfers events={transaction.events} />}
      <ContractSource source={transaction.smart_contract.source_code} />
      <PostConditions conditions={transaction.post_conditions} />
    </Stack>
  </>
);

export default SmartContractPage;
