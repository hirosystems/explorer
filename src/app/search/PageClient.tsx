'use client';

import React from 'react';

import { Section } from '../../common/components/Section';
import { filterToFormattedValueMap, getKeywordByFilter } from '../../common/queries/useSearchQuery';
import { Flex } from '../../ui/Flex';
import { Text } from '../../ui/Text';
import { TxSearchResult } from './TxSearchResult';
import { FilterProps, Filters } from './filters';

export default function ({ filters }: FilterProps) {
  return (
    <Section px={0}>
      <Flex p={6} gap={4} flexDirection={'column'} borderBottom={'1px'}>
        <Flex
          rowGap={2}
          columnGap={2.5}
          flexWrap={'wrap'}
          alignItems={'center'}
          color={'textSubdued'}
        >
          <Text fontSize={'sm'}>Search results for:</Text>
          {Object.keys(filters).map(key => {
            const value = filters[key];
            const keyword = getKeywordByFilter(key);
            return (
              <Text key={key} fontSize={'sm'}>
                {!!keyword && (
                  <Text
                    display="inline-block"
                    bg="surfaceHighlight"
                    borderRadius="md"
                    py={1.5}
                    whiteSpace="pre"
                    textTransform={'uppercase'}
                  >
                    {' '}
                    {getKeywordByFilter(key)}{' '}
                  </Text>
                )}{' '}
                {value && filterToFormattedValueMap[key]
                  ? filterToFormattedValueMap[key](value)
                  : value || ''}
              </Text>
            );
          })}
        </Flex>
        <Filters filters={filters} />
      </Flex>
      <Flex px={6} flexDirection={'column'}>
        <TxSearchResult filters={filters} />
      </Flex>
    </Section>
  );
}
