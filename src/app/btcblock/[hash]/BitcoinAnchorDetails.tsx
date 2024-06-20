'use client';

import styled from '@emotion/styled';

import { useParamsBlockHash } from '../../../app/block/[hash]/useParamsBlockHash';
import { KeyValueVertical } from '../../../common/components/KeyValueVertical';
import { Section } from '../../../common/components/Section';
import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { useSuspenseBurnBlock } from '../../../common/queries/useBurnBlock';
import { toRelativeTime, truncateMiddle } from '../../../common/utils/utils';
import { Flex } from '../../../ui/Flex';
import { Link } from '../../../ui/Link';
import { Text } from '../../../ui/Text';
import BitcoinIcon from '../../../ui/icons/BitcoinIcon';
import { ExplorerErrorBoundary } from '../../_components/ErrorBoundary';

const StyledSection = styled(Section)`
  .key-value-vertical:not(:last-child) {
    border-bottom: 1px solid var(--stacks-colors-borderSecondary);
  }
`;

export function BitcoinAnchorDetailsBase() {
  const { data: btcBlock } = useSuspenseBurnBlock(useParamsBlockHash(), {
    refetchOnWindowFocus: true,
  });

  const { btcBlockBaseUrl, btcTxBaseUrl } = useGlobalContext().activeNetwork;
  const btcBlockBlockTimeUTC = new Date(btcBlock.burn_block_time_iso).toUTCString();

  if (!btcBlock) return null;

  return (
    <StyledSection title="Bitcoin anchor details">
      <KeyValueVertical
        className="key-value-vertical"
        label={'Block height'}
        value={
          <Link target="_blank" href={`${btcBlockBaseUrl}/${btcBlock.burn_block_height}`}>
            <Flex alignItems="center" gap={2}>
              <BitcoinIcon height={5} width={5} />
              <Text fontSize="sm" fontWeight="medium">
                #{btcBlock.burn_block_height}
              </Text>
            </Flex>
          </Link>
        }
        copyValue={btcBlock.burn_block_height.toString()}
      />
      <KeyValueVertical
        className="key-value-vertical"
        label={'Hash'}
        value={
          <Link
            target="_blank"
            href={`${btcBlockBaseUrl}/${btcBlock.burn_block_hash.replace('0x', '')}`}
          >
            <Text fontSize="sm" fontWeight="medium">
              {truncateMiddle(btcBlock.burn_block_hash, 8)}
            </Text>
          </Link>
        }
        copyValue={btcBlock.burn_block_hash}
      />
      <KeyValueVertical
        className="key-value-vertical"
        label={'Anchor transaction ID'}
        value={
          <Link
            target="_blank"
            href={`${btcTxBaseUrl}/${btcBlock.burn_block_hash.replace('0x', '')}`}
          >
            <Text fontSize="sm" fontWeight="medium">
              {truncateMiddle(btcBlock.burn_block_hash, 8)}
            </Text>
          </Link>
        }
        copyValue={btcBlock.burn_block_hash}
      />
      <KeyValueVertical
        className="key-value-vertical"
        label={'Timestamp'}
        value={
          <Text fontSize="sm" fontWeight="medium">
            {toRelativeTime(btcBlock.burn_block_time * 1000)}

            <Text fontSize="sm" fontWeight="medium" color="textSubdued">
              {btcBlockBlockTimeUTC}
            </Text>
          </Text>
        }
        copyValue={btcBlockBlockTimeUTC}
      />
      <KeyValueVertical
        className="key-value-vertical"
        label={'Total Stacks blocks included'}
        value={
          <Text fontSize="sm" fontWeight="medium">
            {btcBlock.stacks_blocks.length}
          </Text>
        }
      />
      {/** TODO: rethink this. getting total stx txs would require querying for all stx blocks upfront, which means we wouldn't need a load more button */}
      {/* <KeyValueVertical
        className="key-value-vertical"
        label={'Total Stacks transactions included'}
        value={
          <Text fontSize="sm" fontWeight="medium">
            2421
          </Text>
        }
      /> */}
      {/** TODO: the API doesn't currently support this */}
      {/* <KeyValueVertical
        className="key-value-vertical"
        label={'Average Stacks block time'}
        value={
          <Text fontSize="sm" fontWeight="medium">
            23 seconds
          </Text>
        }
      /> */}
    </StyledSection>
  );
}

export function BitcoinAnchorDetails() {
  return (
    <ExplorerErrorBoundary>
      <BitcoinAnchorDetailsBase />
    </ExplorerErrorBoundary>
  );
}
