import { FoundResult } from '../../../common/types/search-results';
import { TxListItem } from '../../txs-list/ListItem/TxListItem';
import { NoTxs } from '../NoTxs';

interface TxResultItemProps {
  result: FoundResult;
}

export function TxListResultItem({ result }: TxResultItemProps) {
  if (!result || result.result.entity_type !== 'tx_list') return null;
  const txCount = result.result.txs?.length;
  return (
    <>
      {!result.result.txs?.length ? (
        <NoTxs />
      ) : (
        result.result.txs.map((tx, i) => {
          return (
            <TxListItem
              key={tx.tx_id}
              tx={tx}
              simple
              {...(i === txCount - 1 ? { borderBottom: 'none' } : {})}
              className={`search-bar-result-${i + 1}`}
            />
          );
        })
      )}
    </>
  );
}
