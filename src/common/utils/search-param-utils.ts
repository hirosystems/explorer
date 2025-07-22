import { usePathname, useSearchParams } from 'next/navigation';

export function useFilterParams() {
  const pathname = usePathname();
  const isSearchPage = pathname === '/search';

  const params = new URLSearchParams(useSearchParams());
  const filterParams: Record<string, string> = {};

  if (isSearchPage) {
    params.forEach((value, filter) => {
      if (
        filter === 'fromAddress' ||
        filter === 'toAddress' ||
        filter === 'startTime' ||
        filter === 'endTime' ||
        filter === 'transactionType' ||
        filter.startsWith('term_')
      ) {
        filterParams[filter] = value;
      }
    });
  }

  return filterParams;
}
