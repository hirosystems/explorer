import { AiOutlineClockCircle } from 'react-icons/ai';
import { Block, MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { toRelativeTime } from '@/common/utils';
import { BtcStxBlockLinks } from '@/components/btc-stx-block-links';
import { Box, Flex, Icon, Tooltip } from '@/ui/components';
import { useMediaQuery } from '@/ui/hooks/useMediaQuery';

import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { Value } from '../../../common/components/Value';
import { isInMempool, isInMicroblock } from '../utils';

export function BlockHeight({
  tx,
  block,
}: {
  tx: Transaction | MempoolTransaction;
  block?: Block;
}) {
  const [isOnTouchScreen] = useMediaQuery('(hover: none)');

  if (isInMempool(tx) || isInMicroblock(tx)) return null;

  const ts = tx.parent_burn_block_time || tx.burn_block_time;
  if (!ts) return null;

  const readableTs = `${new Date(ts * 1000).toLocaleTimeString()} ${new Date(
    ts * 1000
  ).toLocaleDateString()}`;

  return (
    <KeyValueHorizontal
      label="Block height"
      value={
        <>
          <BtcStxBlockLinks
            btcBlockHeight={block?.burn_block_height}
            stxBlockHeight={tx.block_height}
            stxBlockHash={tx.block_hash}
          />
          <Box ml="16px">
            {isOnTouchScreen ? (
              <Flex alignItems="center">
                <Icon as={AiOutlineClockCircle} size="16px" mr="4px" />
                <Value>
                  {toRelativeTime(ts * 1000)} - {readableTs}
                </Value>
              </Flex>
            ) : (
              <Tooltip label={readableTs}>
                <Flex alignItems="center">
                  <Icon as={AiOutlineClockCircle} size="16px" mr="4px" />
                  <Value>{toRelativeTime(ts * 1000)}</Value>
                </Flex>
              </Tooltip>
            )}
          </Box>
        </>
      }
      copyValue={readableTs}
    />
  );
}
