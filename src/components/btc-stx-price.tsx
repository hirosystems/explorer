import { css } from '@emotion/react';

import { Fragment, ReactNode } from 'react';
import { usdFormatter } from '@/common/utils';
import { Circle } from '@/components/circle';
import { Box, Flex, Icon } from '@/ui/components';
import { BitcoinIcon } from '@/ui/icons';
import { StxIcon } from '@/ui/icons/StxIcon';

import {
  useCurrentBtcPrice,
  useCurrentStxPrice,
} from '../appPages/common/hooks/use-current-prices';
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

export function BtcStxPrice(props: { children?: ReactNode }) {
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
    <>
      <Box css={wrapperStyle}>
        <Circle size={18} bg="white" css={iconStyle}>
          <Icon as={BitcoinIcon} color="#f7931a" size={19} />
        </Circle>
        <Flex
          fontWeight={500}
          fontSize="14px"
          alignItems="center"
          minWidth="65px"
          suppressHydrationWarning
        >
          {isBtcPriceError ? (
            'N/A'
          ) : isBtcPriceFetching || false ? (
            <ExplorerSkeletonLoader width="70px" height="15px" />
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
          fontSize="14px"
          alignItems="center"
          minWidth="35px"
          suppressHydrationWarning
        >
          {isStxPriceError ? (
            'N/A'
          ) : isStxPriceFetching ? (
            <ExplorerSkeletonLoader width="35px" height="15px" />
          ) : (
            formattedStxPrice
          )}
        </Flex>
      </Box>
    </>
  );
}
