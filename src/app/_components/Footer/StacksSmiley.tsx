import { StacksSmileyIcon } from '@/ui/icons/StacksSmileyIcon';
import { Box, BoxProps, Icon } from '@chakra-ui/react';

export const StacksSmiley = (boxProps: BoxProps) => {
  return (
    <Box
      className="stacks-smiley"
      css={{
        '&:hover .laser-eye-1': {
          filter: 'url(#filter3_d_2985_1972)',
        },
        '&:hover .laser-eye-2': {
          filter: 'url(#filter4_d_2985_1972)',
        },
        '&:hover .laser-eye-1 circle, &:hover .laser-eye-2 circle': {
          fill: '#fd6112',
        },
      }}
      {...boxProps}
    >
      <Icon h={14} w={14}>
        <StacksSmileyIcon
          circleColor="var(--stacks-colors-stacks-smiley-circle-color)"
          linearGradientColor="var(--stacks-colors-stacks-smiley-linear-gradient-color)"
        />
      </Icon>
    </Box>
  );
};
