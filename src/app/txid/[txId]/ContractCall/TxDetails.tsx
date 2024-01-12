'use client';

import * as React from 'react';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { Section } from '../../../../common/components/Section';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
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
}

export const TxDetails: React.FC<TxDetailsProps> = ({ tx }) => {
  return (
    <>
      <Section title="Summary">
        <Flex width="100%" flexDirection={['column', 'column', 'row']}>
          <Box width={['100%']}>
            <ContractName tx={tx} />
            <ID tx={tx} />
            <Sender tx={tx} />
            <Fees tx={tx} />
            <Nonce tx={tx} />
            <BlockHeight tx={tx} />
            <Broadcast tx={tx} />
            <BlockHash tx={tx} />
            <NonCanonical tx={tx} />
          </Box>
        </Flex>
      </Section>
    </>
  );
};
