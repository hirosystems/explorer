import { useIsInViewport } from '@/common/hooks/useIsInViewport';
import { Box, Stack } from '@chakra-ui/react';
import { motion } from 'motion/react';
import * as React from 'react';
import { useRef } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { TxHeader, TxHeaderMinimized } from './TxHeader';
import { TxTabs } from './TxTabs';

export const TokenTransferPage: React.FC<{
  tx: Transaction | MempoolTransaction;
}> = ({ tx }) => {
  const txHeaderRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useIsInViewport(txHeaderRef);

  return (
    <>
      <Stack gap={3}>
        <TxHeader tx={tx} ref={txHeaderRef} />
        {/* TODO: alerts go here */}
      </Stack>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: isHeaderInView ? 0 : 1,
          y: isHeaderInView ? -20 : 0,
          pointerEvents: isHeaderInView ? 'none' : 'auto',
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 'var(--stacks-z-index-docked)',
        }}
      >
        <Box borderRadius="redesign.xl" pt={3} px={6} bg="transparent">
          <TxHeaderMinimized tx={tx} />
        </Box>
      </motion.div>

      <TxTabs tx={tx} />
    </>
  );
};
