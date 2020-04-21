import React, { useState } from 'react';
import { Box } from '@blockstack/ui';
import css from '@styled-system/css';
import { Highlighter } from '@components/highlighter';

export const CodeBlock = ({ code }: { code: string }) => {
  const [editorCode] = useState(code?.toString().trim());

  return (
    <Box
      // @ts-ignore
      css={css({
        '*': {
          whiteSpace: 'pre',
          fontFamily: 'Fira Code',
          fontSize: '14px',
        },
      })}
      overflowX="auto"
      bg="ink"
      borderRadius={[0, 0, '12px']}
      py="base"
    >
      <Highlighter code={editorCode} />
    </Box>
  );
};
