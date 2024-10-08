import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

import { ONE_MINUTE } from '../queries/query-stale-time';

export const RelativeTimeDisplay = ({ timestampInMs }: { timestampInMs: number }) => {
  const [time, setTime] = useState('');

  const updateRelativeTime = useCallback(() => {
    setTime(dayjs().to(dayjs(timestampInMs * 1000)));
  }, [timestampInMs, setTime]);

  useEffect(() => {
    updateRelativeTime(); // Update immediately on mount
    const interval = setInterval(updateRelativeTime, ONE_MINUTE); // Update every minute

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [timestampInMs, updateRelativeTime]); // Dependencies array: the effect depends on the timestamp

  const now = Date.now() / 1000;
  const diff = Math.round(now - timestampInMs);
  const lessThanOneMinute = diff >= 0 && diff < 60;
  if (lessThanOneMinute) {
    return <>{diff}s ago</>;
  }

  return <>{time}</>;
};

export default RelativeTimeDisplay;
