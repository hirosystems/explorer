import React from 'react';
import { Box, Grid, Stack, StxInline, StackProps, color, Tooltip } from '@stacks/ui';
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
  const networkMode = useAppSelector(selectActiveNetwork).mode;
  const router = useRouter();
  const { isConnected } = useUser();

  const navigation: {
    label: string;
    url: string;
    icon: any;
    isDisabled?: boolean;
    isSelected: boolean;
  }[] = [
    {
      label: 'Write & Deploy Contracts',
      url: buildUrl(`/sandbox/deploy`, networkMode),
      icon: <ClarityIcon size="24px" />,
      isSelected: router.pathname === '/sandbox/deploy',
    },
    {
      label: 'Call Functions',
      url: buildUrl(`/sandbox/contract-call`, networkMode),
      icon: <Box as={FunctionIcon} size="24px" />,
      isSelected: router.pathname === '/sandbox/contract-call/[[...params]]',
    },
    {
      label: 'STX Transfer',
      url: buildUrl(`/sandbox/transfer`, networkMode),
      icon: <Box as={StxInline} size="20px" />,
      isSelected: router.pathname === '/sandbox/transfer',
    },
    {
      label: 'Testnet Faucet',
      url: buildUrl(`/sandbox/faucet`, networkMode),
      icon: <Box as={DropIcon} size="24px" />,
      isDisabled: !isConnected || networkMode === 'mainnet',
      isSelected: router.pathname === '/sandbox/faucet',
    },
  ];

  return (
    <Stack borderRight={border()}>
      {navigation.map(nav =>
        nav.isDisabled ? null : (
          <Tooltip placement="left" label={nav.label} key={nav.url}>
            <div>
              <Link href={nav.url}>
                <Grid
                  borderRight={border()}
                  bg={nav.isSelected ? '#efefef' : color('bg')}
                  borderBottom={border()}
                  size="72px"
                  placeItems="center"
                  justifyContent="center"
                  color={color('text-title')}
                  marginBottom={'0px !important'}
                  _hover={{
                    cursor: 'pointer',
                    bg: '#efefef',
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
