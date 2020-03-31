import * as React from 'react';
import { Box, BoxProps, Text, Flex } from '@blockstack/ui';
import { TransactionTitle } from '@components/transaction-title';
import { Statuses } from '@components/status';
import { Transaction } from '@components/tags';
import { TokenTransfers } from '@components/token-transfer';
import { SectionTitle } from '@components/typography';
import { TransactionDetails } from '@components/transaction-details';

const PageWrapper: React.FC<BoxProps> = props => (
  <Box pb="extra-loose" mb="extra-loose" px="base" maxWidth="1100px" mx="auto" pt={16} {...props} />
);

const PageTop: React.FC<BoxProps> = props => (
  <Box width="100%" {...props}>
    <TransactionTitle
      mb="extra-loose"
      status={Statuses.PENDING}
      type={[Transaction.CONTRACT_CREATION, Transaction.TOKEN_TRANSFER]}
    />
  </Box>
);

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

const TransactionPage: React.FC = () => {
  return (
    <PageWrapper>
      <PageTop />
      <TransactionDetails />
      <TokenTransfers />
      <ContractSource />
      <OtherContracts />
    </PageWrapper>
  );
};

export default TransactionPage;
