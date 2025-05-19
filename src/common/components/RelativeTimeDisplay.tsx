import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

import { ONE_MINUTE } from '../queries/query-stale-time';

export const RelativeTimeDisplay = ({ timestampInSeconds }: { timestampInSeconds: number }) => {
  const [time, setTime] = useState('');

  const updateRelativeTime = useCallback(() => {
    setTime(dayjs().to(dayjs(timestampInSeconds * 1000)));
  }, [timestampInSeconds, setTime]);

  useEffect(() => {
    updateRelativeTime(); // Update immediately on mount
    const interval = setInterval(updateRelativeTime, ONE_MINUTE); // Update every minute

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [timestampInSeconds, updateRelativeTime]); // Dependencies array: the effect depends on the timestamp

  const now = Date.now() / 1000;
  const diff = Math.round(now - timestampInSeconds);
  const lessThanOneMinute = diff >= 0 && diff < 60;
  if (lessThanOneMinute) {
    return <>{'<1 minute ago'}</>;
  }

  return <>{time}</>;
};

export default RelativeTimeDisplay;
