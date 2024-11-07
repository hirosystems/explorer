import { Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';

// TODO: Use this for all pages, instead of incorporating this into PageWrapper. In PageWrapper, replace the Stack with a <Box mt={10} mb={8}>{children}</Box>
export const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Stack mt={10} mb={8} gap={7}>
      {children}
    </Stack>
  );
};
