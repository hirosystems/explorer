'use client';

import { Flex, FlexProps, Icon } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { Circle } from '../../../common/components/Circle';
import { TokenPrice } from '../../../common/types/tokenPrice';
import { usdFormatter } from '../../../common/utils/utils';
import BitcoinCircleIcon from '../../../ui/icons/BitcoinCircleIcon';
import StxIcon from '../../../ui/icons/StxIcon';
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

function BtcStxPriceBase({ tokenPrice }: { tokenPrice: TokenPrice }) {
  const formattedBtcPrice = tokenPrice.btcPrice ? usdFormatter.format(tokenPrice.btcPrice) : '';
  const formattedStxPrice = tokenPrice.stxPrice ? usdFormatter.format(tokenPrice.stxPrice) : '';
  return (
    <Flex gap={6} minWidth={'172px'}>
      <PriceContainer
        icon={
          <Icon h={4.5} w={4.5} color="accent.bitcoin-500">
            <BitcoinCircleIcon />
          </Icon>
        }
        minWidth={'92px'}
        color={{ base: 'text', lg: 'slate.50' }}
      >
        {!formattedBtcPrice ? 'N/A' : formattedBtcPrice}
      </PriceContainer>
      <PriceContainer
        icon={
          <Circle h={4.5} w={4.5} bg="brand" border={'none'}>
            <Icon h={2.5} w={2.5} color="white">
              <StxIcon />
            </Icon>
          </Circle>
        }
        minWidth={'56px'}
        color={{ base: 'text', lg: 'slate.50' }}
      >
        {!formattedStxPrice ? 'N/A' : formattedStxPrice}
      </PriceContainer>
    </Flex>
  );
}

export function BtcStxPrice({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <ExplorerErrorBoundary renderContent={() => null}>
      <BtcStxPriceBase tokenPrice={tokenPrice} />
    </ExplorerErrorBoundary>
  );
}
