import * as React from 'react';
import { Box, BoxProps, color, Flex, Spinner, transition } from '@stacks/ui';
import { Caption } from '@components/typography';
import { border } from '@common/utils';
import { usePrevious } from '@common/hooks/search/use-previous';
import { useRecentlyViewedItems } from '@common/hooks/search/use-recent-items';
import { SearchErrorMessage } from '@components/search/error-message';
import { SearchCardItem } from '@components/search/search-result-item';
import { useItem } from '@common/hooks/search/use-item';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  searchErrorSelector,
  searchRecentlyViewedItemsState,
  searchForAddressOfDifferentType,
} from '@store/search';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { InvertedAddressNote } from '@components/search/inverted-address';

interface SearchResultsCardProps extends BoxProps {
  isLoading?: boolean;
  clearResults?: () => void;
  handleSetExiting?: () => void;
  handleItemOnClick?: () => void;
}

const RecentlyViewedList: React.FC<{
  clearResults?: () => void;
  itemOnClick?: () => void;
}> = React.memo(({ clearResults, itemOnClick }) => {
  const { recentItemsArray } = useRecentlyViewedItems();
  return (
    <>
      {recentItemsArray?.map((recentItem, index) => (
        <SearchCardItem
          onClick={itemOnClick}
          key={index}
          clearResults={clearResults}
          recentItem={recentItem}
          isLast={index === recentItemsArray.length - 1}
        />
      ))}
    </>
  );
});

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
        <Caption
          as="button"
          border="0"
          bg="transparent"
          _hover={{ cursor: 'pointer', color: color('brand') }}
          onClick={clearResults}
        >
          Clear {hasResults ? 'results' : 'error'}
        </Caption>
      ) : hasRecent ? (
        <Caption
          as="button"
          border="0"
          bg="transparent"
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
  handleItemOnClick,
  ...rest
}) => {
  const { data } = usePrevious();
  const [item] = useItem();
  const { recentItemsArray } = useRecentlyViewedItems();
  const error = useRecoilValue(searchErrorSelector);

  const hasError = !!error || !!(data?.found && item?.error);
  const hasResults = !hasError && data?.found && !item?.error;
  const hasRecent = recentItemsArray?.length > 0;

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
        {error || (data?.found && item?.error) ? (
          <SearchErrorMessage
            message={error || item?.error}
            hint={
              data?.found && item?.error && item.error.includes('cannot find contract')
                ? 'If you have the tx_id for this contract deploy, try using that instead.'
                : undefined
            }
          />
        ) : data && data.found && item ? (
          <>
            <InvertedAddressNote />
            <SearchCardItem isLast onClick={handleItemOnClick} />
          </>
        ) : (
          <RecentlyViewedList itemOnClick={handleItemOnClick} />
        )}
      </>
    </Box>
  );
};
