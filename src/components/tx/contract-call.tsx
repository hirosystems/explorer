import * as React from 'react';
import { Box, Flex, Grid, Stack } from '@stacks/ui';
import { Text, Pre, Caption, Link } from '@components/typography';

import { Block, ContractCallTransaction } from '@blockstack/stacks-blockchain-api-types';

import { TransactionType } from '@models/transaction.interface';

import { TokenTransfers } from '@components/token-transfer';

import { PageTop } from '@components/page';
import { Rows } from '@components/rows';
import { Row } from '@components/rows/row';
import { getContractId, TransactionDetails } from '@components/transaction-details';
import { ContractSource } from '@components/contract-source';
import { border, clarityValuetoHumanReadable, truncateMiddle } from '@common/utils';
import { PostConditions } from '@components/post-conditions';

import NextLink from 'next/link';
import { Section } from '@components/section';
import { ContractCallTxs, TxData } from '@common/types/tx';
import { Badge } from '@components/badge';
import FunctionIcon from 'mdi-react/FunctionIcon';
import { IconChevronRight } from '@tabler/icons';
import { ContractDetails } from '@components/contract-details';

const Value = ({ arg }: { arg: any }) => {
  if (arg.type === 'principal') {
    const principal = clarityValuetoHumanReadable(arg) as string;
    return (
      <NextLink href="/address/[principal]" as={`/address/${principal}`} passHref>
        <Link as="a">{principal}</Link>
      </NextLink>
    );
  }

  return (
    <Flex width="100%" flexGrow={1} justifyContent="space-between">
      <Text>{clarityValuetoHumanReadable(arg)}</Text>
      <Caption>{arg.type}</Caption>
    </Flex>
  );
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
  console.log(abiData);
  return (
    <Section title="Function called" {...rest}>
      <>
        <Rows
          px="base"
          noTopBorder
          items={[
            {
              label: {
                children: 'Function',
              },
              children: (
                <Flex width="100%" alignItems="center">
                  <Badge
                    _hover={{
                      cursor: 'pointer',
                    }}
                    bg="#7F80FF"
                    p="0"
                    px="0"
                  >
                    <Flex px="tight" py="tight">
                      <FunctionIcon size="15px" />
                      define-{abiData.access} ({summary.function_name})
                      <Grid placeItems="center" pl="tight">
                        <IconChevronRight size="15px" />
                      </Grid>
                    </Flex>
                  </Badge>
                </Flex>
              ),
            },

            {
              label: {
                children: 'Arguments',
              },
              alignItems: 'flex-start',
              flexGrow: 1,
              children: summary.function_args ? (
                <Box width="100%">
                  {summary.function_args.map((arg: any, key: number) => (
                    <Row
                      flexGrow={1}
                      alignItems="center"
                      width="100%"
                      py={key === 0 ? undefined : 'base'}
                      pb={key === summary.function_args.length - 1 ? 'none' : 'base'}
                      borderBottom={key === summary.function_args.length - 1 ? 'none' : '1px solid'}
                    >
                      <Grid
                        justifyContent="flex-start"
                        width="100%"
                        gridTemplateColumns="150px 1fr"
                        alignItems="center"
                      >
                        <Flex alignItems="center">
                          <Pre>{abiData.args[key].name}</Pre>
                        </Flex>
                        <Value arg={arg} />
                      </Grid>
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

const ContractCallPage = ({
  transaction,
  source,
  block,
}: TxData<ContractCallTxs> & { block?: Block }) => {
  console.log(block);
  return (
    <>
      <PageTop tx={transaction as any} />
      <Grid
        gridColumnGap="extra-loose"
        gridTemplateColumns={['100%', '100%', 'repeat(1, calc(100% - 352px) 320px)']}
        gridRowGap={['extra-loose', 'extra-loose', 'unset']}
        maxWidth="100%"
        alignItems="flex-start"
      >
        <Stack spacing="extra-loose">
          <TransactionDetails transaction={transaction} />
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
        <Stack spacing="extra-loose">
          <ContractDetails
            contractId={source.contract.contract_id}
            contractInterface={source.contract}
          />
          <Section title="Bitcoin anchor">
            <Box px="base">
              <Rows
                noTopBorder
                inline
                items={[
                  {
                    label: {
                      children: 'Bitcoin block',
                    },
                    children: `#${block?.burn_block_height}`,
                  },
                  {
                    label: {
                      children: 'Bitcoin hash',
                    },
                    children: truncateMiddle(block?.burn_block_hash as string, 12),
                    copy: block?.burn_block_hash,
                  },
                  {
                    label: {
                      children: 'Anchor transaction',
                    },
                    children: truncateMiddle(block?.miner_txid as string, 12),
                    copy: block?.miner_txid,
                  },
                ]}
              />
            </Box>
          </Section>
        </Stack>
      </Grid>
    </>
  );
};

export default ContractCallPage;
