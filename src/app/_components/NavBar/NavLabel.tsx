import { ReactNode } from 'react';

import { Flex } from '../../../ui/Flex';
import { Text } from '../../../ui/Text';

export function NavLabel({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <Flex
      alignItems={'center'}
      py={2}
      px={3}
      height={7}
      boxSizing="content-box"
      className="nav-label"
      gap={2}
    >
      {icon}
      <Text fontWeight={'medium'} fontSize={'sm'} textAlign={'left'} color="text">
        {children}
      </Text>
    </Flex>
  );
}
