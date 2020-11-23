import * as React from 'react';
import { Grid, Stack } from '@stacks/ui';

import { ContractSource } from '@components/contract-source';
import { PageTop } from '@components/page';
import { TransactionDetails } from '@components/transaction-details';
import { PostConditions } from '@components/post-conditions';

import { Block, SmartContractTransaction } from '@blockstack/stacks-blockchain-api-types';
import { TxData } from '@common/types/tx';
import { getContractName } from '@common/utils';
import { Events } from '@components/tx-events';

const SmartContractPage = ({
  transaction,
}: TxData<SmartContractTransaction> & { block?: Block }) => (
  <>
    <PageTop tx={transaction as any} />

    <Stack spacing="extra-loose">
      <TransactionDetails
        contractName={getContractName(transaction.smart_contract.contract_id)}
        transaction={transaction}
      />
      {'events' in transaction && <Events events={transaction.events} />}
      <ContractSource source={transaction.smart_contract.source_code} />
      <PostConditions conditions={transaction.post_conditions} />
    </Stack>
  </>
);

export default SmartContractPage;
