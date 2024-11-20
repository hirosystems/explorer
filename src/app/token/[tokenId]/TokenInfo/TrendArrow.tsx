import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { FC } from 'react';

import { useColorMode } from '../../../../components/ui/color-mode';
import { Flex } from '../../../../ui/Flex';
import { Icon } from '../../../../ui/Icon';
import { Text } from '../../../../ui/Text';

export const TrendArrow: FC<{ change: number; size: string }> = ({ change, size }) => {
  const colorMode = useColorMode().colorMode;
  return (
    <Flex alignItems={'center'}>
      {change >= 0 ? (
        <Icon
          size={size}
          fill={`feedbackSuccess.${colorMode}`}
          color={`feedbackSuccess.${colorMode}`}
        >
          <CaretUp />
        </Icon>
      ) : (
        <Icon size={size} fill={`feedbackError.${colorMode}`} color={`feedbackError.${colorMode}`}>
          <CaretDown />
        </Icon>
      )}
      &nbsp;
      <Text color={change >= 0 ? `feedbackSuccess.${colorMode}` : `feedbackError.${colorMode}`}>
        {Math.round(change * 10) / 10}%
      </Text>
    </Flex>
  );
};
