import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

export type StxTransfers = AddressTransactionWithTransfers['stx_transfers'];
export type FtTransfers = AddressTransactionWithTransfers['ft_transfers'];
export type NftTransfers = AddressTransactionWithTransfers['nft_transfers'];
