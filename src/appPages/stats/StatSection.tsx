import { ReactNode } from 'react';
import { Box, Flex, Grid } from '@/ui/components';

export function StatSection({
  title,
  bodyMainText,
  bodySecondaryText,
  caption,
  ...rest
}: {
  title: ReactNode;
  bodyMainText: ReactNode;
  bodySecondaryText: ReactNode;
  caption: ReactNode;
}) {
  return (
    <Grid p="24px" height="131px" {...rest}>
      <Box fontWeight="500" mb="9px" style={{ whiteSpace: 'nowrap' }}>
        {title}
      </Box>
      <Flex fontSize="27px" mb="6px" alignItems="baseline" wrap="nowrap" minW="0">
        <Box
          fontSize="27px"
          mr="6px"
          style={{ whiteSpace: 'nowrap' }}
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
        >
          {bodyMainText}{' '}
        </Box>
        <Box fontSize="14px" style={{ whiteSpace: 'nowrap' }}>
          {bodySecondaryText}
        </Box>
      </Flex>
      {caption}
    </Grid>
  );
}
