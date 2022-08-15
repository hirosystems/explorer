import { border } from '@common/utils';
import { Caption } from '@components/typography';
import { FC, memo } from 'react';
import NextLink from 'next/link';
import { Grid, color } from '@stacks/ui';

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
