import { useColorModeValue } from '../../../components/ui/color-mode';
import { usePathname } from 'next/navigation';
import React from 'react';

import { DropIcon } from '../../../common/components/icons/drop';
import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { buildUrl } from '../../../common/utils/buildUrl';
import { Icon } from '../../../ui/Icon';
import { Stack, StackProps } from '../../../ui/Stack';
import ClarityIcon from '../../../ui/icons/ClarityIcon';
import FunctionXIcon from '../../../ui/icons/FunctionX';
import StxIcon from '../../../ui/icons/StxIcon';
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
        icon={
          <Icon size={5} color={iconColor}>
            <ClarityIcon />
          </Icon>
        }
        isSelected={pathname?.startsWith('/sandbox/deploy')}
      />
      <NavItem
        label={'Call Functions'}
        url={buildUrl(`/sandbox/contract-call`, network)}
        icon={
          <Icon size={5} color={iconColor}>
            <FunctionXIcon />
          </Icon>
        }
        isSelected={pathname?.startsWith('/sandbox/contract-call')}
      />
      <NavItem
        label={'STX Transfer'}
        url={buildUrl(`/sandbox/transfer`, network)}
        icon={
          <Icon size={5} color={iconColor}>
            <StxIcon />
          </Icon>
        }
        isSelected={pathname?.startsWith('/sandbox/transfer')}
      />
      {isConnected && network.mode === 'testnet' && (
        <NavItem
          label={'Testnet Faucet'}
          url={buildUrl(`/sandbox/faucet`, network)}
          icon={
            <Icon size={5} color={iconColor}>
              <DropIcon />
            </Icon>
          }
          isSelected={pathname?.startsWith('/sandbox/faucet')}
        />
      )}
    </Stack>
  );
};
