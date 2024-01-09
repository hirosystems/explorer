import * as React from 'react';

import { Section } from '../../../common/components/Section';
import { useAppDispatch, useAppSelector } from '../../../common/state/hooks';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Spinner } from '../../../ui/Spinner';
import { Caption, Text } from '../../../ui/typography';
import { SearchResultItem } from '../items/search-result-item';
import { clearSearchTerm, selectIsSearchFieldFocused } from '../search-slice';
import { useSearch } from '../useSearch';
import { SearchErrorMessage } from './error-message';

const SearchingIndicator: React.FC = React.memo(() => (
  <Flex alignItems="center">
    <Spinner size="18px" opacity={0.5} mr="8px" />
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
};

export const SearchResultsCard: React.FC = () => {
  const {
    query: { data, isLoading, error },
    searchTerm,
  } = useSearch();
  const isFocused = useAppSelector(selectIsSearchFieldFocused);
  const hasError = !!error || !!(data && !data?.found);
  const hasResults = !hasError && !!data?.found;
  const errorMessage = searchTerm && !data?.found && data?.error ? data.error : '';
  const title = React.useMemo(() => {
    if (hasError) {
      return 'Not found';
    }
    if (hasResults) {
      return 'Search results';
    }
  }, [hasError, hasResults]);

  if (!isFocused || (!hasError && !hasResults)) return null;

  return (
    <Section
      title={<Text fontSize={'xs'}>{title}</Text>}
      topRight={<CardActions hasError={hasError} hasResults={hasResults} isLoading={isLoading} />}
      position={'absolute'}
      zIndex={'docked'}
      mt={4}
      width={'container.md'}
      maxWidth={'full'}
      left={0}
    >
      <Box py={6}>
        {errorMessage ? (
          <SearchErrorMessage message={errorMessage} />
        ) : data && data.found ? (
          <SearchResultItem result={data} />
        ) : null}
      </Box>
    </Section>
  );
};
