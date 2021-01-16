import { Flex, FlexProps, color } from '@stacks/ui';
import { Text } from '@components/typography';

import { Card } from '@components/card';
import React from 'react';

import { border } from '@common/utils';
import { SECTION_HEADER_HEIGHT } from '@common/constants/sizes';

interface SectionProps extends FlexProps {
  title?: string;
}

const SectionHeader: React.FC<SectionProps> = React.memo(({ title, children, ...rest }) => (
  <Flex
    alignItems="center"
    bg={color('bg')}
    justifyContent="space-between"
    borderBottom={border()}
    flexShrink={0}
    px="loose"
    py="base"
    borderTopRightRadius="12px"
    borderTopLeftRadius="12px"
    height={SECTION_HEADER_HEIGHT}
    {...rest}
  >
    {title ? (
      <Text color={color('text-title')} fontWeight="500">
        {title}
      </Text>
    ) : null}
    {children}
  </Flex>
));

export const Section: React.FC<{ topRight?: any } & SectionProps> = React.memo(
  ({ title, topRight = null, children, overflowY, ...rest }) => {
    return (
      <Card bg={color('bg')} boxShadow="low" {...rest}>
        {title || topRight ? <SectionHeader title={title}>{topRight}</SectionHeader> : null}
        <Flex overflowY={overflowY} flexDirection="column" flexGrow={1}>
          {children}
        </Flex>
      </Card>
    );
  }
);
