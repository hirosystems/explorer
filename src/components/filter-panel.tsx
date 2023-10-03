import { useColorMode } from '@chakra-ui/react';
import CheckboxBlankCircleOutlineIcon from 'mdi-react/CheckboxBlankCircleOutlineIcon';
import CheckboxMarkedCircleOutlineIcon from 'mdi-react/CheckboxMarkedCircleOutlineIcon';
import React, { memo } from 'react';
import { RiCloseLine } from 'react-icons/ri';

import { GetTransactionListTypeEnum } from '@stacks/blockchain-api-client';
import { Text, Title } from '@/ui/typography';
import { Box, Flex, Grid, GridProps, IconButton, Stack } from '@/ui/components';
import { Tag } from '@/components/tags';
import { FilterIcon } from '@/components/icons/filter';
import { Badge } from '@/common/components/Badge';

import { useFilterState } from '../appPages/common/hooks/use-filter-state';

const FILTERABLE_TYPES: GetTransactionListTypeEnum[] = [
  GetTransactionListTypeEnum.smart_contract,
  GetTransactionListTypeEnum.contract_call,
  GetTransactionListTypeEnum.token_transfer,
  GetTransactionListTypeEnum.coinbase,
  GetTransactionListTypeEnum.poison_microblock,
];

export function FilteredMessage({ ...rest }: GridProps) {
  const { toggleFilterVisibility } = useFilterState();
  return (
    <Grid p="32px" placeItems="center" textAlign="center" {...rest}>
      <Box>
        <Grid
          mx="auto"
          placeItems="center"
          size="72px"
          borderRadius="100%"
          color="textTitle"
          mb="20px"
        >
          <Box color="accent" transform="translateY(2px)" size="48px">
            <FilterIcon size="48px" />
          </Box>
        </Grid>
        <Title mb="8px" fontSize="20px">
          Transactions filtered
        </Title>
        <Text maxWidth="30ch" mx="auto" lineHeight="1.8" color="textBody">
          You have confirmed transactions, but they aren't currently visible due to your filter
          settings.
        </Text>
        <Flex alignItems="center" justifyContent="center" mx="auto" mt="16px">
          <Badge
            _hover={{ cursor: 'pointer', bg: 'bgAlt' }}
            color="textBody"
            onClick={toggleFilterVisibility}
          >
            Change filters
          </Badge>
        </Flex>
      </Box>
    </Grid>
  );
}

const CheckableElement = ({ type, value: toggled, onClick, ...rest }: any) => {
  const handleClick = () => {
    onClick?.([type, !toggled]);
  };

  const Icon = toggled ? CheckboxMarkedCircleOutlineIcon : CheckboxBlankCircleOutlineIcon;

  return (
    <Flex onClick={handleClick} _hover={{ cursor: 'pointer' }} alignItems="center" {...rest}>
      <IconButton
        color={toggled ? 'accent.light' : 'textCaption.light'}
        mr="8px"
        icon={<Icon size="16px" />}
        size="24px"
        aria-label={type}
      />
      <Tag borderWidth="1px" borderColor={`border.${useColorMode().colorMode}`} type={type} />
    </Flex>
  );
};

export const FilterPanel = memo(({ showBorder, bg, ...rest }: any) => {
  const { toggleFilter, toggleFilterVisibility, isVisible, activeFilters } = useFilterState();
  const { colorMode } = useColorMode();

  if (!isVisible) return null;

  return (
    <Flex
      data-test="filter-panel"
      height="100%"
      width="100%"
      maxWidth="100vw"
      left={['unset', 'unset', 0, 0]}
      right={['-10px', '-10px', 'unset', 'unset']}
      flexGrow={1}
      position="absolute"
      top="39px"
      overflowY="hidden"
      flexDirection="column"
      px="32px"
      pointerEvents="all"
      {...rest}
    >
      <Box
        zIndex={1}
        p="16px"
        pb="24px"
        top="1px"
        width="100%"
        borderRadius="0 0 16px 16px"
        willChange="transform, opacity"
        boxShadow="lg"
        pointerEvents="all"
        transition="280ms cubic-bezier(0.4, 0, 0.2, 1)"
        transitionProperty="opacity, transform"
        borderWidth="1px"
        borderColor={`border.${colorMode}`}
        bg={`bg.${colorMode}`}
      >
        <Box position="absolute" top="-48px" left="0" width="100%" bg="bg" height="50px" />
        <Flex pb="16px" alignItems="center" justifyContent="space-between">
          <Title>Filter transactions</Title>
          <Stack isInline alignItems="center">
            <IconButton
              onClick={toggleFilterVisibility}
              icon={<RiCloseLine />}
              aria-label="Toggle filter"
            />
          </Stack>
        </Flex>
        <Flex justifyContent="flex-start">
          <Stack alignItems="flex-start" spacing="16px" mr="16px">
            {[FILTERABLE_TYPES[0], FILTERABLE_TYPES[1], FILTERABLE_TYPES[2]].map(type => (
              <CheckableElement
                onClick={() => toggleFilter(type)}
                value={activeFilters[type]}
                type={type}
                key={type}
                data-test={type}
              />
            ))}
          </Stack>
          <Stack alignItems="flex-start" spacing="16px">
            {[FILTERABLE_TYPES[3], FILTERABLE_TYPES[4]].map(type => (
              <CheckableElement
                onClick={() => toggleFilter(type)}
                value={activeFilters[type]}
                type={type}
                key={type}
                data-test={type}
              />
            ))}
          </Stack>
        </Flex>
      </Box>
    </Flex>
  );
});
