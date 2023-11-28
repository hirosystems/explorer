'use client';

import { css } from '@emotion/react';
import * as React from 'react';
import { Fragment } from 'react';

import { Circle } from '../../../common/components/Circle';
import { ExplorerSkeletonLoader } from '../../../common/components/loaders/skeleton-common';
import {
  useCurrentBtcPrice,
  useSuspenseCurrentStxPrice,
} from '../../../common/queries/useCurrentPrices';
import { usdFormatter } from '../../../common/utils/utils';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { BitcoinIcon, StxIcon } from '../../../ui/icons';
import { ExplorerErrorBoundary } from '../ErrorBoundary';

const wrapperStyle = css`
  display: flex;
  color: #fff;
  gap: 5px;
  align-items: center;
`;

const iconStyle = css`
  position: relative;
  height: 18px;
  width: 18px;
  border-radius: 18px;
  svg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

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
    <Fragment>
      <Box css={wrapperStyle}>
        <Circle size={18} bg="white" css={iconStyle}>
          <Icon as={BitcoinIcon} color={'#f7931a'} size={19} />
        </Circle>
        <Flex
          fontWeight={500}
          fontSize={'14px'}
          alignItems={'center'}
          minWidth={'65px'}
          suppressHydrationWarning={true}
        >
          {isBtcPriceError ? (
            'N/A'
          ) : isBtcPriceFetching || false ? (
            <ExplorerSkeletonLoader width={'70px'} height={'15px'} />
          ) : (
            formattedBtcPrice
          )}
        </Flex>
      </Box>
      <Box css={wrapperStyle}>
        <Circle size={18} bg="accent.light" css={iconStyle}>
          <Icon as={StxIcon} strokeWidth={2} size="11px" color="white" />
        </Circle>
        <Flex
          fontWeight={500}
          fontSize={'14px'}
          alignItems={'center'}
          minWidth={'35px'}
          suppressHydrationWarning={true}
        >
          {isStxPriceError ? (
            'N/A'
          ) : isStxPriceFetching ? (
            <ExplorerSkeletonLoader width={'35px'} height={'15px'} />
          ) : (
            formattedStxPrice
          )}
        </Flex>
      </Box>
    </Fragment>
  );
}

export function BtcStxPrice() {
  return (
    <ExplorerErrorBoundary renderContent={() => null}>
      <BtcStxPriceBase />
    </ExplorerErrorBoundary>
  );
}
