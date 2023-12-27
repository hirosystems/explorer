'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { PiMagnifyingGlass, PiX } from 'react-icons/pi';

import { useAppDispatch } from '../../../common/state/hooks';
import { Icon } from '../../../ui/Icon';
import { IconButton } from '../../../ui/IconButton';
import { InputGroup } from '../../../ui/InputGroup';
import { InputLeftElement } from '../../../ui/InputLeftElement';
import { InputRightElement } from '../../../ui/InputRightElement';
import { Spinner } from '../../../ui/Spinner';
import { blur, clearSearchTerm, focus, setSearchTerm } from '../search-slice';
import { useSearch } from '../useSearch';
import { SearchInput } from './search-input';

export const SearchBox = React.memo(() => {
  const dispatch = useAppDispatch();
  const {
    query: { isFetching },
    searchTerm,
  } = useSearch();

  useEffect(() => {
    dispatch(clearSearchTerm());
  }, [dispatch]);

  const showClearButton = searchTerm !== '' && !isFetching;

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <Icon as={PiMagnifyingGlass} size={4} color="white" />
      </InputLeftElement>
      <SearchInput
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          dispatch(setSearchTerm(e.currentTarget.value));
        }}
        value={searchTerm}
        onFocus={() => dispatch(focus())}
        onBlur={() => setTimeout(() => dispatch(blur()), 200)}
      />
      {isFetching ? (
        <InputRightElement>
          <Spinner w={4} h={4} color="white" />
        </InputRightElement>
      ) : showClearButton ? (
        <InputRightElement>
          <IconButton
            bg="transparent"
            color="white"
            icon={<Icon as={PiX} size={3} />}
            onClick={() => dispatch(clearSearchTerm())}
            aria-label={'Clear search bar'}
            _hover={{ bg: 'transparent' }}
          />
        </InputRightElement>
      ) : null}
    </InputGroup>
  );
});
