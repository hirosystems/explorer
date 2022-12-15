import React from 'react';
import { Box, color, Grid, Stack, StackProps, StxInline, Tooltip, useColorMode } from '@stacks/ui';
import { border } from '@common/utils';
import { ClarityIcon } from '@modules/sandbox/components/ClarityIcon';
import FunctionIcon from 'mdi-react/FunctionIcon';
import { DropIcon } from '@components/icons/drop';
import Link from 'next/link';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { buildUrl } from '@components/links';
import { useRouter } from 'next/router';
import { useUser } from '@modules/sandbox/hooks/useUser';

export const SideNav: React.FC<StackProps> = props => {
  const network = useAppSelector(selectActiveNetwork);
  const router = useRouter();
  const { isConnected } = useUser();
  const { colorMode } = useColorMode();
  const iconColor = colorMode === 'dark' ? { color: color('brand') } : {};

  const navigation: {
    label: string;
    url: string;
    icon: any;
    isDisabled?: boolean;
    isSelected: boolean;
  }[] = [
    {
      label: 'Write & Deploy Contracts',
      url: buildUrl(`/sandbox/deploy`, network),
      icon: <ClarityIcon size="24px" {...iconColor} />,
      isSelected: router.pathname === '/sandbox/deploy',
    },
    {
      label: 'Call Functions',
      url: buildUrl(`/sandbox/contract-call`, network),
      icon: <Box as={FunctionIcon} size="24px" {...iconColor} />,
      isSelected: router.pathname === '/sandbox/contract-call/[[...params]]',
    },
    {
      label: 'STX Transfer',
      url: buildUrl(`/sandbox/transfer`, network),
      icon: <Box as={StxInline} size="20px" {...iconColor} />,
      isSelected: router.pathname === '/sandbox/transfer',
    },
    {
      label: 'Testnet Faucet',
      url: buildUrl(`/sandbox/faucet`, network),
      icon: <Box as={DropIcon} size="24px" {...iconColor} />,
      isDisabled: !isConnected || network.mode === 'mainnet',
      isSelected: router.pathname === '/sandbox/faucet',
    },
  ];

  return (
    <Stack borderRight={border()}>
      {navigation.map(nav =>
        nav.isDisabled ? null : (
          <Tooltip placement="left" label={nav.label} key={nav.url}>
            <div style={{ marginBottom: '0px' }}>
              <Link href={nav.url}>
                <Grid
                  borderRight={border()}
                  bg={
                    nav.isSelected
                      ? colorMode === 'dark'
                        ? color('bg-4')
                        : '#efefef'
                      : color('bg')
                  }
                  borderBottom={border()}
                  size="72px"
                  placeItems="center"
                  justifyContent="center"
                  color={color('text-title')}
                  _hover={{
                    cursor: 'pointer',
                    bg: colorMode === 'dark' ? color('bg-4') : '#efefef',
                  }}
                >
                  {nav.icon}
                </Grid>
              </Link>
            </div>
          </Tooltip>
        )
      )}
    </Stack>
  );
};
