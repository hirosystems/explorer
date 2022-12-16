import NextLink from 'next/link';
import { FC, memo } from 'react';

import { Grid, color } from '@stacks/ui';

import { border } from '@common/utils';

import { Caption } from '@components/typography';

export const ViewAllTxsLink: FC = memo(() => (
  <NextLink href={`/transactions`} passHref>
    <Grid
      as="a"
      borderTop={border()}
      px="base"
      py="base"
      placeItems="center"
      _hover={{ color: color('text-title') }}
      color={color('text-caption')}
    >
      <Caption color="currentColor">View all transactions</Caption>
    </Grid>
  </NextLink>
));
