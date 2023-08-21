import { usdFormatter } from '@/common/utils';
import { Circle } from '@/components/circle';
import { Box, Icon, Flex } from '@/ui/components';
import { BitcoinIcon } from '@/ui/icons';
import { StxIcon } from '@/ui/icons/StxIcon';
import { css } from '@emotion/react';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { FC, Fragment } from 'react';

import { useCurrentBtcPrice, useCurrentStxPrice } from '../app/common/hooks/use-current-prices';
import { ExplorerSkeletonLoader } from '@/components/loaders/skeleton-common';

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

export const BtcStxPrice: FC = () => {
  const {
    data: btcPrice,
    isFetching: isBtcPriceFetching,
    isError: isBtcPriceError,
  } = useCurrentBtcPrice();
  const {
    data: stxPrice,
    isFetching: isStxPriceFetching,
    isError: isStxPriceError,
  } = useCurrentStxPrice();
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
};
