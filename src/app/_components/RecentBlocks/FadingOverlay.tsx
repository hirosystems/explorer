import { Box } from '@chakra-ui/react';

export function FadingOverlay() {
  return (
    <Box
      flex={'0 0 auto'}
      w={['50px', '100px']}
      bg={'linear-gradient(to left, var(--stacks-colors-surface-tertiary) 0%, transparent 100%)'}
      position={'absolute'}
      top={0}
      bottom={0}
      right={0}
      aria-hidden="true"
    />
  );
}
