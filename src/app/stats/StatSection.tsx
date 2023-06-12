import { Box, Flex, Grid, GridProps } from '@/ui/components';
import * as React from 'react';
import { FC, ReactNode } from 'react';

export const StatSection: FC<
  {
    title: ReactNode;
    bodyMainText: ReactNode;
    bodySecondaryText: ReactNode;
    caption?: ReactNode;
  } & GridProps
> = ({ title, bodyMainText, bodySecondaryText, caption, ...rest }) => (
  <Grid p={'24px'} height={caption ? '131px' : 'auto'} {...rest}>
    <Box color={'textTitle'} fontWeight="500" mb={'9px'} style={{ whiteSpace: 'nowrap' }}>
      {title}
    </Box>
    <Flex fontSize={'27px'} mb={'6px'} color={'textTitle'} alignItems={'baseline'} wrap={'nowrap'}>
      <Box fontSize={'27px'} mr={'6px'} style={{ whiteSpace: 'nowrap' }}>
        {bodyMainText}{' '}
      </Box>
      <Box fontSize={'14px'} style={{ whiteSpace: 'nowrap' }}>
        {bodySecondaryText}
      </Box>
    </Flex>
    {caption}
  </Grid>
);
