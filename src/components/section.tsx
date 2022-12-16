import React from 'react';

import { Box, Flex, FlexProps, Spinner, color } from '@stacks/ui';

import { SECTION_HEADER_HEIGHT } from '@common/constants/sizes';
import { border, isReactComponent } from '@common/utils';

import { Card } from '@components/card';
import { Text } from '@components/typography';

interface SectionProps extends Omit<FlexProps, 'title'> {
  title?: string | React.FC;
}

const SectionHeader: React.FC<SectionProps> = React.memo(({ title: Title, children, ...rest }) => {
  return (
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
      minHeight={SECTION_HEADER_HEIGHT}
      {...rest}
    >
      {Title ? (
        <Text color={color('text-title')} fontWeight="500">
          {isReactComponent(Title) ? <Title /> : Title}
        </Text>
      ) : null}
      {children}
    </Flex>
  );
});

export const Section: React.FC<
  { topRight?: any; isLoading?: boolean; headerProps?: SectionProps } & SectionProps
> = React.memo(
  ({
    title,
    topRight: TopRight = null,
    children,
    overflowY,
    headerProps = {},
    isLoading,
    ...rest
  }) => {
    return (
      <Card bg={color('bg')} boxShadow="low" {...rest}>
        {title || TopRight ? (
          <SectionHeader title={title} {...headerProps}>
            <Flex justifyContent="flex-end" alignItems="center">
              {isLoading ? <Spinner size="sm" color={color('text-caption')} opacity={0.5} /> : null}
              {isReactComponent(TopRight) ? (
                <Box ml="base">
                  <TopRight />
                </Box>
              ) : (
                TopRight
              )}
            </Flex>
          </SectionHeader>
        ) : null}
        <Flex overflowY={overflowY} flexDirection="column" flexGrow={1}>
          {children}
        </Flex>
      </Card>
    );
  }
);
