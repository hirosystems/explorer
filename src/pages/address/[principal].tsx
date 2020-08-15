import React from 'react';
import { ReduxNextPageContext } from '@common/types/next-store';
import { useDispatch } from 'react-redux';
import { PageWrapper } from '@components/page';
import { fetchFromSidecar } from '@common/api/fetch';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';
import { Box, color, Flex, Grid, space, Stack, CodeBlock } from '@blockstack/ui';
import { Row } from '@components/rows/row';
import {
  AccountTransactionsListResponse,
  AddressBalanceResponse,
} from '@blockstack/stacks-blockchain-sidecar-types';
// @ts-ignore
import vkQr from '@vkontakte/vk-qr';
import { Caption, Text, Title } from '@components/typography';
import { Timestamp } from '@components/timestamp';
import { TxItem } from '@components/transaction-item';
import { Tab } from '@components/sandbox/tabs';
import { TxLink } from '@components/links';
import { getAssetNameParts, microToStacks, truncateMiddle } from '@common/utils';
import { border } from '@common/utils';
import { LayersIntersectIcon } from '@components/icons/layers-intersect';
import Head from 'next/head';

const fetchBalances = (apiServer: string) => async (
  principal: string
): Promise<AddressBalanceResponse> => {
  const path = `/address/${principal}/balances`;
  const res = await fetchFromSidecar(apiServer)(path);
  return res.json();
};

const fetchTransactions = (apiServer: string) => async (
  principal: string
): Promise<AccountTransactionsListResponse> => {
  const path = `/address/${principal}/transactions?limit=50`;
  const res = await fetchFromSidecar(apiServer)(path);
  return res.json();
};

const fetchAllAccountData = (apiServer: string) => async (principal: string) => {
  const [balances, transactions] = await Promise.all([
    fetchBalances(apiServer)(principal),
    fetchTransactions(apiServer)(principal),
  ]);

  return {
    balances,
    transactions,
  };
};

const getTokenAmounts = (record: Record<string, any>): string[] => {
  return Object.keys(record);
};

const TxList = ({ txs }: any) => {
  return txs && txs.results.length > 0
    ? txs?.results.map((transaction: any) => {
        return (
          <TxLink txid={transaction.tx_id}>
            <TxItem
              _hover={{
                bg: color('bg-alt'),
              }}
              borderBottom={border()}
              as="a"
              tx={transaction}
            />
          </TxLink>
        );
      })
    : null;
};

const TokenAssetListItem = ({
  token,
  balances,
  type,
}: {
  token: string;
  balances: AddressBalanceResponse;
  type: 'non_fungible_tokens' | 'fungible_tokens';
}) => {
  const { address, asset, contract } = getAssetNameParts(token);
  const key = type === 'non_fungible_tokens' ? 'count' : 'balance';
  return (
    <Grid gridTemplateColumns="repeat(2, 1fr)" py={space('base')} borderBottom={border()}>
      <Box>
        <Flex mb={space('extra-tight')}>
          <LayersIntersectIcon size="24px" mr={space('tight')} color={color('text-caption')} />
          <Text fontWeight="600">{asset}</Text>
        </Flex>
        <Box>
          <TxLink txid={`${address}.${contract}`}>
            <Caption
              color={color('accent')}
              _hover={{
                textDecoration: 'underline',
              }}
              as="a"
            >
              {truncateMiddle(address)}.{contract}
            </Caption>
          </TxLink>
        </Box>
      </Box>
      <Box>
        <Text>
          {
            // @ts-ignore
            balances[type][token][key]
          }
        </Text>
      </Box>
    </Grid>
  );
};

const Balances = ({ balances }: { balances: AddressBalanceResponse }) => {
  return (
    <Box width="100%" pt={space('extra-loose')}>
      <Grid
        gridColumnGap={space('extra-loose')}
        gridTemplateColumns={'repeat(2, 1fr)'}
        width="100%"
      >
        <Box>
          <Box mb={space('base')}>
            <Title as="h3">Fungible Tokens</Title>
          </Box>
          <Grid gridTemplateColumns="repeat(2, 1fr)" pb={space('base')} borderBottom={border()}>
            <Caption>Token</Caption>
            <Caption>Balance</Caption>
          </Grid>
          {Object.keys(balances.fungible_tokens).map(token => {
            return <TokenAssetListItem token={token} type="fungible_tokens" balances={balances} />;
          })}
        </Box>
        <Box>
          <Box mb={space('base')}>
            <Title as="h3">Non-Fungible Tokens</Title>
          </Box>
          <Grid gridTemplateColumns="repeat(2, 1fr)" pb={space('base')} borderBottom={border()}>
            <Caption>Token</Caption>
            <Caption>Balance</Caption>
          </Grid>
          {Object.keys(balances.non_fungible_tokens).map(token => {
            console.log(balances.non_fungible_tokens[token]);
            return (
              <TokenAssetListItem token={token} type="non_fungible_tokens" balances={balances} />
            );
          })}
        </Box>
      </Grid>
    </Box>
  );
};

const Tabs: React.FC<any> = ({ transactions, balances }) => {
  const [active, setActive] = React.useState<'transactions' | 'balances'>(
    transactions.count > 0 ? 'transactions' : 'balances'
  );

  return (
    <>
      <Flex borderBottom={`1px solid ${color('border')}`} mt="40px">
        <Tab
          label="Transactions"
          isActive={active === 'transactions'}
          onClick={() => setActive('transactions')}
        />
        <Tab
          label="Balances"
          isActive={active === 'balances'}
          onClick={() => setActive('balances')}
        />
      </Flex>
      {active === 'transactions' ? <TxList txs={transactions} /> : <Balances balances={balances} />}
    </>
  );
};

const AddressPage = ({
  principal,
  balances,
  transactions,
}: {
  principal: string;
  balances?: AddressBalanceResponse;
  transactions?: AccountTransactionsListResponse;
}) => {
  const dispatch = useDispatch();

  const qrSvg = vkQr.createQR(principal, {
    qrSize: 132,
    foregroundColor: color('invert'),
  });

  const lastTimeStamp = transactions?.results[0]
    ? // @ts-ignore
      transactions?.results[0].receipt_time || transactions?.results[0].burn_block_time
    : undefined;

  return (
    <PageWrapper>
      <Head>
        <title>STX Address {truncateMiddle(principal)} | Blockstack Explorer</title>
      </Head>
      <Title my="40px" as="h1" textStyle="display.large" fontSize="36px">
        Address details
      </Title>
      <Flex>
        <Box mr="64px" flexGrow={1}>
          <Row label="Address">{principal}</Row>
          <Row label="Transactions">{transactions?.total}</Row>
          <Row label="Balances">
            <Stack spacing={space('base')} isInline>
              <Box>{microToStacks(balances?.stx.balance as any)} STX</Box>
              <Box>{getTokenAmounts(balances?.non_fungible_tokens as any).length} NFTs</Box>
              <Box>{getTokenAmounts(balances?.fungible_tokens as any).length} FTs</Box>
            </Stack>
          </Row>
          {transactions?.total && lastTimeStamp ? (
            <Row label="Last transaction">
              <Timestamp ts={lastTimeStamp} />
            </Row>
          ) : null}
        </Box>
        <Grid
          style={{ placeItems: 'center' }}
          border={`1px solid ${color('border')}`}
          p={space('base')}
          borderRadius="12px"
          size="256px"
          flexShrink={0}
        >
          <Box dangerouslySetInnerHTML={{ __html: qrSvg }} />
        </Grid>
      </Flex>
      <Tabs transactions={transactions} balances={balances} />
    </PageWrapper>
  );
};

AddressPage.getInitialProps = async ({ store, query }: ReduxNextPageContext) => {
  const { principal } = query;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getState } = store;
  const apiServer = selectCurrentNetworkUrl(getState());
  const data = await fetchAllAccountData(apiServer as any)(principal as any);
  return { principal, ...data };
};

export default AddressPage;
