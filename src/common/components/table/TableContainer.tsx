import { FlexProps, Stack } from '@chakra-ui/react';

import { Card } from '../Card';

interface TableContainerProps extends FlexProps {}

export function TableContainer({ children, ...rest }: TableContainerProps) {
  return (
    <Card
      h="full"
      w="full"
      px={{ base: 3, lg: 4 }}
      pb={{ base: 3, lg: 4 }}
      pt={0.5}
      borderColor="redesignBorderSecondary"
      className="table-container-card"
      alignItems="center"
      justifyContent="flex-start"
      bg="transparent"
      {...rest}
    >
      <Stack
        overflowX="auto"
        overflowY="hidden"
        h="full"
        w="full"
        className="table-container-scroll-wrapper"
        flex={1}
      >
        {children}
      </Stack>
    </Card>
  );
}
