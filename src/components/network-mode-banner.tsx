import { Box, Flex, Grid } from '@stacks/ui';
import React from 'react';

import { useNetworkMode } from '@common/hooks/use-network-mode';

import { IconCircle } from '@tabler/icons';
import { Badge } from '@components/badge';

export const NetworkModeBanner = ({ networkMode }: { networkMode?: 'Testnet' | 'Mainnet' }) => {
  const mode = useNetworkMode(networkMode);
  return mode ? (
    <Grid
      pointerEvents="none"
      justifyContent="flex-start"
      pl="78px"
      alignItems="center"
      flexShrink={0}
      position="absolute"
      zIndex={999}
      width="100%"
      height="64px"
    >
      <Badge
        backdropFilter="blur(10px)"
        bg="rgba(255,255,255,0.1)"
        border="1px solid"
        borderColor="rgba(255,255,255,0.45)"
      >
        <Flex alignItems="center">
          <Box
            as={IconCircle}
            fill="rgba(255,255,255,0.5)"
            color="white"
            size="16px"
            mr="extra-tight"
          />
          <Box>{mode} mode</Box>
        </Flex>
      </Badge>
    </Grid>
  ) : null;
};
