import { Account as AccountPayload } from '@blockstack/rpc-client';

export interface FaucetResponse {
  txId?: string;
  txRaw?: string;
  success: boolean;
}
export interface Account extends AccountPayload {
  principal: string;
  transactions?: FaucetResponse[];
}

export interface IdentityPayload {
  publicKey: string;
  privateKey: string;
  address: string;
}

export type { AccountPayload };
