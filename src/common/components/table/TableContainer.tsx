import { Box, FlexProps, Stack } from '@chakra-ui/react';

import { Card } from '../Card';

interface TableContainerProps extends FlexProps {}

export function TableContainer({ children, ...rest }: TableContainerProps) {
  return (
    <Stack gap={0} alignItems="center" w="full">
      <Card
        h="fit-content"
        w="full"
        p={[3, 3, 3, 4]}
        borderColor="redesignBorderSecondary"
        className="table-container-card"
        {...rest}
      >
        <Box
          overflowX="auto"
          overflowY="hidden"
          h="full"
          w="full"
          className="table-scroll-container"
        >
          {children}
        </Box>
      </Card>
    </Stack>
  );
}
