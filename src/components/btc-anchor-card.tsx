import * as React from 'react';
import { Box, FlexProps } from '@stacks/ui';
import { Rows } from '@components/rows';
import { truncateMiddle } from '@common/utils';
import { Section } from '@components/section';
import { Block } from '@stacks/stacks-blockchain-api-types';
import { Link } from '@components/typography';
import { NetworkModes } from '@common/types/network';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';

export const BtcAnchorBlockCard: React.FC<FlexProps & { block: Block }> = ({ block, ...rest }) => {
  const networkMode = useAppSelector(selectActiveNetwork).mode;
  const btcLinkPathPrefix = networkMode === NetworkModes.Testnet ? '/testnet' : '';

  return (
    <Section title="Bitcoin anchor" {...rest}>
      <Box px="base">
        <Rows
          noTopBorder
          inline
          items={[
            {
              label: {
                children: 'Bitcoin block height',
              },
              children: (
                <Link
                  as="a"
                  target="_blank"
                  href={`https://mempool.space${btcLinkPathPrefix}/block/${block.burn_block_height}`}
                >
                  #{block.burn_block_height}
                </Link>
              ),
            },
            {
              label: {
                children: 'Bitcoin block hash',
              },
              children: (
                <Link
                  as="a"
                  target="_blank"
                  href={`https://mempool.space${btcLinkPathPrefix}/block/${block.burn_block_hash.replace(
                    '0x',
                    ''
                  )}`}
                >
                  {truncateMiddle(block.burn_block_hash, 8)}
                </Link>
              ),
              copy: block?.burn_block_hash,
            },
            {
              label: {
                children: 'Anchor transaction ID',
              },
              children: (
                <Link
                  as="a"
                  target="_blank"
                  href={`https://mempool.space${btcLinkPathPrefix}/tx/${block.miner_txid.replace(
                    '0x',
                    ''
                  )}`}
                >
                  {truncateMiddle(block.miner_txid, 8)}
                </Link>
              ),
              copy: block?.miner_txid,
            },
          ]}
        />
      </Box>
    </Section>
  );
};
