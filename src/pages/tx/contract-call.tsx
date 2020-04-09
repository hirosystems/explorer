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
import { ContractCallTransaction } from '@blockstack/stacks-blockchain-sidecar-types';

const ContractSource = () => (
  <Box mt="extra-loose">
    <SectionTitle mb="base-loose">Contract source</SectionTitle>
    <Box width="100%" height="422px" bg="ink" borderRadius="12px" />
  </Box>
);

const PostConditionStatus = ({ status }: { status: 'success' | 'failed' }) => (
  <Flex align="center" color={status === 'success' ? 'green' : 'red'}>
    <Box mr="tight">
      {status === 'success' ? <CheckmarkCircleIcon /> : <ExclamationMarkCircleIcon />}
    </Box>
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

const FunctionSummarySection = () => (
  <Box mt="extra-loose">
    <SectionTitle mb="base-loose">Function summary</SectionTitle>
    <Rows
      items={[
        {
          label: {
            children: 'Name',
          },
          children: 'bid(uint256)',
        },
        {
          label: {
            children: 'Method',
          },
          children: 'transfer-nft',
        },
        {
          label: {
            children: 'Parameters',
          },
          children: (
            <Rows
              inline
              items={[
                {
                  label: {
                    children: 'From',
                  },
                  children: 'SPJT598WY1RJN792HRKRHRQYFB7RJ5ZCG6J6GEZ4',
                },
                {
                  label: {
                    children: 'To',
                  },
                  children: 'SP2837ZMC89J40K4YTS64B00M7065C6X46JX6ARG0',
                },
                {
                  label: {
                    children: 'Amount',
                  },
                  children: '1',
                },
              ]}
            />
          ),
        },
      ]}
    />
  </Box>
);

interface ContractCallPageProps {
  transaction: ContractCallTransaction;
}

const ContractCallPage = ({ transaction }: ContractCallPageProps) => {
  return (
    <PageWrapper>
      <PageTop
        status={Statuses.PENDING}
        type={[TransactionType.CONTRACT_CALL, TransactionType.TOKEN_TRANSFER]}
      />
      <Stack spacing="extra-loose">
        <TransactionDetails transaction={transaction} />
        <TokenTransfers />
        <ContractSource />
        <FunctionSummarySection />
        <PostConditionsSection />
        <EventsSection />
      </Stack>
    </PageWrapper>
  );
};

export default ContractCallPage;
