import { CMS_URL } from '../common/constants/env';
import { IncidentContent } from '../common/types/incidents';

export async function getStatusBarContent(): Promise<IncidentContent | null> {
  return CMS_URL
    ? fetch(CMS_URL, {
        next: { revalidate: 60 }, // Revalidate every 1 minute
      }).then(res => res.json())
    : Promise.resolve(null);
}
