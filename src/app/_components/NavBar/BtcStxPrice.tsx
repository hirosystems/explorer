'use client';

import { ReactNode } from 'react';

import { Circle } from '../../../common/components/Circle';
import { TokenPrice } from '../../../common/types/tokenPrice';
import { usdFormatter } from '../../../common/utils/utils';
import { Flex, FlexProps } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import BitcoinIcon from '../../../ui/icons/BitcoinIcon';
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
        icon={<Icon as={BitcoinIcon} size={4.5} />}
        minWidth={'92px'}
        color={{ base: 'text', lg: 'slate.50' }}
      >
        {!formattedBtcPrice ? 'N/A' : formattedBtcPrice}
      </PriceContainer>
      <PriceContainer
        icon={
          <Circle size={'18px'} bg="brand" border={'none'}>
            <Icon as={StxIcon} size={'10px'} color="white" />
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
