import { openModal } from '@/common/components/modals/modal-slice';
import { ClearFiltersButton } from '@/common/components/table/filters/ClearFiltersButton';
import { SingleAddressFilterPopover } from '@/common/components/table/filters/single-address-filter.tsx/SingleAddressFilterPopover';
import { MODALS } from '@/common/constants/constants';
import { useAppDispatch } from '@/common/state/hooks';
import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import { Flex, Icon } from '@chakra-ui/react';
import { Funnel } from '@phosphor-icons/react';
import { useMemo } from 'react';

import { EventAssetTypeFilterPopover } from './filters/EventAssetTypeFilterPopover';
import { useEventsTableFilters } from './filters/useEventsTableFilters';

const MobileOpenFilterModalButton = () => {
  // TODO: lots in common with TxTableFilters MobileOpenFilterModalButton
  const dispatch = useAppDispatch();

  return (
    <Button
      display={{ base: 'flex', md: 'none' }}
      alignItems={'center'}
      py={1.5}
      px={4}
      onClick={() => dispatch(openModal(MODALS.TxsTableFilters))}
      variant="redesignTertiary"
      w="full"
      h={10}
    >
      <Flex gap={1.5} alignItems={'center'}>
        <Text textStyle="text-medium-sm" color="textSecondary">
          Filter
        </Text>
        <Icon h={3.5} w={3.5} color="iconSecondary">
          <Funnel weight="bold" />
        </Icon>
      </Flex>
    </Button>
  );
};

export const EventsTableFilters = () => {
  const {
    eventAssetTypes,
    address,
    eventAssetTypeFilterHandler,
    addressFilterHandler,
    clearAllFiltersHandler,
  } = useEventsTableFilters();

  const areAnyFiltersActive = useMemo(() => {
    // TODO: put this util function somewhere else
    return eventAssetTypes.length > 0 || address !== '';
  }, [eventAssetTypes, address]);

  return (
    <Flex flexWrap={'wrap'} gap={4}>
      <MobileOpenFilterModalButton />
      <Flex display={{ base: 'none', md: 'flex' }} gap={3} alignItems={'center'} h="full">
        <Text textStyle="text-regular-sm" color="textSecondary">
          Filter:
        </Text>
        <Flex gap={3} h={7}>
          <EventAssetTypeFilterPopover
            defaultEventAssetTypes={eventAssetTypes}
            eventAssetTypeFilterHandler={eventAssetTypeFilterHandler}
          />
          <SingleAddressFilterPopover
            defaultAddress={address}
            addressFilterHandler={addressFilterHandler}
          />
          {areAnyFiltersActive && (
            <ClearFiltersButton clearAllFiltersHandler={clearAllFiltersHandler} />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
