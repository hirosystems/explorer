import React from 'react';

import { Flex, Box, BlockstackIcon, FlexProps } from '@blockstack/ui';
import { Tag } from '@components/tags';
import { microToStacks, truncateMiddle, toRelativeTime } from '@common/utils';
import { Transaction, TransactionType } from '@models/transaction.interface';
import { Caption, Title } from '@components/typography';
import { getContractName } from '@common/utils';
import { DefaultContract } from '@components/icons/default-contract';

export const ItemIcon = React.memo(({ type, ...rest }: { type: Transaction['tx_type'] }) => {
  switch (type) {
    case 'smart_contract' || 'contract_call':
      return (
        <Box display={['none', 'none', 'block']} {...rest}>
          <DefaultContract size="36px" />
        </Box>
      );
    default:
      return (
        <Box display={['none', 'none', 'block']} {...rest}>
          <BlockstackIcon size="36px" />
        </Box>
      );
  }
});

interface TxItemProps extends FlexProps {
  tx: Transaction;
  isFocused?: boolean;
  isHovered?: boolean;
}

const getTitle = (transaction: Transaction) => {
  switch (transaction.tx_type) {
    case 'smart_contract':
      return getContractName(transaction.smart_contract.contract_id);
    case 'contract_call':
      return getContractName(transaction.contract_call.contract_id);
    case 'token_transfer':
      return 'Token transfer';
    default:
      return truncateMiddle(transaction.tx_id, 10);
  }
};

const getCaption = (tx: Transaction) => {
  const date = toRelativeTime((tx as any).burn_block_time * 1000);
  const truncatedId = truncateMiddle(tx.tx_id, 4);
  switch (tx.tx_type) {
    case 'smart_contract':
      return date + ' ∙ ' + truncatedId;
    case 'contract_call':
      return date + ' ∙ ' + truncatedId;
    case 'token_transfer':
      return date + ' ∙ ' + microToStacks(tx.token_transfer.amount) + ' STX';
    default:
      return date;
  }
};

export const TxItem = React.forwardRef(
  ({ tx, isHovered, isFocused, ...rest }: TxItemProps, ref: any) => (
    <Flex
      px="base"
      justifyContent="space-between"
      alignItems="center"
      height="64px"
      style={{ outline: 'none' }}
      flexShrink={0}
      ref={ref}
      cursor={isHovered ? ['unset', 'unset', 'pointer'] : undefined}
      {...rest}
    >
      <Flex align="center">
        <Box
          display={['none', 'none', 'block']}
          opacity={0.3}
          color="var(--colors-invert)"
          mr="base"
        >
          <ItemIcon type={tx.tx_type} />
        </Box>
        <Flex flexDirection="column">
          <Title
            textDecoration={isFocused || isHovered ? 'underline' : 'unset'}
            fontSize="14px"
            display="block"
          >
            {getTitle(tx)}
          </Title>
          <Caption>{getCaption(tx)}</Caption>
        </Flex>
      </Flex>
      <Box>
        <Tag type={tx.tx_type as TransactionType} />
      </Box>
    </Flex>
  )
);
