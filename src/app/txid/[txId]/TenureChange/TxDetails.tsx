import * as React from 'react';

import {
  MempoolTenureChangeTransaction,
  TenureChangeTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { KeyValueHorizontal } from '../../../../common/components/KeyValueHorizontal';
import { Section } from '../../../../common/components/Section';
import { Value } from '../../../../common/components/Value';
import { capitalize } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { BlockHash } from '../TxDetails/BlockHash';
import { BlockHeight } from '../TxDetails/BlockHeight';
import { Fees } from '../TxDetails/Fees';
import { ID } from '../TxDetails/ID';
import { NonCanonical } from '../TxDetails/NonCanonical';
import { Nonce } from '../TxDetails/Nonce';
import { Sender } from '../TxDetails/Sender';

interface TxDetailsProps {
  tx: TenureChangeTransaction | MempoolTenureChangeTransaction;
}

export const TxDetails: React.FC<TxDetailsProps> = ({ tx }) => {
  const tenureChangePayload: Record<string, string | number> = tx.tenure_change_payload || {};
  return (
    <>
      <Section title="Summary">
        <Flex width="100%" flexDirection={['column', 'column', 'row']}>
          <Box width={['100%']}>
            <Sender tx={tx} />
            <ID tx={tx} />
            <Fees tx={tx} />
            <Nonce tx={tx} />
            <BlockHeight tx={tx} />
            <BlockHash tx={tx} />
            <NonCanonical tx={tx} />
            {Object.keys(tenureChangePayload).map(key => {
              return (
                <KeyValueHorizontal
                  label={capitalize(key.replaceAll('_', ' '))}
                  value={<Value>{tenureChangePayload[key]}</Value>}
                />
              );
            })}
          </Box>
        </Flex>
      </Section>
    </>
  );
};
