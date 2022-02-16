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
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { buildUrl } from '@components/links';

export const SideNav: React.FC<StackProps> = props => {
  const { isSignedIn } = useConnect();
  const networkMode = useAppSelector(selectActiveNetwork).mode;

  const navigation: {
    label: string;
    url: string;
    icon: any;
    isDisabled?: boolean;
  }[] = [
    {
      label: 'Write & Deploy Contracts',
      url: buildUrl(`/sandbox/deploy`, networkMode),
      icon: <ClarityIcon size="24px" />,
    },
    {
      label: 'Call Functions',
      url: buildUrl(`/sandbox/contract-call`, networkMode),
      icon: <Box as={FunctionIcon} size="24px" />,
    },
    {
      label: 'STX Transfer',
      url: buildUrl(`/sandbox/transfer`, networkMode),
      icon: <Box as={StxInline} size="20px" />,
    },
    {
      label: 'Testnet Faucet',
      url: buildUrl(`/sandbox/faucet`, networkMode),
      icon: <Box as={DropIcon} size="24px" />,
      isDisabled: !isSignedIn || networkMode === 'mainnet',
    },
  ];

  return (
    <Stack borderRight={border()} {...props}>
      {navigation.map(nav =>
        nav.isDisabled ? null : (
          <Link href={nav.url}>
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
        )
      )}
    </Stack>
  );
};
