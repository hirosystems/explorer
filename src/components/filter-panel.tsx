import React from 'react';
import { Box, color, Flex, Grid, GridProps, Stack } from '@stacks/ui';
import { Text, Title } from '@components/typography';
import { border } from '@common/utils';
import { IconButton } from '@components/icon-button';
import CheckboxBlankCircleOutlineIcon from 'mdi-react/CheckboxBlankCircleOutlineIcon';
import { Tag } from '@components/tags';
import CloseIcon from 'mdi-react/CloseIcon';
import { useHover } from 'use-events';
import CheckboxMarkedCircleOutlineIcon from 'mdi-react/CheckboxMarkedCircleOutlineIcon';
import { blue } from '@components/button';
import { FilterIcon } from '@components/icons/filter';
import { Badge } from '@components/badge';
import { useFilterState } from '@common/hooks/use-filter-state';
import { GetTransactionListTypeEnum } from '@stacks/blockchain-api-client';

const FILTERABLE_TYPES: GetTransactionListTypeEnum[] = [
  GetTransactionListTypeEnum.smart_contract,
  GetTransactionListTypeEnum.contract_call,
  GetTransactionListTypeEnum.token_transfer,
  GetTransactionListTypeEnum.coinbase,
];

export const FilteredMessage: React.FC<GridProps> = ({ ...rest }) => {
  const { toggleFilterVisibility } = useFilterState();
  return (
    <Grid p="extra-loose" placeItems="center" textAlign="center" {...rest}>
      <Box>
        <Grid
          mx="auto"
          placeItems="center"
          size="72px"
          borderRadius="100%"
          color={color('text-title')}
          mb="base-loose"
          bg={blue(0.3)}
        >
          <Box color={color('accent')} transform="translateY(2px)" size="48px">
            <FilterIcon size="48px" />
          </Box>
        </Grid>
        <Title mb="tight" fontSize="20px">
          Transactions filtered
        </Title>
        <Text maxWidth="30ch" mx="auto" lineHeight="1.8" color={color('text-body')}>
          You have confirmed transactions, but they aren't currently visible due to your filter
          settings.
        </Text>
        <Flex alignItems="center" justifyContent="center" mx="auto" mt="base">
          <Badge
            _hover={{ cursor: 'pointer', bg: color('bg-alt') }}
            border={border()}
            color={color('text-body')}
            onClick={toggleFilterVisibility}
          >
            Change filters
          </Badge>
        </Flex>
      </Box>
    </Grid>
  );
};

const CheckableElement = ({ type, value: toggled, onClick, ...rest }: any) => {
  const [isHovered, bind] = useHover();

  const handleClick = () => {
    onClick?.([type, !toggled]);
  };

  const Icon = toggled ? CheckboxMarkedCircleOutlineIcon : CheckboxBlankCircleOutlineIcon;

  return (
    <Flex
      onClick={handleClick}
      _hover={{ cursor: 'pointer' }}
      alignItems="center"
      {...bind}
      {...rest}
    >
      <IconButton
        color={toggled ? color('accent') : color('text-caption')}
        isHovered={isHovered}
        mr="tight"
        icon={Icon}
        size="24px"
        iconSize="16px"
        dark
      />
      <Tag border={border()} type={type} />
    </Flex>
  );
};

export const FilterPanel = React.memo(({ filterKey, showBorder, bg, ...rest }: any) => {
  const { toggleFilter, toggleFilterVisibility, isVisible, activeFilters } = useFilterState();

  const borderStyles = showBorder
    ? {
        border: border(),
      }
    : {};

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
      top="45px"
      overflowY="hidden"
      flexDirection="column"
      px="extra-loose"
      pointerEvents="none"
      {...rest}
    >
      <Box
        zIndex={100}
        p="base"
        pb="loose"
        top="1px"
        bg={bg}
        width="100%"
        borderRadius="0 0 16px 16px"
        willChange="transform, opacity"
        boxShadow="high"
        pointerEvents="all"
        transition={`280ms cubic-bezier(0.4, 0, 0.2, 1)`}
        transitionProperty="opacity, transform"
        {...borderStyles}
      >
        <Box
          position="absolute"
          top={'-48px'}
          left="0"
          width="100%"
          bg={color('bg')}
          height="50px"
        />
        <Flex pb="base" alignItems="center" justifyContent="space-between">
          <Title>Filter transactions</Title>
          <Stack isInline alignItems="center">
            <IconButton onClick={toggleFilterVisibility} dark icon={CloseIcon} />
          </Stack>
        </Flex>
        <Flex justifyContent="flex-start">
          <Stack alignItems="flex-start" spacing="base" mr="base">
            {[FILTERABLE_TYPES[0], FILTERABLE_TYPES[1]].map(type => (
              <CheckableElement
                onClick={() => toggleFilter(type)}
                value={activeFilters[type]}
                type={type}
                key={type}
                data-test={type}
              />
            ))}
          </Stack>
          <Stack alignItems="flex-start" spacing="base">
            {[FILTERABLE_TYPES[2], FILTERABLE_TYPES[3]].map(type => (
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
