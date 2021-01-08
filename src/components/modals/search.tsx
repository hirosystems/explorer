import React from 'react';
import { Box, color, ControlledModal, Flex, IconButton, Fade } from '@stacks/ui';
import { IconSearch, IconX } from '@tabler/icons';
import { Text, Title } from '@components/typography';
import { useModal } from '@common/hooks/use-modal';
import { MODALS } from '@common/constants';
import { useSearchComponent } from '@common/hooks/search/use-search-component';
import { SearchBox } from '@components/search/search-box';
import { SearchResultsCard } from '@components/search/search-results-card';

export const SearchModal: React.FC = () => {
  const { modal, handleCloseModal } = useModal();
  const handleClose = () => {
    handleCloseModal();
  };
  const inputRef = React.useRef(null);
  const timeoutRef = React.useRef<number | null>(null);

  const { hasRecentItems, isLoading, hasSearchResult, handleClearResults } = useSearchComponent({
    variant: 'default',
    inputRef,
    timeoutRef,
  });

  const isOpen = modal === MODALS.SEARCH;

  const results = hasRecentItems || hasSearchResult;
  return (
    <Fade in={isOpen}>
      {baseFadeInStyles => (
        <Flex
          style={baseFadeInStyles}
          flexDirection="column"
          position="fixed"
          top={0}
          left={0}
          minHeight="100vh"
          zIndex={99999999}
          width="100vw"
          bg={color('bg')}
        >
          <Flex width="100vw" justifyContent="space-between" alignItems="center" p="extra-loose">
            <Title fontSize={4}>Search</Title>
            <IconButton color={color('text-caption')} onClick={handleClose} icon={IconX} />
          </Flex>
          <Box px="base">
            <SearchBox inputRef={inputRef} timeoutRef={timeoutRef} />
          </Box>
          <Box px="base" width="100vw" position="relative" flexGrow={1}>
            <Fade in={results}>
              {styles => (
                <SearchResultsCard
                  clearResults={handleClearResults}
                  isLoading={isLoading}
                  style={styles}
                  height="calc(100% - 32px)"
                  maxWidth="calc(100% - 32px)"
                  width="100%"
                />
              )}
            </Fade>

            <Fade in={!results}>
              {styles => (
                <Flex
                  flexDirection="column"
                  justifyContent="center"
                  p="extra-loose"
                  alignItems="center"
                  style={styles}
                >
                  <Box
                    mb="extra-loose"
                    as={IconSearch}
                    mx="auto"
                    opacity={0.15}
                    size="128px"
                    color={color('invert')}
                  />
                  <Text color={color('text-caption')} textAlign="center" lineHeight="28px">
                    Available search terms: principal, tx_id, contract_id, and block_hash.
                  </Text>
                </Flex>
              )}
            </Fade>
          </Box>
        </Flex>
      )}
    </Fade>
  );
};
