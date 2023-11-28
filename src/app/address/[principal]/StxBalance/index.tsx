import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { Fragment } from 'react';
import { TbQrcode, TbX } from 'react-icons/tb';

import { Section } from '../../../../common/components/Section';
import { openModal } from '../../../../common/components/modals/modal-slice';
import { MODALS } from '../../../../common/constants/constants';
import { useSuspenseAccountBalance } from '../../../../common/queries/useAccountBalance';
import { useAppDispatch } from '../../../../common/state/hooks';
import { hasStxBalance } from '../../../../common/utils/accounts';
import { microToStacks } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Circle } from '../../../../ui/Circle';
import { Flex } from '../../../../ui/Flex';
import { Grid } from '../../../../ui/Grid';
import { IconButton } from '../../../../ui/IconButton';
import { Stack } from '../../../../ui/Stack';
import { Tooltip } from '../../../../ui/Tooltip';
import { StxIcon } from '../../../../ui/icons';
import { Caption } from '../../../../ui/typography';
import { ExplorerErrorBoundary } from '../../../_components/ErrorBoundary';
import { BalanceItem } from './BalanceItem';
import { QRcode } from './QRcode';
import { StackingPercentage } from './StackingPercentage';

interface StxBalanceProps {
  address: string;
}

function StxBalanceBase({ address }: StxBalanceProps) {
  const colorMode = useColorMode().colorMode;
  const dispatch = useAppDispatch();
  const { data: balance } = useSuspenseAccountBalance(address);
  const tokenOfferingData = balance?.token_offering_locked;

  const stxBalance =
    typeof parseInt(balance?.stx?.balance) === 'number' ? parseInt(balance?.stx?.balance) : 0;
  const minerRewards =
    typeof parseInt(balance?.stx?.total_miner_rewards_received) === 'number'
      ? parseInt(balance?.stx?.total_miner_rewards_received)
      : 0;
  const locked =
    typeof parseInt(balance?.stx?.locked) === 'number' ? parseInt(balance?.stx?.locked) : 0;
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
          icon={qrShowing ? <TbX /> : <TbQrcode />}
          onClick={toggleViewQrCode}
          aria-label={'toggle view QR code'}
        />
      </Tooltip>
    </Box>
  );

  if (!hasStxBalance(balance)) return null;

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
              <Circle bg={`brand.${colorMode}`} mr="16px" size="36px">
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
                <StackingPercentage balance={balance} address={address} />
              </Box>
            </>
          ) : null}
        </>
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
