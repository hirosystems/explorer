export interface Fees {
  amount: string | number;
  currency: string;
}

export interface TxSchema {
  txid: string;
  sender: string;
  recipient: string;
  type: number;
  fees: Fees;
  block: number;
  post_conditions: string;
  sponsored: boolean;
  state: string;
  timestamp: number;
}
