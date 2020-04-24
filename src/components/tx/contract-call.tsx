import * as React from 'react';
import { Box, Flex, Text, Stack } from '@blockstack/ui';
import { useSelector } from 'react-redux';
import { ContractCallTransaction } from '@blockstack/stacks-blockchain-sidecar-types';

import { RootState } from '@store';
import { selectOriginContractSource } from '@store/transactions';
import { TransactionType } from '@models/transaction.interface';

import { TokenTransfers } from '@components/token-transfer';
import { SectionTitle } from '@components/typography';
import { PageTop } from '@components/page';
import { Rows } from '@components/rows';
import { CheckmarkCircleIcon, ExclamationMarkCircleIcon } from '@components/svg';
import { TransactionDetails } from '@components/transaction-details';
import { ContractSource } from '@components/contract-source';

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

const FunctionSummarySection = ({ summary }: { summary: any }) => (
  <Box mt="extra-loose">
    <SectionTitle mb="base-loose">Function summary</SectionTitle>
    <Rows
      items={[
        {
          label: {
            children: 'Name',
          },
          children: summary.function_name,
        },

        {
          label: {
            children: 'Arguments',
          },
          children: (
            <Rows
              inline
              items={summary.function_args.map((arg: any) => ({
                label: {
                  children: '',
                },
                children: arg.toString(),
              }))}
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
  const { contractSource } = useSelector((state: RootState) => ({
    contractSource: selectOriginContractSource(transaction.contract_call.contract_id)(state),
  }));
  return (
    <>
      <PageTop status={transaction.tx_status} type={[TransactionType.CONTRACT_CALL]} />
      <Stack spacing="extra-loose">
        <TransactionDetails transaction={transaction} />
        <TokenTransfers events={transaction.events} />
        <ContractSource source={contractSource} />
        <FunctionSummarySection summary={transaction.contract_call} />
      </Stack>
    </>
  );
};

export default ContractCallPage;
