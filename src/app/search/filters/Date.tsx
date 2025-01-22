import { Flex, Icon } from '@chakra-ui/react';
import { CaretDown } from '@phosphor-icons/react';
import { ReactNode, useEffect, useState } from 'react';

import { Badge } from '../../../common/components/Badge';
import { filterToFormattedValueMap } from '../../../common/queries/useSearchQuery';
import { PopoverContent, PopoverRoot, PopoverTrigger } from '../../../components/ui/popover';
import { Button } from '../../../ui/Button';
import { Text } from '../../../ui/Text';
import { AfterForm } from './After';
import { BeforeForm } from './Before';
import { DateRangeForm } from './DateRange';

function FilterTypeButton({
  isSelected,
  setSelected,
  children,
}: {
  isSelected?: boolean;
  setSelected?: () => void;
  children: ReactNode;
}) {
  return (
    <Badge
      color={isSelected ? 'timeFilter.text' : 'textSubdued'}
      bg={isSelected ? 'timeFilter.background' : undefined}
      borderColor={isSelected ? 'timeFilter.border' : undefined}
      px={'2'}
      py={'1'}
      fontSize={'xs'}
      rounded={'full'}
      border="normal"
      fontWeight={'medium'}
      cursor={'pointer'}
      onClick={setSelected}
    >
      {children}
    </Badge>
  );
}

interface DateFilterProps {
  defaultStartTime?: string;
  defaultEndTime?: string;
}

export function DateFilter({ defaultStartTime, defaultEndTime }: DateFilterProps) {
  const defaultStartTimeNumber = isNaN(Number(defaultStartTime)) ? null : Number(defaultStartTime);
  const defaultEndTimeNumber = isNaN(Number(defaultEndTime)) ? null : Number(defaultEndTime);
  const [open, setOpen] = useState(false);

  const populatedFilter =
    defaultStartTime && defaultEndTime
      ? 'dateRange'
      : defaultStartTime
        ? 'after'
        : defaultEndTime
          ? 'before'
          : null;

  const buttonText =
    populatedFilter === 'dateRange'
      ? 'Date range:'
      : populatedFilter === 'before'
        ? 'Before:'
        : populatedFilter === 'after'
          ? 'After:'
          : 'Date';

  const [selectedFilterType, setSelectedFilterType] = useState<'dateRange' | 'before' | 'after'>(
    populatedFilter || 'dateRange'
  );

  useEffect(() => {
    setSelectedFilterType(populatedFilter || 'dateRange');
  }, [populatedFilter]);

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-start' }}
      open={open}
      onOpenChange={e => setOpen(e.open)}
    >
      <PopoverTrigger asChild>
        <Button
          variant={'secondary'}
          fontSize={'sm'}
          rightIcon={
            <Icon h={3.5} w={3.5} style={{ strokeWidth: '2px' }}>
              <CaretDown />
            </Icon>
          }
          height={9}
          color={'textSubdued'}
        >
          <Flex gap={0.5}>
            {!populatedFilter ? (
              <Text>Date</Text>
            ) : (
              <>
                <Text display={['none', 'none', 'inline']}>{buttonText}</Text>
                {!!defaultStartTime && (
                  <Text color={'text'}>
                    {filterToFormattedValueMap.startTime(defaultStartTime)}
                  </Text>
                )}
              </>
            )}
            {!!defaultStartTime && !!defaultEndTime && (
              <Text color={'text'} fontSize={'sm'}>
                -
              </Text>
            )}
            {!!defaultEndTime && (
              <Text color={'text'}>{filterToFormattedValueMap.startTime(defaultEndTime)}</Text>
            )}
          </Flex>
        </Button>
      </PopoverTrigger>
      <PopoverContent maxWidth={'256px'} bgColor={'surface'}>
        <Flex direction={'column'} gap={4} p={4}>
          <Flex gap={'2'} flexWrap={'wrap'}>
            <FilterTypeButton
              isSelected={selectedFilterType === 'dateRange'}
              setSelected={() => setSelectedFilterType('dateRange')}
            >
              Date range
            </FilterTypeButton>
            <FilterTypeButton
              isSelected={selectedFilterType === 'before'}
              setSelected={() => setSelectedFilterType('before')}
            >
              Before
            </FilterTypeButton>
            <FilterTypeButton
              isSelected={selectedFilterType === 'after'}
              setSelected={() => setSelectedFilterType('after')}
            >
              After
            </FilterTypeButton>
          </Flex>
          {selectedFilterType === 'dateRange' ? (
            <DateRangeForm
              defaultStartTime={populatedFilter === 'dateRange' ? defaultStartTimeNumber : null}
              defaultEndTime={populatedFilter === 'dateRange' ? defaultEndTimeNumber : null}
              onClose={() => setOpen(false)}
            />
          ) : selectedFilterType === 'before' ? (
            <BeforeForm
              defaultEndTime={populatedFilter === 'before' ? defaultEndTimeNumber : null}
              onClose={() => setOpen(false)}
            />
          ) : selectedFilterType === 'after' ? (
            <AfterForm
              defaultStartTime={populatedFilter === 'after' ? defaultStartTimeNumber : null}
              onClose={() => setOpen(false)}
            />
          ) : null}
        </Flex>
      </PopoverContent>
    </PopoverRoot>
  );
}
