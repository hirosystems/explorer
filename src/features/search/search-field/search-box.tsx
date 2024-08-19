'use client';

import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { buildAdvancedSearchQuery } from '../../../common/queries/useSearchQuery';
import { useAppDispatch, useAppSelector } from '../../../common/state/hooks';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { IconButton } from '../../../ui/IconButton';
import { InputGroup } from '../../../ui/InputGroup';
import { Spinner } from '../../../ui/Spinner';
import { Text } from '../../../ui/Text';
import { clearSearchTerm, selectIsSearchFieldFocused, selectSearchTerm } from '../search-slice';
import { SearchInput } from './search-input';

export function SearchBox({ isFetching }: { isFetching: boolean }) {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector(selectSearchTerm);
  const isSearchFieldFocused = useAppSelector(selectIsSearchFieldFocused);
  const params = new URLSearchParams(useSearchParams());
  const filterParams: Record<string, string> = {};
  params.forEach((value, filter) => {
    if (
      filter === 'fromAddress' ||
      filter === 'toAddress' ||
      filter === 'startTime' ||
      filter === 'endTime' ||
      filter.startsWith('term_')
    ) {
      filterParams[filter] = value;
    }
  });
  const searchTermFromQueryParams = buildAdvancedSearchQuery(filterParams);

  const [tempSearchTerm, setTempSearchTerm] = useState(searchTermFromQueryParams);

  useEffect(() => {
    setTempSearchTerm(searchTermFromQueryParams);
  }, [searchTermFromQueryParams]);

  useEffect(() => {
    dispatch(clearSearchTerm());
  }, [dispatch]);

  const showClearButton = searchTerm !== '' && !isFetching;

  return (
    <InputGroup>
      <Flex
        width="full"
        alignItems="center"
        gap={2}
        bgColor="whiteAlpha.200"
        border="1px"
        borderColor="whiteAlpha.600"
        borderRadius="xl"
        transitionProperty="border"
        backdropFilter={'blur(24px)'}
        _focusWithin={{
          bgColor: 'whiteAlpha.300',
        }}
      >
        <Icon as={MagnifyingGlass} size={4} color="white" ml={3} />
        <SearchInput tempSearchTerm={tempSearchTerm} setTempSearchTerm={setTempSearchTerm} />
        {isFetching ? (
          <Spinner w={4} h={4} color="white" mr={3} />
        ) : showClearButton ? (
          <IconButton
            bg="transparent"
            color="white"
            size={4}
            icon={<Icon as={X} size={3} />}
            onClick={() => {
              setTempSearchTerm('');
              dispatch(clearSearchTerm());
            }}
            aria-label={'Clear search bar'}
            _hover={{ bg: 'transparent' }}
            mr={3}
          />
        ) : tempSearchTerm === '' && isSearchFieldFocused ? (
          <Text
            color={'whiteAlpha.700'}
            fontSize={'xs'}
            whiteSpace={'nowrap'}
            mr={3.5}
            fontStyle={'italic'}
          >
            Press Enter to search
          </Text>
        ) : null}
      </Flex>
    </InputGroup>
  );
}
