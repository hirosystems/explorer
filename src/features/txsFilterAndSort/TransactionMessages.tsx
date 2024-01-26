'use client';

import React from 'react';
import { IconType } from 'react-icons';
import { LuSearchX } from 'react-icons/lu';

import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { GridProps } from '../../ui/Grid';
import { Icon } from '../../ui/Icon';
import { Text, Title } from '../../ui/typography';

const MessageBase = ({
  title,
  icon,
  description,
}: {
  title: string;
  icon: IconType;
  description?: string;
}) => {
  return (
    <Flex alignItems={'center'} flexDirection="column" p="32px">
      <Box size={'72px'} borderRadius="50%" border="1px solid" borderColor="border" mb="20px">
        <Flex
          justifyContent="center"
          alignItems="center"
          height="100%"
          width="100%"
          color="secondaryText"
        >
          <Icon as={icon} size={30} />
        </Flex>
      </Box>
      <Box textAlign="center">
        <Title mb="8px" fontSize="sm">
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
  <MessageBase title="No transactions" icon={LuSearchX} {...rest} />
);

export const AllTransactionsFilteredMessage: React.FC<GridProps> = ({ ...rest }) => (
  <MessageBase
    title="No transactions"
    description="Filters only apply to loaded transactions. Load more transactions to find transactions with your filter settings, or choose a different filter combination."
    icon={LuSearchX}
    {...rest}
  />
);
