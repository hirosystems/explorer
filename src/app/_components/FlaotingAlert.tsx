import { Button, useToast } from '@chakra-ui/react';

import { Box } from '../../ui/Box';

const FloatingAlert = () => {
  const toast = useToast();

  const showAlert = () => {
    toast({
      title: 'New Transaction Alert',
      description: 'A new transaction has been processed.',
      status: 'info', // Can be 'info', 'success', 'warning', 'error'
      duration: 5000, // Duration in milliseconds
      isClosable: true,
      position: 'bottom-right', // Position of the toast
      render: () => (
        <Box color="white" p={3} bg="blue.500">
          Hello World
        </Box>
      ),
    });
  };

  return null;
};

export default FloatingAlert;
