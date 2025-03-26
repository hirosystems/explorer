import * as React from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import Page from './PageClient';

export default async function (props: { searchParams: Promise<Record<string, string>> }) {
  const searchParams = await props.searchParams;
  const filters = Object.fromEntries(
    Object.entries(searchParams).filter(
      ([key]) =>
        ['startTime', 'endTime', 'fromAddress', 'toAddress'].includes(key) ||
        key.startsWith('term_')
    )
  );

  return <Page filters={filters} />;
}
