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
import { IconSearch, IconX } from '@tabler/icons';

import { useSearchComponent } from '@common/hooks/search/use-search-component';

type Variant = 'default' | 'small';

const ClearButton: React.FC<Omit<IconButtonProps, 'icon'>> = props => (
  <IconButton invert color="white" icon={IconX} {...props} />
);

export const SearchBox = ({
  variant,
  inputRef,
  timeoutRef,
}: {
  variant?: Variant;
  inputRef: any;
  timeoutRef: any;
}) => {
  const {
    defaultHeight,
    inputLeftOffset,
    inputRightOffset,
    handleUpdateQuery,
    handleClearResults,
    hasRecentItems,
    spinnerVisible,
    value,
    query,
    isSmall,
    bindHover,
    bindFocus,
  } = useSearchComponent({
    variant,
    inputRef,
    timeoutRef,
  });

  return (
    <Flex height={defaultHeight} alignItems="center" position="relative" {...bindHover}>
      <SearchInput
        height={defaultHeight}
        pl={inputLeftOffset}
        zIndex={5}
        pr={inputRightOffset}
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
        value={value}
        {...bindFocus}
      />

      {spinnerVisible ? (
        <Box position="absolute" right={isSmall ? '48px' : '64px'}>
          <Spinner size="sm" color="white" />
        </Box>
      ) : null}
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
  );
};
