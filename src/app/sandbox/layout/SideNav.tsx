import { useColorMode } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import React from 'react';

import { DropIcon } from '../../../common/components/icons/drop';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { buildUrl } from '../../../common/utils/buildUrl';
import { Icon } from '../../../ui/Icon';
import { Stack, StackProps } from '../../../ui/Stack';
import { FunctionIcon, StxIcon } from '../../../ui/icons';
import { ClarityIcon } from '../components/ClarityIcon';
import { useUser } from '../hooks/useUser';
import { NavItem } from './NavItem';

export const SideNav: React.FC<StackProps> = () => {
  const network = useGlobalContext().activeNetwork;
  const pathname = usePathname();
  const { isConnected } = useUser();
  const { colorMode } = useColorMode();
  const iconColor = colorMode === 'dark' ? { color: 'brand' } : {};
  return (
    <Stack borderRightWidth={'1px'} gap={'0'}>
      <NavItem
        label={'Write & Deploy Contracts'}
        url={buildUrl(`/sandbox/deploy`, network)}
        icon={<ClarityIcon size="24px" {...iconColor} />}
        isSelected={pathname?.startsWith('/sandbox/deploy')}
      />
      <NavItem
        label={'Call Functions'}
        url={buildUrl(`/sandbox/contract-call`, network)}
        icon={<Icon as={FunctionIcon} size="24px" {...iconColor} />}
        isSelected={pathname?.startsWith('/sandbox/contract-call')}
      />
      <NavItem
        label={'STX Transfer'}
        url={buildUrl(`/sandbox/transfer`, network)}
        icon={<Icon as={StxIcon} size="20px" {...iconColor} />}
        isSelected={pathname?.startsWith('/sandbox/transfer')}
      />
      {isConnected && network.mode === 'testnet' && (
        <NavItem
          label={'Testnet Faucet'}
          url={buildUrl(`/sandbox/faucet`, network)}
          icon={<Icon as={DropIcon} size="24px" {...iconColor} />}
          isSelected={pathname?.startsWith('/sandbox/faucet')}
        />
      )}
    </Stack>
  );
};
