import { FC, useEffect, useState, Fragment } from 'react';
import { FaBitcoin } from 'react-icons/fa';
import { Box, color } from '@stacks/ui';
import { css } from '@emotion/react';
import { StxInline } from '@components/icons/stx-inline';
import { Circle } from '@components/circle';

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
  const [stxPrice, setStxPrice] = useState<string | undefined>();
  const [btcPrice, setBtcPrice] = useState<string | undefined>();
  useEffect(() => {
    void fetch('https://api.coingecko.com/api/v3/exchange_rates')
      .then(res => res.json())
      .then(data => {
        setBtcPrice(formatter.format(data.rates.usd.value));
      });
    void fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=blockstack,bitcoin&vs_currencies=usd'
    )
      .then(res => res.json())
      .then(data => {
        setStxPrice(formatter.format(data.blockstack.usd));
      });
  }, []);
  if (!stxPrice || !btcPrice) return null;
  return (
    <Fragment>
      <Box css={wrapperStyle}>
        <Circle size="18px" bg={'#fff'} css={iconStyle}>
          <FaBitcoin color={'#f7931a'} size={19} />
        </Circle>
        <Box css={priceStyle}>{btcPrice}</Box>
      </Box>
      <Box css={wrapperStyle}>
        <Circle size="19px" bg={color('accent')} css={iconStyle}>
          <StxInline strokeWidth={2} size="11px" color="white" />
        </Circle>
        <Box css={priceStyle}>{stxPrice}</Box>
      </Box>
    </Fragment>
  );
};
