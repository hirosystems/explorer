import * as React from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import Page from './PageClient';

export default async function ({
  searchParams: { startTime, endTime, fromAddress, toAddress },
}: {
  searchParams: {
    startTime?: string;
    endTime?: string;
    fromAddress?: string;
    toAddress?: string;
  };
}) {
  return (
    <Page
      filters={{
        fromAddress,
        toAddress,
        startTime,
        endTime,
      }}
    />
  );
}
