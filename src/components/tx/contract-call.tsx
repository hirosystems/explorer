import * as React from 'react';
import { Box, Flex, Stack } from '@blockstack/ui';
import { Text, Pre, Caption } from '@components/typography';
import { useSelector } from 'react-redux';
import { ContractCallTransaction } from '@blockstack/stacks-blockchain-sidecar-types';
import { RootState } from '@store';

import { selectOriginContractSource } from '@store/transactions';
import { TransactionType } from '@models/transaction.interface';

import { TokenTransfers } from '@components/token-transfer';
import { SectionTitle } from '@components/typography';
import { PageTop } from '@components/page';
import { Rows } from '@components/rows';
import { Row } from '@components/rows/row';
import { TransactionDetails } from '@components/transaction-details';
import { ContractSource } from '@components/contract-source';
import { clarityValuetoHumanReadable } from '@common/utils';
import { PostConditions } from '@components/post-conditions';
import { selectContractAbi } from '@store/contracts';
import { Tooltip } from '@components/tooltip';

const FunctionSummarySection = ({ summary, abi, ...rest }: { summary: any; abi: any }) => {
  // @ts-ignore
  const abiData = abi.functions.find(func => func.name === summary.function_name);
  console.log(abiData);
  return (
    <Box {...rest}>
      <SectionTitle mb="base-loose">Function summary</SectionTitle>
      <Rows
        items={[
          {
            label: {
              children: 'Name',
            },
            children: (
              <Flex width="100%" align="center">
                <Pre fontSize="16px">
                  define-{abiData.access} ({summary.function_name})
                </Pre>
              </Flex>
            ),
          },

          {
            label: {
              children: 'Arguments',
            },
            children: summary.function_args ? (
              <Box width="100%">
                {summary.function_args.map((arg: any, key: number) => (
                  <Row
                    py={key === 0 ? undefined : 'base'}
                    pb={key === summary.function_args.length - 1 ? 'none' : 'base'}
                    borderBottom={key === summary.function_args.length - 1 ? 'none' : '1px solid'}
                  >
                    <Box>
                      <Box pb="base">
                        <Pre>{abiData.args[key].name}</Pre>
                      </Box>
                      <Box>
                        <Tooltip
                          placement="bottom"
                          label={Object.keys(abiData.args[key].type)[0].toString()}
                        >
                          <Text>{clarityValuetoHumanReadable(arg.toString())}</Text>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Row>
                ))}
              </Box>
            ) : (
              <Row py="none" borderBottom="none">
                <Text>This function has no arguments.</Text>
              </Row>
            ),
          },
        ]}
      />
    </Box>
  );
};

interface ContractCallPageProps {
  transaction: ContractCallTransaction;
}

const ContractCallPage = ({ transaction }: ContractCallPageProps) => {
  const { contractSource, abi } = useSelector((state: RootState) => ({
    contractSource: selectOriginContractSource(transaction.contract_call.contract_id)(state),
    abi: JSON.parse(selectContractAbi(transaction.contract_call.contract_id)(state) || ''),
  }));

  console.log(abi);

  return (
    <>
      <PageTop status={transaction.tx_status} type={[TransactionType.CONTRACT_CALL]} />
      <Stack spacing="extra-loose">
        <TransactionDetails transaction={transaction} />
        <TokenTransfers events={transaction.events} />
        <ContractSource source={contractSource} />
        <FunctionSummarySection abi={abi} summary={transaction.contract_call} />
        <PostConditions conditions={transaction.post_conditions} />
      </Stack>
    </>
  );
};

export default ContractCallPage;
