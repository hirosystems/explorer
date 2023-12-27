import * as React from 'react';
import { TbAlertTriangle } from 'react-icons/tb';

import { Circle } from '../../../common/components/Circle';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Caption } from '../../../ui/typography';

export const SearchErrorMessage: React.FC<{ message: string }> = React.memo(({ message }) => (
  <Flex gap={4}>
    <Circle size={12}>
      <Icon as={TbAlertTriangle} size="4" />
    </Circle>
    <Caption lineHeight="22px" wordBreak="break-word">
      {message}
    </Caption>
  </Flex>
));
