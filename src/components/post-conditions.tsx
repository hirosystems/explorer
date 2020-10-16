import * as React from 'react';
import { Box, BoxProps, ChevronIcon, Stack, Flex, Grid, FlexProps } from '@stacks/ui';
import { CodeAccordian } from '@components/code-accordian';

import { Card } from '@components/card';
import { Caption, Text, Pre, SectionTitle } from '@components/typography';
import { Row } from '@components/rows/row';
import { PostCondition } from '@blockstack/stacks-blockchain-api-types';
import { useHover } from 'use-events';
import { ValueWrapped } from '@components/token-transfer/item';
import NextLink from 'next/link';
import { InfoIcon } from '@components/icons/info';
import { border } from '@common/utils';
import { Section } from '@components/section';

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
      borderBottom={!isLast ? '1px solid var(--colors-border)' : undefined}
      borderTop="1px solid var(--colors-border)"
      alignItems="center"
      borderBottomRightRadius={isLast ? '12px' : 'unset'}
      borderBottomLeftRadius={isLast ? '12px' : 'unset'}
      as="a"
      href="https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md#transaction-post-conditions"
      target="_blank"
      _hover={{
        bg: 'var(--colors-bg-light)',
        color: 'var(--colors-accent)',
      }}
    >
      <InfoIcon mr="tight" size="18px" />
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
          {'address' in condition.principal ? (
            <Flex align="center" width="calc(33.333%)" flexShrink={0}>
              <NextLink
                href="/address/[principal]"
                as={`/address/${condition.principal.address}`}
                passHref
              >
                <Text _hover={{ textDecoration: 'underline' }} as="a">
                  <ValueWrapped offset={8} truncate value={condition.principal.address} />
                </Text>
              </NextLink>
            </Flex>
          ) : null}
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
export const PostConditions: React.FC<{ conditions?: PostCondition[] } & FlexProps> = ({
  conditions,
  ...rest
}) =>
  conditions ? (
    <Section title="Post conditions" {...rest}>
      <>
        {conditions?.length ? (
          <>
            <Grid
              px="base"
              py="tight"
              gridTemplateColumns="repeat(3, 1fr)"
              borderBottom="1px solid var(--colors-border)"
            >
              <Caption fontSize="14px">Condition code</Caption>
              <Caption fontSize="14px">Address</Caption>
              <Caption fontSize="14px">Amount</Caption>
            </Grid>
            {conditions.map((condition: PostCondition, key) => (
              <Condition length={conditions?.length} condition={condition} index={key} key={key} />
            ))}
          </>
        ) : (
          <Grid placeItems="center" px="base" py="extra-loose">
            <Caption my="0" p="0" fontSize="14px">
              This transaction has no post-conditions.
            </Caption>
          </Grid>
        )}
      </>
    </Section>
  ) : null;
