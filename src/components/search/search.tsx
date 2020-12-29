import * as React from 'react';
import {
  Box,
  BoxProps,
  Fade,
  Flex,
  IconButton,
  IconButtonProps,
  Spinner,
  transition,
} from '@stacks/ui';
import { SearchInput } from '@components/search/search-input';
import { SearchHints } from '@components/search/search-hints';
import { useFocus, useHover } from 'web-api-hooks';
import { IconSearch, IconX } from '@tabler/icons';
import { useRecentlyViewedItems } from '@common/hooks/search/use-recent-items';
import { useSearch } from '@common/hooks/search/use-search';
import { SearchResultsCard } from '@components/search/search-results-card';
import { useSearchDropdown } from '@common/hooks/search/use-search-dropdown';
import { useTimeoutFn } from 'react-use';

const ClearButton: React.FC<Omit<IconButtonProps, 'icon'>> = props => (
  <IconButton invert color="white" icon={IconX} {...props} />
);

export const SearchComponent: React.FC<BoxProps & { variant?: 'default' | 'small' }> = React.memo(
  ({ variant, ...props }) => {
    const [isHovered, bind] = useHover();
    const [isFocused, bindFocus] = useFocus();
    const { isVisible, handleMakeHidden, handleMakeVisible } = useSearchDropdown();
    const { recentItemsArray } = useRecentlyViewedItems();

    const inputRef = React.useRef(null);

    const {
      query,
      handleUpdateQuery,
      handleClearState,
      isLoading,
      previous,
      item,
      exiting,
      handleSetExiting,
    } = useSearch(inputRef);

    const isSmall = variant === 'small';
    const inputOffset = isSmall ? '38px' : '50px';
    const defaultHeight = isSmall ? '38px' : '64px';

    const hasSearchResult = (previous && !previous.found) || !!item;

    const hasRecentItems = !!recentItemsArray?.length;

    const [isReady, cancel, reset] = useTimeoutFn(handleMakeHidden, 100);

    React.useEffect(() => {
      if (isFocused) {
        if (!isVisible) {
          if (hasRecentItems || hasSearchResult) {
            cancel();
            handleMakeVisible();
          }
        }
      } else {
        if (isVisible) {
          if (isReady() === null) {
            reset();
          }
        }
      }
    }, [isFocused, isVisible, hasRecentItems, hasSearchResult]);

    const handleClearResults = () => {
      cancel();
      if (inputRef.current) {
        (inputRef.current as any).value = null;
        (inputRef.current as any).focus();
      }
      if (!hasRecentItems) {
        cancel();
        handleSetExiting(true);
      } else {
        cancel();
        handleClearState();
      }
    };

    React.useEffect(() => {
      return () => handleClearState();
    }, []);

    return (
      <Box position="relative" {...props}>
        <Flex height={defaultHeight} alignItems="center" position="relative" {...bind}>
          <SearchHints isSmall={isSmall} isHovered={isHovered} />
          <SearchInput
            height={defaultHeight}
            pl={inputOffset}
            zIndex={5}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              handleUpdateQuery(e);
              if (
                (e.currentTarget.value.trim() === '' || e.currentTarget.value === null) &&
                !hasRecentItems
              ) {
                handleClearResults();
              }
            }}
            ref={inputRef}
            {...bindFocus}
          />

          {query && isLoading && (
            <Box position="absolute" right="64px">
              <Spinner size="sm" color="white" />
            </Box>
          )}

          <ClearButton
            transition={transition}
            opacity={!!query ? 1 : 0}
            pointerEvents={!!query ? 'all' : 'none'}
            onClick={handleClearResults}
            position="absolute"
            right="base"
            zIndex={5}
            size={isSmall ? '28px' : '36px'}
            iconSize={isSmall ? '16px' : '24px'}
          />

          <Flex
            alignItems="center"
            justifyContent="center"
            position="absolute"
            width={isSmall ? '38px' : '50px'}
            top={0}
            height={defaultHeight}
            zIndex={99}
          >
            <Box
              as={IconSearch}
              transform="translateX(4px) scaleX(-1)"
              color="white"
              size={isSmall ? '16px' : '18px'}
            />
          </Flex>
        </Flex>
        <Fade
          in={!exiting && isVisible && (hasRecentItems || hasSearchResult)}
          onExited={() => {
            if (exiting) {
              handleClearState();
              handleSetExiting(false);
            }
            if (!query) {
              handleClearState();
            }
          }}
        >
          {styles => (
            <SearchResultsCard
              clearResults={handleClearResults}
              isLoading={isLoading}
              style={styles}
            />
          )}
        </Fade>
      </Box>
    );
  }
);
