'use client';

import { Box, Icon } from '@/ui/components';
import { CSVDownload } from 'react-csv';
import React, { memo, useEffect, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { CSVDownloadObjectType, useTxsCSVData } from '@/common/hooks/useTxsCSVData';

export const CSVDownloadButton = memo(() => {
  const [transactionData, setTransactionData] = useState<CSVDownloadObjectType[]>([]);
  const { getTxsCSVData } = useTxsCSVData();
  const {
    query: { principal },
  } = useRouter();

  useEffect(() => {
    if (transactionData.length) setTransactionData([]);
  }, [transactionData.length]);

  const donwloadCSV = () => {
    const formattedTxnData = getTxsCSVData(principal as string);
    setTransactionData(formattedTxnData);
  };

  return (
    <Box position="relative" marginLeft={'auto'} alignSelf={'center'}>
      <Box
        as="button"
        alignItems="center"
        color={'textCaption.light'}
        display="flex"
        fontSize="12px"
        _hover={{ cursor: 'pointer', color: 'textTitle' }}
        data-test="csv-download-button"
        onClick={donwloadCSV}
      >
        <Icon as={FiDownload} mr="4px" color="currentColor" size="13px" strokeWidth={1.5} />
        Export as CSV
      </Box>
      {!!transactionData.length && <CSVDownload data={transactionData} />}
    </Box>
  );
});
