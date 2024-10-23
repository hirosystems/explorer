import { useColorModeValue } from '@chakra-ui/react';
import { CaretDown } from '@phosphor-icons/react';
import { ReactNode, useEffect, useState } from 'react';

import { Badge } from '../../../common/components/Badge';
import { filterToFormattedValueMap } from '../../../common/queries/useSearchQuery';
import { Button } from '../../../ui/Button';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Popover } from '../../../ui/Popover';
import { PopoverContent } from '../../../ui/PopoverContent';
import { PopoverTrigger } from '../../../ui/PopoverTrigger';
import { Stack } from '../../../ui/Stack';
import { Text } from '../../../ui/Text';
import { useDisclosure } from '../../../ui/hooks/useDisclosure';
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
  const purpleBadgeColor = useColorModeValue('purple.600', 'purple.300');
  const purpleBadgeBg = useColorModeValue('purple.100', 'purple.900');
  const badgeBorder = useColorModeValue('purple.300', 'purple.700');

  return (
    <Badge
      color={isSelected ? purpleBadgeColor : 'textSubdued'}
      bg={isSelected ? purpleBadgeBg : undefined}
      borderColor={isSelected ? badgeBorder : undefined}
      px={'2'}
      py={'1'}
      fontSize={'xs'}
      rounded={'full'}
      border={'1px'}
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
  const { onOpen, onClose, isOpen } = useDisclosure();
  const defaultStartTimeNumber = isNaN(Number(defaultStartTime)) ? null : Number(defaultStartTime);
  const defaultEndTimeNumber = isNaN(Number(defaultEndTime)) ? null : Number(defaultEndTime);

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
    <Popover placement={'bottom-start'} isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button
          variant={'secondary'}
          fontSize={'sm'}
          rightIcon={<Icon as={CaretDown} style={{ strokeWidth: '2px' }} />}
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
        <Stack gap={4} p={4}>
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
              onClose={onClose}
            />
          ) : selectedFilterType === 'before' ? (
            <BeforeForm
              defaultEndTime={populatedFilter === 'before' ? defaultEndTimeNumber : null}
              onClose={onClose}
            />
          ) : selectedFilterType === 'after' ? (
            <AfterForm
              defaultStartTime={populatedFilter === 'after' ? defaultStartTimeNumber : null}
              onClose={onClose}
            />
          ) : null}
        </Stack>
      </PopoverContent>
    </Popover>
  );
}
