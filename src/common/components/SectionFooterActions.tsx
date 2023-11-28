'use client';

import { useColorMode } from '@chakra-ui/react';
import React from 'react';

import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Grid } from '../../ui/Grid';
import { Caption } from '../../ui/typography';
import { ExplorerLink } from './ExplorerLinks';
import { Pending } from './status';

interface SectionFooterButtonPropsBase {
  isLoading?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  href?: string;
  label: string;
}

export const SectionFooterActions: React.FC<SectionFooterButtonPropsBase> = ({
  fetchNextPage,
  isLoading,
  href,
  label,
  hasNextPage,
}) => {
  const colorMode = useColorMode().colorMode;
  if (href) {
    return (
      <ExplorerLink href={href}>
        <Grid
          as="a"
          borderTopWidth="1px"
          px="16px"
          py="16px"
          placeItems="center"
          _hover={{ color: 'textTitle' }}
          color={'textCaption'}
        >
          <Caption color="currentColor">View all {label}</Caption>
        </Grid>
      </ExplorerLink>
    );
  }
  if (fetchNextPage && hasNextPage) {
    return (
      <Grid
        as="a"
        borderTopWidth="1px"
        px="16px"
        py="16px"
        placeItems="center"
        _hover={{ color: 'textTitle', cursor: 'pointer' }}
        onClick={() => fetchNextPage()}
        color={'textCaption'}
      >
        <Caption color="currentColor">
          {isLoading ? (
            <Flex alignItems="center">
              <Box size="16px" as={Pending} mr="4px" />
              Loading...
            </Flex>
          ) : (
            `Load more ${label}`
          )}
        </Caption>
      </Grid>
    );
  }
  return null;
};
