import { Box } from '@/ui/Box';
import { Input } from '@/ui/Input';
import { Button, Flex, Icon, Text } from '@chakra-ui/react';
import { CaretDoubleLeft, CaretDoubleRight, CaretLeft, CaretRight } from '@phosphor-icons/react';
import React, { useState } from 'react';

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export const PaginationControl: React.FC<PaginationControlProps> = ({
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
}) => {
  const [page, setPage] = useState(currentPage.toString());

  return (
    <Flex
      borderBottomRadius="xl"
      border="1px solid var(--stacks-colors-borderSecondary)"
      //   w="fit-content"
      h="full"
    >
      <Box py={2} px={4} h="full">
        <Flex alignItems="center" justifyContent="center">
          <Flex gap={1}>
            <Button onClick={onPreviousPage} isDisabled={currentPage === 1} px={2} py={1}>
              <Icon as={CaretDoubleLeft} size={4} />
            </Button>
            <Button onClick={onPreviousPage} isDisabled={currentPage === 1} px={2} py={1}>
              <Icon as={CaretLeft} size={4} />
            </Button>
          </Flex>
          <Button mx={2} p={2} fontWeight="medium" fontSize="xs">
            {currentPage}
          </Button>
          <Flex gap={1}>
            <Button onClick={onNextPage} isDisabled={currentPage === totalPages} px={2} py={1}>
              <Icon as={CaretRight} size={4} />
            </Button>
            <Button onClick={onNextPage} isDisabled={currentPage === totalPages} px={2} py={1}>
              <Icon as={CaretDoubleRight} size={4} />
            </Button>
          </Flex>
        </Flex>
      </Box>

      <Box border="1px solid var(--stacks-colors-borderSecondary)" w="1px" h="auto" />

      <Box py={2} px={4} h="full">
        <Flex alignItems="center" justifyContent="center">
          <Input
            h={6}
            w={12}
            mx={2}
            value={page}
            onChange={e => setPage(e.target.value)}
            mr={2}
            type="number"
          />
          <Text mr={4} fontSize="xs">
            of {totalPages} pages
          </Text>
          <Button px={2} py={1} fontSize="xs">
            GO
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};
