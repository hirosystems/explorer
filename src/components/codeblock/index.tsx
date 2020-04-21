import React, { useState } from 'react';
import Highlight from 'prism-react-renderer';
import { Box, Flex } from '@blockstack/ui';
import Prism from 'prismjs';
import { theme } from '@components/codeblock/prism-theme';
require('prismjs/components/prism-lisp');

const Highlighter = ({ code }: { code: string }) => {
  return (
    <Highlight theme={theme} code={code} language={'lisp' as any} Prism={Prism as any}>
      {({ tokens, getLineProps, getTokenProps, className }) => (
        <Box className={className} as="code">
          <Box as="pre" style={{ fontFamily: 'Fira Code' }}>
            {tokens.map((line, i) => (
              <Flex height="loose" _hover={{ bg: 'ink.900' }} {...getLineProps({ line, key: i })}>
                <Box
                  textAlign="right"
                  width="48px"
                  borderRight="1px solid"
                  borderRightColor="ink.900"
                  color="ink.400"
                  pr="base"
                  flexShrink={0}
                  style={{ userSelect: 'none' }}
                >
                  {i < 10 ? '0' : ''}
                  {i}
                </Box>
                <Box left="-48px" pl="60px" position="relative">
                  {line.map((token, key) => (
                    <Box
                      py="2px"
                      display="inline-block"
                      as="span"
                      {...getTokenProps({ token, key })}
                    />
                  ))}
                </Box>
              </Flex>
            ))}
          </Box>
        </Box>
      )}
    </Highlight>
  );
};

export const CodeBlock = ({ code }: { code: string }) => {
  const [editorCode] = useState(code?.toString().trim());

  return (
    <Box
      bg="ink"
      borderRadius="12px"
      py="base"
      style={{
        whiteSpace: 'pre',
        fontFamily: 'Fira Code',
        overflowX: 'auto',
        fontSize: '14px',
      }}
    >
      <Highlighter code={editorCode} />
    </Box>
  );
};
