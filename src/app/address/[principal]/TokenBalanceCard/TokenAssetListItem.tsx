'use client';

import React from 'react';

import { NonFungibleTokenHolding } from '@stacks/stacks-blockchain-api-types/generated';
import { IntCV, hexToCV } from '@stacks/transactions';

import { TokenLink } from '../../../../common/components/ExplorerLinks';
import { TwoColsListItem } from '../../../../common/components/TwoColumnsListItem';
import { FtTokenAmount, NftTokenAmount } from '../../../../common/components/balances/TokenAmount';
import { FtTokenSymbol, NftTokenSymbol } from '../../../../common/components/balances/TokenSymbol';
import { getAssetNameParts, initBigNumber } from '../../../../common/utils/utils';
import { FlexProps } from '../../../../ui/Flex';
import { FtAvatar } from './FtAvatar';
import { NftAvatar } from './NftAvatar';

interface TokenAssetListItemProps extends FlexProps {
  amount: string;
  token: string;
  tokenType: 'non_fungible_tokens' | 'fungible_tokens';
  bnsName?: string;
  holdings?: NonFungibleTokenHolding[];
}

export const TokenAssetListItem: React.FC<TokenAssetListItemProps> = ({
  amount,
  token,
  tokenType,
  bnsName,
  holdings,
}) => {
  const { address, asset, contract } = getAssetNameParts(token);
  const contractId = `${address}.${contract}`;
  const firstNftValue = !!holdings?.length
    ? (hexToCV(holdings[0].value.hex) as IntCV).value
    : undefined;

  if (initBigNumber(amount).isLessThanOrEqualTo(0)) return null;

  return (
    <TwoColsListItem
      icon={
        tokenType === 'non_fungible_tokens' ? (
          <NftAvatar
            asset={asset}
            token={token}
            contractId={contractId}
            firstNftValue={firstNftValue}
          />
        ) : (
          <FtAvatar token={token} contractId={contractId} />
        )
      }
      leftContent={{
        title: <TokenLink tokenId={`${address}.${contract}`}>{bnsName || asset}</TokenLink>,
        subtitle:
          tokenType === 'non_fungible_tokens' ? (
            <NftTokenSymbol asset={asset} />
          ) : (
            <FtTokenSymbol asset={asset} contractId={contractId} />
          ),
      }}
      rightContent={{
        title:
          tokenType === 'non_fungible_tokens' ? (
            <NftTokenAmount amount={amount} />
          ) : (
            <FtTokenAmount amount={amount} contractId={contractId} />
          ),
        subtitle: null,
      }}
    />
  );
};
