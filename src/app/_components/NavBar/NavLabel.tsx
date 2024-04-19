import { ReactNode } from 'react';

import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Link } from '../../../ui/Link';
import { Text } from '../../../ui/Text';
import { useBreakpointValue } from '../../../ui/hooks/useBreakpointValue';
import { NavItem } from './types';

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

export const DesktopSubNav = ({ label, href, onClick }: NavItem) => {
  return (
    <Flex
      alignItems={'center'}
      borderRadius="xl"
      _hover={{
        bg: 'dropdownBgHover',
      }}
      width="full"
    >
      {href ? (
        <Link
          href={href}
          display="block"
          rounded="md"
          color="text"
          width="fit-content"
          variant="noUnderline"
        >
          {label}
        </Link>
      ) : (
        <Box
          as={'button'}
          onClick={onClick}
          role="group"
          display="block"
          rounded="md"
          color="text"
          width="full"
          textAlign={'left'}
        >
          {label}
        </Box>
      )}
    </Flex>
  );
};
