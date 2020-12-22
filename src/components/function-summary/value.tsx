import * as React from 'react';
import { Box, BoxProps, Flex } from '@stacks/ui';
import { Caption, Link, Text } from '@components/typography';
import { clarityValuetoHumanReadable, microToStacks } from '@common/utils';
import NextLink from 'next/link';

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

export const FunctionSummaryClarityValue = ({ arg, ...rest }: { arg: any }) => {
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
