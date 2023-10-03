import { useColorMode } from '@chakra-ui/react';

import { memo, ReactNode, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/common/state/hooks';
import { SearchErrorMessage } from '@/features/search/dropdown/error-message';
import { SearchResultItem } from '@/features/search/items/search-result-item';
import { clearSearchTerm, selectIsSearchFieldFocused } from '@/features/search/search-slice';
import { useSearch } from '@/features/search/use-search';
import { Box, BoxProps, Flex, Spinner } from '@/ui/components';
import { Caption } from '@/ui/typography';

const SearchingIndicator = memo(function () {
  return (
    <Flex alignItems="center">
      <Spinner size="18px" opacity={0.5} mr="8px" />
      <Caption>Searching</Caption>
    </Flex>
  );
});

interface CardActionsProps {
  isLoading?: boolean;
  hasError?: boolean;
  hasResults?: boolean;
}

function CardActions({ isLoading, hasError, hasResults }: CardActionsProps) {
  const dispatch = useAppDispatch();
  return (
    <Box opacity={isLoading || hasResults || hasError ? 1 : 0}>
      {isLoading ? (
        <SearchingIndicator />
      ) : hasError || hasResults ? (
        <Caption
          as="button"
          border="0"
          bg="transparent"
          _hover={{ cursor: 'pointer', color: 'brand' }}
          onClick={() => dispatch(clearSearchTerm())}
        >
          Clear {hasResults ? 'results' : 'error'}
        </Caption>
      ) : null}
    </Box>
  );
}

function SearchResultsCardWrapper({
  title,
  actions,
  children,
  ...rest
}: BoxProps & { title?: string; actions?: ReactNode }) {
  return (
    <Box
      borderRadius="12px"
      mt="16px"
      bg={`bg.${useColorMode().colorMode}`}
      color={`textCaption.${useColorMode().colorMode}`}
      position="absolute"
      width="100%"
      zIndex={1}
      boxShadow="high"
      borderWidth="1px"
      overflow="auto"
      minWidth={0}
      {...rest}
    >
      <Flex
        borderBottomWidth="1px"
        justifyContent="space-between"
        alignItems="center"
        px="16px"
        height="48px"
      >
        {title && <Caption>{title}</Caption>}

        {actions && actions}
      </Flex>
      <>{children}</>
    </Box>
  );
}

export function SearchResultsCard() {
  const {
    query: { data, isLoading, error },
    searchTerm,
  } = useSearch();
  const isFocused = useAppSelector(selectIsSearchFieldFocused);
  const hasError = !!error || (data && !data?.found);
  const hasResults = !hasError && data?.found;
  const errorMessage = searchTerm && !data?.found && data?.error ? data.error : '';
  const getTitle = useMemo(() => {
    if (hasError) {
      return 'Not found';
    }
    if (hasResults) {
      return 'Search results';
    }
  }, [hasError, hasResults]);

  if (!isFocused || (!hasError && !hasResults)) return null;

  return (
    <SearchResultsCardWrapper
      title={getTitle}
      actions={<CardActions hasError={hasError} hasResults={hasResults} isLoading={isLoading} />}
    >
      <>
        {errorMessage ? (
          <SearchErrorMessage message={errorMessage} />
        ) : data && data.found ? (
          <SearchResultItem result={data} />
        ) : null}
      </>
    </SearchResultsCardWrapper>
  );
}
