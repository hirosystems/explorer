import { useColorMode } from '@chakra-ui/react';
import { FC } from 'react';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';

import { Flex } from '../../../../ui/Flex';
import { Icon } from '../../../../ui/Icon';
import { Text } from '../../../../ui/Text';

export const TrendArrow: FC<{ change: number; size: string }> = ({ change, size }) => {
  const colorMode = useColorMode().colorMode;
  return (
    <Flex alignItems={'center'}>
      {change >= 0 ? (
        <Icon
          as={AiOutlineCaretUp}
          size={size}
          fill={`feedbackSuccess.${colorMode}`}
          color={`feedbackSuccess.${colorMode}`}
        />
      ) : (
        <Icon
          as={AiOutlineCaretDown}
          size={size}
          fill={`feedbackError.${colorMode}`}
          color={`feedbackError.${colorMode}`}
        />
      )}
      &nbsp;
      <Text color={change >= 0 ? `feedbackSuccess.${colorMode}` : `feedbackError.${colorMode}`}>
        {Math.round(change * 10) / 10}%
      </Text>
    </Flex>
  );
};
