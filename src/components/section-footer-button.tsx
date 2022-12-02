import React from 'react';

import { Box, color, Flex, Grid } from '@stacks/ui';
import { Caption } from '@components/typography';

import { border } from '@common/utils';
import { Pending } from '@components/status';
import { ExplorerLink } from './links';

interface SectionFooterButtonPropsBase {
  isLoading?: boolean;
  hasNextPage?: boolean;
  onClick?: () => void;
  path?: 'blocks' | 'transactions';
  showLoadMoreButton?: boolean;
}

export const SectionFooterAction: React.FC<SectionFooterButtonPropsBase> = ({
  onClick,
  isLoading,
  path,
  hasNextPage,
  showLoadMoreButton,
}) =>
  onClick && showLoadMoreButton ? (
    hasNextPage ? (
      <Grid
        as="a"
        borderTop={border()}
        px="base"
        py="base"
        placeItems="center"
        _hover={{ color: color('text-title'), cursor: 'pointer' }}
        onClick={() => onClick()}
        color={color('text-caption')}
      >
        <Caption color="currentColor">
          {isLoading ? (
            <Flex alignItems="center">
              <Box size="16px" as={Pending} mr="extra-tight" />
              Loading...
            </Flex>
          ) : (
            `Load more ${path}`
          )}
        </Caption>
      </Grid>
    ) : null
  ) : (
    <ExplorerLink path={`/${path}`}>
      <Grid
        as="a"
        borderTop={border()}
        px="base"
        py="base"
        placeItems="center"
        _hover={{ color: color('text-title') }}
        color={color('text-caption')}
      >
        <Caption color="currentColor">View all {path}</Caption>
      </Grid>
    </ExplorerLink>
  );
