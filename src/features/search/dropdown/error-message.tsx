import { Flex, Icon } from '@chakra-ui/react';
import { Warning } from '@phosphor-icons/react';
import * as React from 'react';

import { Circle } from '../../../common/components/Circle';
import { Caption } from '../../../ui/typography';

export const SearchErrorMessage: React.FC<{ message: string }> = React.memo(({ message }) => (
  <Flex gap={4} alignItems={'center'}>
    <Circle h={12} w={12}>
      <Icon h={4} w={4}>
        <Warning />
      </Icon>
    </Circle>
    <Caption lineHeight="22px" wordBreak="break-word">
      {message}
    </Caption>
  </Flex>
));
