import * as React from 'react';

import useSWR from 'swr';
import {
  AddressBalanceResponse,
  MempoolTransaction,
  Transaction,
  TransactionResults,
} from '@blockstack/stacks-blockchain-api-types';
import { Box, Flex, Grid, color } from '@stacks/ui';
import { Title, Text } from '@components/typography';
import { Link } from '@components/link';
import type { NextPage, NextPageContext } from 'next';
import { Section } from '@components/section';
import { Rows } from '@components/rows';
import { TransactionList } from '@components/transaction-list';
import { capitalize, microToStacks, truncateMiddle, validateStacksAddress } from '@common/utils';
import { useApiServer } from '@common/hooks/use-api';
import { getServerSideApiServer } from '@common/api/utils';
import { fetchAllAccountData } from '@common/api/accounts';
import { TokenBalancesRow } from '@components/balances/token-balances-row';
import { Activity } from '@components/activity-row';
import { StxBalances } from '@components/balances/stx-balance-card';
import { getStackStartBlockHeight, hasTokenBalance } from '@common/utils/accounts';
import { TokenBalancesCard } from '@components/balances/principal-token-balances';
import { Meta } from '@components/meta-head';
import { AddressNotFound } from '@components/address-not-found';
import {
  fetchAddressVesting,
  fetchLegacyExplorerVestingData,
  VestingData,
  getAddressDetails,
  invertAddress,
} from '@common/utils/addresses';
import { StacksTokenVestingCard } from '@components/stacks-token-vesting-card';
import { getNetworkMode } from '@common/api/network';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { IconAlertCircle } from '@tabler/icons';
import { AddressLink } from '@components/links';
import { useInfiniteFetch } from '@common/hooks/use-fetch-blocks';

const IncorrectAddressModeNotice: React.FC<{ address: string }> = ({ address }) => {
  const network = useNetworkMode();
  const invert = network && network.toLowerCase() === 'testnet' ? 'mainnet' : 'testnet';
  return (
    <Section mb="extra-loose">
      <Flex alignItems="center" justifyContent="space-between" p="base-loose">
        <Flex alignItems="center">
          <Box mr="tight" as={IconAlertCircle} color={color('feedback-alert')} />
          <Text color={color('text-body')}>
            This is a <strong>{capitalize(invert)}</strong> address, but you are viewing data from
            the <strong>{network}</strong> Stacks Network.
          </Text>
        </Flex>

        <AddressLink principal={address}>
          <Link
            fontSize={1}
            color={color('brand')}
            textDecoration="none"
            _hover={{
              textDecoration: 'underline',
            }}
          >
            Update address
          </Link>
        </AddressLink>
      </Flex>
    </Section>
  );
};

const SummaryCard = ({ principal, hasTokenBalances, data }: any) => {
  return (
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
            copy: principal,
          },
          {
            condition: !!data?.transactions?.results?.length,
            label: {
              children: 'Activity',
            },
            children: (
              <Activity txs={data?.transactions?.results} amount={data?.transactions?.total} />
            ),
          },
          {
            condition: !!hasTokenBalances,
            label: {
              children: 'Holdings',
            },
            children: <TokenBalancesRow balances={data?.balances} />,
          },
          {
            label: {
              children: 'Fees',
            },
            children: `${microToStacks(data?.balances?.stx?.total_fees_sent || 0)} STX`,
          },
        ]}
      />
    </Section>
  );
};

interface AddressPageData {
  principal: string;
  balances: AddressBalanceResponse;
  transactions: TransactionResults | null;
  pendingTransactions: MempoolTransaction[];
  error?: boolean;
  vesting?: VestingData;
  networkModeAddress: string | null;
}

const AddressPage: NextPage<AddressPageData> = props => {
  const {
    principal,
    balances,
    pendingTransactions,
    transactions,
    vesting,
    networkModeAddress,
    error,
  } = props;
  if (error) {
    return (
      <>
        <Meta title="Address not found" />
        <AddressNotFound />
      </>
    );
  }
  const apiServer = useApiServer();
  const { data } = useSWR(principal, fetchAllAccountData(apiServer as any), {
    initialData: {
      balances,
      transactions,
      pendingTransactions,
    },
  });

  const {
    data: _transactions,
    loadMore,
    isReachingEnd,
    isLoadingMore,
  } = useInfiniteFetch<Transaction>({
    initialData: data?.transactions?.results as Transaction[],
    type: 'tx',
    limit: 50,
    principal,
    types: ['smart_contract', 'contract_call', 'token_transfer', 'coinbase'],
  });
  const hasTokenBalances = hasTokenBalance(data?.balances);
  const stackingStartedAtThisBlock = getStackStartBlockHeight(data?.transactions?.results);

  const confirmedTxs = _transactions || [];
  const pendingTxs = data?.pendingTransactions || [];

  return (
    <>
      <Meta title={`STX Address ${truncateMiddle(principal)}`} />
      <Flex
        mb="extra-loose"
        alignItems={['unset', 'unset', 'flex-end']}
        justifyContent="space-between"
        flexDirection={['column', 'column', 'row']}
      >
        <Title mb={['base', 'base', '0']} mt="64px" as="h1" color="white" fontSize="36px">
          Address details
        </Title>
      </Flex>
      <Grid
        gridColumnGap="extra-loose"
        gridTemplateColumns={['100%', '100%', 'repeat(1, calc(100% - 352px) 320px)']}
        gridRowGap={['extra-loose', 'extra-loose', 'unset']}
        maxWidth="100%"
        alignItems="flex-start"
      >
        <Box>
          {networkModeAddress ? <IncorrectAddressModeNotice address={networkModeAddress} /> : null}
          <SummaryCard principal={principal} hasTokenBalances={hasTokenBalances} data={data} />
          <TransactionList
            showCoinbase
            hideFilter={false}
            principal={principal}
            mempool={pendingTxs}
            loadMore={loadMore}
            transactions={confirmedTxs}
            isReachingEnd={isReachingEnd}
            isLoadingMore={isLoadingMore}
          />
        </Box>
        {balances ? (
          <Box>
            <StxBalances
              principal={principal}
              stackingBlock={stackingStartedAtThisBlock}
              balances={balances}
            />
            {data?.balances && hasTokenBalance(data.balances) ? (
              <TokenBalancesCard mt="extra-loose" balances={data.balances} />
            ) : null}
            {vesting ? <StacksTokenVestingCard vesting={vesting} /> : null}
          </Box>
        ) : null}
      </Grid>
    </>
  );
};

export async function getServerSideProps(
  ctx: NextPageContext
): Promise<{ props: AddressPageData }> {
  const { query } = ctx;
  const principal: string = query?.principal as string;
  const validAddress = validateStacksAddress(principal);
  if (!validAddress) {
    return {
      props: {
        principal,
        error: true,
      },
    } as any;
  }
  const apiServer = await getServerSideApiServer(ctx);
  const networkMode = await getNetworkMode(apiServer);
  const details = getAddressDetails(principal);
  const isDifferentMode = details.network !== networkMode?.toLowerCase();

  const data = await fetchAllAccountData(apiServer)({ principal });
  const hasHadVesting = await fetchAddressVesting(principal);

  const networkModeAddress = isDifferentMode ? invertAddress(principal) : null;

  let vesting = null;

  if (hasHadVesting) {
    vesting = await fetchLegacyExplorerVestingData(principal);
  }
  return {
    props: { principal, vesting, networkModeAddress, ...data },
  };
}

export default AddressPage;
