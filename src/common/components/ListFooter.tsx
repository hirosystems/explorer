'use client';

import { ArrowUpRight } from '@phosphor-icons/react';
import React from 'react';

import { Box, BoxProps } from '../../ui/Box';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
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
      <Box {...rest} width={'full'}>
        <ExplorerLink href={href} mt={'auto'} width={'full'}>
          <Button visual={'secondary'} width={'full'}>
            View all recent {label}
            <Icon size={4}>
              <ArrowUpRight />
            </Icon>
          </Button>
        </ExplorerLink>
      </Box>
    );
  }
  if (fetchNextPage && hasNextPage) {
    return (
      <Box {...rest} width={'full'}>
        <Button visual={'secondary'} onClick={() => fetchNextPage()} width={'full'}>
          {isLoading ? 'Loading...' : `Load more ${label}`}
        </Button>
      </Box>
    );
  }
  return null;
};
