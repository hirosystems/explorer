import { BlockLink } from '@/common/components/ExplorerLinks';
import { useGlobalContext } from '@/common/context/useGlobalContext';
import { truncateHex } from '@/common/utils/utils';
import { BlockHeightBadge } from '@/ui/Badge';
import { Link } from '@/ui/Link';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';

import { CoinbaseTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { useTxBlock } from '../useTxBlock';
import { SummaryItemLabel, SummaryItemValue } from './tx-summary/TxSummary';

export function DetailsCard({ tx }: { tx: Transaction }) {
  const items = getDetailsCardItems(tx);
  const title = getDetailsCardTitle(tx);

  return (
    <Stack
      p={5}
      borderRadius="redesign.xl"
      bg="surfaceSecondary"
      border="1px solid"
      borderColor="redesignBorderSecondary"
      gap={4}
      h="fit-content"
    >
      <Text textStyle="text-medium-sm" color="textPrimary">
        {title}
      </Text>
      {items}
    </Stack>
  );
}

function getDetailsCardTitle(tx: Transaction) {
  if (tx.tx_type === 'coinbase') return 'Burn block details';
  if (tx.tx_type === 'token_transfer') return null;
  if (tx.tx_type === 'smart_contract') return null;
  if (tx.tx_type === 'contract_call') return null;
  if (tx.tx_type === 'tenure_change') return null;
  if (tx.tx_type === 'poison_microblock') return null;
  return null;
}

function getDetailsCardItems(tx: Transaction) {
  if (tx.tx_type === 'coinbase') return <CoinbaseDetailsCardItems tx={tx as CoinbaseTransaction} />;
  return null;
}

export function SummaryItem({
  label,
  value,
  valueRenderer,
  showCopyButton,
}: {
  label: string;
  value: string;
  valueRenderer?: (value: string) => React.ReactNode;
  showCopyButton?: boolean;
}) {
  return (
    <>
      <Stack gap={0.5}>
        <SummaryItemLabel label={label} />
        <SummaryItemValue
          value={value}
          label={label}
          valueRenderer={valueRenderer}
          showCopyButton={showCopyButton}
        />
      </Stack>
    </>
  );
}

function CoinbaseDetailsCardItems({ tx }: { tx: CoinbaseTransaction }) {
  const { data: block } = useTxBlock(tx);
  const { btcTxBaseUrl } = useGlobalContext().activeNetwork;

  return (
    <>
      <SummaryItem
        label="Block height"
        value={block?.burn_block_height?.toString()}
        valueRenderer={value => <BlockHeightBadge blockType="btc" blockHeight={Number(value)} />}
        showCopyButton={true}
      />
      <SummaryItem
        label="Block hash"
        value={block?.burn_block_hash}
        valueRenderer={value => (
          <BlockLink hash={value} wordBreak="break-all">
            {truncateHex(value, 3, 4)}
          </BlockLink>
        )}
        showCopyButton={true}
      />
      {block?.miner_txid && (
        <SummaryItem
          label="Anchor transaction ID"
          value={block?.miner_txid}
          valueRenderer={value => (
            <Link
              href={`${btcTxBaseUrl}/${block?.miner_txid.replace('0x', '')}`}
              target="_blank"
              wordBreak="break-all"
            >
              {truncateHex(value, 3, 4)}
            </Link>
          )}
          showCopyButton={true}
        />
      )}
    </>
  );
}
