'use client';

import * as React from 'react';
import { ReactNode } from 'react';

import { Circle } from '../../../common/components/Circle';
import {
  useCurrentBtcPrice,
  useSuspenseCurrentStxPrice,
} from '../../../common/queries/useCurrentPrices';
import { usdFormatter } from '../../../common/utils/utils';
import { Flex, FlexProps } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Skeleton } from '../../../ui/Skeleton';
import { BitcoinIcon, StxIcon } from '../../../ui/icons';
import { ExplorerErrorBoundary } from '../ErrorBoundary';

function PriceContainer({
  icon,
  children,
  ...rest
}: { icon: ReactNode; children: ReactNode } & FlexProps) {
  return (
    <Flex color={'slate.50'} gap={1.5} alignItems={'center'} {...rest}>
      {icon}
      <Flex fontWeight={'medium'} fontSize={'xs'} flexGrow={1} suppressHydrationWarning={true}>
        {children}
      </Flex>
    </Flex>
  );
}

function BtcStxPriceBase() {
  const {
    data: btcPrice,
    isFetching: isBtcPriceFetching,
    isError: isBtcPriceError,
  } = useCurrentBtcPrice();
  const {
    data: stxPrice,
    isFetching: isStxPriceFetching,
    isError: isStxPriceError,
  } = useSuspenseCurrentStxPrice();
  const formattedBtcPrice = btcPrice ? usdFormatter.format(btcPrice) : '';
  const formattedStxPrice = stxPrice ? usdFormatter.format(stxPrice) : '';
  return (
    <Flex gap={6} minWidth={'172px'}>
      <PriceContainer icon={<Icon as={BitcoinIcon} size={4.5} />} minWidth={'92px'}>
        {isBtcPriceError || !formattedBtcPrice ? (
          'N/A'
        ) : isBtcPriceFetching ? (
          <Skeleton display={'flex'} flexGrow={1} height={3} />
        ) : (
          formattedBtcPrice
        )}
      </PriceContainer>
      <PriceContainer
        icon={
          <Circle size={4.5} bg="brand" border={'none'}>
            <Icon as={StxIcon} size={2.5} color="white" />
          </Circle>
        }
        minWidth={'56px'}
      >
        {isStxPriceError || !formattedStxPrice ? (
          'N/A'
        ) : isStxPriceFetching ? (
          <Skeleton display={'flex'} flexGrow={1} height={3} />
        ) : (
          formattedStxPrice
        )}
      </PriceContainer>
    </Flex>
  );
}

export function BtcStxPrice() {
  return (
    <ExplorerErrorBoundary renderContent={() => null}>
      <BtcStxPriceBase />
    </ExplorerErrorBoundary>
  );
}
