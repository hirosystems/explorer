import * as React from 'react';
import { Box, color, Flex, IconButton, IconButtonProps, Spinner, transition } from '@stacks/ui';
import { SearchInput } from '@features/search/search-field/search-input';
import { IconSearch, IconX } from '@tabler/icons';
import { useAppDispatch } from '@common/state/hooks';
import { setSearchTerm, focus, blur, clearSearchTerm } from '@features/search/searchSlice';
import { useSearch } from '@features/search/useSearch';
import { useEffect } from 'react';

type Variant = 'default' | 'small';

const ClearButton: React.FC<Omit<IconButtonProps, 'icon'>> = props => (
  <IconButton
    border="1px solid transparent"
    bg="transparent"
    as="button"
    invert
    color="white"
    outline={0}
    _focus={{
      borderColor: color('brand'),
    }}
    display="flex"
    icon={IconX}
    {...props}
  />
);

interface SearchBoxProps {
  variant?: Variant;
}

export const SearchBox = React.memo(({ variant }: SearchBoxProps) => {
  const dispatch = useAppDispatch();
  const {
    query: { isLoading },
    searchTerm,
  } = useSearch();

  useEffect(() => {
    dispatch(clearSearchTerm());
  }, []);

  const showClearButton = true;

  const isSmall = variant === 'small';
  const inputLeftOffset = isSmall ? '38px' : '50px';
  const inputRightOffset = isLoading ? '92px' : '60px';
  const defaultHeight = isSmall ? '38px' : '64px';

  return (
    <Flex height={defaultHeight} alignItems="center" position="relative">
      <SearchInput
        height={defaultHeight}
        pl={inputLeftOffset}
        zIndex={5}
        pr={inputRightOffset}
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          dispatch(setSearchTerm(e.currentTarget.value));
        }}
        value={searchTerm}
        onFocus={() => dispatch(focus())}
        onBlur={() => setTimeout(() => dispatch(blur()), 200)}
      />

      {isLoading ? (
        <Box position="absolute" zIndex={99} right={isSmall ? '48px' : '64px'}>
          <Spinner size="sm" color="white" />
        </Box>
      ) : null}
      <ClearButton
        transition={transition}
        opacity={showClearButton ? 1 : 0}
        pointerEvents={showClearButton ? 'all' : 'none'}
        onClick={() => dispatch(clearSearchTerm())}
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
});
