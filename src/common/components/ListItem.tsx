import { FC, ReactNode } from 'react';

import { Flex } from '../../ui/Flex';
import { Stack } from '../../ui/Stack';
import { Caption, Text, Title } from '../../ui/typography';

export const ListItem: FC<{
  icon: ReactNode;
  title: ReactNode;
  subTitle: ReactNode;
  rightItem?: ReactNode;
}> = ({ icon, title, subTitle, rightItem }) => (
  <Flex justifyContent="space-between" alignItems="center" py="16px">
    <Flex alignItems="center" width={'100%'} flexWrap={'nowrap'}>
      {icon}
      <Stack ml="16px" spacing="8px" overflow={'hidden'} flex={'1'}>
        <Title fontSize={14} whiteSpace={'normal'} overflowWrap={'break-word'}>
          {title}
        </Title>
        <Text fontSize={12}>{subTitle}</Text>
      </Stack>
    </Flex>
    {typeof rightItem !== 'undefined' && <Caption>{rightItem}</Caption>}
  </Flex>
);
