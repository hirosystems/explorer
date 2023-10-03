import React, { memo, ReactNode } from 'react';
import { SECTION_HEADER_HEIGHT } from '@/common/constants/sizes';
import { isReactComponent } from '@/common/utils';
import { Card } from '@/components/card';
import { Flex, FlexProps, Spinner } from '@/ui/components';
import { Text } from '@/ui/typography';

interface SectionProps extends Omit<FlexProps, 'title'> {
  title?: string;
}

const SectionHeader = memo(({ title: Title, children, ...rest }: SectionProps) => {
  return (
    <Flex
      alignItems="center"
      bg="bg"
      justifyContent="space-between"
      borderBottomWidth="1px"
      flexShrink={0}
      p="12px 16px"
      borderTopRightRadius="12px"
      borderTopLeftRadius="12px"
      minHeight={SECTION_HEADER_HEIGHT}
      {...rest}
    >
      {Title ? (
        <Text color="textTitle" fontWeight="500" py="10px">
          {Title}
        </Text>
      ) : null}
      {children}
    </Flex>
  );
});

export const Section = memo(
  ({
    title,
    topRight: TopRight = null,
    children,
    overflowY,
    headerProps = {},
    isLoading,
    ...rest
  }: { topRight?: ReactNode; isLoading?: boolean; headerProps?: SectionProps } & SectionProps) => {
    return (
      <Card {...rest}>
        {title || TopRight ? (
          <SectionHeader title={title} {...headerProps}>
            <Flex justifyContent="flex-end" alignItems="center">
              {isLoading ? <Spinner size="sm" color="textCaption" opacity={0.5} /> : null}
              {TopRight}
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
