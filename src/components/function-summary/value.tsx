import { useGlobalContext } from '@/common/context/useAppContext';
import { NetworkModes } from '@/common/types/network';
import { microToStacks } from '@/common/utils';
import { TxLink } from '@/components/links';
import { Box, Flex, TextLink } from '@/ui/components';
import { Caption, Text } from '@/ui/typography';
import NextLink from 'next/link';
import * as React from 'react';

import { cvToJSON, hexToCV } from '@stacks/transactions';

import { Value } from '../../app/common/components/Value';

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
  const networkMode = useGlobalContext().activeNetwork.mode;
  const btcLinkPathPrefix = networkMode === NetworkModes.Testnet ? '/testnet' : '';
  let additional: any = null;
  if (isPoxAddr && btc) {
    additional = (
      <Box display="block" as="span">
        <Caption mb="4px">BTC address (converted)</Caption>
        <Text
          target="_blank"
          as={TextLink}
          href={`https://mempool.space${btcLinkPathPrefix}/address/${btc}`}
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
            mb={index !== arr.length - 1 || !!additional ? '8px' : 'unset'}
            as="span"
            key={index}
          >
            <Caption mb="4px">{entry?.[0]?.replace(/\(/g, '')}</Caption>
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

export const FunctionSummaryClarityValue = ({
  arg,
  btc,
  ...rest
}: {
  arg: any;
  btc: null | string;
}) => {
  if (arg.type === 'principal') {
    const principal = arg.hex ? (cvToJSON(hexToCV(arg.hex)) || {}).value : '';
    const isContract = principal.includes('.');
    if (isContract) {
      return (
        <Flex width="100%" flexGrow={1} justifyContent="space-between" {...rest}>
          <TxLink txId={principal}>
            <TextLink as="a">{principal}</TextLink>
          </TxLink>
          <Caption>{getPrettyClarityValueType(arg.type)}</Caption>
        </Flex>
      );
    }
    return (
      <Flex width="100%" flexGrow={1} justifyContent="space-between" {...rest}>
        <NextLink href="/address/[principal]" as={`/address/${principal}`} passHref legacyBehavior>
          <TextLink as="a" {...rest}>
            {arg.repr}
          </TextLink>
        </NextLink>
        <Caption>{getPrettyClarityValueType(arg.type)}</Caption>
      </Flex>
    );
  }
  return (
    <Flex width="100%" flexGrow={1} justifyContent="space-between" {...rest}>
      <Value>{getValue(arg, btc)}</Value>
      <Caption>{getPrettyClarityValueType(arg.type)}</Caption>
    </Flex>
  );
};
