import React from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useHover, useFocus } from 'use-events';
import { Flex, Box, Text, FlexProps, BoxProps } from '@blockstack/ui';
import { DialogCard } from '@components/dialog-card';
import { Tag } from '@components/tags';
import { truncateMiddle } from '@common/utils';
import { Transaction, TransactionType } from '@models/transaction.interface';

dayjs.extend(relativeTime);

export interface RecentlyViewedProps extends FlexProps {
  transactions: Transaction[];
}

export const RecentlyViewed = ({ transactions, style = {}, ...rest }: RecentlyViewedProps) => {
  return (
    <DialogCard width={['100%', '100%', '544px']} maxHeight="308px" style={style} {...rest}>
      <Box mx="base" mt={['base-tight', 'base-loose']} mb="tight">
        <Text
          color="#677282"
          fontWeight={600}
          fontSize="11px"
          lineHeight="base"
          style={{ textTransform: 'uppercase' }}
        >
          Recently Viewed
        </Text>
      </Box>
      {transactions.length && transactions.length > 1 ? (
        <RecentlyViewedList transactions={transactions} />
      ) : null}
    </DialogCard>
  );
};

interface RecentlyViewedListProps extends BoxProps {
  transactions: Transaction[];
}

export const RecentlyViewedList = ({ transactions, ...rest }: RecentlyViewedListProps) => {
  return transactions.length ? (
    <Box width="100%" {...rest}>
      {transactions
        .sort((a, b) => -(a as any).viewedDate.localeCompare((b as any).viewedDate))
        .map((tx, i) => (
          <RecentlyViewedListItem key={i} transaction={tx} isLast={transactions.length - 1 === i} />
        ))}
    </Box>
  ) : null;
};

interface RecentlyViewedListItemProps extends BoxProps {
  transaction: Transaction;
  isLast: boolean;
}

export const RecentlyViewedListItem = ({ transaction, isLast }: RecentlyViewedListItemProps) => {
  const [isHovered, bindHover] = useHover();
  const [isFocused, bindFocus] = useFocus();
  return (
    <Link href="/txid/[txid]" as={`/txid/${transaction.tx_id}`} passHref>
      <Flex
        as="a"
        px="base-loose"
        justifyContent="space-between"
        alignItems="center"
        height="64px"
        borderBottom={isLast ? null : '1px solid #E1E3E8'}
        cursor="pointer"
        style={{ outline: 'none' }}
        {...bindHover}
        {...bindFocus}
      >
        <Flex flexDirection="column">
          <Text
            textStyle="body.small"
            lineHeight="base-loose"
            display="block"
            textDecoration={isHovered || isFocused ? 'underline' : null}
          >
            {truncateMiddle(transaction.tx_id, 10)}
          </Text>
          <Text textStyle="caption" color="ink.600">
            {dayjs().to((transaction as any).viewedDate)}
          </Text>
        </Flex>
        <Box>
          <Tag type={transaction.tx_type as TransactionType} />
        </Box>
      </Flex>
    </Link>
  );
};

export default RecentlyViewed;
