import { QrCode, X } from '@phosphor-icons/react';
import * as React from 'react';

import { Circle } from '../../../../common/components/Circle';
import { Section } from '../../../../common/components/Section';
import { useAccountBalance } from '../../../../common/queries/useAccountBalance';
import { microToStacks } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Grid } from '../../../../ui/Grid';
import { HStack } from '../../../../ui/HStack';
import { Icon } from '../../../../ui/Icon';
import { IconButton } from '../../../../ui/IconButton';
import { Stack } from '../../../../ui/Stack';
import { Tooltip } from '../../../../ui/Tooltip';
import StxIcon from '../../../../ui/icons/StxIcon';
import { Caption } from '../../../../ui/typography';
import { ExplorerErrorBoundary } from '../../../_components/ErrorBoundary';
import { BalanceItem } from './BalanceItem';
import { QRcode } from './QRcode';
import { StackingPercentage } from './StackingPercentage';

interface StxBalanceProps {
  address: string;
}

function StxBalanceBase({ address }: StxBalanceProps) {
  const { data: balance } = useAccountBalance(address);
  const tokenOfferingData = balance?.token_offering_locked;

  const stxBalance =
    typeof parseInt(balance?.stx?.balance || '0') === 'number'
      ? parseInt(balance?.stx?.balance || '0')
      : 0;
  const minerRewards =
    typeof parseInt(balance?.stx?.total_miner_rewards_received || '0') === 'number'
      ? parseInt(balance?.stx?.total_miner_rewards_received || '0')
      : 0;
  const locked =
    typeof parseInt(balance?.stx?.locked || '0') === 'number'
      ? parseInt(balance?.stx?.locked || '0')
      : 0;
  const tokenOfferingLocked = parseInt(tokenOfferingData?.total_locked || '0');
  const totalBalance = microToStacks(stxBalance + tokenOfferingLocked);
  const availableBalance = microToStacks(stxBalance - locked);
  const stackedBalance = microToStacks(locked);
  const minerRewardsBalance = microToStacks(minerRewards);
  const isStacking = locked > 0;

  const [qrShowing, setQrShowing] = React.useState(false);
  const toggleViewQrCode = () => setQrShowing(v => !v);

  const TopRight = (
    <Box position="relative">
      <Tooltip label={`${qrShowing ? 'Hide' : 'Show'} QR code`}>
        <IconButton
          position="absolute"
          top="-18px"
          right="-12px"
          icon={qrShowing ? <X /> : <QrCode />}
          onClick={toggleViewQrCode}
          aria-label={'toggle view QR code'}
        />
      </Tooltip>
    </Box>
  );

  return (
    <Section title={qrShowing ? 'Address QR code' : 'STX Balance'} topRight={TopRight}>
      {!qrShowing ? (
        <Stack
          sx={{
            '& > *:not(:last-child)': {
              borderBottom: '1px',
            },
          }}
        >
          <HStack gap={4} py={4}>
            <Circle bg={'brand'} size={10}>
              <Icon as={StxIcon} size={4} color="white" />
            </Circle>
            <Stack gap={2}>
              <Caption>Total balance</Caption>
              <BalanceItem balance={totalBalance} />
            </Stack>
          </HStack>
          {isStacking || !!tokenOfferingData ? (
            <Stack gap={2} py={4}>
              <Caption>Available</Caption>
              <BalanceItem balance={availableBalance} />
            </Stack>
          ) : null}
          {minerRewards > 0 ? (
            <Stack gap={2} py={4}>
              <Caption>Miner rewards</Caption>
              <BalanceItem balance={minerRewardsBalance} />
            </Stack>
          ) : null}
          {isStacking ? (
            <Box
              sx={{
                '& > *:not(:last-child)': {
                  borderBottom: '1px',
                },
              }}
            >
              <Stack gap={2} py={4}>
                <Caption>Stacked amount (locked)</Caption>
                <BalanceItem balance={stackedBalance} />
              </Stack>
              {!!balance && <StackingPercentage balance={balance} address={address} />}
            </Box>
          ) : null}
        </Stack>
      ) : (
        <Grid placeItems="center" pt="32px" pb="24px" width="100%">
          <QRcode address={address} />
          <Caption
            mt="16px"
            onClick={toggleViewQrCode}
            _hover={{
              cursor: 'pointer',
              color: 'textTitle',
            }}
          >
            Hide
          </Caption>
        </Grid>
      )}
    </Section>
  );
}

export function StxBalance(props: StxBalanceProps) {
  return (
    <ExplorerErrorBoundary Wrapper={Section} wrapperProps={{ title: 'STX Balance' }} tryAgainButton>
      <StxBalanceBase {...props} />
    </ExplorerErrorBoundary>
  );
}
