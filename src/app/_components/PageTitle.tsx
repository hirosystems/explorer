import { ReactNode } from 'react';

import { Flex } from '../../ui/Flex';
import { HStack } from '../../ui/HStack';
import { Heading, HeadingProps } from '../../ui/Heading';

export function PageTitle({ children, ...props }: { children: ReactNode } & HeadingProps) {
  return (
    <Heading
      as="h1"
      fontWeight={'medium'}
      fontSize="4xl"
      mt={20}
      mb="0"
      color={'slate.50'}
      {...props}
    >
      {children}
    </Heading>
  );
}

export function PageTitleWithTags({ children, tags }: { children: ReactNode; tags?: ReactNode }) {
  return (
    <Flex direction={'column'} gap={2} mt={10}>
      <HStack gap={2}>{tags}</HStack>
      <PageTitle mt={2}>{children}</PageTitle>
    </Flex>
  );
}
