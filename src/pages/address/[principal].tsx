import * as React from 'react';

import {
  AddressBalanceResponse,
  TransactionResults,
  MempoolTransactionListResponse,
} from '@blockstack/stacks-blockchain-api-types';
import { Box, Flex, Grid, color, space, Stack } from '@stacks/ui';
import { Caption, Link, Text, Title } from '@components/typography';
import { getAssetNameParts, microToStacks, truncateMiddle } from '@common/utils';

import Head from 'next/head';

import { NextPage } from 'next';
import { PageWrapper } from '@components/page';

import { ReduxNextPageContext } from '@common/types/next-store';

import { getTxTypeIcon, TxItem } from '@components/transaction-item';
import { ItemIcon } from '@components/token-transfer/item';
import { TxLink } from '@components/links';
import { border } from '@common/utils';
import { fetchFromSidecar } from '@common/api/fetch';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';

import { useSelector } from 'react-redux';
import { RootState } from '@store';
import useSWR from 'swr';
import { StxInline } from '@components/icons/stx-inline';
import { Section } from '@components/section';
import { Rows } from '@components/rows';
import { Transaction } from '@models/transaction.interface';
import { TransactionList } from '@components/transaction-list';
import { Badge, BadgeProps } from '@components/badge';
import pluralize from 'pluralize';
import { TransferIcon } from '@components/icons/transfer';

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

const BalancesSmall = ({ balances }: { balances?: AddressBalanceResponse }) => {
  return (
    <Stack isInline spacing={'base'}>
      <NumberedBadge array={Object.keys(balances?.fungible_tokens || [])} singular="FT" />
      <NumberedBadge array={Object.keys(balances?.non_fungible_tokens || [])} singular="NFT" />
    </Stack>
  );
};

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

interface AddressPageData {
  principal: string;
  balances?: AddressBalanceResponse;
  transactions?: TransactionResults | MempoolTransactionListResponse;
}

const hasTokenBalance = (balances: any) => {
  const totalFt: number = Object.keys(balances?.fungible_tokens).length || 0;
  const totleNft: number = Object.keys(balances?.non_fungible_tokens).length || 0;

  return totleNft + totalFt > 0;
};

const NumberedBadge = ({
  array,
  singular,
  icon: Icon,
  ...rest
}: { array: any[]; singular: string; icon?: any } & BadgeProps) => (
  <Badge
    border={border()}
    color={color('text-body')}
    labelProps={{ display: 'flex', alignItems: 'center' }}
    alignItems="center"
    my={0}
    {...rest}
  >
    {Icon && <Icon strokeWidth={2} size="16px" />}
    <Box ml={'extra-tight'}>
      {array.length} {pluralize(singular, array.length)}
    </Box>
  </Badge>
);

const Activity = ({ txs }: { txs: Transaction[] }) => {
  const contractCalls = txs?.filter(tx => tx.tx_type === 'contract_call');
  const contractCreations = txs?.filter(tx => tx.tx_type === 'smart_contract');
  const transactions = txs?.filter(
    tx => tx.tx_type !== 'contract_call' && tx.tx_type !== 'smart_contract'
  );
  const ContractCallIcon = getTxTypeIcon('contract_call');
  const ContractIcon = getTxTypeIcon('smart_contract');
  return (
    <Stack isInline spacing={'base'}>
      <NumberedBadge array={transactions} icon={TransferIcon} singular="transfer" />
      <NumberedBadge array={contractCreations} icon={ContractIcon} singular="contract" />
      <NumberedBadge array={contractCalls} icon={ContractCallIcon} singular="contract call" />
    </Stack>
  );
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

  return (
    <PageWrapper>
      <Head>
        <title>STX Address {truncateMiddle(principal)} | Stacks Explorer</title>
      </Head>
      <Flex mb="base" alignItems="flex-end" justifyContent="space-between">
        <Title mb="0" mt="64px" as="h1" color="white" fontSize="36px">
          Address details
        </Title>

        <Title
          alignItems="center"
          display="flex"
          fontWeight="500"
          my="0"
          as="h4"
          color="white"
          fontSize="28px"
        >
          <StxInline color="white" strokeBalance={2} mr="tight" size="22px" />
          <Flex alignItems="baseline">
            {microToStacks(data?.balances?.stx.balance as any)}{' '}
            <Text fontSize="20px" ml="tight">
              STX
            </Text>
          </Flex>
        </Title>
      </Flex>
      <Section mb={'extra-loose'} title="Summary">
        <Rows
          px="base"
          noTopBorder
          items={[
            {
              label: {
                children: 'Address',
              },
              children: principal,
            },
            {
              label: {
                children: 'Activity',
              },
              children: <Activity txs={transactions?.results as any} />,
            },
            {
              label: {
                children: 'Balances',
              },
              children: <BalancesSmall balances={data?.balances} />,
            },
          ]}
        />
      </Section>
      {data?.balances && hasTokenBalance(data.balances) ? (
        <Balances balances={data.balances} />
      ) : null}
      {data?.transactions?.results ? (
        <TransactionList principal={principal} transactions={data.transactions.results as any} />
      ) : null}
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
