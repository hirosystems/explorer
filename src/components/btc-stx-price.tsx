import { usdFormatter } from '@/common/utils';
import { Circle } from '@/components/circle';
import { Box, Icon } from '@/ui/components';
import { BitcoinIcon } from '@/ui/icons';
import { StxIcon } from '@/ui/icons/StxIcon';
import { css } from '@emotion/react';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { FC, Fragment } from 'react';

import { useCurrentBtcPrice, useCurrentStxPrice } from '../app/common/hooks/use-current-prices';

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

const priceStyle = css`
  font-weight: 500;
  font-size: 14px;
`;

const BtcStxPriceBase: FC = () => {
  const { data: btcPrice } = useCurrentBtcPrice();
  const { data: stxPrice } = useCurrentStxPrice();
  const formattedBtcPrice = usdFormatter.format(btcPrice);
  const formattedStxPrice = usdFormatter.format(stxPrice);

  if (!formattedStxPrice || !formattedBtcPrice) return null;
  return (
    <Fragment>
      <Box css={wrapperStyle}>
        <Circle size={18} bg="white" css={iconStyle}>
          <Icon as={BitcoinIcon} color={'#f7931a'} size={19} />
        </Circle>
        <Box css={priceStyle} suppressHydrationWarning={true}>
          {formattedBtcPrice}
        </Box>
      </Box>
      <Box css={wrapperStyle}>
        <Circle size={18} bg="accent.light" css={iconStyle}>
          <Icon as={StxIcon} strokeWidth={2} size="11px" color="white" />
        </Circle>
        <Box css={priceStyle} suppressHydrationWarning={true}>
          {formattedStxPrice}
        </Box>
      </Box>
    </Fragment>
  );
};

export default BtcStxPriceBase;

export const BtcStxPrice = dynamic(() => import('./btc-stx-price'), {
  loading: () => null,
  ssr: false,
});
