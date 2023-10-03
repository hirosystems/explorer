import { TbArrowUpRight } from 'react-icons/tb';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { Box, Stack, TextLink } from '@/ui/components';
import { ExplorerLink } from '@/components/links';

import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { getSenderName } from '../utils';

export function Sender({ tx }: { tx: Transaction | MempoolTransaction }) {
  return (
    <KeyValueHorizontal
      label={getSenderName(tx.tx_type)}
      value={
        <Stack isInline>
          <Box color="textCaption">
            <TbArrowUpRight size="16px" />
          </Box>
          <ExplorerLink href={`/address/${encodeURIComponent(tx.sender_address)}`}>
            <TextLink as="a" fontSize="14px" fontWeight={500}>
              {tx.sender_address}
            </TextLink>
          </ExplorerLink>
        </Stack>
      }
      copyValue={tx.sender_address}
    />
  );
}
