import * as React from 'react';
import { Box, BoxProps, Flex, Grid, Stack } from '@stacks/ui';
import { Text, Pre, Caption, Link } from '@components/typography';
import { Block, Transaction } from '@blockstack/stacks-blockchain-api-types';

import { PageTop } from '@components/page';
import { Rows } from '@components/rows';
import { Row } from '@components/rows/row';
import { getContractId, TransactionDetails } from '@components/transaction-details';
import { ContractSource } from '@components/contract-source';
import { border, clarityValuetoHumanReadable, microToStacks, truncateMiddle } from '@common/utils';
import { PostConditions } from '@components/post-conditions';
import { Events } from '@components/tx-events';
import NextLink from 'next/link';
import { Section } from '@components/section';
import { ContractCallTxs, TxData } from '@common/types/tx';
import { Badge } from '@components/badge';
import FunctionIcon from 'mdi-react/FunctionIcon';
import { IconChevronRight } from '@tabler/icons';
import { ContractDetails } from '@components/contract-details';
import { ClarityType, cvToString, deserializeCV, getCVTypeString } from '@stacks/transactions';

const getPrettyClarityValueType = (type: any) => {
  if (type === 'bool' || type === 'int' || type === 'principal' || type === 'uint') {
    switch (type) {
      case 'bool':
        return 'Boolean';
      case 'int':
        return 'Integer';
      case 'principal':
        return 'Principal';
      case 'uint':
        return 'Unsigned Integer';
    }
  }

  if (type.includes('tuple')) {
    return 'Tuple';
  }
  return type;
};

const tupleToArr = (tuple: string) =>
  tuple
    .replace('(tuple (', '')
    .replace('))', '')
    .split(') (')
    .map(item => item.split(' '));

const TupleResult = ({ tuple }: any) => {
  return tuple.map((entry: any, index: number, arr: any[]) => (
    <Box display="block" mb={index !== arr.length - 1 ? 'tight' : 'unset'} as="span" key={index}>
      <Caption mb="extra-tight">{entry[0]}</Caption>
      <Text>{entry[1]}</Text>
    </Box>
  ));
};

const getValue = (arg: { name: string; type: any; repr: any; value: any }) => {
  if (arg.type === 'uint') {
    const value = arg.repr.replace('u', '');
    if (arg.name.includes('ustx')) {
      return `${microToStacks(value)} STX`;
    }
    return parseInt(value).toLocaleString();
  }
  if (arg.type.includes('tuple')) {
    const value = tupleToArr(arg.repr);

    return (
      <>
        <TupleResult tuple={value} />
      </>
    );
  }
  return arg.repr;
};

const Principal: React.FC<{ principal: string } & BoxProps> = ({ principal, ...rest }) => (
  <NextLink href="/address/[principal]" as={`/address/${principal}`} passHref>
    <Link as="a" {...rest}>
      {principal}
    </Link>
  </NextLink>
);

const Value = ({ arg, ...rest }: { arg: any }) => {
  if (arg.type === 'principal') {
    const principal = clarityValuetoHumanReadable(arg) as string;
    return (
      <Flex width="100%" flexGrow={1} justifyContent="space-between" {...rest}>
        <Principal principal={principal} />
        <Caption>{getPrettyClarityValueType(arg.type)}</Caption>
      </Flex>
    );
  }

  return (
    <Flex width="100%" flexGrow={1} justifyContent="space-between" {...rest}>
      <Text>{getValue(arg)}</Text>
      <Caption>{getPrettyClarityValueType(arg.type)}</Caption>
    </Flex>
  );
};

const hexToNiceObject = (hex?: string) => {
  if (!hex) return;
  const value = deserializeCV(new Buffer(hex.replace('0x', ''), 'hex'));
  if (value.type === ClarityType.Tuple) {
    const type = getCVTypeString(value);

    const keys = (value.data && Object.keys(value.data)) || [];
    const values = (value.data && Object.values(value.data)) || [];
    return {
      type,
      value: values.map((value, index) => ({
        name: keys[index],
        repr: cvToString(value),
        type: getCVTypeString(value),
      })),
    };
  }
  return value;
};

const resultValue = (value: any) => {
  return { repr: cvToString(value), type: getCVTypeString(value) };
};
const Result = ({ result: _result }: { result: Transaction['tx_result'] }) => {
  const result = hexToNiceObject(_result?.hex);
  if (!_result?.repr.includes('tuple')) {
    return (
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        <Box>{_result?.repr}</Box>
        <Caption>{resultValue(result).type}</Caption>
      </Flex>
    );
  } else {
    return (
      <Box width="100%">
        <Pre>{result?.type}</Pre>

        <Stack mt="extra-loose" spacing="base" width="100%">
          {(result as any)?.value?.map((value: any) => (
            <Box borderBottom={border()} pb="base">
              <Caption display="inline-block" mb="tight">
                {value.name}
              </Caption>
              <Value arg={value} />
            </Box>
          ))}
        </Stack>
      </Box>
    );
  }
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
              flexGrow: 1,
              alignItems: 'flex-start',
              condition: result?.repr,
              children: <Result result={result} />,
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
  const isPending = transaction.tx_status === 'pending';
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
          {'events' in transaction && transaction.events && <Events events={transaction.events} />}
          {!isPending && source.contract && (
            <FunctionSummarySection
              abi={source.contract.abi}
              result={transaction.tx_result}
              summary={transaction.contract_call}
            />
          )}
          {source.contract && (
            <ContractSource
              sourceTx={source.contract.contract_id}
              source={source.contract.source_code}
              contractCall={transaction.contract_call}
            />
          )}
          <PostConditions conditions={transaction.post_conditions} />
        </Stack>
        <Stack spacing="extra-loose">
          {source?.contract?.contract_id && (
            <ContractDetails
              contractId={source?.contract?.contract_id}
              contractInterface={source.contract}
            />
          )}
          {!isPending && (
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
          )}
        </Stack>
      </Grid>
    </>
  );
};

export default ContractCallPage;
