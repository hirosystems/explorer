import React from 'react';
import { Box, BoxProps } from '@blockstack/ui';
import { TransactionTitle, TitleProps } from '@components/transaction-title';

export const PageWrapper: React.FC<BoxProps> = props => (
  <Box pb="extra-loose" mb="extra-loose" px="base" maxWidth="1100px" mx="auto" pt={16} {...props} />
);

export const PageTop: React.FC<TitleProps> = ({ status, type, ...props }) => (
  <Box width="100%" {...props}>
    <TransactionTitle mb="extra-loose" status={status} type={type} />
  </Box>
);

export const Page: React.FC = ({ children }) => (
  <Box as="main" maxWidth="1280px" mx="auto">
    <Box mx={['base', 'extra-loose']}>{children}</Box>
  </Box>
);
