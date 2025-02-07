import { Box, FlexProps } from '@chakra-ui/react';

import { Card } from '../Card';

interface TableContainerProps extends FlexProps {}

export function TableContainer({ children, ...rest }: TableContainerProps) {
  return (
    <Card
      h="fit-content"
      w="full"
      p={[3, 3, 3, 4]}
      borderColor="redesignBorderSecondary"
      className="table-container-card"
      {...rest}
    >
      <Box overflowX="auto" overflowY="hidden" h="full" w="full" className="table-scroll-container">
        {children}
      </Box>
    </Card>
  );
}
