import { Box, Flex, Icon } from '@chakra-ui/react';
import { CaretDown } from '@phosphor-icons/react';
import { FC } from 'react';

import {
  HoverCardContent,
  HoverCardRoot,
  HoverCardTrigger,
} from '../../../components/ui/hover-card';
import { Link } from '../../../ui/Link';
import { LabelWrapper } from './LabelWrapper';
import { NavItem } from './types';

export const DesktopNav: FC<{ navItems: NavItem[] }> = ({ navItems }) => {
  return (
    <Flex gap={6}>
      {navItems.map(navItem => (
        <Flex key={navItem.id} alignItems={'center'}>
          <HoverCardRoot
            positioning={{ placement: 'bottom-start' }}
            lazyMount
            id={navItem.id}
            openDelay={300}
          >
            <HoverCardTrigger>
              <Flex
                gap={1.5}
                border={
                  navItem.id === 'network'
                    ? '1px solid var(--stacks-colors-white-alpha-600)'
                    : undefined
                }
                bg={navItem.id === 'network' ? 'whiteAlpha.200' : undefined}
                px={navItem.id === 'network' ? 3 : undefined}
                py={navItem.id === 'network' ? 1.5 : undefined}
                rounded={navItem.id === 'network' ? 'full' : undefined}
                alignItems="center"
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
                  <Icon h={3.5} w={3.5} color={'white'}>
                    <CaretDown />
                  </Icon>
                )}
              </Flex>
            </HoverCardTrigger>
            {navItem.children && (
              <Box h="full" w="full">
                <HoverCardContent
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
                </HoverCardContent>
              </Box>
            )}
          </HoverCardRoot>
        </Flex>
      ))}
    </Flex>
  );
};
