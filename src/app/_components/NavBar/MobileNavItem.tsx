import { FC } from 'react';
import { PiCaretDown } from 'react-icons/pi';

import { Box } from '../../../ui/Box';
import { Collapse } from '../../../ui/Collapse';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Stack } from '../../../ui/Stack';
import { Text } from '../../../ui/Text';
import { useDisclosure } from '../../../ui/hooks/useDisclosure';
import { NavItem } from './types';

export const MobileNavItem: FC<NavItem> = ({ label, onClick, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack gap={4} onClick={children && onToggle} p={1}>
      <Flex
        as="a"
        href={href ?? '#'}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: 'none',
        }}
        pr={2}
      >
        <Text>{label}</Text>
        {children && (
          <Icon
            as={PiCaretDown}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={4}
            h={4}
          />
        )}
      </Flex>
      <Collapse in={isOpen}>
        <Stack mt={2} pl={4} borderLeft={'2px solid var(--stacks-colors-purple-400)'}>
          {children?.map(child => {
            const as = child.onClick ? 'button' : child.href ? 'a' : 'div';
            return (
              <Box
                as={as}
                key={child.id}
                color="invert"
                {...(as === 'button' ? { onClick: child.onClick } : { href: child.href })}
              >
                {child.label}
              </Box>
            );
          })}
        </Stack>
      </Collapse>
    </Stack>
  );
};
