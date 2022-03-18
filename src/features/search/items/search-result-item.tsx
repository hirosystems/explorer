import React from 'react';
import { FoundResult, SearchResultType } from '@common/types/search-results';
import { AddressResultItem } from '@features/search/items/address-result-item';
import { TxResultItem } from '@features/search/items/tx-result-item';
import { BlockResultItem } from '@features/search/items/block-result-item';

interface SearchResultItemProps {
  result: FoundResult;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ result }) => {
  switch (result.result.entity_type) {
    case SearchResultType.BlockHash:
      return <BlockResultItem result={result} />;
    case SearchResultType.ContractAddress:
    case SearchResultType.MempoolTxId:
    case SearchResultType.TxId:
      return <TxResultItem result={result} />;
    case SearchResultType.StandardAddress:
      return <AddressResultItem result={result} />;
  }
};
