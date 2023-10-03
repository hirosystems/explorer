import { useColorMode } from '@chakra-ui/react';
import React from 'react';
import { Pending } from '@/components/status';
import { Box, Flex, Grid } from '@/ui/components';
import { Caption } from '@/ui/typography';

import { ExplorerLink } from './links';

interface SectionFooterButtonPropsBase {
  isLoading?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => any;
  href?: string;
  label: string;
}

export function SectionFooterAction({
  fetchNextPage,
  isLoading,
  href,
  label,
  hasNextPage,
}: SectionFooterButtonPropsBase) {
  const { colorMode } = useColorMode();
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
          color="textCaption"
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
        color="textCaption"
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
}
