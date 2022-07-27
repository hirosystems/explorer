import * as React from 'react';

import { Box, BoxProps, Circle, color, Flex, Grid, Stack, StxInline } from '@stacks/ui';
import { Caption, Text } from '@components/typography';

import { Section } from '@components/section';
import { border, microToStacks, getLocaleDecimalSeparator } from '@common/utils';
import { IconButton } from '@components/icon-button';
import { IconQrcode, IconX } from '@tabler/icons';
import { Tooltip } from '@components/tooltip';
import { StackingPercentage } from '@components/stacking';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vkQr from '@vkontakte/vk-qr';
import { openModal } from '@components/modals/modal-slice';
import { VestingAddressData } from '@pages/api/vesting/[address]';
import { useAtomValue } from 'jotai/utils';
import { accountInViewTokenOfferingData } from '@store/currently-in-view';
import { MODALS } from '@common/constants';
import { useAppDispatch } from '@common/state/hooks';
import { css } from '@emotion/react';
import { TokenBalancesRow } from '@components/balances/token-balances-row';

export const BalanceItem = ({ balance, ...rest }: any) => {
  const localeDecimalSeparator = getLocaleDecimalSeparator();
  const parts = balance.split(localeDecimalSeparator);

  return (
    <Flex as="span" {...rest} style={{ userSelect: 'all' }}>
      <Text color="currentColor">{parts[0]}</Text>
      <Text color="currentColor" opacity={0.65}>
        {localeDecimalSeparator}
        {parts[1]}
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
  nonce?: string;
}

export const WalletOverview: React.FC<StxBalancesProps> = ({ balances, principal, nonce }) => {
  const dispatch = useAppDispatch();
  const tokenOfferingData = useAtomValue(accountInViewTokenOfferingData);

  const balance =
    typeof parseInt(balances?.stx?.balance) === 'number' ? parseInt(balances?.stx?.balance) : 0;
  const minerRewards =
    typeof parseInt(balances?.stx?.total_miner_rewards_received) === 'number'
      ? parseInt(balances?.stx?.total_miner_rewards_received)
      : 0;
  const locked =
    typeof parseInt(balances?.stx?.locked) === 'number' ? parseInt(balances?.stx?.locked) : 0;
  const tokenOfferingLocked = parseInt(tokenOfferingData?.total_locked || '0');
  const totalBalance = microToStacks(balance + tokenOfferingLocked);
  const availableBalance = microToStacks(balance - locked);
  const stackedBalance = microToStacks(locked);
  const minerRewardsBalance = microToStacks(minerRewards);
  const isStacking = locked > 0;

  const [qrShowing, setQrShowing] = React.useState(false);
  const toggleViewQrCode = () => setQrShowing(v => !v);

  return (
    <Section title={'Wallet overview'}>
      <>
        <Box px="base-loose" borderBottom={nonce && '1px solid #F0F0F2'} paddingBottom={'24px'}>
          <Box padding={'16px 4px 12px'}>
            <Text fontSize="14px" color={'#747478'}>
              Holdings
            </Text>
          </Box>
          <TokenBalancesRow balances={balances} />
        </Box>
        {nonce && (
          <Box px="base-loose" paddingBottom={'24px'}>
            <Box padding={'16px 4px 12px'}>
              <Text fontSize="14px" color={'#747478'}>
                Nonce
              </Text>
            </Box>
            <Box padding={'0 4px'}>
              <Text fontSize="14px" color={'#242629'}>
                {nonce}
              </Text>
            </Box>
          </Box>
        )}
      </>
    </Section>
  );
};
