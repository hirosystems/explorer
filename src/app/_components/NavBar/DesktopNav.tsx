import { Popover } from '@chakra-ui/react';
import { CaretDown } from '@phosphor-icons/react';
import { FC, useState } from 'react';

import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Link } from '../../../ui/Link';
import { LabelWrapper } from './LabelWrapper';
import { NavItem } from './types';

export const DesktopNav: FC<{ navItems: NavItem[] }> = ({ navItems }) => {
  const [isNavHovered, setIsNavHovered] = useState(false);
  return (
    <Flex gap={6}>
      {navItems.map(navItem => (
        <Flex key={navItem.id} alignItems={'center'}>
          <Popover.Root
            onOpenChange={value => setIsNavHovered(value.open)}
            open={isNavHovered}
            positioning={{ placement: 'bottom-start' }}
            lazyMount
          >
            <Popover.Trigger>
              <Flex
                gap={1.5}
                border={
                  navItem.id === 'network'
                    ? '1px solid var(--stacks-colors-whiteAlpha-600)'
                    : undefined
                }
                bg={navItem.id === 'network' ? 'whiteAlpha.200' : undefined}
                px={navItem.id === 'network' ? 3 : undefined}
                py={navItem.id === 'network' ? 1.5 : undefined}
                rounded={navItem.id === 'network' ? 'full' : undefined}
              >
                <Link
                  href={navItem.href ?? '#'}
                  color={'slate.50'}
                  fontSize="sm"
                  fontWeight={'regular'}
                  _hover={{
                    textDecoration: navItem.children ? 'none' : 'underline',
                  }}
                  whiteSpace={'nowrap'}
                >
                  {navItem.label}
                </Link>
                {navItem.children && (
                  <Icon size={3.5} color={'white'}>
                    <CaretDown />
                  </Icon>
                )}
              </Flex>
            </Popover.Trigger>
            {navItem.children && (
              <Box h="full" w="full" zIndex="popover">
                <Popover.Content
                  boxShadow={'xl'}
                  bg="surface"
                  rounded={'xl'}
                  mt={4}
                  width="fit-content"
                  maxWidth={500}
                  p={2}
                  borderColor="borderSecondary"
                >
                  {navItem.children.map(child => (
                    <LabelWrapper {...child} key={child.id} />
                  ))}
                </Popover.Content>
              </Box>
            )}
          </Popover.Root>
        </Flex>
      ))}
    </Flex>
  );
};
