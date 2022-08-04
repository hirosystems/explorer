// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Prism from 'prismjs';
import { clarity } from '@components/code-block/clarity';
import 'prismjs/components/prism-json';
clarity(Prism);
import { css, Theme } from '@stacks/ui-core';

import * as React from 'react';

import { Box, CodeBlock as CodeBlockBase, CodeBlockProps, color } from '@stacks/ui';

const CodeBlock = ({
  highlightedLine,
  ...rest
}: Omit<CodeBlockProps, 'Prism'> & { highlightedLine?: number }) => {
  const highlightedLineStyle = highlightedLine
    ? {
        [`.token-line:nth-child(${highlightedLine})`]: {
          backgroundColor: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.1)',
          '::after': {
            content: `'Called function'`,
            pr: 'base',
            fontSize: '12px',
            opacity: 0.45,
            ml: 'auto',
          },
          '& > div:first-child': {
            '::before': {
              content: `''`,
              width: '10px',
              height: '10px',
              right: '-5px',
              position: 'absolute',
              bg: 'green',
              borderRadius: '10px',
            },
            // borderRightColor: 'green',
            color: 'white',
            bg: 'rgba(255,255,255,0.08)',
            position: 'relative',
          },
          '& > div:nth-child(2)': {
            pl: 'base',
          },
        },
      }
    : {};
  return (
    <Box
      css={(theme: Theme) =>
        css({
          width: '100%',

          '.prism-code': {
            width: '100%',
          },
          '.token-line': {
            width: '100%',
            height: 'auto',
            fontFamily: `'Fira Code', monospace`,
            alignItems: 'center',
            whiteSpace: 'pre-wrap',
            ':hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
            '& > div:first-of-type': {
              alignItems: 'center',
            },
          },
          ...highlightedLineStyle,
        })(theme)
      }
    >
      <CodeBlockBase border="0" borderRadius="0" bg="#040404" Prism={Prism as any} {...rest} />
    </Box>
  );
};

export default CodeBlock;
