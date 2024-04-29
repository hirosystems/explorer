import { ReactNode } from 'react';

import { Flex } from '../../../ui/Flex';
import { Text } from '../../../ui/Text';

export function NavLabel({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <Flex
      alignItems={'center'}
      gap={2}
      sx={{
        py: { base: 5, lg: 2 },
        px: { lg: 3 },
        height: { lg: 7 },
        boxSizing: ['border-box', 'border-box', 'border-box', 'content-box'],
      }}
    >
      {icon}
      <Text fontWeight={'regular'} fontSize={'sm'} textAlign={'left'} color="text">
        {children}
      </Text>
    </Flex>
  );
}
