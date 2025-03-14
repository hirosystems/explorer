import { Box, FlexProps, Stack } from '@chakra-ui/react';

import { Card } from '../Card';

interface TableContainerProps extends FlexProps {}

export function TableContainer({ children, ...rest }: TableContainerProps) {
  return (
    <Card
      h="fit-content"
      w="full"
      px={{ base: 3, lg: 4 }}
      pb={{ base: 3, lg: 4 }}
      pt={0.5}
      borderColor="redesignBorderSecondary"
      className="table-container-card"
      alignItems="center"
      justifyContent="center"
      {...rest}
    >
      <Box overflowX="auto" overflowY="hidden" h="full" w="full" className="table-scroll-container">
        {children}
      </Box>
    </Card>
  );
}
