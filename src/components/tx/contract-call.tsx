import * as React from 'react';
import { Box, Flex, Stack } from '@stacks/ui';
import { Text, Pre, Caption, Link } from '@components/typography';

import { ContractCallTransaction } from '@blockstack/stacks-blockchain-api-types';

import { TransactionType } from '@models/transaction.interface';

import { TokenTransfers } from '@components/token-transfer';

import { PageTop } from '@components/page';
import { Rows } from '@components/rows';
import { Row } from '@components/rows/row';
import { getContractId, TransactionDetails } from '@components/transaction-details';
import { ContractSource } from '@components/contract-source';
import { border, clarityValuetoHumanReadable } from '@common/utils';
import { PostConditions } from '@components/post-conditions';

import NextLink from 'next/link';
import { Section } from '@components/section';
import { TxData } from '@common/types/tx';

const Value = ({ arg }: { arg: any }) => {
  if (arg.type === 'principal') {
    const principal = clarityValuetoHumanReadable(arg) as string;
    return (
      <NextLink href="/address/[principal]" as={`/address/${principal}`} passHref>
        <Link as="a">{principal}</Link>
      </NextLink>
    );
  }

  return <Text>{clarityValuetoHumanReadable(arg)}</Text>;
};

const FunctionSummarySection = ({
  summary,
  result,
  abi,
  ...rest
}: {
  result: any;
  summary: any;
  abi: any;
}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const abiData = abi.functions.find(func => func.name === summary.function_name);
  return (
    <Section title="Function summary" {...rest}>
      <>
        <Rows
          px="base"
          noTopBorder
          items={[
            {
              label: {
                children: 'Name',
              },
              children: (
                <Flex width="100%" alignItems="center">
                  <Pre fontSize="14px">
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
                          <Value arg={arg} />
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
            {
              label: {
                children: 'Result',
              },
              condition: result?.repr,
              children: (
                <Flex width="100%" alignItems="center">
                  <Pre fontSize="14px">{result?.repr}</Pre>
                </Flex>
              ),
            },
          ]}
        />
      </>
    </Section>
  );
};

const ContractCallPage = ({ transaction, source }: TxData<ContractCallTransaction>) => {
  return (
    <>
      <PageTop status={transaction.tx_status} type={[TransactionType.CONTRACT_CALL]} />
      <Stack spacing="extra-loose">
        <TransactionDetails transaction={transaction} />
        <TokenTransfers events={transaction.events} />
        <FunctionSummarySection
          abi={source.contract.abi}
          result={transaction.tx_result}
          summary={transaction.contract_call}
        />
        <ContractSource
          sourceTx={source.contract.contract_id}
          source={source.contract.source_code}
          contractCall={transaction.contract_call}
        />
        <PostConditions conditions={transaction.post_conditions} />
      </Stack>
    </>
  );
};

export default ContractCallPage;
