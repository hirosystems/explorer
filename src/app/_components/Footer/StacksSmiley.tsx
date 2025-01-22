import { StacksSmileyIcon } from '@/ui/icons/StacksSmileyIcon';
import { Box, BoxProps, Icon } from '@chakra-ui/react';
import { useState } from 'react';

export const StacksSmiley = (boxProps: BoxProps) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Box
      className="stacks-smiley"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...boxProps}
    >
      <Icon h={14} w={14}>
        <StacksSmileyIcon
          laserEyesOn={isHovered}
          circleColor="var(--stacks-colors-stacks-smiley-circle-color)"
          linearGradientColor="var(--stacks-colors-stacks-smiley-linear-gradient-color)"
        />
      </Icon>
    </Box>
  );
};
