'use client';

import { useColorMode } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import React, { useEffect } from 'react';
import { HiOutlineHashtag } from 'react-icons/hi';
import { block } from 'sharp';

import { blocks } from '../../../../../e2e/blocks-test-vector';
import { Circle } from '../../../../common/components/Circle';
import { SectionWithControls } from '../../../../common/components/Section';
import { StacksIconCircle } from '../../../../common/components/StacksIconCircle';
import { Accordion } from '../../../../ui/Accordion';
import { Icon } from '../../../../ui/Icon';
import { BitcoinIcon, StxIcon } from '../../../../ui/icons';
import { Controls } from '../Controls';
import { Footer } from '../Footer';
import { useBlockListContext } from '../context/useBlockListContext';
import { BurnBlock } from './BurnBlock';
import { StxBlock } from './StxBlock';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export function BlockListLayoutA() {
  const colorMode = useColorMode().colorMode;
  const [loading, setLoading] = React.useState(false);
  const [oldBlocksCount, setOldBlocksCount] = React.useState(0);
  const [newBlocksCount, setNewBlocksCount] = React.useState(16);
  const [groupedByBtc, setGroupedByBtc] = React.useState(true);
  const [liveUpdates, setLiveUpdates] = React.useState(false);
  const [heightView, setHeightView] = React.useState(false);
  const [blockView, setBlockView] = React.useState(true);
  const { blocksGroupedByBurnBlockHeight, latestBlocks } = useBlockListContext();

  console.log('latestBlocks', latestBlocks);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setOldBlocksCount(newBlocksCount);
  //     setNewBlocksCount(newBlocksCount + Math.floor(Math.random() * 50) + 3);
  //   }, 5000);
  //
  //   return () => {
  //     clearInterval(intervalId); // Clear the interval when the component unmounts
  //   };
  // }, [newBlocksCount]);
  return (
    <SectionWithControls
      title="Recent Blocks"
      controls={
        <Controls
          groupByBtc={{
            onChange: () => {
              setGroupedByBtc(!groupedByBtc);
            },
            isChecked: groupedByBtc,
          }}
          liveUpdates={{
            onChange: () => setLiveUpdates(!liveUpdates),
            isChecked: liveUpdates,
          }}
          heightView={{
            color: heightView ? '#242629' : '#8D929A',
            isDisabled: heightView,
            onClick: () => {
              setHeightView(true);
              setBlockView(false);
            },
            cursor: heightView ? 'default' : 'pointer',
          }}
          blockView={{
            color: blockView ? '#242629' : '#8D929A',
            isDisabled: blockView,
            onClick: () => {
              setHeightView(false);
              setBlockView(true);
            },
            cursor: blockView ? 'default' : 'pointer',
          }}
          update={{
            isLoading: loading,
            onClick: () => {
              setLoading(true);
              setOldBlocksCount(newBlocksCount);
              setNewBlocksCount(0);
              setTimeout(() => {
                setLoading(false);
              }, 1250);
            },
          }}
          latestBlocksCount={latestBlocks.length}
        />
      }
      footer={<Footer />}
    >
      <Accordion allowMultiple flexGrow={1}>
        {blocksGroupedByBurnBlockHeight?.map(({ burnBlock, blocks }) => {
          return (
            <>
              {blocks.map((block, i) => (
                <StxBlock
                  key={block.hash}
                  hash={block.hash}
                  height={block.height}
                  timestamp={block.burn_block_time}
                  txsCount={block.txs.length}
                  icon={i === 0 ? <Icon as={StxIcon} strokeWidth={2} size="11px" /> : undefined}
                />
              ))}
              <BurnBlock
                height={burnBlock.height}
                timestamp={burnBlock.timestamp}
                hash={burnBlock.hash}
                txsCount={0}
                icon={<Icon as={BitcoinIcon} color={'#f7931a'} size={18} />}
              />
            </>
          );
        })}
      </Accordion>
    </SectionWithControls>
  );
}
