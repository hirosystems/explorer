import React from 'react';
import Prism from 'prismjs';
import Highlight from 'prism-react-renderer';
import { Box, Flex, useTheme } from '@blockstack/ui';

import { Token, GetTokenProps, RenderProps } from '@components/highlighter/types';
import { theme } from '@components/highlighter/prism-theme';

const lineNumberWidth = 60;
const getLineNumber = (n: number) => (n + 1 < 10 ? '0' : '') + (n + 1);

const Tokens = ({
  tokens,
  getTokenProps,
  ...rest
}: {
  tokens: Token[];
  getTokenProps: GetTokenProps;
}) => {
  const bsTheme = useTheme();
  const pl = `calc(${lineNumberWidth}px + ${(bsTheme as any).sizes['base'] || '16px'})`;

  return (
    <Box pl={pl} pr="base" position="relative" zIndex={2} {...rest}>
      {tokens.map((token, key) => (
        <Box py="2px" display="inline-block" {...getTokenProps({ token, key })} />
      ))}
    </Box>
  );
};
const LineNumber = ({ number, ...rest }: { number: number }) => (
  <Flex
    textAlign="right"
    pr="base"
    pl="base"
    width={lineNumberWidth}
    borderRight="1px solid"
    borderRightColor="inherit"
    color="ink.400"
    flexShrink={0}
    style={{ userSelect: 'none' }}
    position="absolute"
    left={0}
    height="100%"
    align="baseline"
    justify="center"
    zIndex={1}
    {...rest}
  >
    {getLineNumber(number)}
  </Flex>
);

const Line = ({
  tokens,
  getTokenProps,
  index,
  ...rest
}: {
  tokens: Token[];
  index: number;
  getTokenProps: any;
}) => {
  return (
    <Flex
      height="loose"
      align="baseline"
      borderColor="ink.900"
      _hover={{ bg: 'ink.900', borderColor: 'ink.600' }}
      position="relative"
      {...rest}
    >
      <LineNumber number={index} />
      <Tokens getTokenProps={getTokenProps} tokens={tokens} />
    </Flex>
  );
};
const Lines = ({ tokens: lines, getLineProps, getTokenProps, className }: RenderProps) => {
  return (
    <Box display="block" className={className}>
      <Box display="block" style={{ fontFamily: 'Fira Code' }}>
        {lines.map((tokens, i) => (
          <Line
            index={i}
            tokens={tokens}
            getTokenProps={getTokenProps}
            {...getLineProps({ line: tokens, key: i })}
          />
        ))}
      </Box>
    </Box>
  );
};

export const Highlighter = ({ code }: { code: string }) => {
  return (
    <Highlight theme={theme} code={code} language={'lisp' as any} Prism={Prism as any}>
      {Lines}
    </Highlight>
  );
};
