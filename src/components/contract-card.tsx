import Link from 'next/link';
import * as React from 'react';
import { useHover } from 'use-events';

import { Box, Flex, FlexProps, Text } from '@stacks/ui';

import { Card } from '@components/card';
import { CodeIcon } from '@components/icons/code';
import { DefaultContract } from '@components/icons/default-contract';
import { Caption, Title } from '@components/typography';

import { ArrowRightIcon } from './icons/arrow-right';

const ContractCardButton: React.FC<{ contractId: string } & FlexProps> = ({
  contractId,
  ...props
}) => {
  const [hover, bind] = useHover();
  return (
    <Link
      href={{
        pathname: '/txid/[txid]',
        query: {
          txid: contractId,
        },
      }}
      as={`/txid/${contractId}`}
      passHref
    >
      <Flex
        borderBottomLeftRadius="12px"
        borderBottomRightRadius="12px"
        py="base"
        alignItems="center"
        justify="center"
        borderTop="1px solid"
        cursor={hover ? 'pointer' : 'unset'}
        bg={hover ? 'var(--colors-bg-alt)' : 'transparent'}
        borderColor="var(--colors-border)"
        style={{
          userSelect: 'none',
        }}
        as="a"
        target="_blank"
        {...props}
        {...bind}
      >
        <Caption fontWeight="500" color="var(--colors-text-body)" mr="extra-tight">
          Go to contract
        </Caption>
        <ArrowRightIcon color="var(--colors-text-body)" size="16px" />
      </Flex>
    </Link>
  );
};

interface ContractCardProps extends FlexProps {
  title: string;
  contractId?: string;
  meta?: string;
  icon?: string;
}

export const ContractCard: React.FC<ContractCardProps> = ({ title, meta, contractId, ...rest }) => {
  return (
    <Card
      flexShrink={['unset', 'unset', 0]}
      width={['100%', '100%', '262px']}
      height={['unset', 'unset', '262px']}
      {...rest}
    >
      <Flex
        px="base"
        py="base"
        flexGrow={1}
        alignItems="center"
        flexDirection={['row', 'row', 'column']}
        justify={['flex-start', 'flex-start', 'center']}
      >
        <Box
          mt={['unset', 'unset', 'base-tight']}
          mb={['unset', 'unset', 'base']}
          mr={['base-tight', 'base-tight', 'unset']}
          size={10}
          borderRadius="12px"
          color="var(--colors-invert)"
        >
          <DefaultContract />
        </Box>
        <Box textAlign={['left', 'left', 'center']}>
          <Title width="100%" textStyle="body.large.medium" display="block">
            {title}
          </Title>
          {meta ? (
            <Text
              width="100%"
              textStyle="body.small"
              color="var(--colors-text-caption)"
              display="block"
            >
              {meta}
            </Text>
          ) : null}
        </Box>
      </Flex>
      {contractId ? <ContractCardButton contractId={contractId} /> : null}
    </Card>
  );
};
