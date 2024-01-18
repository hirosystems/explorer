'use client';

import React from 'react';
import { HiMiniArrowUpRight } from 'react-icons/hi2';

import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import { ExplorerLink } from './ExplorerLinks';

interface SectionFooterButtonPropsBase {
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
}) => {
  if (href) {
    return (
      <ExplorerLink href={href} mt={'auto'} width={'full'}>
        <Button variant={'secondary'} width={'full'}>
          View all recent {label} <Icon as={HiMiniArrowUpRight} width={'16px'} height={'16px'} />
        </Button>
      </ExplorerLink>
    );
  }
  if (fetchNextPage && hasNextPage) {
    return (
      <Button variant={'secondary'} onClick={() => fetchNextPage()} width={'full'}>
        {isLoading ? 'Loading...' : `Load more ${label}`}
      </Button>
    );
  }
  return null;
};
