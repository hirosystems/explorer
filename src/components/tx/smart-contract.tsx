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
import { PagePanes } from '@components/page-panes';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';

const SmartContractPage = ({
  transaction,
  block,
}: TxData<SmartContractTransaction> & { block?: Block }) => (
  <>
    <PageTop tx={transaction as any} />
    <PagePanes fullWidth={transaction.tx_status === 'pending' || block === null}>
      <Stack spacing="extra-loose">
        <TransactionDetails
          contractName={getContractName(transaction.smart_contract.contract_id)}
          transaction={transaction}
        />
        {'events' in transaction && <Events events={transaction.events} />}
        <ContractSource source={transaction.smart_contract.source_code} />
        <PostConditions conditions={transaction.post_conditions} />
      </Stack>
      {block && <BtcAnchorBlockCard block={block} />}
    </PagePanes>
  </>
);

export default SmartContractPage;
