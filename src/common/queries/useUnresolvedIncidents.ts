import { useQuery } from '@tanstack/react-query';
import { Statuspage } from 'statuspage.io';

const statusPage = new Statuspage('3111l89394q4');

export function useUnresolvedIncidents() {
  return useQuery({
    queryKey: ['unresolvedIncidents'],
    queryFn: () => statusPage.api.incidents.getUnresolved(),
    refetchInterval: 1000 * 60 * 10,
  });
}
