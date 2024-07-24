import { Backspace, FunnelSimple } from '@phosphor-icons/react';

import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Text } from '../../../ui/Text';
import { TextLink } from '../../../ui/TextLink';
import { AddressFilter } from './Address';
import { DateFilter } from './Date';

export interface FilterProps {
  filters: Record<string, string | undefined>;
}
export function Filters({ filters }: FilterProps) {
  return (
    <Flex
      direction={'column'}
      gap={4}
      pt={5}
      pl={6}
      pr={6}
      pb={6}
      boxShadow={'0px 4px 10px 2px rgba(0, 0, 0, 0.03)'}
      rounded={'xl'}
      border={'1px'}
    >
      <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'} color={'text'}>
          <Icon as={FunnelSimple} size={4} />
          <Text fontSize={'sm'} fontWeight={'medium'} lineHeight={'1.43em'}>
            Filters
          </Text>
        </Flex>
        {Object.keys(filters).length > 0 && (
          <Flex gap={2} alignItems={'center'}>
            <TextLink
              href={'/search'}
              variant={'secondary'}
              width={'full'}
              fontSize={'sm'}
              fontWeight={'medium'}
              display={'flex'}
              gap={1.5}
              color="textSubdued"
            >
              <Icon as={Backspace} size={4} />
              <span>Clear all filters</span>
            </TextLink>
          </Flex>
        )}
      </Flex>
      <Flex gap={2} mt={0.5} direction={['column', 'row']}>
        <AddressFilter
          defaultFromAddress={filters.fromAddress}
          defaultToAddress={filters.toAddress}
        />
        <DateFilter defaultStartTime={filters.startTime} defaultEndTime={filters.endTime} />
      </Flex>
    </Flex>
  );
}
