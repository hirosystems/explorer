'use client';

import { Block } from '@stacks/stacks-blockchain-api-types';

import { KeyValueVertical } from '../../common/components/KeyValueVertical';
import { Section } from '../../common/components/Section';
import { useGlobalContext } from '../../common/context/useGlobalContext';
import { truncateMiddleDeprecated } from '../../common/utils/utils';
import { Text } from '../../ui/Text';
import { TextLink } from '../../ui/TextLink';

export function BtcAnchorBlockCardBase({ block }: { block?: Block }) {
  const { btcBlockBaseUrl, btcTxBaseUrl } = useGlobalContext().activeNetwork;

  if (!block) return null;

  return (
    <Section title="Bitcoin anchor">
      <KeyValueVertical
        label={'Bitcoin block height'}
        value={
          <TextLink as="a" target="_blank" href={`${btcBlockBaseUrl}/${block.burn_block_height}`}>
            <Text fontSize={'sm'} fontWeight={'medium'}>
              #{block.burn_block_height}
            </Text>
          </TextLink>
        }
        copyValue={block.burn_block_height.toString()}
      />
      <KeyValueVertical
        label={'Bitcoin block hash'}
        value={
          <TextLink
            as="a"
            target="_blank"
            href={`${btcBlockBaseUrl}/${block.burn_block_hash.replace('0x', '')}`}
          >
            <Text fontSize={'sm'} fontWeight={'medium'}>
              {truncateMiddleDeprecated(block.burn_block_hash, 8)}
            </Text>
          </TextLink>
        }
        copyValue={block.burn_block_hash}
      />
      <KeyValueVertical
        label={'Anchor transaction ID'}
        value={
          <TextLink
            as="a"
            target="_blank"
            href={`${btcTxBaseUrl}/${block.miner_txid.replace('0x', '')}`}
          >
            <Text fontSize={'sm'} fontWeight={'medium'}>
              {truncateMiddleDeprecated(block.miner_txid, 8)}
            </Text>
          </TextLink>
        }
        copyValue={block.miner_txid}
      />
    </Section>
  );
}
