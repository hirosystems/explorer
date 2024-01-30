import { TbArrowLeft } from 'react-icons/tb';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { StxPrice } from '../../common/components/StxPrice';
import { useGlobalContext } from '../../common/context/useAppContext';
import { buildUrl } from '../../common/utils/buildUrl';
import { getContractName, getFunctionName, microToStacksFormatted } from '../../common/utils/utils';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { HStack } from '../../ui/HStack';
import { TxLink } from '../../ui/TxLink';

export const TxTitle = (
  tx: Transaction | MempoolTransaction,
  txHref: string,
  showPrice?: boolean,
  openInNewTab?: boolean
) => {
  const network = useGlobalContext().activeNetwork;
  switch (tx.tx_type) {
    case 'smart_contract':
      return (
        <TxLink href={txHref} openInNewTab={openInNewTab}>
          {getContractName(tx?.smart_contract?.contract_id)}
          <Box display={['none', 'none', 'inline']}>: {tx.tx_id}</Box>
        </TxLink>
      );
    case 'contract_call':
      return (
        <HStack alignItems="center">
          <TxLink href={txHref} openInNewTab={openInNewTab}>
            {getFunctionName(tx)}
            <Box display={['none', 'none', 'inline']}>: {tx.tx_id}</Box>
          </TxLink>
          <Box color={'textCaption'} size="14px">
            <TbArrowLeft size="14px" />
          </Box>
          <TxLink
            href={buildUrl(`/txid/${tx.contract_call.contract_id}`, network)}
            overflow={'none'}
          >
            {getContractName(tx.contract_call.contract_id)}
          </TxLink>
        </HStack>
      );
    case 'token_transfer':
      return (
        <Flex flexDirection={['row']} alignItems={['center']} height={'1em'}>
          <TxLink href={txHref} openInNewTab={openInNewTab}>
            {microToStacksFormatted(tx.token_transfer.amount)} STX
          </TxLink>
          {showPrice && <StxPrice tx={tx} value={Number(tx.token_transfer.amount)} />}
        </Flex>
      );
    case 'tenure_change':
      return (
        <Flex flexDirection={['row']} alignItems={['center']}>
          <TxLink href={txHref} openInNewTab={openInNewTab}>
            Tenure change
            <Box display={['none', 'none', 'inline']}>: {tx.tx_id}</Box>
          </TxLink>
        </Flex>
      );
    case 'coinbase':
      return (
        <TxLink href={txHref} openInNewTab={openInNewTab}>
          Block #{(tx as Transaction).block_height} coinbase
          <Box display={['none', 'none', 'inline']}>: {tx.tx_id}</Box>
        </TxLink>
      );
    default:
      return (
        <TxLink href={txHref} openInNewTab={openInNewTab}>
          {tx.tx_id}
        </TxLink>
      );
  }
};
