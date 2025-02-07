import { Input } from '@/ui/Input';
import { Text } from '@/ui/Text';
import { Box, Button, Flex, Icon } from '@chakra-ui/react';
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
            <Button
              onClick={onPreviousPage}
              disabled={currentPage === 1}
              px={2}
              py={1}
              bg="sand.150"
            >
              <Icon  h={4} w={4}>
                <CaretDoubleLeft />
              </Icon>
            </Button>
            <Button
              onClick={onPreviousPage}
              disabled={currentPage === 1}
              px={2}
              py={1}
              bg="sand.150"
            >
              <Icon  h={4} w={4}>
                <CaretLeft />
              </Icon>
            </Button>
          </Flex>
          <Button mx={2} p={2} fontWeight="medium" fontSize="xs" bg="sand.150">
            {currentPage}
          </Button>
          <Flex gap={1}>
            <Button
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              px={2}
              py={1}
              bg="sand.150"
            >
              <Icon  h={4} w={4}>
                <CaretRight />
              </Icon>
            </Button>
            <Button
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              px={2}
              py={1}
              bg="sand.150"
            >
              <Icon h={4} w={4}>
                <CaretDoubleRight />
              </Icon>
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
          <Button px={2} py={1} fontSize="xs" bg="sand.150" fontWeight="medium" color="sand.400">
            GO
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};
