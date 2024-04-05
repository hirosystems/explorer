import { Icon } from '../../../../ui/Icon';
import { Stack } from '../../../../ui/Stack';
import { StxIcon } from '../../../../ui/icons';
import { BlockCount } from '../LayoutA/BlockCount';
import { FADE_DURATION } from '../consts';
import { UIBlock, UIBlockType } from '../types';
import { BtcBlockListItem } from './BtcBlockListItem';
import { StxBlockListItem } from './StxBlockListItem';

export function Blocks({
  blockList,
  isUpdateListLoading,
}: {
  blockList: UIBlock[];
  isUpdateListLoading: boolean;
}) {
  return (
    <Stack
      pl={4}
      pr={2}
      gap={0}
      width={'full'}
      style={{
        transition: `opacity ${FADE_DURATION / 1000}s`,
        opacity: isUpdateListLoading ? 0 : 1,
      }}
    >
      {blockList.map((block, i) => {
        switch (block.type) {
          case UIBlockType.StxBlock:
            const isFirstStxBlockInBurnBlock =
              i === 0 || (i > 0 && blockList[i - 1].type === UIBlockType.BurnBlock); // what is this check for? -  (i > 0 && blockList[i - 1].type === UIBlockType.BurnBlock. It's to make sure to skip Burn Blocks that dont have any stxx txs. Stacks tx should be first
            return (
              // TODO: update to use new component
              <StxBlockListItem
                key={block.hash}
                hash={block.hash}
                height={block.height}
                timestamp={block.timestamp}
                txsCount={block.txsCount}
                icon={
                  isFirstStxBlockInBurnBlock ? (
                    <Icon as={StxIcon} size={2.5} color={'white'} />
                  ) : undefined
                }
                hasBorder={i < blockList.length && blockList[i + 1].type === UIBlockType.StxBlock}
              />
            );
          case UIBlockType.BurnBlock: // TODO: update to use new component
            return (
              <BtcBlockListItem
                key={block.hash}
                hash={block.hash}
                height={block.height}
                timestamp={block.timestamp}
              />
            );
          case UIBlockType.Count:
            return <BlockCount key={block.count} count={block.count} />;
        }
      })}
    </Stack>
  );
}
