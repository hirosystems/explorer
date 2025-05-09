import { HStack, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { Heading, HeadingProps } from '../../ui/Heading';

export function PageTitle({ children, ...props }: { children: ReactNode } & HeadingProps) {
  return (
    <Heading as="h1" fontWeight={'medium'} fontSize="4xl" mb={0} color={'textPrimary'} {...props}>
      {children}
    </Heading>
  );
}

export function PageTitleWithTags({ children, tags }: { children: ReactNode; tags?: ReactNode }) {
  return (
    <Stack gap={2} mt={10}>
      <HStack gap={2}>{tags}</HStack>
      <PageTitle mt={2}>{children}</PageTitle>
    </Stack>
  );
}
