import * as React from 'react';
import { Box, BoxProps, ChevronIcon, Stack, Flex } from '@blockstack/ui';
import { CodeAccordian } from '@components/code-accordian';

import { Card } from '@components/card';
import { Caption, Text, Pre, SectionTitle } from '@components/typography';
import { Row } from '@components/rows/row';
import { PostCondition } from '@blockstack/stacks-blockchain-sidecar-types';
import { useHover } from 'use-events';
import { ValueWrapped } from '@components/token-transfer/item';

import { InfoIcon } from '@components/svg';
const getConditionType = (type: PostCondition['type']) => {
  switch (type) {
    case 'fungible':
      return 'FT';
    case 'non_fungible':
      return 'NFT';
    case 'stx':
      return 'STX';
  }
};

const Condition = ({
  condition,
  index: key,
  length,
}: {
  condition: PostCondition;
  index: number;
  length: number;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const isLast = key === length - 1;

  const handleOpen = React.useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isOpen]);
  const [hover, bind] = useHover();

  const note = (
    <Flex
      bg="var(--colors-bg)"
      color="var(--colors-text-caption)"
      p="base"
      borderTop="1px solid"
      borderBottom={!isLast ? '1px solid' : 'unset'}
      borderColor={['ink.800', 'ink.800', 'var(--colors-border)']}
      align="center"
      borderBottomRightRadius={isLast ? '12px' : 'unset'}
      borderBottomLeftRadius={isLast ? '12px' : 'unset'}
      as="a"
      // @ts-ignore
      href="https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md#transaction-post-conditions"
      target="_blank"
      _hover={{
        bg: 'var(--colors-bg-light)',
        color: 'var(--colors-accent)',
      }}
    >
      <Box opacity={0.3} mr="tight">
        <InfoIcon size="12px" />
      </Box>
      <Caption color="currentColor">Click here to learn more about post conditions.</Caption>
    </Flex>
  );
  return (
    <React.Fragment key={key}>
      <Row
        borderBottom={isLast && !isOpen ? 'unset' : '1px solid var(--colors-border)'}
        pl="base"
        onClick={handleOpen}
        _hover={{
          cursor: 'pointer',
        }}
        {...bind}
      >
        <Stack width="100%" isInline>
          <Flex pr="base" align="center" width="calc(33.333%)" flexShrink={0}>
            <Pre>{condition.condition_code}</Pre>
          </Flex>
          <Flex align="center" width="calc(33.333%)" flexShrink={0}>
            <Text>
              {'address' in condition.principal ? (
                <ValueWrapped offset={4} truncate value={condition.principal.address} />
              ) : null}
            </Text>
          </Flex>
          <Flex align="center" width="calc(33.333% - 38px)" flexShrink={0}>
            <Text>
              {condition.type === 'stx' ? condition.amount + ' ' : null}
              {getConditionType(condition.type)}
            </Text>
          </Flex>
          <Flex
            align="center"
            justify="center"
            width="48px"
            flexShrink={0}
            color="var(--colors-invert)"
            opacity={hover ? 1 : 0.5}
          >
            <ChevronIcon size="32px" direction={isOpen ? 'up' : 'down'} />
          </Flex>
        </Stack>
      </Row>
      <CodeAccordian isLast={isLast} code={condition} isOpen={isOpen} note={note} />
    </React.Fragment>
  );
};
export const PostConditions = ({
  conditions,
  ...rest
}: { conditions?: PostCondition[] } & BoxProps) =>
  conditions ? (
    <Box {...rest}>
      <SectionTitle mb="base-loose">Post conditions</SectionTitle>
      <Box>
        {conditions?.length ? (
          <Card>
            <Box borderBottom="1px solid var(--colors-border)">
              <Stack width="100%" isInline>
                <Flex
                  pl={'base'}
                  align="center"
                  width="calc(33.333% - 4px)"
                  flexShrink={0}
                  py="base"
                >
                  <Caption fontSize="14px">Condition code</Caption>
                </Flex>
                <Box width="calc(33.333%)" py="base">
                  <Caption fontSize="14px">Address</Caption>
                </Box>
                <Box width="calc(33.333% + 44px)" py="base">
                  <Caption fontSize="14px">Amount</Caption>
                </Box>
              </Stack>
            </Box>
            {conditions.map((condition: PostCondition, key) => (
              <Condition length={conditions?.length} condition={condition} index={key} key={key} />
            ))}
          </Card>
        ) : (
          <Box>
            <Caption fontSize="14px">This transaction has no post-conditions.</Caption>
          </Box>
        )}
      </Box>
    </Box>
  ) : null;
