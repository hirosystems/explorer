'use client';

import { useColorModeValue } from '@chakra-ui/react';
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { FC, ReactNode, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';

import { TabsContainer } from '../../../common/components/TabsContainer';
import { Box } from '../../../ui/Box';
import { Button } from '../../../ui/Button';
import { FlexProps } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Menu } from '../../../ui/Menu';
import { MenuButton } from '../../../ui/MenuButton';
import { MenuItem } from '../../../ui/MenuItem';
import { MenuList } from '../../../ui/MenuList';
import { Select } from '../../../ui/Select';
import { FilterButton } from '../../txs-filter/FilterButton';
import { CSVDownloadButton } from './CSVDownloadButton';

enum Sort {
  receiptTime = 'Receipt Time',
  feeRate = 'Fee rate',
  size = 'Size',
}

export const TxListTabsBase: FC<
  {
    confirmedList: ReactNode;
    mempoolList: ReactNode;
  } & FlexProps
> = ({ confirmedList, mempoolList, ...props }) => {
  const principal = useParams().principal;
  const [tabIndex, setTabIndex] = useState(0);
  const [sort, setSort] = useState<Sort | undefined>();
  const bg = useColorModeValue('white', 'black');
  const color = useColorModeValue('slate.700', 'slate.400');
  const borderColor = useColorModeValue('slate.300', 'slate.900');

  return (
    <TabsContainer
      setTabIndex={setTabIndex}
      title={'Recent transactions'}
      tabs={[
        {
          title: 'Confirmed',
          content: confirmedList,
        },
        {
          title: 'Pending',
          content: mempoolList,
        },
      ]}
      actions={
        <Box marginLeft={'auto'} display={'flex'} gap={4} width={['100%', '100%', '100%', 'auto']}>
          {!!principal && <CSVDownloadButton address={principal as string} />}
          {/*{tabIndex === 1 && (*/}
          {/*  <Menu>*/}
          {/*    <MenuButton*/}
          {/*      as={Button}*/}
          {/*      rightIcon={<Icon as={BsChevronDown} size={3} />}*/}
          {/*      fontSize={'sm'}*/}
          {/*      bg={bg}*/}
          {/*      color={color}*/}
          {/*      fontWeight={'semibold'}*/}
          {/*      border={'1px'}*/}
          {/*      borderColor={borderColor}*/}
          {/*    >*/}
          {/*      {sort || 'Sort by'}*/}
          {/*    </MenuButton>*/}
          {/*    <MenuList fontSize={'sm'} color={color}>*/}
          {/*      <MenuItem onClick={() => setSort(Sort.receiptTime)}>{Sort.receiptTime}</MenuItem>*/}
          {/*      <MenuItem onClick={() => setSort(Sort.feeRate)}>{Sort.feeRate}</MenuItem>*/}
          {/*      <MenuItem onClick={() => setSort(Sort.size)}>{Sort.size}</MenuItem>*/}
          {/*    </MenuList>*/}
          {/*  </Menu>*/}
          {/*)}*/}
          <FilterButton />
        </Box>
      }
      {...props}
    />
  );
};
