import { MODALS } from '@/common/constants';
import { useAppDispatch } from '@/common/state/hooks';
import {
  formatStacksAmount,
  getLocaleDecimalSeparator,
  getUsdValue,
  microToStacks,
} from '@/common/utils';
import { openModal } from '@/components/modals/modal-slice';
import { Section } from '@/components/section';
import { StackingPercentage } from '@/components/stacking';
import { Box, BoxProps, Circle, Flex, Grid, IconButton, Stack, Tooltip } from '@/ui/components';
import { StxIcon } from '@/ui/icons/StxIcon';
import { Caption, Text } from '@/ui/typography';
import { useColorMode } from '@chakra-ui/react';
import vkQr from '@vkontakte/vk-qr';
import * as React from 'react';
import { TbQrcode, TbX } from 'react-icons/tb';

import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';

import { useCurrentStxPrice } from '../../app/common/hooks/use-current-prices';

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
        <Text ml="4px" color="currentColor">
          STX
        </Text>
      </Flex>
      {usdBalance && (
        <Text mt="4px" color="ink.400" fontSize="14px">
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
        foregroundColor: 'invert',
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

  const TopRight = (
    <Box position="relative">
      <Tooltip label={`${qrShowing ? 'Hide' : 'Show'} QR code`}>
        <IconButton
          position="absolute"
          top="-18px"
          right="-12px"
          icon={qrShowing ? <TbX /> : <TbQrcode />}
          onClick={toggleViewQrCode}
          aria-label={'toggle view QR code'}
        />
      </Tooltip>
    </Box>
  );

  return (
    <Section title={qrShowing ? 'Address QR code' : 'STX Balance'} topRight={TopRight}>
      {!qrShowing ? (
        <>
          <Box px="20px">
            <Flex
              borderBottom={isStacking || !!tokenOfferingData ? '1px solid' : 'unset'}
              alignItems="flex-start"
              py="24px"
            >
              <Circle bg={`brand.${useColorMode().colorMode}`} mr="16px" size="36px">
                <StxIcon color="white" size="16px" />
              </Circle>
              <Stack spacing="8px" pr="16px">
                <BalanceItem fontWeight="500" color={'textTitle'} balance={totalBalance} />
                <Caption>Total balance</Caption>
              </Stack>
            </Flex>
          </Box>
          {isStacking || !!tokenOfferingData ? (
            <Box px="20px">
              <Stack
                borderBottom={
                  isStacking || minerRewards > 0 || !!tokenOfferingData ? '1px solid' : 'unset'
                }
                spacing="8px"
                py="24px"
              >
                <Caption>Available</Caption>
                <BalanceItem color={'textTitle'} balance={availableBalance} />
              </Stack>
            </Box>
          ) : null}
          {minerRewards > 0 ? (
            <>
              <Box px="20px">
                <Stack
                  borderBottom={!!tokenOfferingData ? '1px solid' : 'unset'}
                  spacing="8px"
                  py="24px"
                >
                  <Caption>Miner rewards</Caption>
                  <BalanceItem color={'textTitle'} balance={minerRewardsBalance} />
                </Stack>
              </Box>
            </>
          ) : null}
          {!!tokenOfferingData ? (
            <Box px="20px">
              <Stack borderBottom={isStacking ? '1px solid' : undefined} spacing="8px" py="24px">
                <Caption>Locked</Caption>
                <Flex alignItems="baseline" justifyContent="space-between">
                  <BalanceItem
                    color={'textTitle'}
                    balance={microToStacks(tokenOfferingData.total_locked)}
                  />
                  <Box
                    onClick={() => dispatch(openModal(MODALS.UNLOCKING_SCHEDULE))}
                    fontSize={1}
                    _hover={{
                      cursor: 'pointer',
                    }}
                    color={'brand'}
                  >
                    View schedule
                  </Box>
                </Flex>
              </Stack>
            </Box>
          ) : null}
          {isStacking ? (
            <>
              <Box px="20px">
                <Stack borderBottomWidth="1px" spacing="8px" py="24px">
                  <Caption>Stacked amount (locked)</Caption>
                  <BalanceItem color={'textTitle'} balance={stackedBalance} />
                </Stack>
                <StackingPercentage balances={balances} address={principal} />
              </Box>
            </>
          ) : null}
        </>
      ) : (
        <Grid placeItems="center" pt="32px" pb="24px" width="100%">
          <QRcode principal={principal} />
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
};
