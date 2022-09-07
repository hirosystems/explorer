import { FC, useEffect, useState, Fragment } from 'react';
import { FaBitcoin } from 'react-icons/fa';
import { Box, color } from '@stacks/ui';
import { css } from '@emotion/react';
import { StxInline } from '@components/icons/stx-inline';
import { Circle } from '@components/circle';
import { useCurrentBtcPrice, useCurrentStxPrice } from '@common/hooks/use-current-prices';

const wrapperStyle = css`
  display: flex;
  color: #fff;
  gap: 5px;
`;

const iconStyle = css`
  position: relative;
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

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const BtcStxPrice: FC = () => {
  const { data: btcPrice } = useCurrentBtcPrice();
  const { data: stxPrice } = useCurrentStxPrice();
  const formattedBtcPrice = formatter.format(btcPrice);
  const formattedStxPrice = formatter.format(stxPrice);

  if (!formattedStxPrice || !formattedBtcPrice) return null;
  return (
    <Fragment>
      <Box css={wrapperStyle}>
        <Circle size="18px" bg={'#fff'} css={iconStyle}>
          <FaBitcoin color={'#f7931a'} size={19} />
        </Circle>
        <Box css={priceStyle}>{formattedBtcPrice}</Box>
      </Box>
      <Box css={wrapperStyle}>
        <Circle size="19px" bg={color('accent')} css={iconStyle}>
          <StxInline strokeWidth={2} size="11px" color="white" />
        </Circle>
        <Box css={priceStyle}>{formattedStxPrice}</Box>
      </Box>
    </Fragment>
  );
};
