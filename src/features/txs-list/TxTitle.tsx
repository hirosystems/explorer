import { Link } from '@chakra-ui/next-js';
import { useColorMode } from '@chakra-ui/react';
import { FC } from 'react';
import { TbArrowLeft } from 'react-icons/tb';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { StxPriceButton } from '../../common/components/StxPriceButton';
import { useGlobalContext } from '../../common/context/useAppContext';
import { buildUrl } from '../../common/utils/buildUrl';
import { getContractName, getFunctionName, microToStacksFormatted } from '../../common/utils/utils';
import { Box, BoxProps } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { HStack } from '../../ui/HStack';

export const TxTitle = (
  tx: Transaction | MempoolTransaction,
  txHref: string,
  showPrice?: boolean,
  openInNewTab?: boolean
) => {
  const network = useGlobalContext().activeNetwork;
  const TxLink: FC<{ href?: string } & BoxProps> = ({ href = txHref, ...rest }) => (
    <Box
      as={Link}
      href={href}
      {...(openInNewTab && { target: '_blank' })}
      textOverflow={'ellipsis'}
      overflow={'hidden'}
      whiteSpace={'nowrap'}
      display={'block'}
      color={`links.${useColorMode().colorMode}`}
      _hover={{ color: `links.${useColorMode().colorMode}`, textDecoration: 'underline' }}
      {...rest}
    />
  );
  switch (tx.tx_type) {
    case 'smart_contract':
      return (
        <TxLink>
          {getContractName(tx?.smart_contract?.contract_id)}
          <Box display={['none', 'none', 'inline']}>: {tx.tx_id}</Box>
        </TxLink>
      );
    case 'contract_call':
      return (
        <HStack alignItems="center">
          <TxLink>
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
          <TxLink>
            {microToStacksFormatted(tx.token_transfer.amount)} STX
            <Box display={['none', 'none', 'inline']}>: {tx.tx_id}</Box>
          </TxLink>
          {showPrice && <StxPriceButton tx={tx} value={Number(tx.token_transfer.amount)} />}
        </Flex>
      );
    // case 'tenure_change':
    //   return (
    //     <Flex flexDirection={['row']} alignItems={['center']}>
    //       <TxLink>
    //         Tenure change
    //         <Box display={['none', 'none', 'inline']}>: {tx.tx_id}</Box>
    //       </TxLink>
    //     </Flex>
    //   );
    case 'coinbase':
      return (
        <TxLink>
          Block #{(tx as Transaction).block_height} coinbase
          <Box display={['none', 'none', 'inline']}>: {tx.tx_id}</Box>
        </TxLink>
      );
    default:
      return <TxLink>{tx.tx_id}</TxLink>;
  }
};
