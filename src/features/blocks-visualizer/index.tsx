import { useHomeQueries } from '@features/home/useHomeQueries';
import { useInfiniteQuery } from 'react-query';
import { getNextPageParam } from '@store/common';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { css, keyframes } from '@emotion/react';
import { Box, StxInline, Tooltip } from '@stacks/ui';
import { IconCurrencyBitcoin, IconClock } from '@tabler/icons';
import { BsFillCheckCircleFill, BsFillExclamationCircleFill } from 'react-icons/bs';
import { CgSpinnerTwo } from 'react-icons/cg';
import { FaChevronRight } from 'react-icons/fa';
import { BiLink } from 'react-icons/bi';
import { Block as BlockType } from '@stacks/stacks-blockchain-api-types';
import { buildUrl } from '@components/links';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { transactionQK, TransactionQueryKeys } from '@features/transaction/query-keys';

const animeTime = 5;
const boxSize = 100;
const borderMargin = 5;
const pathWidth = 3;
const verticalSpacing = 65;

const borderAnimation = keyframes`
  0%, 100% {
    clip: rect(0px, ${boxSize + borderMargin * 2}px, ${pathWidth}px, 0px);
  }
  25% {
    clip: rect(0px, ${pathWidth}px, ${boxSize * 2 + verticalSpacing + borderMargin * 2}px, 0px);
  }
  50% {
    clip: rect(
      ${boxSize * 2 + verticalSpacing + borderMargin * 2 - pathWidth}px,
      ${boxSize + borderMargin * 2}px,
      ${boxSize * 2 + verticalSpacing + borderMargin * 2}px,
      0px
    );
  }
  75% {
    clip: rect(
      0px,
      ${boxSize + borderMargin * 2}px,
      ${boxSize * 2 + verticalSpacing + borderMargin * 2}px,
      ${boxSize + borderMargin * 2 - pathWidth}px
    );
  } 
`;

const verticalBorderAnimation = keyframes`
  0%, 100% {
    clip: rect(0px, ${boxSize * 2 + verticalSpacing + borderMargin * 2}px, ${pathWidth}px, 0px);
  }
  25% {
    clip: rect(0px, ${pathWidth}px, ${boxSize + borderMargin * 2}px, 0px);
  }
  50% {
    clip: rect(
      ${boxSize + borderMargin * 2 - pathWidth}px,
      ${boxSize * 2 + verticalSpacing + borderMargin * 2}px,
      ${boxSize + borderMargin * 2}px,
      0px
    );
  }
  75% {
    clip: rect(
      0px,
      ${boxSize * 2 + verticalSpacing + borderMargin * 2}px,
      ${boxSize + borderMargin * 2}px,
      ${boxSize * 2 + verticalSpacing + borderMargin * 2 - pathWidth}px
    );
  }
`;

const spinAnimation = keyframes`
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
`;

const wrapperStyle = css`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  justify-content: center;
  @media (max-width: 1024px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;

const blockStyle = css`
  width: ${boxSize}px;
  height: ${boxSize}px;
  background-color: #f9f9f9;
  overflow-wrap: anywhere;
  text-align: center;
  padding: 0 20px;
  cursor: pointer;
  font-size: 12px;
  box-shadow: 1px 1px 1px 1px #666;
`;

const containerStyle = css`
  display: flex;
  flex-wrap: nowrap;
  @media (max-width: 1024px) {
    flex-direction: column-reverse;
  }
`;

const blockWrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: ${boxSize * 2 + verticalSpacing}px;
  justify-content: space-between;
  @media (max-width: 1024px) {
    flex-direction: row;
    height: auto;
    width: ${boxSize * 2 + verticalSpacing}px;
  }
`;

const currentBlockStyle = css`
  ${blockWrapperStyle};
  position: relative;

  &::before,
  &::after {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    content: '';
    z-index: 1;
    margin: -${borderMargin}px;
    box-shadow: inset 0 0 0 ${pathWidth}px #aab3ff;
    animation: ${borderAnimation} ${animeTime}s linear infinite;
    @media (max-width: 1024px) {
      animation: ${verticalBorderAnimation} ${animeTime}s linear infinite;
    }
  }

  &::before {
    animation-delay: ${animeTime * -0.5}s;
  }

  .block-box {
    box-shadow: none;
    background-color: #fff;
    border: 1px dashed #b2b2b2;
  }
`;

const spanStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
  height: 30px;
`;
const timeStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  text-align: center;
  width: 50px;
  @media (max-width: 1024px) {
    flex-direction: row;
    width: ${boxSize * 2 + verticalSpacing}px;
  }
`;

const timeContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: ${verticalSpacing}px;
  font-size: 14px;
  @media (max-width: 1024px) {
    height: auto;
    width: ${verticalSpacing}px;
  }
`;

const iconStyle = css`
  position: relative;
  top: 9px;
  left: -8px;
  border-radius: 50%;
`;
const iconStyleAnimated = css`
  ${iconStyle};
  animation: ${spinAnimation} 1s infinite;
`;

const linkStyle = css`
  transform: rotate(-45deg);
  @media (max-width: 1024px) {
    transform: rotate(45deg);
  }
`;

const arrowStyle = css`
  @media (max-width: 1024px) {
    transform: rotate(-90deg);
  }
`;

const secondsToHMS = (seconds: number) => ({
  numHours: Math.floor(((seconds % 31536000) % 86400) / 3600),
  numMinutes: Math.floor((((seconds % 31536000) % 86400) % 3600) / 60),
  numSeconds: (((seconds % 31536000) % 86400) % 3600) % 60,
});

function secondsToString(seconds?: number) {
  if (typeof seconds === 'undefined') return '';
  const { numHours, numMinutes, numSeconds } = secondsToHMS(seconds);
  if (numHours)
    return `${numHours} hr${numMinutes === 1 ? '' : 's'}${
      numMinutes ? ` ${numMinutes} min${numMinutes === 1 ? '' : 's'}` : ''
    }`;
  if (numMinutes) return `${numMinutes} min${numMinutes === 1 ? '' : 's'}`;
  return `${numSeconds} sec${numMinutes === 1 ? '' : 's'}`;
}

function formatSeconds(seconds?: number) {
  if (typeof seconds === 'undefined') return '';
  const { numHours, numMinutes, numSeconds } = secondsToHMS(seconds);
  return `${numHours ? `${numHours < 10 ? `0${numHours}` : numHours}:` : ''}${`${
    numMinutes < 10 ? `0${numMinutes}` : numMinutes
  }:`}${`${numSeconds < 10 ? `0${numSeconds}` : numSeconds}`}`;
}

interface BlockData {
  stx: {
    height: number;
    burn_block_time: number;
  };
  btc: {
    height: number;
    timeBetween: number;
  };
}

interface BlockProps {
  block: BlockType;
  nextBtcBlockBurnTime?: number;
}

interface BlockInfoProps {
  tooltip: string;
  icon: React.ReactNode;
  time: string;
}

const BlockInfo: React.FC<BlockInfoProps> = ({ tooltip, icon, time }) => (
  <Box css={timeStyle}>
    <FaChevronRight color={'#9f9f9f'} css={arrowStyle} />
    <Tooltip label={tooltip}>
      <Box css={timeContainerStyle}>
        {icon}
        <IconClock color={'#333'} />
        {time}
      </Box>
    </Tooltip>
    <FaChevronRight color={'#9f9f9f'} css={arrowStyle} />
  </Box>
);

const Block: React.FC<BlockProps> = ({ nextBtcBlockBurnTime, block }) => {
  const stxBlockHeight = block.height;
  const btcBlockBurnTime = block.burn_block_time;
  const btcBlockHeight = block.burn_block_height;
  const timeBetweenBlocks = nextBtcBlockBurnTime
    ? nextBtcBlockBurnTime - btcBlockBurnTime
    : undefined;
  const delayedBlock = timeBetweenBlocks && timeBetweenBlocks > 10 * 60;
  const Icon = delayedBlock ? BsFillExclamationCircleFill : BsFillCheckCircleFill;
  const iconColor = delayedBlock ? '#ffbf00' : '#7bc62d';
  const timeBetweenBlocksFormatted = secondsToString(timeBetweenBlocks);
  const router = useRouter();
  const activeNetworkUrl = useAppSelector(selectActiveNetwork).url;
  return (
    <Box css={containerStyle}>
      <Box css={blockWrapperStyle}>
        <section style={{ display: 'flex' }}>
          <Box
            className={'block-box'}
            css={blockStyle}
            onClick={() => {
              window
                ?.open(`https://www.blockchain.com/btc/block/${btcBlockHeight}`, '_blank')
                ?.focus();
            }}
          >
            <Box css={spanStyle}>
              <IconCurrencyBitcoin color={'#f2a900'} />
            </Box>
            {btcBlockHeight}
          </Box>
        </section>
        <BiLink size={25} css={linkStyle} color={'#ccc'} />
        <Box
          css={blockStyle}
          className={'block-box'}
          onClick={() =>
            router.push(buildUrl(`/block/${encodeURIComponent(block.hash)}`, activeNetworkUrl))
          }
        >
          <Box css={spanStyle}>
            <StxInline color="#5546FF" size="16px" />
          </Box>{' '}
          {stxBlockHeight}
        </Box>
      </Box>
      {timeBetweenBlocksFormatted && (
        <BlockInfo
          tooltip={
            delayedBlock
              ? `This block took longer than expected`
              : 'This block was mined in under 10 minutes.'
          }
          icon={<Icon size={20} color={iconColor} css={iconStyle} />}
          time={timeBetweenBlocksFormatted}
        />
      )}
    </Box>
  );
};

interface CurrentBlockProps {
  lastBlock: BlockType;
}

const CurrentBlock: React.FC<CurrentBlockProps> = ({ lastBlock }) => {
  const btcBlockHeight = lastBlock.burn_block_height + 1;
  const stxBlockHeight = lastBlock.height + 1;
  const lastBtcBlockBurnTime = lastBlock.burn_block_time;

  const [currentBlockWaitTime, setCurrentBlockWaitTime] = useState(
    Math.ceil(Date.now() / 1000) - lastBtcBlockBurnTime
  );

  const formattedBlockWaitTime = formatSeconds(currentBlockWaitTime);

  useEffect(() => {
    const handler = setInterval(() => {
      setCurrentBlockWaitTime(currentBlockWaitTime + 1);
    }, 1000);
    return () => clearInterval(handler);
  });

  return (
    <Box css={containerStyle}>
      <BlockInfo
        tooltip={`The block time on the bitcoin blockchain is ~10 minutes. However, this block time isn't set in stone and can oscillate between a few seconds and a few hours.`}
        icon={<CgSpinnerTwo size={20} color={'#ccc'} css={iconStyleAnimated} />}
        time={formattedBlockWaitTime}
      />
      <Box css={currentBlockStyle}>
        <section style={{ display: 'flex' }}>
          <Box className={'block-box'} css={blockStyle}>
            <Box css={spanStyle}>
              <IconCurrencyBitcoin color={'#f2a900'} />
            </Box>
            {btcBlockHeight}
          </Box>
        </section>
        <BiLink size={25} css={linkStyle} color={'#ccc'} />
        <Box css={blockStyle} className={'block-box'}>
          <Box css={spanStyle}>
            <StxInline color="#5546FF" size="16px" />
          </Box>{' '}
          {stxBlockHeight}
        </Box>
      </Box>
    </Box>
  );
};

export const BlocksVisualizer: React.FC = () => {
  const queries = useHomeQueries();
  const { data: blocks } = useInfiniteQuery(
    [TransactionQueryKeys.lastThreeBlocks],
    () => queries.fetchBlocks(3)(),
    { getNextPageParam, refetchInterval: 1 * 60 * 1000 }
  );
  const lastThreeBlocks = (blocks?.pages?.[0]?.results || []).slice(0, 3).reverse();
  const lastBlock = lastThreeBlocks[2];
  return (
    <Box css={wrapperStyle}>
      {lastThreeBlocks.map((block, i) => (
        <Block block={block} nextBtcBlockBurnTime={lastThreeBlocks[i + 1]?.burn_block_time} />
      ))}
      <CurrentBlock lastBlock={lastBlock} />
    </Box>
  );
};
