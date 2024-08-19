import * as React from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import Page from './PageClient';

export default async function ({ searchParams }: { searchParams: Record<string, string> }) {
  const filter = Object.fromEntries(
    Object.entries(searchParams).filter(
      ([key]) =>
        ['startTime', 'endTime', 'fromAddress', 'toAddress'].includes(key) ||
        key.startsWith('term_')
    )
  );

  return <Page filters={filter} />;
}
