'use client';

import { FC, ReactNode } from 'react';
import * as React from 'react';

import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Grid } from '../../../ui/Grid';
import { Text } from '../../../ui/Text';

export const StatSection: FC<{
  title: ReactNode;
  bodyMainText: ReactNode;
  bodySecondaryText: ReactNode;
  caption: ReactNode;
}> = ({ title, bodyMainText, bodySecondaryText, caption, ...rest }) => (
  <Grid p={'24px'} height={'131px'} {...rest}>
    <Text fontWeight="500" mb={'9px'} style={{ whiteSpace: 'nowrap' }}>
      {title}
    </Text>
    <Flex fontSize={'27px'} mb={'6px'} alignItems={'baseline'} wrap={'nowrap'} minW={'0'}>
      <Box
        fontSize={'27px'}
        mr={'6px'}
        style={{ whiteSpace: 'nowrap' }}
        textOverflow={'ellipsis'}
        overflow={'hidden'}
        whiteSpace={'nowrap'}
      >
        {bodyMainText}{' '}
      </Box>
      <Box fontSize={'14px'} style={{ whiteSpace: 'nowrap' }}>
        {bodySecondaryText}
      </Box>
    </Flex>
    {caption}
  </Grid>
);
