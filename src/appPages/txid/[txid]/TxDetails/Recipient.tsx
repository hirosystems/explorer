import { TbArrowDownRight } from 'react-icons/tb';

import {
  MempoolTokenTransferTransaction,
  TokenTransferTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { Box, Stack, TextLink } from '@/ui/components';
import { ExplorerLink } from '@/components/links';

import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';

export function Recipient({
  tx,
}: {
  tx: TokenTransferTransaction | MempoolTokenTransferTransaction;
}) {
  return (
    <KeyValueHorizontal
      label="Recipient"
      value={
        <Stack isInline>
          <Box color="textCaption">
            <TbArrowDownRight size="16px" />
          </Box>
          <ExplorerLink
            href={`/address/${encodeURIComponent(tx.token_transfer.recipient_address)}`}
          >
            <TextLink as="a" fontSize="14px" fontWeight={500}>
              {tx.token_transfer.recipient_address}
            </TextLink>
          </ExplorerLink>
        </Stack>
      }
      copyValue={tx.token_transfer.recipient_address}
    />
  );
}
