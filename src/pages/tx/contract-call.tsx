import * as React from 'react';
import { Box, Flex, Text, Stack } from '@blockstack/ui';

import { TokenTransfers } from '@components/token-transfer';
import { SectionTitle } from '@components/typography';
import { PageTop, PageWrapper } from '@components/page';
import { Rows } from '@components/rows';
import { CheckmarkCircleIcon, ExclamationMarkCircleIcon } from '@components/svg';
import { TransactionType } from '@models/transaction.interface';
import { Statuses } from '@components/status';
import { TransactionDetails } from '@components/transaction-details';

const ContractSource = () => (
  <Box mt="extra-loose">
    <SectionTitle mb="base-loose">Contract source</SectionTitle>
    <Box width="100%" height="422px" bg="ink" borderRadius="12px" />
  </Box>
);

const ContractItem = () => (
  <Flex pb="base" align="center" pr="base">
    <Box mr="tight" size="24px" borderRadius="6px" bg="ink.200" />
    <Text textStyle="body.small.medium">ContractName</Text>
  </Flex>
);
const OtherContracts = () => (
  <Box mt="extra-loose">
    <SectionTitle mb="base-loose">Other contracts called</SectionTitle>
    <ContractItem />
    <ContractItem />
    <ContractItem />
    <ContractItem />
  </Box>
);

const PostConditionStatus = ({ status }: { status: 'success' | 'failed' }) => (
  <Flex align="center" color={status === 'success' ? 'green' : 'red'}>
    <Box mr="tight">{status === 'success' ? <CheckmarkCircleIcon /> : <ExclamationMarkCircleIcon />}</Box>
    <Text textStyle="body.small.medium" fontWeight="600">
      {status === 'success' ? 'Success' : 'Failed'}
    </Text>
  </Flex>
);

const PostConditionsSection = () => (
  <Box mt="extra-loose">
    <SectionTitle mb="base-loose">Post-conditions</SectionTitle>
    <Rows
      columnLabels={['Status', 'Post-condition']}
      items={[
        {
          label: {
            children: <PostConditionStatus status={'success'} />,
          },
          children: 'max-transfer = 20 STX',
        },
        {
          label: {
            children: <PostConditionStatus status={'failed'} />,
          },
          children: 'Beagle #32 owner = SP7HTEK3HGNMDDYTH7JRP890J2VB8KC181N65XCK',
        },
      ]}
    />
  </Box>
);

const EventsSection = () => (
  <Box mt="extra-loose">
    <SectionTitle mb="base-loose">Events</SectionTitle>
    <Rows
      items={[
        {
          children: 'AuctionSuccessful(uint256: 31, bid: 7000)',
        },
        {
          children: 'Transfer(address: SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS)',
        },
      ]}
    />
  </Box>
);

const TransactionPage: React.FC = () => {
  return (
    <PageWrapper>
      <PageTop status={Statuses.PENDING} type={[TransactionType.CONTRACT_CALL, TransactionType.TOKEN_TRANSFER]} />
      <Stack spacing="extra-loose">
        <TransactionDetails />
        <TokenTransfers />
        <ContractSource />
        <OtherContracts />
        <PostConditionsSection />
        <EventsSection />
      </Stack>
    </PageWrapper>
  );
};

export default TransactionPage;
