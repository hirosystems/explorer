import React from 'react';
import NextLink from 'next/link';

import { Grid, color } from '@stacks/ui';
import { Caption } from '@components/typography';

import { border } from '@common/utils';

export const SectionFooterAction: React.FC<{
  isLoadingMore?: boolean;
  onClick?: () => void;
  path: 'blocks' | 'transactions';
}> = React.memo(({ onClick, isLoadingMore = false, path }) =>
  onClick ? (
    <Grid
      as="a"
      borderTop={border()}
      px="base"
      py="base"
      placeItems="center"
      _hover={{ color: color('text-title') }}
      onClick={onClick}
      color={color('text-caption')}
    >
      <Caption color="currentColor">{isLoadingMore ? 'Loading...' : 'Load more'}</Caption>
    </Grid>
  ) : (
    <NextLink href={`/${path}`} passHref>
      <Grid
        as="a"
        borderTop={border()}
        px="base"
        py="base"
        placeItems="center"
        _hover={{ color: color('text-title') }}
        onClick={onClick}
        color={color('text-caption')}
      >
        <Caption color="currentColor">View all {path}</Caption>
      </Grid>
    </NextLink>
  )
);
