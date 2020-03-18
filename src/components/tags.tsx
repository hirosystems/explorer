import * as React from 'react';
import { Flex, Text, FlexProps } from '@blockstack/ui';

export enum Transaction {
  CONTRACT_CREATION = 'contact_creation',
  CONTRACT_CALL = 'contract_call',
  TOKEN_TRANSFER = 'token_transfer',
  COINBASE = 'coinbase',
  POISON_MICROBLOCK = 'poison_microblock',
}
const colorMap = {
  [Transaction.CONTRACT_CREATION]: '#0F5257',
  [Transaction.CONTRACT_CALL]: '#F9A14D',
  [Transaction.TOKEN_TRANSFER]: 'blue',
  [Transaction.COINBASE]: '#6014B8',
  [Transaction.POISON_MICROBLOCK]: '#AAA9DD',
};
const labelMap = {
  [Transaction.CONTRACT_CREATION]: 'Contract creation',
  [Transaction.CONTRACT_CALL]: 'Contract call',
  [Transaction.TOKEN_TRANSFER]: 'Token transfer',
  [Transaction.COINBASE]: 'Coinbase',
  [Transaction.POISON_MICROBLOCK]: 'Poison-microblock',
};

interface TagProps extends FlexProps {
  type: Transaction;
}

const Label: React.FC = props => (
  <Text display="block" lineHeight="16px" fontSize="11px" fontWeight={600} color="white" {...props} />
);

export const Tag = ({ type, ...rest }: TagProps) => {
  return (
    <Flex
      height="24px"
      align="center"
      justify="center"
      borderRadius="24px"
      py="extra-tight"
      px="base"
      background={colorMap[type]}
      {...rest}
    >
      <Label>{labelMap[type]}</Label>
    </Flex>
  );
};
