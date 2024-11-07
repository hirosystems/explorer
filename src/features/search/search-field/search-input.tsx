import { Box, Flex } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { advancedSearchKeywords, useSearchPageUrl } from '../../../common/queries/useSearchQuery';
import { useAppDispatch, useAppSelector } from '../../../common/state/hooks';
import { Input, InputProps } from '../../../ui/Input';
import { Text } from '../../../ui/Text';
import { blur, focus, selectIsSearchFieldFocused, setSearchTerm } from '../search-slice';

export function SearchInput({
  tempSearchTerm,
  setTempSearchTerm,
  ...rest
}: {
  tempSearchTerm: string;
  setTempSearchTerm: (value: string) => void;
} & InputProps) {
  const dispatch = useAppDispatch();
  const [scrollLeft, setScrollLeft] = useState(0);
  const reg = new RegExp(`(${advancedSearchKeywords.join('|')})`, 'gi');
  const isSearchFieldFocused = useAppSelector(selectIsSearchFieldFocused);
  const router = useRouter();
  const isSearchPage = usePathname() === '/search';
  const network = useGlobalContext().activeNetwork;
  const searchPageUrl = useSearchPageUrl(tempSearchTerm, network);
  const isAdvancedSearch = advancedSearchKeywords.some(term => tempSearchTerm.includes(term));

  return (
    <Flex position="relative" alignItems={'center'} maxW={'lg'} width={'full'} overflow="hidden">
      <Input
        id="search-bar"
        name="search-bar"
        display="block"
        type="search"
        autoComplete="off"
        autoCapitalize={'off'}
        autoCorrect={'off'}
        placeholder={isSearchFieldFocused ? '' : 'Search the Stacks blockchain'}
        enterKeyHint={'search'}
        outline={'none'}
        border={'none'}
        fontSize="sm"
        color="transparent"
        bg={'transparent'}
        p={0}
        zIndex="docked"
        width={'full'}
        css={{
          caretColor: 'var(--stacks-colors-slate-50)',
          '::-webkit-search-cancel-button': {
            display: 'none',
          },
          '::placeholder': {
            color: 'slate.250',
          },
        }}
        _placeholder={{ color: 'white' }}
        _hover={{
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          _placeholder: {
            color: 'slate.50',
          },
        }}
        _focus={{
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (isSearchPage && isAdvancedSearch) {
              router.push(searchPageUrl);
            } else {
              dispatch(setSearchTerm(tempSearchTerm));
            }
          }
        }}
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          const formattedValue = e.currentTarget.value.replace(reg, match => match.toUpperCase());
          setTempSearchTerm(formattedValue.trimStart());
        }}
        onScroll={(e: React.FormEvent<HTMLInputElement>) =>
          setScrollLeft(e.currentTarget.scrollLeft)
        }
        onFocus={() => dispatch(focus())}
        onBlur={() => setTimeout(() => dispatch(blur()), 200)}
        value={tempSearchTerm}
        {...rest}
      />
      <Box
        color="slate.50"
        fontSize="sm"
        lineHeight="1em"
        position="absolute"
        display="flex"
        alignItems="center"
        whiteSpace="pre"
        overflow="hidden"
        textOverflow="ellipsis"
        width={'fit-content'}
        justifyContent={'flex-start'}
        style={{ transform: `translateX(-${scrollLeft}px)` }}
        height={'full'}
      >
        {tempSearchTerm
          ?.toString()
          ?.split(new RegExp(`(${advancedSearchKeywords.join('|')})`, 'g'))
          ?.map((segment, index) =>
            advancedSearchKeywords.includes(segment) ? (
              <Text
                key={index}
                display="inline-block"
                bg="whiteAlpha.300"
                borderRadius="md"
                color="white"
                py={1}
                whiteSpace="pre"
                textTransform={'uppercase'}
              >
                {segment}
              </Text>
            ) : (
              <React.Fragment key={index}>{segment}</React.Fragment>
            )
          )}
      </Box>
    </Flex>
  );
}
