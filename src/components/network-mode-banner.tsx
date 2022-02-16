import React from 'react';
import { Box, Flex, color } from '@stacks/ui';
import { IconFlask } from '@tabler/icons';

import { Badge, BadgeProps } from '@components/badge';
import { capitalize } from '@common/utils';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';

export const NetworkModeBanner: React.FC<BadgeProps> = props => {
  const networkMode = useAppSelector(selectActiveNetwork).mode;
  return networkMode === 'testnet' ? (
    <Badge flexShrink={0} bg="white" {...props}>
      <Flex alignItems="center">
        <Box
          as={IconFlask}
          fill="rgba(0,0,0,0.1)"
          color={color('brand')}
          size="16px"
          mr="extra-tight"
        />
        <Box color="ink">{capitalize(networkMode)} mode</Box>
      </Flex>
    </Badge>
  ) : null;
};
