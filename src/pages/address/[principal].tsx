import { fetchNonce } from '@common/api/account';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { truncateMiddle } from '@common/utils';
import { hasTokenBalance } from '@common/utils/accounts';
import { AddressNotFound } from '@components/address-not-found';
import { TokenBalancesCard } from '@components/balances/principal-token-balances';
import { StxBalances } from '@components/balances/stx-balance-card';
import { Meta } from '@components/meta-head';
import { UnlockingScheduleModal } from '@components/modals/unlocking-schedule';
import { PageWrapper } from '@components/page-wrapper';
import { Title } from '@components/typography';
import { AccountTransactionList } from '@features/account-transaction-list';
import { AddressSummary } from '@features/address-page/address-summary';
import { addressQK, AddressQueryKeys } from '@features/address/query-keys';
import { useAddressQueries } from '@features/address/use-address-queries';
import { Flex, Grid, GridProps, Stack } from '@stacks/ui';
import { microStxToStx } from '@stacks/ui-utils';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { useRefreshOnBack } from '../../hooks/use-refresh-on-back';

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
      gridTemplateColumns={['100%', '100%', 'repeat(1, calc(100% - 352px) 320px)']}
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
    queries.fetchTransactionsForAddress(address)
  );

  const hasTokenBalances = hasTokenBalance(balance);

  return (
    <PageWrapper>
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
      <PageTop />
      <ContentWrapper>
        <Stack spacing="extra-loose">
          <AddressSummary
            principal={address}
            hasTokenBalances={hasTokenBalances}
            balances={balance}
            lastExecutedTxNonce={nonces?.last_executed_tx_nonce}
          />
          <AccountTransactionList contractId={address} />
        </Stack>
        {balance && (
          <Stack spacing="extra-loose">
            <StxBalances principal={address} balances={balance} />
            <TokenBalancesCard balances={balance} />
          </Stack>
        )}
      </ContentWrapper>
    </PageWrapper>
  );
};

export default AddressPage;
