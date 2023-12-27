'use client';

import React from 'react';

import { FilterIcon } from '../../common/components/icons/filter';
import { Box } from '../../ui/Box';
import { Grid, GridProps } from '../../ui/Grid';
import { Text, Title } from '../../ui/typography';

export const FilteredMessage: React.FC<GridProps> = ({ ...rest }) => {
  return (
    <Grid p="32px" placeItems="center" textAlign="center" {...rest}>
      <Box>
        <Grid
          mx="auto"
          placeItems="center"
          size="72px"
          borderRadius="100%"
          color={'textTitle'}
          mb="20px"
        >
          <Box color={'accent'} transform="translateY(2px)" size="48px">
            <FilterIcon size="10px" />
          </Box>
        </Grid>
        <Title mb="8px" fontSize="sm">
          Transactions filtered
        </Title>
        <Text fontSize={'xs'} maxWidth="30ch" mx="auto" lineHeight="1.8">
          You have confirmed transactions, but they aren't currently visible due to your filter
          settings.
        </Text>
      </Box>
    </Grid>
  );
};
