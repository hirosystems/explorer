import React from 'react';
import { components } from '@components/changelog/mdx';
import { Box, Flex, color, FlexProps } from '@stacks/ui';
import { Title } from '@components/typography';
import hydrate from 'next-mdx-remote/hydrate';
import { toRelativeTime } from '@common/utils';

interface Source {
  compiledSource: string;
  renderedOutput: string;
  scope?: Record<string, unknown>;
}

export const ChangelogEntry: React.FC<
  {
    entry: {
      data: {
        date: string;
      };
      content: Source;
    };
  } & FlexProps
> = ({ entry, ...rest }) => (
  <Flex width="100%" {...rest}>
    <Flex flexShrink={0} justifyContent="flex-end" width="125px">
      <Title color={color('text-caption')} fontSize={1} textAlign="right">
        {toRelativeTime(entry.data.date)}
      </Title>
    </Flex>
    <Box px="extra-loose" flexGrow={1} width="100%">
      {hydrate(entry.content, { components })}
    </Box>
    <Flex
      display={['none', 'none', 'none', 'flex']}
      flexShrink={0}
      flexGrow={1}
      justifyContent="flex-end"
      width="125px"
    />
  </Flex>
);
