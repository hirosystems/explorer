import * as React from 'react';
import { Box, BoxProps, Flex } from '@stacks/ui';
import { Caption, Link, Text } from '@components/typography';
import { clarityValuetoHumanReadable, microToStacks } from '@common/utils';
import NextLink from 'next/link';
import { TxLink } from '@components/links';
import { useNetworkMode } from '@common/hooks/use-network-mode';

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

const TupleResult = ({ tuple, isPoxAddr, btc }: any) => {
  const { networkMode } = useNetworkMode();
  let additional: any = null;
  if (isPoxAddr && btc) {
    additional = (
      <Box display="block" as="span">
        <Caption mb="extra-tight">BTC address (converted)</Caption>
        <Text
          target="_blank"
          as={Link}
          href={`https://www.blockchain.com/btc${
            networkMode === 'testnet' ? '-testnet' : ''
          }/address/${btc}`}
        >
          {btc}
        </Text>
      </Box>
    );
  }

  return (
    <>
      {tuple.map((entry: any, index: number, arr: any[]) =>
        entry && entry.length ? (
          <Box
            display="block"
            mb={index !== arr.length - 1 || !!additional ? 'tight' : 'unset'}
            as="span"
            key={index}
          >
            <Caption mb="extra-tight">{entry?.[0]?.replace(/\(/g, '')}</Caption>
            <Text>{entry?.[1]?.replace(/\)/g, '')}</Text>
          </Box>
        ) : null
      )}
      {additional}
    </>
  );
};

const getValue = (arg: { name: string; type: any; repr: any; value: any }, btc: null | string) => {
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
        <TupleResult isPoxAddr={arg.name === 'pox-addr'} btc={btc} tuple={value} />
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

export const FunctionSummaryClarityValue = ({
  arg,
  btc,
  ...rest
}: {
  arg: any;
  btc: null | string;
}) => {
  if (arg.type === 'principal') {
    const principal = clarityValuetoHumanReadable(arg) as string;
    const isContract = principal.includes('.');
    if (isContract) {
      return (
        <Flex width="100%" flexGrow={1} justifyContent="space-between" {...rest}>
          <TxLink txid={principal}>
            <Link as="a">{principal}</Link>
          </TxLink>
          <Caption>{getPrettyClarityValueType(arg.type)}</Caption>
        </Flex>
      );
    }
    return (
      <Flex width="100%" flexGrow={1} justifyContent="space-between" {...rest}>
        <Principal principal={principal} />
        <Caption>{getPrettyClarityValueType(arg.type)}</Caption>
      </Flex>
    );
  }
  return (
    <Flex width="100%" flexGrow={1} justifyContent="space-between" {...rest}>
      <Text>{getValue(arg, btc)}</Text>
      <Caption>{getPrettyClarityValueType(arg.type)}</Caption>
    </Flex>
  );
};
