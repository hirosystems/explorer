import * as React from 'react';
import { Box, BoxProps, color, Flex, Spinner, transition } from '@stacks/ui';
import { Caption } from '@components/typography';
import { border } from '@common/utils';
import { usePrevious } from '@common/hooks/search/use-previous';
import { useRecentlyViewedItems } from '@common/hooks/search/use-recent-items';
import { SearchErrorMessage } from '@components/search/error-message';
import { SearchCardItem } from '@components/search/search-result-item';
import { useItem } from '@common/hooks/search/use-item';
import { useSetRecoilState } from 'recoil';
import { searchRecentlyViewedItemsState } from '@store/search';

interface SearchResultsCardProps extends BoxProps {
  isLoading?: boolean;
  clearResults?: () => void;
}

const RecentlyViewedList: React.FC<{ clearResults?: () => void }> = React.memo(
  ({ clearResults }) => {
    const { recentItemsArray } = useRecentlyViewedItems();
    return (
      <>
        {recentItemsArray?.map((recentItem, index) => (
          <React.Suspense key={index} fallback={<Box minHeight="96px">Loading!!!!</Box>}>
            <SearchCardItem clearResults={clearResults} recentItem={recentItem} />
          </React.Suspense>
        ))}
      </>
    );
  }
);

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
  hasRecent?: boolean;
  clearResults?: () => void;
}
const CardActions: React.FC<CardActionsProps> = ({
  isLoading,
  hasError,
  hasResults,
  clearResults,
  hasRecent,
}) => {
  const setRecent = useSetRecoilState(searchRecentlyViewedItemsState);
  return (
    <Box opacity={isLoading || hasResults || hasError || hasRecent ? 1 : 0} transition={transition}>
      {isLoading ? (
        <SearchingIndicator />
      ) : hasError || hasResults ? (
        <Caption _hover={{ cursor: 'pointer', color: color('brand') }} onClick={clearResults}>
          Clear {hasResults ? 'results' : 'error'}
        </Caption>
      ) : hasRecent ? (
        <Caption
          _hover={{ cursor: 'pointer', color: color('brand') }}
          onClick={() => setRecent({})}
        >
          Clear recent
        </Caption>
      ) : null}
    </Box>
  );
};

export const SearchResultsCard: React.FC<SearchResultsCardProps> = ({
  isLoading,
  clearResults,
  ...rest
}) => {
  const { data } = usePrevious();
  const [item] = useItem();
  const { recentItemsArray } = useRecentlyViewedItems();

  const hasError = (data && !data.found) || (data && data.found && item && item.error);
  const hasResults = data && data.found && item && !item.error;
  const hasRecent = recentItemsArray.length > 0;

  const getTitle = React.useCallback(() => {
    if (hasError) {
      return 'Not found';
    }
    if (hasResults) {
      return 'Search results';
    }
    if (hasRecent) {
      return 'Recently viewed';
    }
  }, [hasError, hasResults, hasRecent]);

  return (
    <Box
      overflow="hidden"
      borderRadius="12px"
      mt="base"
      mr="52px"
      bg={color('bg')}
      color={color('text-caption')}
      position="absolute"
      width="100%"
      zIndex={99}
      boxShadow="high"
      border={border()}
      {...rest}
    >
      <Flex
        borderBottom={border()}
        justifyContent="space-between"
        alignItems="center"
        px="base"
        height="48px"
      >
        <Caption>{getTitle()}</Caption>

        <CardActions
          hasError={hasError}
          hasResults={hasResults}
          hasRecent={hasRecent}
          isLoading={isLoading}
          clearResults={clearResults}
        />
      </Flex>
      <>
        {(data && !data.found) || (data && data.found && item && item.error) ? (
          <SearchErrorMessage
            message={('error' in data && data.error) || item.error}
            hint={
              data.found && item.error && item.error.includes('cannot find contract')
                ? 'If you have the tx_id for this contract deploy, try using that instead.'
                : undefined
            }
          />
        ) : data && data.found && item ? (
          <SearchCardItem clearResults={clearResults} />
        ) : (
          <RecentlyViewedList clearResults={clearResults} />
        )}
      </>
    </Box>
  );
};
