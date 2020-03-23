import * as React from 'react';
import { Box, BoxProps, Text, Flex } from '@blockstack/ui';
import { TransactionTitle } from '@components/transaction-title';
import { Statuses } from '@components/status';
import { Transaction } from '@components/tags';
import { Rows } from '@components/rows';
import { TokenTransfers } from '@components/token-transfer';
import { ContractCard } from '@components/contract-card';
import { SectionTitle } from '@components/typography';

const data = {
  txid: '84ee928fd3b61a9dee390fe62b606d28097cd43179a754100b49a45fb2206999',
  sender: 'SP2X1KBV41VRZ4X3KMPZA2C53K2N4XX1P4VMKK697',
  recipient: 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS',
  type: 0,
  fees: {
    amount: '12.1830',
    currency: 'STX',
  },
  block: 1829,
  post_conditions: 'lskdjfs',
  sponsored: true,
  state: 'success',
  timestamp: 1583933098,
};

const TransactionDetailsSection: React.FC = () => (
  <Flex align="flex-start" flexDirection={['column', 'column', 'row']}>
    <Box
      width={['100%']}
      order={[2, 2, 0]}
      mt={['extra-loose', 'extra-loose', 'unset']}
      mr={['unset', 'unset', '72px']}
    >
      <Rows items={data} />
    </Box>
    <ContractCard title="Stack-o-puppers" meta="stackopuppers.co" order={[0, 0, 2]} />
  </Flex>
);

const PageWrapper: React.FC<BoxProps> = props => (
  <Box pb="extra-loose" mb="extra-loose" px="base" maxWidth="1100px" mx="auto" pt={16} {...props} />
);

const PageTop: React.FC<BoxProps> = props => (
  <Box width="100%" {...props}>
    <TransactionTitle mb="extra-loose" status={Statuses.SUCCESS} type={Transaction.CONTRACT_CREATION} />
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
      <TransactionDetailsSection />
      <TokenTransfers />
      <ContractSource />
      <OtherContracts />
    </PageWrapper>
  );
};

export default TransactionPage;
