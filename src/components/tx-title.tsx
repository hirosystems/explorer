import { PageTitle } from '@/app/common/components/PageTitle';
import { TxStatus } from '@/common/types/tx';
import { getContractName, getFunctionName, microToStacks } from '@/common/utils';
import { getTransactionStatus } from '@/common/utils/transactions';
import { Status } from '@/components/status';
import { Tag, TagProps } from '@/components/tags';
import { Box, BoxProps, Flex, Stack, StackProps } from '@/ui/components';
import { Title } from '@/ui/typography';
import { useMemo } from 'react';

import type { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import WhyTxFail from './why-tx-fail';

export interface TitleProps {
  contractName?: string;
  tx: MempoolTransaction | Transaction;
}

const Tags = ({
  type,
  ...rest
}: { type: Transaction['tx_type'] | Transaction['tx_type'][] } & BoxProps) =>
  Array.isArray(type) ? (
    <Box {...rest}>
      <Stack isInline spacing="8px">
        {type.map((t: Transaction['tx_type'], key) => (
          <Tag color="white" bg="rgba(255,255,255,0.24)" type={t} key={key} />
        ))}
      </Stack>
    </Box>
  ) : (
    <Tag
      color="white"
      bg="rgba(255,255,255,0.24)"
      type={type}
      {...(rest as Omit<TagProps, 'type'>)}
    />
  );

const TxTags = ({
  tx,
  txStatus,
  type,
}: TitleProps & {
  txStatus?: TxStatus;
  type: Transaction['tx_type'] | MempoolTransaction['tx_type'];
} & BoxProps) => (
  <Stack isInline spacing="8px" mt={'0px !important'}>
    <Tags type={type} />
    {txStatus && <Status txStatus={txStatus as any} />}
    <WhyTxFail tx={tx} />
  </Stack>
);

export const getTxTitle = (transaction: Transaction | MempoolTransaction) => {
  switch (transaction.tx_type) {
    case 'smart_contract':
      return getContractName(transaction?.smart_contract?.contract_id);
    case 'contract_call':
      return getFunctionName(transaction);
    case 'token_transfer':
      return `${microToStacks(transaction.token_transfer.amount)} STX transfer`;
    case 'coinbase':
      return 'block_height' in transaction && transaction?.block_height
        ? `Block #${transaction.block_height} coinbase`
        : 'Coinbase';
    case 'poison_microblock':
      return `Poison microblock transaction`;
  }
};

export const TxTitle = ({ contractName, tx, ...rest }: TitleProps & StackProps) => {
  const txStatus = useMemo(() => getTransactionStatus(tx), [tx]);

  return (
    <Stack {...rest} mb={'24px'}>
      <Title as="h1" color="white" fontSize="36px" mt={'72px'} mb={'16px'}>
        {getTxTitle(tx)}
      </Title>
      <TxTags tx={tx} txStatus={txStatus} type={tx.tx_type} />
    </Stack>
  );
};
