import { FC, ReactNode } from 'react';

import { useColorMode } from '../../../../components/ui/color-mode';
import { Flex, FlexProps } from '../../../../ui/Flex';
import { Icon } from '../../../../ui/Icon';
import { Text } from '../../../../ui/Text';

export const DeveloperStat: FC<
  {
    value: number | string;
    label: string;
    icon: ReactNode;
  } & FlexProps
> = ({ value, label, icon, border, ...flexProps }) => {
  const colorMode = useColorMode().colorMode;
  return (
    <Flex direction={'column'} gap={'20px'} alignItems={'center'} my={'20px'} {...flexProps}>
      <Text fontSize={'24px'} color={`textTitle.${colorMode}`}>
        {value}
      </Text>
      <Flex gap={'8px'}>
        {icon && <Icon color={`textTitle.${colorMode}`}>{icon}</Icon>}
        <Text fontSize={'12px'} color={`textTitle.${colorMode}`}>
          {label}
        </Text>
      </Flex>
    </Flex>
  );
};
