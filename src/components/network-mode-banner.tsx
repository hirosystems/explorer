import React from 'react';
import { Box, Flex } from '@stacks/ui';
import { IconCircle } from '@tabler/icons';

import { Badge, BadgeProps } from '@components/badge';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { capitalize } from '@common/utils';

export const NetworkModeBanner: React.FC<BadgeProps> = props => {
  const mode = useNetworkMode();
  return mode ? (
    <Badge
      flexShrink={0}
      backdropFilter="blur(10px)"
      bg="rgba(255,255,255,0.1)"
      border="1px solid"
      borderColor="rgba(255,255,255,0.45)"
      {...props}
    >
      <Flex alignItems="center">
        <Box
          as={IconCircle}
          fill="rgba(255,255,255,0.5)"
          color="white"
          size="16px"
          mr="extra-tight"
        />
        <Box>{capitalize(mode)} mode</Box>
      </Flex>
    </Badge>
  ) : null;
};
