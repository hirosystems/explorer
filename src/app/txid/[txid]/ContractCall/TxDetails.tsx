import { Section } from '@/components/section';
import { Box, Flex } from '@/ui/components';
import * as React from 'react';

import {
  Block,
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { useVerticallyStackedElementsBorderStyle } from '../../../common/styles/border';
import { BlockHash } from '../TxDetails/BlockHash';
import { BlockHeight } from '../TxDetails/BlockHeight';
import { Broadcast } from '../TxDetails/Broadcast';
import { ContractName } from '../TxDetails/ContractName';
import { Fees } from '../TxDetails/Fees';
import { ID } from '../TxDetails/ID';
import { NonCanonical } from '../TxDetails/NonCanonical';
import { Nonce } from '../TxDetails/Nonce';
import { Sender } from '../TxDetails/Sender';

interface TxDetailsProps {
  tx: ContractCallTransaction | MempoolContractCallTransaction;
  block?: Block;
}

export const TxDetails: React.FC<TxDetailsProps> = ({ tx, block }) => {
  return (
    <>
      <Section title="Summary">
        <Flex px="16px" width="100%" flexDirection={['column', 'column', 'row']}>
          <Box width={['100%']} css={useVerticallyStackedElementsBorderStyle}>
            <ContractName tx={tx} />
            <ID tx={tx} />
            <Sender tx={tx} />
            <Fees tx={tx} />
            <Nonce tx={tx} />
            <BlockHeight tx={tx} block={block} />
            <Broadcast tx={tx} />
            <BlockHash tx={tx} />
            <NonCanonical tx={tx} />
          </Box>
        </Flex>
      </Section>
    </>
  );
};
