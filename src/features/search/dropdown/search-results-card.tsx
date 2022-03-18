import * as React from 'react';
import { Box, BoxProps, color, Flex, Spinner, transition } from '@stacks/ui';
import { Caption } from '@components/typography';
import { border } from '@common/utils';
import { SearchErrorMessage } from '@features/search/dropdown/error-message';
import { Pending } from '@components/status';
import { ReactNode } from 'react';
import { SafeSuspense } from '@components/ssr-safe-suspense';
import { SearchResultItem } from '@features/search/items/search-result-item';
import { SearchResultsItemPlaceholder } from '@features/search/items/item-placeholder';
import { useAppDispatch, useAppSelector } from '@common/state/hooks';
import { clearSearchTerm, selectIsSearchFieldFocused } from '@features/search/searchSlice';
import { useSearch } from '@features/search/useSearch';

const SearchingIndicator: React.FC = React.memo(() => (
  <Flex alignItems="center">
    <Spinner size="sm" opacity={0.5} mr="tight" />
    <Caption>Searching</Caption>
  </Flex>
));

interface CardActionsProps {
  isLoading?: boolean;
  hasError?: boolean;
  hasResults?: boolean;
}

const CardActions: React.FC<CardActionsProps> = ({ isLoading, hasError, hasResults }) => {
  const dispatch = useAppDispatch();
  return (
    <Box opacity={isLoading || hasResults || hasError ? 1 : 0} transition={transition}>
      {isLoading ? (
        <SearchingIndicator />
      ) : hasError || hasResults ? (
        <Caption
          as="button"
          border="0"
          bg="transparent"
          _hover={{ cursor: 'pointer', color: color('brand') }}
          onClick={() => dispatch(clearSearchTerm())}
        >
          Clear {hasResults ? 'results' : 'error'}
        </Caption>
      ) : null}
    </Box>
  );
};

const SearchResultsCardWrapper: React.FC<BoxProps & { title?: string; actions?: ReactNode }> = ({
  title,
  actions,
  children,
  ...rest
}) => {
  return (
    <Box
      borderRadius="12px"
      mt="base"
      bg={color('bg')}
      color={color('text-caption')}
      position="absolute"
      width="100%"
      zIndex={99}
      boxShadow="high"
      border={border()}
      overflow="auto"
      {...rest}
    >
      <Flex
        borderBottom={border()}
        justifyContent="space-between"
        alignItems="center"
        px="base"
        height="48px"
      >
        {title && <Caption>{title}</Caption>}

        {actions && actions}
      </Flex>
      <>{children}</>
    </Box>
  );
};

export const SearchResultsCardPlaceholder = (props: BoxProps) => {
  return (
    <SearchResultsCardWrapper title="Searching" actions={<SearchingIndicator />} {...props}>
      <Flex p="base" flexGrow={1}>
        <Pending size="16px" />
        <Caption ml="loose">Searching the network...</Caption>
      </Flex>
    </SearchResultsCardWrapper>
  );
};

export const SearchResultsCard: React.FC = () => {
  const {
    query: { data, isLoading, error },
    searchTerm,
  } = useSearch();
  const isFocused = useAppSelector(selectIsSearchFieldFocused);
  const hasError = !!error || (data && !data?.found);
  const hasResults = !hasError && data?.found;
  const errorMessage = searchTerm && !data?.found && data?.error ? data.error : '';
  const getTitle = React.useMemo(() => {
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
          <>
            <SafeSuspense fallback={<SearchResultsItemPlaceholder result={data} isLast />}>
              <SearchResultItem result={data} />
            </SafeSuspense>
          </>
        ) : null}
      </>
    </SearchResultsCardWrapper>
  );
};
