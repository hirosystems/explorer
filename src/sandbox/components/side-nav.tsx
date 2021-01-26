import React from 'react';
import { Box, Grid, Stack, StxInline, StackProps, color } from '@stacks/ui';
import { border } from '@common/utils';
import { ClarityIcon } from '@sandbox/components/clarity-icon';
import { Tooltip } from '@components/tooltip';
import FunctionIcon from 'mdi-react/FunctionIcon';
import { DropIcon } from '@components/icons/drop';
import { Routes } from '@sandbox/common/types';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { sandboxRouteState } from '@sandbox/store/sandbox';
import { useConnect } from '@sandbox/hooks/use-connect';
import { useNetworkMode } from '@common/hooks/use-network-mode';

export const SideNav: React.FC<StackProps> = props => {
  const setRoute = useSetRecoilState(sandboxRouteState);

  const { isSignedIn } = useConnect();
  const mode = useNetworkMode();

  const navigation: {
    label: string;
    slug: Routes;
    icon: any;
    isDisabled?: boolean;
  }[] = [
    {
      label: 'Write & Deploy Contracts',
      slug: 'deploy',
      icon: <ClarityIcon size="24px" />,
    },
    {
      label: 'Call Functions',
      slug: 'function-call',
      icon: <Box as={FunctionIcon} size="24px" />,
    },
    {
      label: 'STX Transfer',
      slug: 'transfer',
      icon: <Box as={StxInline} size="20px" />,
    },
    {
      label: 'Testnet Faucet',
      slug: 'faucet',
      icon: <Box as={DropIcon} size="24px" />,
      isDisabled: !isSignedIn || mode === 'mainnet',
    },
  ];

  return (
    <Stack bg={color('bg-2')} borderRight={border()} {...props}>
      {navigation.map(nav =>
        nav.isDisabled ? null : (
          <Tooltip label={nav.label} placement="right" key={nav.label}>
            <Grid
              borderRight={border()}
              bg={color('bg')}
              borderBottom={border()}
              size="72px"
              placeItems="center"
              justifyContent="center"
              color={color('text-title')}
              _hover={{
                cursor: 'pointer',
                bg: color('bg-2'),
              }}
              onClick={() => setRoute(nav.slug)}
            >
              {nav.icon}
            </Grid>
          </Tooltip>
        )
      )}
    </Stack>
  );
};
