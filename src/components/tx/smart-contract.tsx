import * as React from 'react';
import { Box, Flex, Text, Stack } from '@blockstack/ui';

import { CodeBlock } from '@components/codeblock';
import { SectionTitle } from '@components/typography';
import { PageTop } from '@components/page';

import { TransactionType } from '@models/transaction.interface';
import { Statuses } from '@components/status';
import { TransactionDetails } from '@components/transaction-details';
import { SmartContractTransaction } from '@blockstack/stacks-blockchain-sidecar-types';
import { TokenTransfers } from '@components/token-transfer';

const ContractSource = ({ source }: { source: string }) => (
  <Box mt="extra-loose">
    <SectionTitle mb="base-loose">Contract source</SectionTitle>
    <CodeBlock code={source} />
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
    <>
      <PageTop status={Statuses.SUCCESS} type={TransactionType.SMART_CONTRACT} />
      <Stack spacing="extra-loose">
        <TransactionDetails
          contractName={transaction.smart_contract.contract_id.split('.')[1]}
          transaction={transaction}
        />
        <TokenTransfers events={transaction.events} />
        <ContractSource source={transaction.smart_contract.source_code} />
        <OtherContracts />
      </Stack>
    </>
  );
};

export default SmartContractPage;
