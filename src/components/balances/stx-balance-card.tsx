import * as React from 'react';

import { Box, BoxProps, Circle, color, Flex, Grid, Stack, StxInline } from '@stacks/ui';
import { Caption, Text } from '@components/typography';

import { Section } from '@components/section';
import { border, microToStacks } from '@common/utils';
import { ItemIcon } from '@components/item-icon';
import { IconButton } from '@components/icon-button';
import { IconQrcode, IconX } from '@tabler/icons';
import { Tooltip } from '@components/tooltip';
import { StackingPercentage } from '@components/stacking';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vkQr from '@vkontakte/vk-qr';
import { useModal } from '@common/hooks/use-modal';
import { VestingAddressData } from '@pages/api/vesting/[address]';

export const BalanceItem = ({ balance, ...rest }: any) => {
  const parts = balance.split('.');

  return (
    <Flex as="span" {...rest} style={{ userSelect: 'all' }}>
      <Text color="currentColor">{parts[0]}</Text>
      <Text color="currentColor" opacity={0.65}>
        .{parts[1]}
      </Text>
      <Text ml="extra-tight" color="currentColor">
        STX
      </Text>
    </Flex>
  );
};

const QRcode: React.FC<{ principal: string } & BoxProps> = React.memo(({ principal, ...rest }) => {
  const qrSvg = React.useMemo(
    () =>
      vkQr.createQR(principal, {
        qrSize: 256,
        isShowLogo: true,
        logoData: '/stx-square.svg',
        foregroundColor: color('invert'),
      }),
    [principal]
  );

  const qr = <Box dangerouslySetInnerHTML={{ __html: qrSvg }} />;

  return (
    <Box position="relative" mx="auto" {...rest}>
      {qr}
      <Box position="absolute" left={0} top={0}>
        {qr}
      </Box>
    </Box>
  );
});

interface StxBalancesProps {
  [key: string]: any;

  unlocking?: VestingAddressData;
}

export const StxBalances: React.FC<StxBalancesProps> = ({
  balances,
  principal,
  stackingBlock,
  unlocking,
}) => {
  const { handleOpenUnlockingScheduleModal } = useModal();
  const balance =
    typeof parseInt(balances?.stx?.balance) === 'number' ? parseInt(balances?.stx?.balance) : 0;
  const minerRewards =
    typeof parseInt(balances?.stx?.total_miner_rewards_received) === 'number'
      ? parseInt(balances?.stx?.total_miner_rewards_received)
      : 0;
  const locked =
    typeof parseInt(balances?.stx?.locked) === 'number' ? parseInt(balances?.stx?.locked) : 0;

  const totalBalance =
    unlocking && 'found' in unlocking && 'balance' in unlocking
      ? microToStacks(locked + Number(unlocking.lockedBalance) + Number(unlocking.balance))
      : microToStacks(balance);

  const availableBalance =
    unlocking && 'found' in unlocking && 'balance' in unlocking
      ? microToStacks(unlocking.balance)
      : microToStacks(balance - locked);
  const stackedBalance = microToStacks(locked);
  const minerRewardsBalance = microToStacks(minerRewards);
  const isStacking = locked > 0;

  const [qrShowing, setQrShowing] = React.useState(false);
  const toggleViewQrCode = () => setQrShowing(v => !v);

  const TopRight = () => (
    <Box position="relative">
      <Tooltip label={`${qrShowing ? 'Hide' : 'Show'} QR code`}>
        <IconButton
          position="absolute"
          top="-18px"
          right="-12px"
          dark
          icon={qrShowing ? IconX : IconQrcode}
          onClick={toggleViewQrCode}
        />
      </Tooltip>
    </Box>
  );

  return (
    <Section title={qrShowing ? 'Address QR code' : 'STX Balance'} topRight={TopRight}>
      {!qrShowing ? (
        <>
          <Box px="base-loose">
            <Flex
              borderBottom={
                isStacking || (unlocking && 'found' in unlocking && unlocking.found)
                  ? border()
                  : 'unset'
              }
              alignItems="center"
              py="loose"
            >
              <Circle bg={color('brand')} mr="base">
                <StxInline color="white" size="22px" />
              </Circle>
              <Stack spacing="tight" pr="base">
                <BalanceItem fontWeight="500" color={color('text-title')} balance={totalBalance} />
                <Caption>Total balance</Caption>
              </Stack>
            </Flex>
          </Box>
          {isStacking || (unlocking && 'found' in unlocking && unlocking.found) ? (
            <Box px="base-loose">
              <Stack
                borderBottom={
                  isStacking ||
                  minerRewards > 0 ||
                  (unlocking && 'found' in unlocking && 'balance' in unlocking)
                    ? border()
                    : 'unset'
                }
                spacing="tight"
                py="loose"
              >
                <Caption>Available</Caption>
                <BalanceItem color={color('text-title')} balance={availableBalance} />
              </Stack>
            </Box>
          ) : null}
          {minerRewards > 0 ? (
            <>
              <Box px="base-loose">
                <Stack
                  borderBottom={
                    unlocking && 'found' in unlocking && 'balance' in unlocking ? border() : 'unset'
                  }
                  spacing="tight"
                  py="loose"
                >
                  <Caption>Miner rewards</Caption>
                  <BalanceItem color={color('text-title')} balance={minerRewardsBalance} />
                </Stack>
              </Box>
            </>
          ) : null}
          {unlocking && 'found' in unlocking && 'balance' in unlocking ? (
            <Box px="base-loose">
              <Stack borderBottom={isStacking ? border() : undefined} spacing="tight" py="loose">
                <Caption>Locked</Caption>
                <Flex alignItems="baseline" justifyContent="space-between">
                  <BalanceItem
                    color={color('text-title')}
                    balance={microToStacks(unlocking.lockedBalance)}
                  />
                  <Box
                    onClick={handleOpenUnlockingScheduleModal}
                    fontSize={1}
                    _hover={{
                      cursor: 'pointer',
                    }}
                    color={color('brand')}
                  >
                    View schedule
                  </Box>
                </Flex>
              </Stack>
            </Box>
          ) : null}
          {isStacking ? (
            <>
              <Box px="base-loose">
                <Stack borderBottom={border()} spacing="tight" py="loose">
                  <Caption>Stacked amount (locked)</Caption>
                  <BalanceItem color={color('text-title')} balance={stackedBalance} />
                </Stack>
                <StackingPercentage balances={balances} stackingBlock={stackingBlock} />
              </Box>
            </>
          ) : null}
        </>
      ) : (
        <Grid placeItems="center" pt="extra-loose" pb="loose" width="100%">
          <QRcode principal={principal} />
          <Caption
            mt="base"
            onClick={toggleViewQrCode}
            _hover={{
              cursor: 'pointer',
              color: color('text-title'),
            }}
          >
            Hide
          </Caption>
        </Grid>
      )}
    </Section>
  );
};
