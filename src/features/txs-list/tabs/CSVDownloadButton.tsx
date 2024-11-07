'use client';

import { Box, Icon } from '@chakra-ui/react';
import { DownloadSimple } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { CSVDownload } from 'react-csv';

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

  return (
    <Box position="relative" marginLeft={'auto'} alignSelf={'center'}>
      <Box
        as="button"
        alignItems="center"
        color={`text`}
        display="flex"
        fontSize="xs"
        _hover={{ cursor: 'pointer', color: 'textTitle' }}
        data-test="csv-download-button"
        onClick={downloadCSV}
        flexWrap={'nowrap'}
        whiteSpace={'nowrap'}
      >
        <Icon mr={1} color="currentColor" h={3} w={3} strokeWidth={1.5}>
          <DownloadSimple />
        </Icon>
        Export as CSV
      </Box>
      {!!transactionData.length && <CSVDownload data={transactionData} />}
    </Box>
  );
}
