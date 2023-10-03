import { As, useColorMode } from '@chakra-ui/react';
import { Flex, FlexProps } from '@/ui/Flex';
import { Text } from '@/ui/Text';
import { Icon } from '@/ui/Icon';

export function DeveloperStat({
  value,
  label,
  icon,
  border,
  ...flexProps
}: {
  value: number | string;
  label: string;
  icon: As | null;
} & FlexProps) {
  const { colorMode } = useColorMode();
  return (
    <Flex direction="column" gap="20px" alignItems="center" my="20px" {...flexProps}>
      <Text fontSize="24px" color={`textTitle.${colorMode}`}>
        {value}
      </Text>
      <Flex gap="8px">
        {icon && <Icon as={icon} color={`textTitle.${colorMode}`} />}
        <Text fontSize="12px" color={`textTitle.${colorMode}`}>
          {label}
        </Text>
      </Flex>
    </Flex>
  );
}
