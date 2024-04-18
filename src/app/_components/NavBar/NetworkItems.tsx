'use client';

import { useMemo } from 'react';
import { PiPlusBold } from 'react-icons/pi';

import { openModal } from '../../../common/components/modals/modal-slice';
import { MODALS } from '../../../common/constants/constants';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { useAppDispatch } from '../../../common/state/hooks';
import { Network } from '../../../common/types/network';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { DesktopSubNav } from './DesktopSubNav';
import { NavLabel } from './NavLabel';
import { NetworkLabel } from './NetworkLabel';
import { NavItem } from './types';

export function NetworkItems() {
  const { networks } = useGlobalContext();
  const dispatch = useAppDispatch();

  const networkItems: NavItem[] = useMemo(
    () => [
      ...Object.values<Network>(networks).map((network, key) => {
        return {
          id: network.url,
          label: <NetworkLabel network={network} key={key} />,
        };
      }),
    ],

    [networks]
  );

  return (
    <Flex direction={'column'} gap={2} p={2}>
      {networkItems.map((child, index) => (
        <DesktopSubNav key={child.id} {...child} />
      ))}
      <Box borderTop="1px solid var(--stacks-colors-border)" />
      <DesktopSubNav
        id={'add-network'}
        label={
          <NavLabel icon={<Icon as={PiPlusBold} size={4} color={'slate.50'} />}>
            Add a network
          </NavLabel>
        }
        onClick={() => dispatch(openModal(MODALS.ADD_NETWORK))}
      />
    </Flex>
  );
}
