'use client';

import { useMemo } from 'react';

import { useGlobalContext } from '../../../common/context/useAppContext';
import { buildUrl } from '../../../common/utils/buildUrl';
import { Flex } from '../../../ui/Flex';
import { DesktopSubNav } from './DesktopSubNav';
import { NavLabel } from './NavLabel';
import { NavItem } from './types';

export function ExploreItems() {
  const { activeNetwork } = useGlobalContext();

  const exploreItems: NavItem[] = useMemo(
    () => [
      {
        id: 'transactions',
        label: <NavLabel>Transactions</NavLabel>,
        href: buildUrl('/transactions', activeNetwork),
      },
      {
        id: 'blocks',
        label: <NavLabel>Blocks</NavLabel>,
        href: buildUrl('/blocks', activeNetwork),
      },
      {
        id: 'tokens',
        label: <NavLabel>Tokens</NavLabel>,
        href: buildUrl('/tokens', activeNetwork),
      },
    ],

    [activeNetwork]
  );

  return (
    <Flex direction={'column'} gap={2} p={2}>
      {exploreItems.map((child, index) => (
        <DesktopSubNav key={child.id} {...child} />
      ))}
    </Flex>
  );
}
