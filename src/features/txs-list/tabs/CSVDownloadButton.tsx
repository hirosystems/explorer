'use client';

import { useColorMode } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { CSVDownload } from 'react-csv';
import { FiDownload } from 'react-icons/fi';

import { Box } from '../../../ui/Box';
import { Icon } from '../../../ui/Icon';
import { CSVDownloadObjectType, useTxsCSVData } from './useTxsCSVData';

export function CSVDownloadButton({ address }: { address: string }) {
  const [transactionData, setTransactionData] = useState<CSVDownloadObjectType[]>([]);
  const { getTxsCSVData } = useTxsCSVData();

  useEffect(() => {
    if (transactionData.length) setTransactionData([]);
  }, [transactionData.length]);

  const downloadCSV = () => {
    const formattedTxnData = getTxsCSVData(address);
    setTransactionData(formattedTxnData);
  };

  const colorMode = useColorMode().colorMode;

  return (
    <Box position="relative" marginLeft={'auto'} alignSelf={'center'}>
      <Box
        as="button"
        alignItems="center"
        color={`textCaption.${colorMode}`}
        display="flex"
        fontSize="12px"
        _hover={{ cursor: 'pointer', color: 'textTitle' }}
        data-test="csv-download-button"
        onClick={downloadCSV}
        flexWrap={'nowrap'}
        whiteSpace={'nowrap'}
      >
        <Icon as={FiDownload} mr="4px" color="currentColor" size="13px" strokeWidth={1.5} />
        Export as CSV
      </Box>
      {!!transactionData.length && <CSVDownload data={transactionData} />}
    </Box>
  );
}
