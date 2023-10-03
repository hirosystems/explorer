import { useColorMode } from '@chakra-ui/react';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';
import { Flex } from '@/ui/Flex';

export function TrendArrow({ change, size }: { change: number; size: string }) {
  const { colorMode } = useColorMode();
  return (
    <Flex alignItems="center">
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
}
