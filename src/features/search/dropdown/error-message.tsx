import { Warning } from '@phosphor-icons/react';
import * as React from 'react';

import { Circle } from '../../../common/components/Circle';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Caption } from '../../../ui/typography';

export const SearchErrorMessage: React.FC<{ message: string }> = React.memo(({ message }) => (
  <Flex gap={4} alignItems={'center'}>
    <Circle size={12}>
      <Icon size="4">
        <Warning />
      </Icon>
    </Circle>
    <Caption lineHeight="22px" wordBreak="break-word">
      {message}
    </Caption>
  </Flex>
));
