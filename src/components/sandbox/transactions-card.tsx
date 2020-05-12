import * as React from 'react';
import { Flex, Box, Stack, Spinner, BlockstackIcon, CloseIcon, Transition } from '@blockstack/ui';
import { Tooltip } from '@components/tooltip';
import { Caption, Title, Text } from '@components/typography';
import { useDebugState } from '@common/sandbox';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store';
import { selectTransaction } from '@store/transactions';
import { fetchTransaction } from '@store/transactions';
import { Card } from '@components/card';
import { Transaction } from '@blockstack/stacks-blockchain-sidecar-types';
import { truncateMiddle, microToStacks } from '@common/utils';
import { CellItem } from '@components/token-transfer/item';
import { Timestamp } from '@components/timestamp';
import { getTransactionTypeLabel } from '@components/token-transfer/utils';
import { DefaultContract } from '@components/icons/default-contract';
import useOnClickOutside from 'use-onclickoutside';

export const Loading = (props: any) => (
  <Box opacity={0.2} {...props}>
    <Spinner color="var(--colors-invert)" size="sm" />
  </Box>
);

const TruncatedTitle = ({ value, ...rest }: { value: string }) => (
  <Tooltip label={value} fontFamily={`"Fira Code", monospace`}>
    <Box whiteSpace="nowrap" {...rest}>
      <Title
        as="a"
        // @ts-ignore
        href={`/txid/${value}`}
        target="_blank"
        _hover={{
          color: 'var(--colors-text-hover)',
        }}
        fontFamily={`"Fira Code", monospace`}
      >
        {truncateMiddle(value, 5)}
      </Title>
    </Box>
  </Tooltip>
);
export const TxItem = ({ txid, isLast, loading, ...rest }: any) => {
  const dispatch = useDispatch();
  const [localFetchLoading, setLocalFetchLoading] = React.useState(false);
  const { tx } = useSelector((state: RootState) => ({
    tx: selectTransaction(txid)(state) as Transaction,
  }));
  const loadingRef = React.useRef<number | undefined>(undefined);
  const handleFetch = React.useCallback(async () => {
    if (!localFetchLoading) {
      setLocalFetchLoading(true);

      loadingRef.current = setTimeout(async () => {
        await dispatch(fetchTransaction(txid));
        setLocalFetchLoading(false);
      }, 8000);
    }
  }, [txid]);

  React.useEffect(() => {
    handleFetch().then(() => null);
    return () => clearTimeout(loadingRef.current);
  }, []);

  const Icon = tx?.tx_type === 'smart_contract' ? DefaultContract : BlockstackIcon;

  return (
    <Box
      width="100%"
      borderBottom={!isLast ? '1px solid var(--colors-border)' : undefined}
      {...rest}
    >
      <Stack isInline spacing="base" align="center" p="base">
        <Flex align="center" flexGrow={1} flexShrink={0} width="40%">
          <Flex
            mr="base"
            align="center"
            justify="center"
            borderRadius="48px"
            size="48px"
            bg="var(--colors-text-caption)"
            flexShrink={0}
          >
            <Icon color="var(--colors-bg)" size="24px" />
          </Flex>
          <Box>
            <TruncatedTitle value={txid} />
            {tx ? <Caption>{getTransactionTypeLabel(tx.tx_type)}</Caption> : null}
          </Box>
        </Flex>
        {tx ? (
          <Flex width="60%" flexGrow={1} align="center" justify="flex-end">
            <CellItem
              label="Confirmed"
              width="60%"
              value={
                <Timestamp
                  fontSize="14px"
                  ts={
                    //@ts-ignore
                    tx?.burn_block_time
                  }
                />
              }
            />
            {tx.tx_type === 'token_transfer' ? (
              <CellItem
                width="40%"
                label="Amount"
                textProps={{ fontSize: '14px' }}
                value={`${microToStacks(tx.token_transfer.amount)} STX`}
              />
            ) : null}
          </Flex>
        ) : (
          <Box ml="auto">
            {!loading && localFetchLoading ? (
              <Loading />
            ) : !tx && !loading ? (
              <Box _hover={{ cursor: 'pointer' }} onClick={handleFetch}>
                <Text>Refresh</Text>
              </Box>
            ) : (
              <Loading />
            )}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export const TransactionsCard = ({ loading, visible, identity, hide, ...rest }: any) => {
  const { transactions } = useDebugState();
  const ref = React.useRef(null);
  useOnClickOutside(ref, hide);
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
          <Card boxShadow="high" flexGrow={0}>
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
                opacity={0.5}
                _hover={{ opacity: 1, cursor: 'pointer' }}
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
