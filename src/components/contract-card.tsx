import * as React from 'react';
import { Box, Flex, FlexProps, Text } from '@blockstack/ui';
import { Card } from '@components/card';
import { CodeIcon } from '@components/svg';
import { useHover } from 'use-events';

const ContractCardButton: React.FC<FlexProps> = props => {
  const [hover, bind] = useHover();
  return (
    <Flex
      borderBottomLeftRadius="12px"
      borderBottomRightRadius="12px"
      py="base"
      align="center"
      justify="center"
      borderTop="1px solid"
      cursor={hover ? 'pointer' : 'unset'}
      bg={hover ? 'ink.50' : 'transparent'}
      borderColor="inherit"
      style={{
        userSelect: 'none',
      }}
      {...props}
      {...bind}
    >
      <CodeIcon mr="tight" />
      <Text textStyle="body.small">View contract</Text>
    </Flex>
  );
};

interface ContractCardProps extends FlexProps {
  title: string;
  meta: string;
  icon?: string;
}

export const ContractCard: React.FC<ContractCardProps> = ({ title, meta }) => {
  return (
    <Card
      flexShrink={['unset', 'unset', 0]}
      width={['100%', '100%', '262px']}
      height={['unset', 'unset', '262px']}
    >
      <Flex
        px="base"
        py="base"
        flexGrow={1}
        align="center"
        direction={['row', 'row', 'column']}
        justify={['flex-start', 'flex-start', 'center']}
      >
        <Box
          mt={['unset', 'unset', 'base-tight']}
          mb={['unset', 'unset', 'base']}
          mr={['base-tight', 'base-tight', 'unset']}
          size={10}
          borderRadius="12px"
          bg="blue"
        />
        <Box textAlign={['left', 'left', 'center']}>
          <Text width="100%" textStyle="body.large.medium" display="block">
            {title}
          </Text>
          <Text width="100%" textStyle="body.small" color="ink.600" display="block">
            {meta}
          </Text>
        </Box>
      </Flex>
      <ContractCardButton />
    </Card>
  );
};
