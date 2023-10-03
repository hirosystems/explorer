import { FormEvent, memo, useEffect } from 'react';
import { TbSearch, TbX } from 'react-icons/tb';
import { useAppDispatch } from '@/common/state/hooks';
import { SearchInput } from '@/features/search/search-field/search-input';
import { blur, clearSearchTerm, focus, setSearchTerm } from '@/features/search/search-slice';
import { useSearch } from '@/features/search/use-search';
import { Box, Flex, IconButton, Spinner } from '@/ui/components';

type Variant = 'default' | 'small';

interface SearchBoxProps {
  variant?: Variant;
}

export const SearchBox = memo(({ variant }: SearchBoxProps) => {
  const dispatch = useAppDispatch();
  const {
    query: { isFetching },
    searchTerm,
  } = useSearch();

  useEffect(() => {
    dispatch(clearSearchTerm());
  }, []);

  const showClearButton = true;

  const isSmall = variant === 'small';
  const inputLeftOffset = isSmall ? '38px' : '50px';
  const inputRightOffset = isFetching ? '92px' : '60px';
  const defaultHeight = isSmall ? '38px' : '64px';

  return (
    <Flex height={defaultHeight} alignItems="center" position="relative">
      <SearchInput
        height={defaultHeight}
        pl={inputLeftOffset}
        pr={inputRightOffset}
        onChange={(e: FormEvent<HTMLInputElement>) => {
          dispatch(setSearchTerm(e.currentTarget.value));
        }}
        value={searchTerm}
        onFocus={() => dispatch(focus())}
        onBlur={() => setTimeout(() => dispatch(blur()), 200)}
      />

      {isFetching ? (
        <Box position="absolute" right={isSmall ? '48px' : '64px'} zIndex={1}>
          <Spinner size="18px" color="white" />
        </Box>
      ) : null}
      <IconButton
        bg="transparent"
        color="white"
        icon={<TbX width={isSmall ? '16px' : '24px'} height={isSmall ? '16px' : '24px'} />}
        opacity={showClearButton ? 1 : 0}
        onClick={() => dispatch(clearSearchTerm())}
        position="absolute"
        right="16px"
        size={isSmall ? '28px' : '36px'}
        aria-label="Clear search bar"
        borderRadius="50%"
        _hover={{ bg: 'rgba(255, 255, 255, 0.15)' }}
        zIndex={1}
      />

      <Flex
        alignItems="center"
        justifyContent="center"
        position="absolute"
        width={isSmall ? '38px' : '50px'}
        top={0}
        height={defaultHeight}
      >
        <Box
          as={TbSearch}
          transform="translateX(4px) scaleX(-1)"
          color="white"
          size={isSmall ? '16px' : '18px'}
          zIndex={1}
        />
      </Flex>
    </Flex>
  );
});
