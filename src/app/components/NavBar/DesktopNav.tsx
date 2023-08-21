import { Stack } from '@/ui/Stack';
import { Box } from '@/ui/Box';
import { Popover } from '@/ui/Popover';
import { PopoverTrigger } from '@/ui/PopoverTrigger';
import { PopoverContent } from '@/ui/PopoverContent';
import { FC } from 'react';
import { DesktopSubNav } from './DesktopSubNav';
import { NavItem } from './types';
import { Flex } from '@/ui/Flex';
import { useColorMode } from '@chakra-ui/react';
import { BsChevronDown } from 'react-icons/bs';
import { Icon } from '@/ui/Icon';

export const DesktopNav: FC<{ navItems: NavItem[] }> = ({ navItems }) => {
  const colorMode = useColorMode().colorMode;
  return (
    <Stack direction={'row'} spacing={4}>
      {navItems.map(navItem => (
        <Flex key={navItem.id} alignItems={'center'}>
          <Popover trigger={'hover'} placement={'bottom-start'} isLazy>
            <PopoverTrigger>
              <Flex alignItems={'center'} gap={'2px'}>
                <Box
                  as="a"
                  href={navItem.href ?? '#'}
                  color={'#fff'}
                  fontSize="14px"
                  fontWeight={500}
                  _hover={{
                    textDecoration: navItem.children ? 'none' : 'underline',
                  }}
                >
                  {navItem.label}
                </Box>
                {navItem.children && (
                  <Icon
                    as={BsChevronDown}
                    transition={'all .25s ease-in-out'}
                    transform={false ? 'rotate(180deg)' : ''}
                    size={3}
                    color={'#fff'}
                    position={'relative'}
                    top={'2px'}
                  />
                )}
              </Flex>
            </PopoverTrigger>
            {navItem.children && (
              <PopoverContent boxShadow={'xl'} bg={`bg.${colorMode}`} rounded={'xl'} mt={'16px'}>
                <Flex direction={'column'}>
                  {navItem.children.map((child, index) => (
                    <DesktopSubNav
                      key={child.id}
                      hasDivider={index < (navItem.children?.length || 0) - 1}
                      {...child}
                    />
                  ))}
                </Flex>
              </PopoverContent>
            )}
          </Popover>
        </Flex>
      ))}
    </Stack>
  );
};
