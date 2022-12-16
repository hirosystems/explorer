import { IconQrcode, IconX } from '@tabler/icons';
import vkQr from '@vkontakte/vk-qr';
import * as React from 'react';

import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import { Box, BoxProps, Circle, Flex, Grid, Stack, StxInline, color } from '@stacks/ui';

import { MODALS } from '@common/constants';
import { useCurrentStxPrice } from '@common/hooks/use-current-prices';
import { useAppDispatch } from '@common/state/hooks';
import {
  border,
  formatStacksAmount,
  getLocaleDecimalSeparator,
  getUsdValue,
  microToStacks,
  usdFormatter,
} from '@common/utils';

import { IconButton } from '@components/icon-button';
import { openModal } from '@components/modals/modal-slice';
import { Section } from '@components/section';
import { StackingPercentage } from '@components/stacking';
import { Tooltip } from '@components/tooltip';
import { Caption, Text } from '@components/typography';

export const BalanceItem = ({ balance, ...rest }: any) => {
  const { data: stxPrice } = useCurrentStxPrice();

  const formattedBalance = formatStacksAmount(balance);
  const usdBalance = getUsdValue(balance, stxPrice);
  const localeDecimalSeparator = getLocaleDecimalSeparator() || '.';
  const parts = formattedBalance.split(localeDecimalSeparator);

  return (
    <Flex flexDirection="column" as="span" {...rest} style={{ userSelect: 'all' }}>
      <Flex>
        <Text color="currentColor">{parts[0]}</Text>
        <Text color="currentColor" opacity={0.65}>
          {localeDecimalSeparator}
          {parts[1]}
        </Text>
        <Text ml="extra-tight" color="currentColor">
          STX
        </Text>
      </Flex>
      {usdBalance && (
        <Text mt="extra-tight" color="ink.400" fontSize="14px">
          {usdBalance}
        </Text>
      )}
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
  balances: AddressBalanceResponse;
  principal: string;
}

export const StxBalances: React.FC<StxBalancesProps> = ({ balances, principal }) => {
  const dispatch = useAppDispatch();
  const tokenOfferingData = balances?.token_offering_locked;

  const balance =
    typeof parseInt(balances?.stx?.balance) === 'number' ? parseInt(balances?.stx?.balance) : 0;
  const minerRewards =
    typeof parseInt(balances?.stx?.total_miner_rewards_received) === 'number'
      ? parseInt(balances?.stx?.total_miner_rewards_received)
      : 0;
  const locked =
    typeof parseInt(balances?.stx?.locked) === 'number' ? parseInt(balances?.stx?.locked) : 0;
  const tokenOfferingLocked = parseInt(tokenOfferingData?.total_locked || '0');
  const totalBalance = microToStacks(balance + tokenOfferingLocked, false);
  const availableBalance = microToStacks(balance - locked, false);
  const stackedBalance = microToStacks(locked, false);
  const minerRewardsBalance = microToStacks(minerRewards, false);
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
              borderBottom={isStacking || !!tokenOfferingData ? border() : 'unset'}
              alignItems="flex-start"
              py="loose"
            >
              <Circle bg={color('brand')} mr="base" size="36px">
                <StxInline color="white" size="16px" />
              </Circle>
              <Stack spacing="tight" pr="base">
                <BalanceItem fontWeight="500" color={color('text-title')} balance={totalBalance} />
                <Caption>Total balance</Caption>
              </Stack>
            </Flex>
          </Box>
          {isStacking || !!tokenOfferingData ? (
            <Box px="base-loose">
              <Stack
                borderBottom={
                  isStacking || minerRewards > 0 || !!tokenOfferingData ? border() : 'unset'
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
                  borderBottom={!!tokenOfferingData ? border() : 'unset'}
                  spacing="tight"
                  py="loose"
                >
                  <Caption>Miner rewards</Caption>
                  <BalanceItem color={color('text-title')} balance={minerRewardsBalance} />
                </Stack>
              </Box>
            </>
          ) : null}
          {!!tokenOfferingData ? (
            <Box px="base-loose">
              <Stack borderBottom={isStacking ? border() : undefined} spacing="tight" py="loose">
                <Caption>Locked</Caption>
                <Flex alignItems="baseline" justifyContent="space-between">
                  <BalanceItem
                    color={color('text-title')}
                    balance={microToStacks(tokenOfferingData.total_locked)}
                  />
                  <Box
                    onClick={() => dispatch(openModal(MODALS.UNLOCKING_SCHEDULE))}
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
                <StackingPercentage balances={balances} address={principal} />
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
