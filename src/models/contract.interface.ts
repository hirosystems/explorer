export interface Contract {
  tx_id: string;
  contract_id: string;
  block_height: number;
  source_code: string;
  abi: string;
  canonical: true;
}
