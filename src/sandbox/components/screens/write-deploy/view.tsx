import React, { memo, useRef } from 'react';
import { Box, color, Flex, Stack } from '@stacks/ui';

import { ClarityCodeEditor } from '@sandbox/components/clarity-editor';
import { WasmComponent } from '@sandbox/components/clarity-repl';
import { Global, css } from '@emotion/react';
import { border } from '@common/utils';
import { Caption } from '@components/typography';
import { ClarityIcon } from '@sandbox/components/clarity-icon';

export const WriteAndDeployView: React.FC = memo(() => {
  const ref = useRef<HTMLElement | null>(null);
  return (
    <>
      <WasmComponent />
      <Global
        styles={css`
          .clarity-editor-wrapper {
            position: absolute !important;
          }
        `}
      />
      <Flex flexDirection="column" bg="#282c34" pt="base" flexGrow={1} flexShrink={1}>
        <Box
          px="extra-loose"
          pb="base"
          borderBottom={border()}
          borderBottomColor="rgba(255,255,255,0.1)"
          color="white"
        >
          <Stack alignItems="center" isInline>
            <ClarityIcon size="16px" />
            <Caption transform="translateY(1px)" color="white">
              Clarity code editor
            </Caption>
          </Stack>
        </Box>
        <Box size="100%" ref={ref} position="relative">
          <ClarityCodeEditor />
        </Box>
      </Flex>
    </>
  );
});
