import { useHomeQueries } from '@features/home/useHomeQueries';
import { useInfiniteQuery } from 'react-query';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';
import { Box, StxInline, Tooltip } from '@stacks/ui';
import { IconCurrencyBitcoin } from '@tabler/icons';
import { BsFillExclamationCircleFill, BsArrowRight } from 'react-icons/bs';
import { AiFillCheckCircle } from 'react-icons/ai';
import { Block as BlockType } from '@stacks/stacks-blockchain-api-types';
import { buildUrl } from '@components/links';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { TransactionQueryKeys } from '@features/transaction/query-keys';
import { NetworkModes } from '@common/types/network';
import { getNextPageParam } from '@common/utils';

const wrapperStyle = css`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  justify-content: center;
  padding: 0 15px 0 65px;
  @media (max-width: 1024px) {
    flex-direction: column-reverse;
    align-items: center;
    padding: 0 15px 45px 15px;
  }
`;

const blockStyle = css`
  height: 60px;
  width: 100%;
  line-height: 60px;
  background-color: #d9d9d9;
  border-radius: 6px;
  overflow-wrap: anywhere;
  text-align: center;
  cursor: pointer;
  font-size: 12px;
  color: #1b1b1b;
`;

const blockWrapperStyle = css`
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 10px;
  margin-right: 28px;
  flex-basis: 25%;
  &:last-child {
    margin-right: 0;
  }
  @media (max-width: 1024px) {
    flex-direction: row;
    height: auto;
    flex-basis: 100%;
    width: 100%;
    margin-right: 0;
    margin-bottom: 28px;
    &:first-child {
      margin-bottom: 0;
    }
  }
`;

const blockAndArrowStyle = css`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
  width: 100%;
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const currentBlockStyle = css`
  ${blockWrapperStyle};
  background-color: #fff;
  border: 2px dashed #62676e;
  .block-box {
    box-shadow: none;
    background-color: #d9d9d9;
  }
`;

const blockchainIconWrapperStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  position: absolute;
  left: -65px;
  @media (max-width: 1024px) {
    left: auto;
    bottom: -65px;
  }
`;
const timeStyle = css`
  width: 100%;
  @media (max-width: 1024px) {
    //flex-direction: row;
  }
`;

const timeContainerStyle = css`
  display: flex;
  height: 60px;
  font-size: 12px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  @media (max-width: 1024px) {
    height: auto;
  }
`;

const iconStyle = css``;

const arrowStyle = css`
  position: absolute;
  right: -37px;
  @media (max-width: 1024px) {
    transform: rotate(-90deg);
    top: -37px;
    right: auto;
  }
`;

const secondsToHMS = (seconds: number) => ({
  numHours: Math.floor(((seconds % 31536000) % 86400) / 3600),
  numMinutes: Math.floor((((seconds % 31536000) % 86400) % 3600) / 60),
  numSeconds: (((seconds % 31536000) % 86400) % 3600) % 60,
});

function secondsToString(seconds: number) {
  const { numHours, numMinutes, numSeconds } = secondsToHMS(seconds);
  if (numHours)
    return `${numHours}h${numMinutes === 1 ? '' : 's'}${
      numMinutes ? ` ${numMinutes}m${numMinutes === 1 ? '' : 's'}` : ''
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

interface BlockProps {
  block: BlockType;
  previousBtcBlockBurnTime: number;
  displayBlockchainIcons?: boolean;
}

interface BlockInfoProps {
  tooltip: string;
  icon: React.ReactNode;
  time: string;
}

const BlockInfo: React.FC<BlockInfoProps> = ({ tooltip, icon, time }) => (
  <Box css={timeStyle}>
    <Tooltip label={tooltip}>
      <Box css={timeContainerStyle}>
        {icon}
        {time}
      </Box>
    </Tooltip>
  </Box>
);

const Block: React.FC<BlockProps> = ({
  displayBlockchainIcons,
  previousBtcBlockBurnTime,
  block,
}) => {
  const stxBlockHeight = block.height;
  const btcBlockBurnTime = block.burn_block_time;
  const btcBlockHeight = block.burn_block_height;
  const timeBetweenBlocks = btcBlockBurnTime - previousBtcBlockBurnTime;
  const delayedBlock = timeBetweenBlocks && timeBetweenBlocks >= 11 * 60;
  const Icon = delayedBlock ? BsFillExclamationCircleFill : AiFillCheckCircle;
  const timeBetweenBlocksFormatted = secondsToString(timeBetweenBlocks);
  const router = useRouter();
  const activeNetworkMode = useAppSelector(selectActiveNetwork).mode;
  const btcLinkPathPrefix = activeNetworkMode === NetworkModes.Testnet ? '/testnet' : '';

  return (
    <Box css={blockWrapperStyle}>
      <Box css={blockAndArrowStyle}>
        {displayBlockchainIcons && (
          <Box css={blockchainIconWrapperStyle} backgroundColor={'#f7931a'}>
            <IconCurrencyBitcoin color={'#fff'} />
          </Box>
        )}
        <Box
          className={'block-box'}
          css={blockStyle}
          onClick={() => {
            window
              ?.open(`https://mempool.space${btcLinkPathPrefix}/block/${btcBlockHeight}`, '_blank')
              ?.focus();
          }}
        >
          {btcBlockHeight}
        </Box>
        <BsArrowRight color={'#d9d9d9'} css={arrowStyle} size={'37px'} />
      </Box>
      <BlockInfo
        tooltip={
          delayedBlock
            ? `This block took longer than expected`
            : 'This block was mined in under 10 minutes.'
        }
        icon={<Icon size={20} color={'#757b83'} css={iconStyle} />}
        time={timeBetweenBlocksFormatted}
      />
      <Box css={blockAndArrowStyle}>
        {displayBlockchainIcons && (
          <Box css={blockchainIconWrapperStyle} backgroundColor={'#5546ff'}>
            <StxInline color="#fff" size="16px" />
          </Box>
        )}
        <Box
          css={blockStyle}
          className={'block-box'}
          onClick={() =>
            router.push(buildUrl(`/block/${encodeURIComponent(block.hash)}`, activeNetworkMode))
          }
        >
          {stxBlockHeight}
        </Box>
        <BsArrowRight color={'#d9d9d9'} css={arrowStyle} size={'37px'} />
      </Box>
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
    <Box css={currentBlockStyle}>
      <Box css={blockAndArrowStyle}>
        <Box className={'block-box'} css={blockStyle}>
          {btcBlockHeight}
        </Box>
      </Box>
      <BlockInfo
        tooltip={`The block time on the bitcoin blockchain is ~10 minutes. However, this block time isn't set in stone and can oscillate between a few seconds and a few hours.`}
        icon={null}
        time={formattedBlockWaitTime}
      />
      <Box css={blockAndArrowStyle}>
        <Box css={blockStyle} className={'block-box'}>
          {stxBlockHeight}
        </Box>
      </Box>
    </Box>
  );
};

export const BlocksVisualizer: React.FC = () => {
  const queries = useHomeQueries();
  const { data: blocks } = useInfiniteQuery(
    [TransactionQueryKeys.lastFourBlocks],
    () => queries.fetchBlocks(4)(),
    { getNextPageParam, refetchInterval: 1 * 60 * 1000 }
  );
  const lastFourBlocks = (blocks?.pages?.[0]?.results || []).slice(0, 4).reverse();
  if (lastFourBlocks.length === 0) return null;
  console.log(lastFourBlocks);
  const lastBlock = lastFourBlocks[3];
  return (
    <Box css={wrapperStyle}>
      {lastFourBlocks.map((block, i) => {
        if (i === 0) return null;
        return (
          <Block
            block={block}
            previousBtcBlockBurnTime={lastFourBlocks[i - 1]?.burn_block_time}
            displayBlockchainIcons={i == 1}
          />
        );
      })}
      <CurrentBlock lastBlock={lastBlock} />
    </Box>
  );
};
