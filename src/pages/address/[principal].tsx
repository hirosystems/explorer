import { fetchNonce } from '@common/api/account';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { truncateMiddle, border } from '@common/utils';
import { hasTokenBalance } from '@common/utils/accounts';
import { AddressNotFound } from '@components/address-not-found';
import { TokenBalancesCard } from '@components/balances/principal-token-balances';
import { NewAccountCard } from '@components/balances/account-toggle';
import { StxBalances } from '@components/balances/stx-balance-card';
import { Meta } from '@components/meta-head';
import { UnlockingScheduleModal } from '@components/modals/unlocking-schedule';
import { PrincipalCollectible } from '@components/nfts/principal-collectibles';
import { PageWrapper } from '@components/page-wrapper';
import { Title } from '@components/typography';
import { AccountTransactionList } from '@features/account-transaction-list';
import { AddressSummary } from '@features/address-page/address-summary';
import { addressQK, AddressQueryKeys } from '@features/address/query-keys';
import { useAddressQueries } from '@features/address/use-address-queries';
import {
  Box,
  DynamicColorCircle,
  Flex,
  Grid,
  GridProps,
  Stack,
  Text,
  Circle,
  color,
  Button,
} from '@stacks/ui';
import { microStxToStx } from '@stacks/ui-utils';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useRefreshOnBack } from '../../hooks/use-refresh-on-back';
import { css } from '@emotion/react';
import { IdentIcon } from '@features/address/avatar';
import { WalletOverview } from '@components/balances/wallet-overview';
import { IconLayoutGridAdd, IconCopy } from '@tabler/icons';

const PageTop = () => {
  return (
    <Flex
      mb="extra-loose"
      alignItems={['unset', 'unset', 'flex-end']}
      justifyContent="space-between"
      flexDirection={['column', 'column', 'row']}
    >
      <Title
        mb={['base', 'base', '0']}
        mt="64px"
        as="h1"
        color="white"
        fontSize="36px"
        data-test="address-title"
      >
        Address details
      </Title>
    </Flex>
  );
};
const ContentWrapper = (props: GridProps) => {
  return (
    <Grid
      gridColumnGap="extra-loose"
      gridTemplateColumns={['100%', '100%', 'repeat(1, 380px calc(100% - 412px) )']}
      gridRowGap={['extra-loose', 'extra-loose', 'unset']}
      maxWidth="100%"
      alignItems="flex-start"
      {...props}
    />
  );
};

const queryOptions = {
  // refetchOnWindowFocus: false,
};

const profilePictureCss = css`
  border-radius: 50%;
  width: 224px;
  height: 224px;
  overflow: hidden;
  border: 6px solid #f3d6cf;
  margin-bottom: 20px !important;
`;

const AddressPage: NextPage<any> = arg => {
  const { error } = arg;

  if (error)
    return (
      <>
        <Meta title="Address not found" />
        <AddressNotFound />
      </>
    );

  const queries = useAddressQueries();
  const apiServer = useAppSelector(selectActiveNetwork).url;

  const { query } = useRouter();
  const address = query.principal as string;

  const { data: balance } = useQuery(
    addressQK(AddressQueryKeys.accountBalance, address),
    queries.fetchAccountBalance(address),
    queryOptions
  );

  const { data: nonces } = useQuery(
    addressQK(AddressQueryKeys.nonce, address),
    () => fetchNonce(apiServer)(address),
    queryOptions
  );

  useQuery(addressQK(AddressQueryKeys.coreApiInfo), queries.fetchCoreApiInfo());

  useQuery(
    addressQK(AddressQueryKeys.mempoolTransactionsForAddress, address),
    queries.fetchMempoolTransactionsForAddress(address)
  );

  useQuery(
    addressQK(AddressQueryKeys.transactionsForAddress, address),
    queries.fetchTransactionsForAddress(address),
    { staleTime: 2000 }
  );

  const hasTokenBalances = hasTokenBalance(balance);

  useRefreshOnBack('principal');

  return (
    <PageWrapper>
      <div style={{ height: '50px' }}></div>
      <UnlockingScheduleModal />
      <Meta
        title={`STX Address ${truncateMiddle(address)}`}
        labels={[
          {
            label: 'STX Balance',
            data: `${balance?.stx?.balance ? microStxToStx(balance.stx.balance) : 0} STX`,
          },
        ]}
      />
      {/*<PageTop />*/}
      <ContentWrapper>
        <Stack spacing="extra-loose" paddingLeft="65px">
          <Box css={profilePictureCss}>
            <IdentIcon seed={address} />
          </Box>
          <Text fontSize={'32px'} fontWeight={500} style={{ marginBottom: '4px' }}>
            andres.btc
          </Text>
          <Text fontSize={'16px'} fontWeight={500} color={'#9A9A9A'}>
            {truncateMiddle(address)}
          </Text>
          <Box>
            <Text fontSize={'14px'} fontWeight={300} color={'#747478'} paddingBottom="32px">
              Exploring Stacks & Web3 built on the Bitcoin network. The price of awakening is the
              sacrifice of the mirages.
            </Text>
            <Flex justifyContent="space-between">
              <Button
                fontSize={'14px'}
                paddingLeft="58px"
                paddingRight="58px"
                size="md"
                marginRight="10px"
                borderRadius="100px"
              >
                + Follow
              </Button>
              <Circle border={border()} mr="base" size="46px">
                <IconLayoutGridAdd size="20px" color="currentColor" />
              </Circle>
              <Circle border={border()} size="46px">
                <IconCopy size="20px" color="currentColor" />
              </Circle>
            </Flex>
          </Box>

          {balance && (
            <Fragment>
              <StxBalances principal={address} balances={balance} />
              <WalletOverview
                principal={address}
                balances={balance}
                nonce={nonces && (nonces.last_executed_tx_nonce ?? nonces.possible_next_nonce)}
              />
            </Fragment>
          )}
        </Stack>

        <Stack spacing="extra-loose" paddingRight="65px">
          <NewAccountCard address={address} balance={balance} />
        </Stack>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default AddressPage;
