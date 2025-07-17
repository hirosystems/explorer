import { Box, Text, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface SSRDisabledMessageProps {
  sectionName?: string;
  children?: ReactNode;
}

export function SSRDisabledMessage({
  sectionName = 'This section',
  children,
}: SSRDisabledMessageProps) {
  return (
    <Box
      p={8}
      border="1px dashed"
      borderRadius="md"
      bg="surfaceTertiary"
      textAlign="center"
      minH="200px"
      width="100%"
      flex="1"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack gap={3}>
        <Text color="textPrimary" textStyle="text-medium-md">
          {sectionName} is currently unavailable.
        </Text>
        <Text color="textSecondary" textStyle="text-mono-xs">
          Connect to Mainnet or Testnet to view it.
        </Text>
        {children && <Box mt={2}>{children}</Box>}
      </VStack>
    </Box>
  );
}
