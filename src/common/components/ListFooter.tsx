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
      <ExplorerLink href={href} width={'full'} mt={'auto'} variant={'secondary'}>
        View all recent {label} <Icon as={HiMiniArrowUpRight} width={'16px'} height={'16px'} />
      </ExplorerLink>
    );
  }
  if (fetchNextPage && hasNextPage) {
    return (
      <Button
        onClick={() => fetchNextPage()}
        width={'full'}
        bg={'bg'}
        color={'text'}
        fontWeight={'medium'}
        border={'1px'}
        mt={'auto'}
        _hover={{
          bg: 'buttonHoverBg',
        }}
      >
        {isLoading ? 'Loading...' : `Load more ${label}`}
      </Button>
    );
  }
  return null;
};
