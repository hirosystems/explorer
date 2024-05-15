import { CaretDown } from '@phosphor-icons/react';
import { FC } from 'react';

import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Link } from '../../../ui/Link';
import { Popover } from '../../../ui/Popover';
import { PopoverContent } from '../../../ui/PopoverContent';
import { PopoverTrigger } from '../../../ui/PopoverTrigger';
import { LabelWrapper } from './LabelWrapper';
import { NavItem } from './types';

export const DesktopNav: FC<{ navItems: NavItem[] }> = ({ navItems }) => {
  return (
    <Flex gap={6}>
      {navItems.map(navItem => (
        <Flex key={navItem.id} alignItems={'center'}>
          <Popover trigger={'hover'} placement={'bottom-start'} isLazy>
            <PopoverTrigger>
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
                >
                  {navItem.label}
                </Link>
                {navItem.children && <Icon as={CaretDown} size={3.5} color={'white'} />}
              </Flex>
            </PopoverTrigger>
            {navItem.children && (
              <PopoverContent
                boxShadow={'xl'}
                bg="surface"
                rounded={'xl'}
                mt={4}
                width="fit-content"
                p={2}
                borderColor="borderSecondary"
              >
                {navItem.children.map(child => (
                  <LabelWrapper {...child} key={child.id} />
                ))}
              </PopoverContent>
            )}
          </Popover>
        </Flex>
      ))}
    </Flex>
  );
};
