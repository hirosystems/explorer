import { css } from '@emotion/react';
import { FC, Fragment } from 'react';
import { FaBitcoin } from 'react-icons/fa';

import { Box, color } from '@stacks/ui';

import { useCurrentBtcPrice, useCurrentStxPrice } from '@common/hooks/use-current-prices';
import { usdFormatter } from '@common/utils';

import { Circle } from '@components/circle';
import { StxInline } from '@components/icons/stx-inline';

const wrapperStyle = css`
  display: flex;
  color: #fff;
  gap: 5px;
`;

const iconStyle = (bg: string) => css`
  position: relative;
  height: 18px;
  width: 18px;
  border-radius: 18px;
  background-color: ${bg};
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

export const BtcStxPrice: FC = () => {
  const { data: btcPrice } = useCurrentBtcPrice();
  const { data: stxPrice } = useCurrentStxPrice();
  const formattedBtcPrice = usdFormatter.format(btcPrice);
  const formattedStxPrice = usdFormatter.format(stxPrice);

  if (!formattedStxPrice || !formattedBtcPrice) return null;
  return (
    <Fragment>
      <Box css={wrapperStyle}>
        <Circle css={iconStyle('white')}>
          <FaBitcoin color={'#f7931a'} size={19} />
        </Circle>
        <Box css={priceStyle}>{formattedBtcPrice}</Box>
      </Box>
      <Box css={wrapperStyle}>
        <Circle css={iconStyle(color('accent'))}>
          <StxInline strokeWidth={2} size="11px" color="white" />
        </Circle>
        <Box css={priceStyle}>{formattedStxPrice}</Box>
      </Box>
    </Fragment>
  );
};
