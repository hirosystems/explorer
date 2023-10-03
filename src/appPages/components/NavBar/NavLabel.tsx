import React, { ReactNode } from 'react';
import { useColorMode } from '@chakra-ui/react';
import { BsChevronRight } from 'react-icons/bs';
import { Flex } from '@/ui/Flex';
import { Text } from '@/ui/Text';
import { Icon } from '@/ui/Icon';

export function NavLabel({ children }: { children: ReactNode }) {
  return (
    <Flex height="50px" alignItems="center">
      <Text
        color={`textTitle.${useColorMode().colorMode}`}
        _groupHover={{ textDecoration: 'underline' }}
        fontWeight={500}
        fontSize="13px"
        textAlign="left"
      >
        {children}
      </Text>
      <Flex
        transition="all .3s ease"
        transform="translateX(-10px)"
        opacity={0}
        _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
        justify="flex-end"
        align="center"
        flex={1}
      >
        <Icon w={3} h={3} as={BsChevronRight} color={`textCaption.${useColorMode().colorMode}`} />
      </Flex>
    </Flex>
  );
}
