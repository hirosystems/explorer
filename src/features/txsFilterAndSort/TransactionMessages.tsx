'use client';

import { Box, Flex, GridProps, Icon } from '@chakra-ui/react';
import { XCircle } from '@phosphor-icons/react';
import React, { ReactNode } from 'react';

import { Text } from '../../ui/Text';
import { Title } from '../../ui/typography';

const MessageBase = ({
  title,
  icon,
  description,
}: {
  title: string;
  icon: ReactNode;
  description?: string;
}) => {
  return (
    <Flex alignItems={'center'} flexDirection="column" p={8}>
      <Box
        h={'72px'}
        w={'72px'}
        borderRadius="50%"
        border={`1px solid var(--stacks-colors-border-secondary)`}
        mb={5}
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          height="100%"
          width="100%"
          color="textSubdued"
        >
          <Icon h={30} w={30}>
            {icon}
          </Icon>
        </Flex>
      </Box>
      <Box textAlign="center">
        <Title mb={2} fontSize="sm">
          {title}
        </Title>
        {description ? (
          <Text fontSize={'xs'} maxWidth="30ch" mx="auto" lineHeight="1.8">
            {description}
          </Text>
        ) : null}
      </Box>
    </Flex>
  );
};

export const NoTransactionsMessage: React.FC<GridProps> = ({ ...rest }) => (
  <MessageBase title="No transactions" icon={<XCircle />} {...rest} />
);

export const AllTransactionsFilteredMessage: React.FC<GridProps> = ({ ...rest }) => (
  <MessageBase
    title="No transactions"
    description="Filters only apply to loaded transactions. Load more transactions to find transactions with your filter settings, or choose a different filter combination."
    icon={<XCircle />}
    {...rest}
  />
);
