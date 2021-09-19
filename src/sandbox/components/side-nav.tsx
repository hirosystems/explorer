import React from 'react';
import { Box, Grid, Stack, StxInline, StackProps, color } from '@stacks/ui';
import { border } from '@common/utils';
import { ClarityIcon } from '@sandbox/components/clarity-icon';
import { Tooltip } from '@components/tooltip';
import FunctionIcon from 'mdi-react/FunctionIcon';
import { DropIcon } from '@components/icons/drop';
import { Routes } from '@sandbox/common/types';
import Link from 'next/link';
import { useConnect } from '@sandbox/hooks/use-connect';
import { useNetworkMode } from '@common/hooks/use-network-mode';

export const SideNav: React.FC<StackProps> = props => {
  const { isSignedIn } = useConnect();
  const { networkMode } = useNetworkMode();

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
      slug: 'contract-call',
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
      isDisabled: !isSignedIn || networkMode === 'mainnet',
    },
  ];

  return (
    <Stack borderRight={border()} {...props}>
      {navigation.map(nav =>
        nav.isDisabled ? null : (
          <Tooltip label={nav.label} placement="right" key={nav.label}>
            <Link href={`/sandbox/${nav.slug}`}>
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
              >
                {nav.icon}
              </Grid>
            </Link>
          </Tooltip>
        )
      )}
    </Stack>
  );
};
