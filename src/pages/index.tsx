import React from 'react';
import { Flex, Box, transition, Stack } from '@stacks/ui';
import { Text } from '@components/typography';
import { PageWrapper } from '@components/page';
import { SearchBarWithDropdown } from '@components/search-bar';
import { Meta } from '@components/meta-head';
import { ReduxNextPageContext } from '@common/types/next-store';
import { fetchTxList } from '@common/api/transactions';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';
import { Card } from '@components/card';
import { color } from '@components/color-modes';
import { Transaction } from '@blockstack/stacks-blockchain-api-types';
import { TxLink } from '@components/links';
import { TxItem } from '@components/transaction-item';
import { border } from '@common/utils';

export const Home = ({ transactions, mempool }) => {
  const [active, setActive] = React.useState<'tx' | 'mempool'>('mempool');
  const items = active === 'tx' ? transactions : mempool;
  return (
    <PageWrapper isHome>
      <Meta />
      <Flex flexDirection="column" align="center" maxWidth="544px" justify="center">
        <Text
          as="h1"
          fontSize="36px"
          display="block"
          width="100%"
          textAlign={['center', 'left']}
          mt="72px"
          mb="extra-loose"
          color="white"
        >
          Stacks Explorer
        </Text>
        <SearchBarWithDropdown />
      </Flex>
      <Card mt="extra-loose" bg={color('bg')} overflow="hidden">
        <Flex justifyContent="space-between" borderBottom={border()} p="base">
          <Box>
            <Text fontWeight="500">Recent transactions</Text>
          </Box>
          <Stack spacing="base" isInline>
            <Box>
              <Text fontSize="14px">Confirmed</Text>
            </Box>
            <Box>
              <Text fontSize="14px">Pending</Text>
            </Box>
          </Stack>
        </Flex>
        <Box>
          {items?.results?.length
            ? items?.results?.map((tx: Transaction, key: number, arr: any) => {
                return (
                  <TxLink txid={tx.tx_id}>
                    <TxItem
                      as="a"
                      tx={tx}
                      key={tx.tx_id}
                      borderLeft="3px solid"
                      borderLeftColor={color('bg')}
                      borderBottom={key === arr.length - 1 ? 'unset' : '1px solid'}
                      borderBottomColor="var(--colors-border)"
                      transition={transition}
                      _hover={{
                        bg: color('bg-alt'),
                        borderLeftColor: color('accent'),
                      }}
                    />
                  </TxLink>
                );
              })
            : null}
        </Box>
      </Card>
    </PageWrapper>
  );
};

Home.getInitialProps = async ({ store }: ReduxNextPageContext) => {
  const apiServer = selectCurrentNetworkUrl(store.getState());

  const transactions = await fetchTxList({
    apiServer: apiServer as string,
    limit: 10,
    types: ['smart_contract', 'contract_call', 'token_transfer'],
  })();

  const mempool = await fetchTxList({
    apiServer: apiServer as string,
    limit: 10,
    mempool: true,
  })();

  return {
    transactions,
    mempool,
  };
};

export default Home;
