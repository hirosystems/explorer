import * as React from 'react';
import { Box, BoxProps, CodeBlock, ChevronIcon, Stack, Flex } from '@blockstack/ui';
import { Card } from '@components/card';
import { Caption, Text, SectionTitle } from '@components/typography';
import { Row } from '@components/rows/row';
import { PostCondition } from '@blockstack/stacks-blockchain-sidecar-types';
import { useHover } from 'use-events';
import { InfoIcon } from '@components/svg';
import { ValueWrapped } from '@components/token-transfer/item';

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
  const handleOpen = React.useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  const [hover, bind] = useHover();
  return (
    <React.Fragment key={key}>
      <Row
        borderBottom={key === length - 1 ? 'unset' : '1px solid var(--colors-border)'}
        pl="base"
        onClick={handleOpen}
        _hover={{
          cursor: 'pointer',
        }}
        {...bind}
      >
        <Stack width="100%" isInline>
          <Flex align="center" width="calc(33.333%)" flexShrink={0}>
            <Text
              fontFamily={`"Fira Code", monospace`}
              bg="var(--colors-bg-light)"
              borderRadius="3px"
              px="extra-tight"
              border="1px solid var(--colors-border)"
              fontSize="12px"
            >
              {condition.condition_code}
            </Text>
          </Flex>
          <Flex align="center" width="calc(33.333%)" flexShrink={0}>
            <Text>
              {condition.type === 'stx' ? condition.amount + ' ' : null}
              {getConditionType(condition.type)}
            </Text>
          </Flex>
          <Flex align="center" width="calc(33.333% - 38px)" flexShrink={0}>
            <Text>
              {'address' in condition.principal ? (
                <ValueWrapped offset={6} truncate value={condition.principal.address} />
              ) : null}
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
      {isOpen ? (
        <Box
          bg="ink"
          borderBottom={key === length - 1 ? 'unset' : '1px solid var(--colors-border)'}
          borderTop="1px solid var(--colors-border)"
          borderBottomRightRadius={key === length - 1 ? '12px' : 'unset'}
          borderBottomLeftRadius={key === length - 1 ? '12px' : 'unset'}
        >
          <CodeBlock
            showLineNumbers
            code={JSON.stringify(condition, null, '  ')}
            // @ts-ignore
            language="json"
          />
          <Flex p="base" borderTop="1px solid" borderTopColor="ink.800" align="center">
            <Box opacity={0.3} mr="tight" color="white">
              <InfoIcon size="12px" />
            </Box>
            <Caption
              as="a"
              // @ts-ignore
              href="https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md#transaction-post-conditions"
              target="_blank"
            >
              Click here to learn more about post conditions.
            </Caption>
          </Flex>
        </Box>
      ) : null}
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
                  <Caption fontSize="14px">Amount</Caption>
                </Box>
                <Box width="calc(33.333% + 44px)" py="base">
                  <Caption fontSize="14px">Address</Caption>
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
