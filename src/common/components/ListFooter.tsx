'use client';

import { Box, BoxProps, Icon } from '@chakra-ui/react';
import { ArrowUpRight } from '@phosphor-icons/react';
import React from 'react';

import { Button } from '../../components/ui/button';
import { ExplorerLink } from './ExplorerLinks';

interface SectionFooterButtonPropsBase extends BoxProps {
  isLoading?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  href?: string;
  label: string;
}

export const ListFooter: React.FC<SectionFooterButtonPropsBase> = ({
  fetchNextPage,
  isLoading,
  href,
  label,
  hasNextPage,
  ...rest
}) => {
  if (href) {
    return (
      <Box {...rest} width="full">
        <ExplorerLink href={href} mt="auto" width="full" variant="noUnderline">
          <Button variant="secondary" width="full">
            View all recent {label}
            <Icon h={4} w={4}>
              <ArrowUpRight />
            </Icon>
          </Button>
        </ExplorerLink>
      </Box>
    );
  }
  if (fetchNextPage && hasNextPage) {
    return (
      <Box {...rest} width="full">
        <Button variant="secondary" onClick={() => fetchNextPage()} width="full">
          {isLoading ? 'Loading...' : `Load more ${label}`}
        </Button>
      </Box>
    );
  }
  return null;
};
