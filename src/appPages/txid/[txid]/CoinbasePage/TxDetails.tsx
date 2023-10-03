import {
  Block,
  CoinbaseTransaction,
  MempoolCoinbaseTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { Section } from '@/components/section';
import { Box, Flex } from '@/ui/components';

import { useVerticallyStackedElementsBorderStyle } from '../../../common/styles/border';
import { BlockHash } from '../TxDetails/BlockHash';
import { BlockHeight } from '../TxDetails/BlockHeight';
import { Fees } from '../TxDetails/Fees';
import { ID } from '../TxDetails/ID';
import { NonCanonical } from '../TxDetails/NonCanonical';
import { Nonce } from '../TxDetails/Nonce';
import { Sender } from '../TxDetails/Sender';

interface TxDetailsProps {
  tx: CoinbaseTransaction | MempoolCoinbaseTransaction;
  block?: Block;
}

export function TxDetails({ tx, block }: TxDetailsProps) {
  return (
    <Section title="Summary">
      <Flex px="16px" width="100%" flexDirection={['column', 'column', 'row']}>
        <Box width={['100%']} css={useVerticallyStackedElementsBorderStyle}>
          <ID tx={tx} />
          <Sender tx={tx} />
          <Fees tx={tx} />
          <Nonce tx={tx} />
          <BlockHeight tx={tx} block={block} />
          <BlockHash tx={tx} />
          <NonCanonical tx={tx} />
        </Box>
      </Flex>
    </Section>
  );
}
