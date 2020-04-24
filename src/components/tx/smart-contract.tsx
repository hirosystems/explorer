import * as React from 'react';
import { Stack } from '@blockstack/ui';

import { ContractSource } from '@components/contract-source';
import { PageTop } from '@components/page';
import { TokenTransfers } from '@components/token-transfer';
import { TransactionDetails } from '@components/transaction-details';

import { SmartContractTransaction } from '@blockstack/stacks-blockchain-sidecar-types';
import { TransactionType } from '@models/transaction.interface';

interface SmartContractPageProps {
  transaction: SmartContractTransaction;
}

const SmartContractPage = ({ transaction }: SmartContractPageProps) => {
  return (
    <>
      <PageTop status={transaction.tx_status} type={TransactionType.SMART_CONTRACT} />
      <Stack spacing="extra-loose">
        <TransactionDetails
          contractName={transaction.smart_contract.contract_id.split('.')[1]}
          transaction={transaction}
        />
        <TokenTransfers events={transaction.events} />
        <ContractSource source={transaction.smart_contract.source_code} />
      </Stack>
    </>
  );
};

export default SmartContractPage;
