import { Flex, Stack } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import { Text } from '../../ui/Text';
import { Caption, Title } from '../../ui/typography';

export const ListItem: FC<{
  icon: ReactNode;
  title: ReactNode;
  subTitle: ReactNode;
  rightItem?: ReactNode;
}> = ({ icon, title, subTitle, rightItem }) => (
  <Flex justifyContent="space-between" alignItems="center" py={4}>
    <Flex alignItems="center" width={'100%'} flexWrap={'nowrap'}>
      {icon}
      <Stack ml={4} gap={2} overflow={'hidden'} flex={'1'}>
        <Title fontSize={14} whiteSpace={'normal'} overflowWrap={'break-word'}>
          {title}
        </Title>
        <Text fontSize={12}>{subTitle}</Text>
      </Stack>
    </Flex>
    {typeof rightItem !== 'undefined' && <Caption>{rightItem}</Caption>}
  </Flex>
);
