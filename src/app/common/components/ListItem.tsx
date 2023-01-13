import { Flex, Stack } from '@/ui/components';
import { Caption, Text, Title } from '@/ui/typography';
import { FC, ReactNode } from 'react';

export const ListItem: FC<{
  icon: ReactNode;
  title: ReactNode;
  subTitle: ReactNode;
  rightItem?: ReactNode;
}> = ({ icon, title, subTitle, rightItem }) => (
  <Flex justifyContent="space-between" alignItems="center" py="16px">
    <Flex alignItems="center">
      {icon}
      <Stack ml="16px" spacing="8px">
        <Title lineHeight="28px">{title}</Title>
        <Text fontSize={12}>{subTitle}</Text>
      </Stack>
    </Flex>
    {typeof rightItem !== 'undefined' && <Caption>{rightItem}</Caption>}
  </Flex>
);
