import { Flex, Icon, Stack, StackProps } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import { Text } from '../../../../ui/Text';

export const DeveloperStat: FC<
  {
    value: number | string;
    label: string;
    icon: ReactNode;
  } & StackProps
> = ({ value, label, icon, border, ...stackProps }) => {
  return (
    <Stack gap={5} alignItems={'center'} my={5} {...stackProps}>
      <Text fontSize={'2xl'} color={'text'}>
        {value}
      </Text>
      <Flex gap={'8px'}>
        {icon && <Icon color={'text'}>{icon}</Icon>}
        <Text fontSize={'xs'} color={'text'}>
          {label}
        </Text>
      </Flex>
    </Stack>
  );
};
