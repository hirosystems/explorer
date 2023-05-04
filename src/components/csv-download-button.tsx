'use client';

import { useFilterState } from '@/app/common/hooks/use-filter-state';
import { CSVDownloadObjectType, getTxnData } from '@/common/utils/csv-download-utils';
import { Box, Icon } from '@/ui/components';
import { CSVLink } from 'react-csv';
import { Caption } from '@/ui/typography';
import React, { memo, useRef, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import { useQueryClient } from 'react-query';

import { useRouter } from 'next/router';

export const CSVDownloadButton = memo(() => {
  const [transactionData, setTransactionData] = useState<CSVDownloadObjectType[]>([]);
  const queryClient = useQueryClient();
  const { activeFilters } = useFilterState();
  const {
    query: { principal },
  } = useRouter();
  const csvLink = useRef<CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }>(null);

  const donwloadCSV = () => {
    const formattedTxnData = getTxnData(queryClient, activeFilters, principal as string);

    setTransactionData(formattedTxnData);
    console.log(formattedTxnData[0]);

    // This is added to prevent immediate invocation of click function.
    // Click should get invoked after the setState render is finished
    setTimeout(() => {
      if (csvLink.current && csvLink.current.link) csvLink.current.link.click();
    }, 0);
  };

  return (
    <Box position="relative" marginLeft={'auto'} alignSelf={'center'}>
      <Caption
        display="flex"
        alignItems="center"
        _hover={{ cursor: 'pointer', color: 'textTitle' }}
        data-test="csv-download-button"
        position="relative"
        zIndex={999}
        onClick={donwloadCSV}
      >
        <Icon as={FiDownload} mr="4px" color="currentColor" size="13px" strokeWidth={1.5} />
        Export as CSV
      </Caption>
      <CSVLink
        data={transactionData}
        filename="transactions.csv"
        className="hidden"
        ref={csvLink}
        target="_blank"
      />
    </Box>
  );
});
