import * as React from 'react';
import { Flex, Box, Stack, Spinner, BlockstackIcon, CloseIcon, Transition } from '@blockstack/ui';
import { Caption, Title, Text } from '@components/typography';
import { useRefreshPendingTx } from '@common/hooks/use-refresh-pending-tx';
import { Card } from '@components/card';
import { TxLink } from '@components/links';
import { TxItem as TransactionItem } from '@components/transaction-item';
import { color } from '@components/color-modes';

import { useTransactionState } from '@common/hooks/use-transaction-state';
import { useSandboxState } from '@common/hooks/use-sandbox-state';

export const Loading = (props: any) => (
  <Box opacity={0.2} {...props}>
    <Spinner color="var(--colors-invert)" size="sm" />
  </Box>
);

export const TxItem = ({ txid, isLast, ...rest }: any) => {
  const { transaction, loading } = useTransactionState(txid);
  useRefreshPendingTx(txid);

  return (
    <Flex
      borderBottom={!isLast ? `1px solid ${color('border')}` : undefined}
      _hover={{ bg: color('bg-alt'), cursor: 'pointer' }}
      align="center"
      {...rest}
    >
      <TxLink txid={txid}>
        {transaction ? (
          <Flex width="100%" align="center">
            <TransactionItem flexGrow={1} as="a" tx={transaction} target="_blank" />
            {transaction.tx_status === 'pending' ? (
              <Box pt="2px" opacity={0.5} mr="base" color={color('invert')}>
                <Spinner size="sm" />
              </Box>
            ) : null}
          </Flex>
        ) : (
          <Flex align="center" p="base">
            <Box mr="tight">
              <Spinner size="sm" />
            </Box>
            <Box transform="translateY(-2px)">
              <Text fontSize="14px">Fetching transaction...</Text>
            </Box>
          </Flex>
        )}
      </TxLink>
    </Flex>
  );
};

export const TransactionsCard = ({ loading, visible, identity, hide, ...rest }: any) => {
  const { transactions } = useSandboxState();
  const ref = React.useRef<any | null>(null);
  return (
    <Transition
      styles={{
        init: {
          opacity: 0,
          pointerEvents: 'none',
          transform: 'translateY(10px)',
        },
        entered: {
          opacity: 1,
          pointerEvents: 'all',
          transform: 'none',
        },
        exiting: {
          opacity: 0,
          pointerEvents: 'none',
          transform: 'translateY(10px)',
        },
      }}
      in={visible}
      onExit={hide}
      timeout={220}
    >
      {style => (
        <Box ref={ref} style={style} {...rest}>
          <Card boxShadow="high" flexGrow={0} overflow="hidden">
            <Flex
              justify="space-between"
              align="center"
              px="base"
              py="tight"
              borderBottom="1px solid var(--colors-border)"
              height="36px"
            >
              <Caption fontWeight="bold">Recent transactions</Caption>
              <Box
                onClick={hide}
                opacity={0.3}
                _hover={{ opacity: 1, cursor: 'pointer' }}
                color="var(--colors-invert)"
                size="12px"
              >
                <CloseIcon />
              </Box>
            </Flex>

            {transactions?.length ? (
              transactions
                .slice()
                .reverse()
                // @ts-ignore
                .map((tx, key, arr) => (
                  <TxItem
                    isLast={key === arr.length - 1}
                    txid={tx.txId}
                    key={tx.txId}
                    loading={loading}
                  />
                ))
            ) : (
              <Flex p="loose" flexGrow={1} align="center" justify="center">
                <Box>
                  <Caption>No Transactions</Caption>
                </Box>
              </Flex>
            )}
          </Card>
        </Box>
      )}
    </Transition>
  );
};
