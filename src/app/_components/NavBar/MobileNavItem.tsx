import { FC } from 'react';
import { BsChevronDown } from 'react-icons/bs';

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
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        as="a"
        href={href ?? '#'}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text fontSize={'24px'}>{label}</Text>
        {children && (
          <Icon
            as={BsChevronDown}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={4}
            h={4}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0 !important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={'pink'}
          align={'start'}
        >
          {children &&
            children.map(child => {
              const as = child.onClick ? 'button' : child.href ? 'a' : 'div';
              return (
                <Box
                  as={as}
                  key={child.id}
                  width={'100%'}
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
