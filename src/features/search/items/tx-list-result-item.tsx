import { FoundResult } from '../../../common/types/search-results';
import { TxListItem } from '../../txs-list/ListItem/TxListItem';
import { SearchErrorMessage } from '../dropdown/error-message';

interface TxResultItemProps {
  result: FoundResult;
}

export function TxListResultItem({ result }: TxResultItemProps) {
  if (!result || result.result.entity_type !== 'tx_list') return null;
  return (
    <>
      {!result.result.txs?.length ? (
        <SearchErrorMessage message={'No transactions found for this search.'} />
      ) : (
        result.result.txs.map(tx => {
          return <TxListItem key={tx.tx_id} tx={tx} />;
        })
      )}
    </>
  );
}
