import { Block } from '@stacks/stacks-blockchain-api-types';
import { useGlobalContext } from '@/common/context/useAppContext';
import { NetworkModes } from '@/common/types/network';
import { truncateMiddle } from '@/common/utils';
import { Section } from '@/components/section';
import { Box, TextLink } from '@/ui/components';
import { Text } from '@/ui/typography';

import { KeyValueVertical } from '../../../common/components/KeyValueVertical';
import { useVerticallyStackedElementsBorderStyle } from '../../../common/styles/border';

export function BtcAnchorBlockCard({ block }: { block: Block }) {
  const networkMode = useGlobalContext().activeNetwork.mode;
  const btcLinkPathPrefix = networkMode === NetworkModes.Testnet ? '/testnet' : '';

  return (
    <Section title="Bitcoin anchor">
      <Box px="16px" css={useVerticallyStackedElementsBorderStyle}>
        <KeyValueVertical
          label="Bitcoin block height"
          value={
            <TextLink
              as="a"
              target="_blank"
              href={`https://mempool.space${btcLinkPathPrefix}/block/${block.burn_block_height}`}
            >
              <Text fontSize="14px" fontWeight={500}>
                #{block.burn_block_height}
              </Text>
            </TextLink>
          }
          copyValue={block.burn_block_height.toString()}
        />
        <KeyValueVertical
          label="Bitcoin block hash"
          value={
            <TextLink
              as="a"
              target="_blank"
              href={`https://mempool.space${btcLinkPathPrefix}/block/${block.burn_block_hash.replace(
                '0x',
                ''
              )}`}
            >
              <Text fontSize="14px" fontWeight={500}>
                {truncateMiddle(block.burn_block_hash, 8)}
              </Text>
            </TextLink>
          }
          copyValue={block.burn_block_hash}
        />
        <KeyValueVertical
          label="Anchor transaction ID"
          value={
            <TextLink
              as="a"
              target="_blank"
              href={`https://mempool.space${btcLinkPathPrefix}/tx/${block.miner_txid.replace(
                '0x',
                ''
              )}`}
            >
              <Text fontSize="14px" fontWeight={500}>
                {truncateMiddle(block.miner_txid, 8)}
              </Text>
            </TextLink>
          }
          copyValue={block.miner_txid}
        />
      </Box>
    </Section>
  );
}
