import { useColorMode, useColorModeValue } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import React from 'react';

import { DropIcon } from '../../../common/components/icons/drop';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { buildUrl } from '../../../common/utils/buildUrl';
import { Icon } from '../../../ui/Icon';
import { Stack, StackProps } from '../../../ui/Stack';
import { FunctionIcon, StxIcon } from '../../../ui/icons';
import { ClarityIcon } from '../../../ui/icons/ClarityIcon';
import { useUser } from '../hooks/useUser';
import { NavItem } from './NavItem';

export const SideNav: React.FC<StackProps> = () => {
  const network = useGlobalContext().activeNetwork;
  const pathname = usePathname();
  const { isConnected } = useUser();
  const iconColor = useColorModeValue('black', 'white');

  return (
    <Stack borderRight={'1px'} borderColor={useColorModeValue('slate.150', 'slate.900')} gap={'0'}>
      <NavItem
        label={'Write & Deploy Contracts'}
        url={buildUrl(`/sandbox/deploy`, network)}
        icon={<Icon as={ClarityIcon} size={5} color={iconColor} />}
        isSelected={pathname?.startsWith('/sandbox/deploy')}
      />
      <NavItem
        label={'Call Functions'}
        url={buildUrl(`/sandbox/contract-call`, network)}
        icon={<Icon as={FunctionIcon} size={5} color={iconColor} />}
        isSelected={pathname?.startsWith('/sandbox/contract-call')}
      />
      <NavItem
        label={'STX Transfer'}
        url={buildUrl(`/sandbox/transfer`, network)}
        icon={<Icon as={StxIcon} size={5} color={iconColor} />}
        isSelected={pathname?.startsWith('/sandbox/transfer')}
      />
      {isConnected && network.mode === 'testnet' && (
        <NavItem
          label={'Testnet Faucet'}
          url={buildUrl(`/sandbox/faucet`, network)}
          icon={<Icon as={DropIcon} size={5} color={iconColor} />}
          isSelected={pathname?.startsWith('/sandbox/faucet')}
        />
      )}
    </Stack>
  );
};
