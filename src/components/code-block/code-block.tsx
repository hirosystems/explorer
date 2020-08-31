import * as React from 'react';
import { CodeBlock as CodeBlockBase, CodeBlockProps } from '@stacks/ui';
// @ts-ignore
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import { clarity } from '@components/code-block/clarity';

clarity(Prism);

const CodeBlock = (props: Omit<CodeBlockProps, 'Prism'>) => {
  return (
    <CodeBlockBase
      css={{
        '.token-line': {
          fontFamily: `'Soehne Mono', 'Fira Code', monospace`,
          alignItems: 'center',
          ':hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
          },
          '& > div:first-of-type': {
            alignItems: 'center',
          },
        },
      }}
      border="0"
      borderRadius="0"
      Prism={Prism as any}
      {...props}
    />
  );
};

export default CodeBlock;
