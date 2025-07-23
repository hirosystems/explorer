import { Pre } from '@/ui/typography';
import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';

export function FunctionResultType({
  tx,
}: {
  tx: ContractCallTransaction | MempoolContractCallTransaction;
}) {
  const result = tx?.tx_result;
  if (!result) return null;
  const { success, type, value } = cvToJSON(hexToCV(result.hex));
  return <Pre>{value.type}</Pre>;
}
