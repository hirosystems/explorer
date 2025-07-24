import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';
import { cvToJSON, hexToCV } from '@stacks/transactions';

import { Pre } from '../Pre';

export function FunctionResultType({ tx }: { tx: ContractCallTransaction }) {
  const result = tx.tx_result;
  const { value } = cvToJSON(hexToCV(result.hex));
  return <Pre>{value.type}</Pre>;
}
