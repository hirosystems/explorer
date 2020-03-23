import * as React from 'react';
import { Box, Flex, ChevronIcon, FlexProps, Text, BoxProps } from '@blockstack/ui';
import { Card } from '@components/card';
import { Caption, SectionTitle } from '@components/typography';
import { useHover } from 'use-events';

interface BottomButtonProps extends FlexProps {
  label: string;
  icon: React.FC;
}
const BottomButton: React.FC<BottomButtonProps> = ({ label, icon: Icon, ...props }) => {
  const [hover, bind] = useHover();
  return (
    <Flex
      borderBottomLeftRadius="12px"
      borderBottomRightRadius="12px"
      py="base"
      align="center"
      justify={['center', 'center', 'unset']}
      px="base-loose"
      cursor={hover ? 'pointer' : 'unset'}
      bg={hover ? 'ink.50' : 'transparent'}
      style={{
        userSelect: 'none',
      }}
      {...props}
      {...bind}
    >
      {Icon && (
        <Box color={hover ? 'ink.600' : 'ink.400'}>
          <Icon />
        </Box>
      )}
      <Text textStyle="body.small">{label}</Text>
    </Flex>
  );
};

const Cell = (props: FlexProps) => {
  return <Flex px="tight" direction="column" justify="center" {...props} />;
};
const Item = () => (
  <Flex flexWrap="wrap" borderBottom="1px solid" borderColor="inherit" px="base-loose" py="loose">
    <Flex align="center" pr="base">
      <Box mr="tight" size="24px" borderRadius="6px" bg={'blue'} />
      <Text>Stacks Token</Text>
    </Flex>
    <Flex flexGrow={1} justify={['space-between', 'space-between', 'space-evenly']} pt={['base', 'base', 'unset']}>
      <Cell>
        <Box>
          <Text>100,000.0000 STX</Text>
        </Box>
        <Box>
          <Caption>Transferred</Caption>
        </Box>
      </Cell>
      <Cell>
        <Box>
          <Text>SP1P7...R9GZS</Text>
        </Box>
        <Box>
          <Caption>From</Caption>
        </Box>
      </Cell>
      <Cell>
        <Box>
          <Text>SP1P7...R9GZS</Text>
        </Box>
        <Box>
          <Caption>To</Caption>
        </Box>
      </Cell>
    </Flex>
  </Flex>
);

export const TokenTransfers = (props: BoxProps) => {
  return (
    <Box mt="extra-loose" {...props}>
      <SectionTitle mb="base-loose">Token transfers</SectionTitle>
      <Card>
        <Item />
        <Item />
        <Item />
        <Item />
        <BottomButton
          icon={() => <ChevronIcon direction="down" size={6} color="currentColor" />}
          label="68 more transfers"
        />
      </Card>
    </Box>
  );
};
