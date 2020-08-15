// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Prism from 'prismjs';
import { clarity } from '@components/code-block/clarity';
import 'prismjs/components/prism-json';
clarity(Prism);
import { css, Theme } from '@stacks/ui-core';

import * as React from 'react';

import { Box, CodeBlock as CodeBlockBase, CodeBlockProps } from '@stacks/ui';

const CodeBlock = (props: Omit<CodeBlockProps, 'Prism'>) => {
  return (
    <Box
      css={(theme: Theme) =>
        css({
          '.token-line': {
            fontFamily: `'Fira Code', monospace`,
            alignItems: 'center',
            ':hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
            '& > div:first-of-type': {
              alignItems: 'center',
            },
          },
        })(theme)
      }
    >
      <CodeBlockBase border="0" borderRadius="0" Prism={Prism as any} {...props} />
    </Box>
  );
};

export default CodeBlock;
