import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

import { ONE_MINUTE } from '../queries/query-stale-time';

export const RelativeTimeDisplay = ({ timestampInMs }: { timestampInMs: number }) => {
  const [time, setTime] = useState('');

  const updateRelativeTime = useCallback(() => {
    setTime(dayjs().to(dayjs(timestampInMs)));
  }, [timestampInMs, setTime]);

  useEffect(() => {
    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, ONE_MINUTE);

    return () => clearInterval(interval);
  }, [timestampInMs, updateRelativeTime]);

  return <>{time}</>;
};

export default RelativeTimeDisplay;
