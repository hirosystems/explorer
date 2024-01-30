import {
  TransactionValueFilterTypes,
  setTransactionValueFilter,
} from '@/common/state/slices/transaction-value-filter-slice';
import { Box, useColorModeValue } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { BsChevronDown } from 'react-icons/bs';
import { PiCurrencyDollar } from 'react-icons/pi';

import { useAppDispatch, useAppSelector } from '../../common/state/hooks';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import { Menu } from '../../ui/Menu';
import { MenuButton } from '../../ui/MenuButton';
import { MenuItem } from '../../ui/MenuItem';
import { MenuList } from '../../ui/MenuList';

const StyledContainer = styled(Box)`
  .menu-button {
    :hover {
      background: none;
    }
  }

  .menu-list {
    font-size: 16px;
  }

  .menu-item {
    background-color: 'orange !important';

    &:active {
      background-color: 'orange !important';
    }
    :active {
      background-color: 'orange !important';
    }
  }

  .additional-info {
    margin-left: 12px;
    margin-top: 4px;
  }
`;

function getActiveTransactionValueFilterLabel(
  activeTransactionValueFilter: TransactionValueFilterTypes
) {
  if (activeTransactionValueFilter === TransactionValueFilterTypes.CurrentValue) {
    return 'Current value';
  }
  if (
    activeTransactionValueFilter === TransactionValueFilterTypes.EstimatedValueOnDayOfTransaction
  ) {
    return 'Estimated value on day of transaction';
  }
}

export function ShowValueMenu() {
  const dispatch = useAppDispatch();
  const activeTransactionValueFilter = useAppSelector(
    state => state.activeTransactionValueFilter.activeTransactionValueFilter
  );

  const bg = useColorModeValue('white', 'black');
  const color = useColorModeValue('slate.700', 'slate.400');
  const blackColor = useColorModeValue('slate.900', 'slate.900');
  const borderColor = useColorModeValue('slate.300', 'slate.900');

  return (
    <StyledContainer>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<Icon as={BsChevronDown} size={3} color={blackColor} />}
          leftIcon={<Icon as={PiCurrencyDollar} size={4} />}
          fontSize={'sm'}
          bg={bg}
          color={color}
          fontWeight={'semibold'}
          border={'1px'}
          borderColor={borderColor}
        >
          <Box display="inline" fontWeight="normal">
            Show:{' '}
          </Box>
          <Box display="inline" fontWeight="normal" color={blackColor}>
            {getActiveTransactionValueFilterLabel(activeTransactionValueFilter)}
          </Box>
        </MenuButton>
        <MenuList fontSize={'sm'} color={color} padding="8px">
          {Object.keys(TransactionValueFilterTypes).map(filterType => (
            <MenuItem
              color={blackColor}
              onClick={() => {
                dispatch(setTransactionValueFilter(filterType as TransactionValueFilterTypes));
              }}
            >
              {getActiveTransactionValueFilterLabel(filterType as TransactionValueFilterTypes)}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </StyledContainer>
  );
}
