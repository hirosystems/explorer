'use client';

import { NavBlock, NavDirection } from '../../../app/btcblock/[hash]/NavBlock';
import '../../../common/components/loaders/skeleton-text';
import { Flex } from '../../../ui/Flex';
import { PageTitle } from '../../_components/PageTitle';

export function Header(
  backwardsUrl: string,
  forwardsUrl: string,
  btcBlock: any,
  prevBlock: any,
  nextBlock: any
) {
  return (
    <Flex gap={4} alignItems="center" mt={20}>
      <NavBlock
        href={`/btcblock/${prevBlock?.burn_block_hash}`}
        direction={NavDirection.Backward}
      />
      <PageTitle margin={0}>{`Block #${btcBlock?.burn_block_height.toLocaleString()}`}</PageTitle>
      <NavBlock href={`/btcblock/${nextBlock?.burn_block_hash}`} direction={NavDirection.Forward} />
    </Flex>
  );
}
