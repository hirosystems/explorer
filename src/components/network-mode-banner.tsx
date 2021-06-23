import React from 'react';
import { Box, Flex, color } from '@stacks/ui';
import { IconFlask } from '@tabler/icons';

import { Badge, BadgeProps } from '@components/badge';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { capitalize } from '@common/utils';

export const NetworkModeBanner: React.FC<BadgeProps> = props => {
  const mode = useNetworkMode();
  return mode === 'testnet' || mode === 'regtest' ? (
    <Badge flexShrink={0} bg="white" {...props}>
      <Flex alignItems="center">
        <Box
          as={IconFlask}
          fill="rgba(0,0,0,0.1)"
          color={color('brand')}
          size="16px"
          mr="extra-tight"
        />
        <Box color="ink">{capitalize(mode)} mode</Box>
      </Flex>
    </Badge>
  ) : null;
};
