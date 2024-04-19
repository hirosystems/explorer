import { ArrowLeft } from '@phosphor-icons/react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { TxLink } from '../../common/components/ExplorerLinks';
import { StxPrice } from '../../common/components/StxPrice';
import { getContractName, getFunctionName, microToStacksFormatted } from '../../common/utils/utils';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { HStack } from '../../ui/HStack';

export const TxTitle = ({
  tx,
  showPrice,
  openInNewTab,
}: {
  tx: Transaction | MempoolTransaction;
  showPrice?: boolean;
  openInNewTab?: boolean;
}) => {
  switch (tx.tx_type) {
    case 'smart_contract':
      return (
        <TxLink txId={tx.tx_id} openInNewTab={openInNewTab}>
          {getContractName(tx?.smart_contract?.contract_id)}
        </TxLink>
      );
    case 'contract_call':
      return (
        <HStack alignItems="center" whiteSpace="nowrap">
          <TxLink txId={tx.tx_id} openInNewTab={openInNewTab}>
            {getFunctionName(tx)}
          </TxLink>
          <Box color={'textCaption'} size="14px">
            <ArrowLeft size="14px" />
          </Box>
          <TxLink txId={tx.contract_call.contract_id} overflow={'none'}>
            {getContractName(tx.contract_call.contract_id)}
          </TxLink>
        </HStack>
      );
    case 'token_transfer':
      return (
        <Flex flexDirection={['row']} alignItems={['center']} height={'1em'}>
          <TxLink txId={tx.tx_id} openInNewTab={openInNewTab}>
            {microToStacksFormatted(tx.token_transfer.amount)} STX
          </TxLink>
          {showPrice && <StxPrice tx={tx} value={Number(tx.token_transfer.amount)} />}
        </Flex>
      );
    case 'tenure_change':
      return (
        <Flex flexDirection={['row']} alignItems={['center']}>
          <TxLink txId={tx.tx_id} openInNewTab={openInNewTab}>
            Tenure change
          </TxLink>
        </Flex>
      );
    case 'coinbase':
      return (
        <TxLink txId={tx.tx_id} openInNewTab={openInNewTab}>
          Block #{(tx as Transaction).block_height}
        </TxLink>
      );
    default:
      return (
        <TxLink txId={tx.tx_id} openInNewTab={openInNewTab}>
          {tx.tx_id}
        </TxLink>
      );
  }
};
