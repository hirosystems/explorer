import { FC } from 'react';
import { Icon } from '@/ui/Icon';
import { useColorMode } from '@chakra-ui/react';
import { Text } from '@/ui/Text';
import { Flex } from '@/ui/Flex';
import { AiOutlineCaretUp, AiOutlineCaretDown } from 'react-icons/ai';

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
