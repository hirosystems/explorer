import React, { FC, ReactNode } from 'react';
import { PiCaretRight } from 'react-icons/pi';

import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Text } from '../../../ui/Text';

export const NavLabel: FC<{ children: ReactNode }> = ({ children }) => (
  <Flex height={'50px'} alignItems={'center'} color="black">
    <Text
      _groupHover={{ textDecoration: 'underline' }}
      fontWeight={'medium'}
      fontSize={'xs'}
      textAlign={'left'}
    >
      {children}
    </Text>
    <Flex
      transition={'all .3s ease'}
      transform={'translateX(-10px)'}
      opacity={0}
      _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
      justify={'flex-end'}
      align={'center'}
      flex={1}
    >
      <Icon w={3} h={3} as={PiCaretRight} />
    </Flex>
  </Flex>
);
