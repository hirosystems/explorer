import { ReactNode } from 'react';

import { Flex } from '../../../ui/Flex';
import { Text } from '../../../ui/Text';
import { useBreakpointValue } from '../../../ui/hooks/useBreakpointValue';

const mobileNavLabelStyles = {
  py: 5,
};

const desktopNavLabelStyles = {
  py: 2,
  px: 3,
  height: 7,
  boxSizing: 'content-box',
};

export function NavLabel({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return (
    <Flex
      alignItems={'center'}
      gap={2}
      {...(isDesktop ? desktopNavLabelStyles : mobileNavLabelStyles)}
    >
      {icon}
      <Text fontWeight={'medium'} fontSize={'sm'} textAlign={'left'} color="text">
        {children}
      </Text>
    </Flex>
  );
}
