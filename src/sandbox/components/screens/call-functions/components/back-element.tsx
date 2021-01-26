import { useHover } from 'use-events';
import { Box, color, Flex, FlexProps, transition } from '@stacks/ui';
import { IconButton } from '@components/icon-button';
import { ArrowLeftIcon } from '@components/icons/arrow-left';
import React from 'react';

export const BackElement: React.FC<FlexProps> = props => {
  const [isHovered, bind] = useHover();
  return (
    <Flex alignItems="center" mb="base" _hover={{ cursor: 'pointer' }} {...props} {...bind}>
      <IconButton mr="tight" icon={ArrowLeftIcon} dark isHovered={isHovered} />
      <Box
        color={isHovered ? color('text-body') : color('text-caption')}
        transform={isHovered ? 'none' : 'translateX(-8px)'}
        transition={transition}
        fontSize="14px"
      >
        Back to search
      </Box>
    </Flex>
  );
};
