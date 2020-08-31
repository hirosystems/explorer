import React from 'react';
import { ReduxNextPageContext } from '@common/types/next-store';
import { Box, Flex, Stack, Spinner } from '@stacks/ui';
import { Card } from '@components/card';
import { fetchTxList } from '@common/api/transactions';
import { TxItem } from '@components/transaction-item';
import { TransactionType } from '@models/transaction.interface';
import { Tag } from '@components/tags';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';
import { PageWrapper } from '@components/page';
import { Transaction } from '@blockstack/stacks-blockchain-api-types';
import { Caption, Text, Title } from '@components/typography';
import { TxLink } from '@components/links';
import { Meta } from '@components/meta-head';
import { useConfigState } from '@common/hooks/use-config-state';
import { useLoading } from '@common/hooks/use-loading';
import { color } from '@components/color-modes';

const TransactionsPage = ({ txs, total }: { txs: Transaction[]; total: number }) => {
  const types = [
    TransactionType.CONTRACT_CALL,
    TransactionType.SMART_CONTRACT,
    TransactionType.TOKEN_TRANSFER,
  ];
  const { isLoading, doFinishLoading, doStartLoading } = useLoading();
  const [transactions, setTransactions] = React.useState<Transaction[]>(txs);
  const [selectedTypes, setSelectedTypes] = React.useState<TransactionType[]>(types);
  const [offset, setOffset] = React.useState(txs.length);
  const { apiServer } = useConfigState();

  const handleFetchMore = async () => {
    if (transactions.length < total) {
      doStartLoading();
      const { results } = await fetchTxList({
        apiServer: apiServer as string,
        types: ['smart_contract', 'contract_call', 'token_transfer'],
        offset,
      })();
      setTransactions([...transactions, ...results]);
      setOffset(offset + 200);
      doFinishLoading();
    }
  };

  const handleClick = React.useCallback(
    (type: TransactionType) => {
      if (selectedTypes?.find(selected => type === selected)) {
        setSelectedTypes(selectedTypes?.filter(selected => type !== selected));
      } else {
        setSelectedTypes([...selectedTypes, type]);
      }
    },
    [selectedTypes]
  );

  const items = selectedTypes.length
    ? transactions.filter((item: Transaction) => selectedTypes.find(type => type === item.tx_type))
    : transactions;
  return (
    <PageWrapper>
      <Meta title="Recent transactions" />
      <Box mb="base-loose">
        <Title mt="72px" color="white" as="h1" textStyle="display.large" fontSize="36px">
          Recent transactions
        </Title>
      </Box>
      <Flex align="flex-end" justify="space-between">
        <Box>
          <Caption mb="tight">Filter by type</Caption>
          <Stack flexWrap="wrap" isInline>
            {types.map(type => {
              const isSelected = selectedTypes?.length
                ? selectedTypes.find(selected => selected === type)
                : true;

              return (
                <Tag
                  mb="tight"
                  _hover={{ cursor: 'pointer', opacity: isSelected ? 1 : 0.75 }}
                  opacity={isSelected ? 1 : 0.5}
                  onClick={() => handleClick(type)}
                  type={type}
                />
              );
            })}
          </Stack>
        </Box>
        <Caption mb="tight">
          {offset} / {total}
        </Caption>
      </Flex>
      <Card bg={color('bg')} mt="tight" overflow="hidden">
        {items.length ? (
          items?.map((tx: Transaction, key: number) => {
            return (
              <TxLink txid={tx.tx_id}>
                <TxItem
                  as="a"
                  tx={tx}
                  key={tx.tx_id}
                  _hover={{
                    bg: color('bg-alt'),
                  }}
                  borderBottom={
                    key === items.length - 1 ? 'unset' : '1px solid var(--colors-border)'
                  }
                />
              </TxLink>
            );
          })
        ) : (
          <Flex p="base" align="center" justify="center">
            <Box py="72px" maxWidth="420px" textAlign="center">
              <Box mb="base">
                <Title as="h2">No transactions found!</Title>
              </Box>
              <Box>
                <Text>
                  There aren't any transactions of the type(s) selected.{' '}
                  {total === 0
                    ? 'The Testnet might have been recently restarted, please check back soon.'
                    : 'You can try to load more to find some.'}
                </Text>
              </Box>
            </Box>
          </Flex>
        )}
        {transactions.length < total ? (
          <Flex
            borderTop="1px solid var(--colors-border)"
            p="base"
            align="center"
            justify="center"
            onClick={handleFetchMore}
            _hover={{
              cursor: 'pointer',
              bg: 'var(--colors-bg-alt)',
            }}
            borderBottomRightRadius="12px"
            borderBottomLeftRadius="12px"
          >
            {isLoading ? (
              <Spinner mr="tight" color="var(--colors-invert)" size="xs" thickness="1px" />
            ) : null}
            <Caption>{isLoading ? 'Loading...' : 'Load more'}</Caption>
          </Flex>
        ) : null}
      </Card>
    </PageWrapper>
  );
};

TransactionsPage.getInitialProps = async ({ store }: ReduxNextPageContext) => {
  const apiServer = selectCurrentNetworkUrl(store.getState());

  const { results, total } = await fetchTxList({
    apiServer: apiServer as string,
    types: ['smart_contract', 'contract_call', 'token_transfer'],
  })();

  return {
    total,
    txs: results,
  };
};

export default TransactionsPage;
