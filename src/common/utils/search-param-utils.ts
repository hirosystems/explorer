import { useSearchParams } from 'next/navigation';

export function useFilterParams() {
  const params = new URLSearchParams(useSearchParams());
  const filterParams: Record<string, string> = {};
  params.forEach((value, filter) => {
    if (
      filter === 'fromAddress' ||
      filter === 'toAddress' ||
      filter === 'startTime' ||
      filter === 'endTime' ||
      filter.startsWith('term_')
    ) {
      filterParams[filter] = value;
    }
  });
  return filterParams;
}
