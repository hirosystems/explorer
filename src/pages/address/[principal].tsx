import {
  AddressBalanceResponse,
  TransactionResults,
  MempoolTransactionListResponse,
} from '@blockstack/stacks-blockchain-api-types';
import { Box, Flex, Grid, useClipboard, color, space } from '@stacks/ui';
import { Caption, Link, Text, Title } from '@components/typography';
import { getAssetNameParts, microToStacks, truncateMiddle } from '@common/utils';

import { CopyIcon } from '@components/icons/copy';
import Head from 'next/head';

import { NextPage } from 'next';
import { PageWrapper } from '@components/page';
import { QrCode } from '@components/icons/qrcode';
import React from 'react';
import { ReduxNextPageContext } from '@common/types/next-store';

import { Tab } from '@components/sandbox/tabs';

import { TxItem } from '@components/transaction-item';
import { ItemIcon } from '@components/token-transfer/item';
import { TxLink } from '@components/links';
import { border } from '@common/utils';
import { fetchFromSidecar } from '@common/api/fetch';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';

import { useSelector } from 'react-redux';
import { RootState } from '@store';
import useSWR from 'swr';
import { StxInline } from '@components/icons/stx-inline';
import { Tooltip } from '@components/tooltip';
import { IconButton } from '@components/icon-button';

const fetchBalances = (apiServer: string) => async (
  principal: string
): Promise<AddressBalanceResponse> => {
  const path = `/address/${principal}/balances`;
  const res = await fetchFromSidecar(apiServer)(path);
  return res.json();
};

const fetchTransactions = (apiServer: string) => async (
  principal: string
): Promise<TransactionResults> => {
  const path = `/address/${principal}/transactions?limit=50`;
  const res = await fetchFromSidecar(apiServer)(path);
  const final = await res.json();

  return final;
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
    ? txs?.results.map((transaction: any, index: number) => {
        return (
          <TxLink txid={transaction.tx_id}>
            <TxItem
              _hover={{
                bg: color('bg-alt'),
              }}
              borderBottom={index !== txs.results.length - 1 ? border() : 'unset'}
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
    <Grid px="base" gridTemplateColumns="60% 1fr 1fr" py={space('base')}>
      <Box>
        <Flex mb={space('extra-tight')}>
          <ItemIcon
            type={
              type === 'non_fungible_tokens' ? 'non_fungible_token_asset' : 'fungible_token_asset'
            }
          />
          <Text fontWeight="600">{asset}</Text>
        </Flex>
      </Box>
      <Box>
        <TxLink txid={`${address}.${contract}`}>
          <Link
            color={color('accent')}
            _hover={{
              textDecoration: 'underline',
            }}
            as="a"
          >
            {truncateMiddle(address, 4)}.{contract}
          </Link>
        </TxLink>
      </Box>
      <Box>
        <Text>
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            balances[type][token][key]
          }
        </Text>
      </Box>
    </Grid>
  );
};

const NftBalances = ({ balances }: { balances: AddressBalanceResponse }) => (
  <Box>
    <Grid gridTemplateColumns="repeat(2, 1fr)" pb={space('base')} borderBottom={border()}>
      <Caption>Token</Caption>
      <Caption>Balance</Caption>
    </Grid>
    {Object.keys(balances.non_fungible_tokens).map(token => {
      console.log(balances.non_fungible_tokens[token]);
      return <TokenAssetListItem token={token} type="non_fungible_tokens" balances={balances} />;
    })}
  </Box>
);

const FtBalances = ({ balances }: { balances: AddressBalanceResponse }) => (
  <Box>
    <Grid px="base" gridTemplateColumns="60% 1fr 1fr" pb={space('base')} borderBottom={border()}>
      <Caption>Token</Caption>
      <Caption>Address</Caption>
      <Caption>Amount</Caption>
    </Grid>
    {Object.keys(balances.fungible_tokens).map(token => {
      return <TokenAssetListItem token={token} type="fungible_tokens" balances={balances} />;
    })}
  </Box>
);

const Balances = ({ balances }: { balances: AddressBalanceResponse }) => {
  return (
    <Box
      mt="extra-loose"
      border={border()}
      borderRadius="12px"
      bg={color('bg')}
      alignItems="flex-start"
    >
      <Box borderBottom={border()} p="base">
        <Text>Balances</Text>
      </Box>
      <Box width="100%" pt={space('extra-loose')}>
        <FtBalances balances={balances} />
      </Box>
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

interface AddressPageData {
  principal: string;
  balances?: AddressBalanceResponse;
  transactions?: TransactionResults | MempoolTransactionListResponse;
}

const hasTokenBalance = (balances: any) => {
  const totalFt: number = balances?.fungible_tokens?.length || 0;
  const totleNft: number = balances?.non_fungible_tokens?.length || 0;

  return totleNft + totalFt > 0;
};

const AddressPage: NextPage<AddressPageData> = ({ principal, balances, transactions }) => {
  const { apiServer } = useSelector((state: RootState) => ({
    apiServer: selectCurrentNetworkUrl(state),
  }));

  const { data, error } = useSWR(principal, fetchAllAccountData(apiServer as any), {
    initialData: {
      balances,
      transactions,
    },
    refreshInterval: 5000,
  });

  const { onCopy, hasCopied } = useClipboard(principal || '');

  return (
    <PageWrapper>
      <Head>
        <title>STX Address {truncateMiddle(principal)} | Blockstack Explorer</title>
      </Head>
      <Flex mb="base" alignItems="flex-end" justifyContent="space-between">
        <Box>
          <Title mb="base" mt="64px" as="h1" color="white" fontSize="36px">
            Address details
          </Title>
          <Flex>
            <Title pt="5px" mb="0" color="white" mt="0" as="h3">
              {principal}
            </Title>
            <Flex ml="tight" alignItems="center">
              <Tooltip label={hasCopied ? 'Copied!' : 'Copy'}>
                <IconButton onClick={onCopy} icon={CopyIcon} />
              </Tooltip>
              {/*<Grid*/}
              {/*  opacity="0.5"*/}
              {/*  _hover={{ opacity: 1 }}*/}
              {/*  color="white"*/}
              {/*  size="32px"*/}
              {/*  placeItems="center"*/}
              {/*>*/}
              {/*  <QrCode size="24px" />*/}
              {/*</Grid>*/}
            </Flex>
          </Flex>
        </Box>
        <Title
          alignItems="center"
          display="flex"
          fontWeight="500"
          my="0"
          as="h4"
          color="white"
          fontSize="28px"
        >
          <StxInline color="white" strokeBalance={1.5} mr="tight" size="18px" />
          <Flex alignItems="baseline">
            {microToStacks(data?.balances?.stx.balance as any)}{' '}
            <Text fontSize="20px" ml="tight">
              STX
            </Text>
          </Flex>
        </Title>
      </Flex>
      <Box border={border()} borderRadius="12px" bg={color('bg')} alignItems="flex-start">
        <Box borderBottom={border()} p="base">
          <Text>Transactions</Text>
        </Box>
        {data?.transactions?.results.length ? (
          <TxList txs={data?.transactions} />
        ) : (
          <Grid placeItems="center" px="base" py="extra-loose">
            <Text>No transactions yet</Text>
          </Grid>
        )}
      </Box>
      {data?.balances && hasTokenBalance(data.balances) ? (
        <Balances balances={data.balances} />
      ) : null}{' '}
    </PageWrapper>
  );
};

AddressPage.getInitialProps = async ({
  store,
  query,
}: ReduxNextPageContext): Promise<AddressPageData> => {
  const principal = query?.principal as string;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getState } = store;
  const apiServer = selectCurrentNetworkUrl(getState());
  const data = await fetchAllAccountData(apiServer as any)(principal as any);
  return { principal, ...data };
};

export default AddressPage;
