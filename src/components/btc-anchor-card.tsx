import * as React from 'react';
import { Box, FlexProps } from '@stacks/ui';
import { Rows } from '@components/rows';
import { truncateMiddle } from '@common/utils';
import { Section } from '@components/section';
import { Block } from '@stacks/stacks-blockchain-api-types';
import { Link } from '@components/typography';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { NetworkModes } from '@common/types/network';

export const BtcAnchorBlockCard: React.FC<FlexProps & { block: Block }> = ({ block, ...rest }) => {
  const mode = useNetworkMode();
  const path = mode === NetworkModes.Testnet ? '-testnet' : '';
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
              children: `#${block.burn_block_height}`,
            },
            {
              label: {
                children: 'Bitcoin block hash',
              },
              children: (
                <Link
                  as="a"
                  target="_blank"
                  href={`https://www.blockchain.com/btc${path}/block/${block.burn_block_hash.replace(
                    '0x',
                    ''
                  )}?utm_source=stacks_explorer`}
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
                  href={`https://www.blockchain.com/btc${path}/tx/${block.miner_txid.replace(
                    '0x',
                    ''
                  )}?utm_source=stacks_explorer`}
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
