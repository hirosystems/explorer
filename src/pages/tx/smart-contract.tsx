import * as React from 'react';
import { Box, Flex, Text, Stack } from '@blockstack/ui';

import { SectionTitle } from '@components/typography';
import { PageTop, PageWrapper } from '@components/page';

import { TransactionType } from '@models/transaction.interface';
import { Statuses } from '@components/status';
import { TransactionDetails } from '@components/transaction-details';
import { SmartContractTransaction } from '@blockstack/stacks-blockchain-sidecar-types';

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

interface SmartContractPageProps {
  transaction: SmartContractTransaction;
}

const SmartContractPage = ({ transaction }: SmartContractPageProps) => {
  return (
    <PageWrapper>
      <PageTop status={Statuses.SUCCESS} type={TransactionType.SMART_CONTRACT} />
      <Stack spacing="extra-loose">
        <TransactionDetails transaction={transaction} />
        <ContractSource />
        <OtherContracts />
      </Stack>
    </PageWrapper>
  );
};

export default SmartContractPage;
