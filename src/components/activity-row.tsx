import * as React from 'react';
import { NumberedBadge } from '@components/numbered-badge';
import { Flex, FlexProps } from '@stacks/ui';
import { TransferIcon } from '@components/icons/transfer';
import { Transaction } from '@models/transaction.interface';
import { getTxTypeIcon } from '@components/transaction-item';

export const Activity: React.FC<FlexProps & { txs: Transaction[] }> = ({ txs, ...rest }) => {
  const contractCalls = txs?.filter(tx => tx.tx_type === 'contract_call');
  const contractCreations = txs?.filter(tx => tx.tx_type === 'smart_contract');
  const transactions = txs?.filter(
    tx => tx.tx_type !== 'contract_call' && tx.tx_type !== 'smart_contract'
  );
  const ContractCallIcon = getTxTypeIcon('contract_call');
  const ContractIcon = getTxTypeIcon('smart_contract');
  return (
    <Flex flexDirection={['column', 'column', 'row']} {...rest}>
      <NumberedBadge
        mr={['unset', 'unset', 'base']}
        my={['tight', 'tight', 'unset']}
        array={transactions}
        icon={TransferIcon}
        singular="transfer"
      />
      <NumberedBadge
        mr={['unset', 'unset', 'base']}
        mb={['tight', 'tight', 'unset']}
        array={contractCreations}
        icon={ContractIcon}
        singular="contract"
      />
      <NumberedBadge
        mr={['unset', 'unset', 'base']}
        array={contractCalls}
        icon={ContractCallIcon}
        singular="contract call"
      />
    </Flex>
  );
};
