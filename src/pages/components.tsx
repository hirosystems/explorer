import React from 'react';
import { Tag } from '@components/tags';
import { Status, Statuses } from '@components/status';
import { TransactionTitle } from '@components/transaction-title';

import { Box, Flex, Stack, Text, BoxProps } from '@blockstack/ui';
import { TransactionType } from '@models/transaction.interface';

const BoxWrapper = ({
  children,
  label,
  childrenProps = {},
  ...props
}: { label: string; childrenProps?: any } & BoxProps) => (
  <Box px="base" {...props}>
    <Box mb="tight" borderBottom="1px solid" borderColor="inherit" pb="tight">
      <Text fontWeight="600" fontSize="12px">
        {label}
      </Text>
    </Box>
    <Box {...childrenProps}>{children}</Box>
  </Box>
);

const TitleComponents: React.FC = props => {
  return (
    <BoxWrapper
      childrenProps={{ as: Flex, flexWrap: 'wrap', maxWidth: '500px' }}
      label="Title"
      {...props}
    >
      {Object.keys(TransactionType).map(label =>
        Object.keys(Statuses).map(status => (
          <TransactionTitle
            type={TransactionType[label as keyof typeof TransactionType]}
            status={Statuses[status as keyof typeof Statuses]}
            mb="tight"
            mr="base"
          />
        ))
      )}
    </BoxWrapper>
  );
};

const TagComponents: React.FC = props => (
  <BoxWrapper label="Transaction Tags" {...props}>
    <Stack spacing="loose">
      {Object.keys(TransactionType).map(label => (
        <Tag type={TransactionType[label as keyof typeof TransactionType]} />
      ))}
    </Stack>
  </BoxWrapper>
);

const StatusComponents: React.FC = props => (
  <BoxWrapper label="Transaction Statuses" {...props}>
    <Stack spacing="loose">
      {Object.keys(Statuses).map(label => (
        <Status status={Statuses[label as keyof typeof Statuses]} />
      ))}
    </Stack>
  </BoxWrapper>
);

const Components: React.FC = () => (
  <Flex height="100vh" width="100%" align="flex-start" py="loose" justify="center">
    <Stack isInline>
      <Box>
        <TitleComponents />
      </Box>
      <TagComponents />
      <StatusComponents />
    </Stack>
  </Flex>
);

export default Components;
