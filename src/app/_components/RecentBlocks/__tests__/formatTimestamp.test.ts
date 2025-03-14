import { formatTimestamp } from '../utils';

describe('formatTimestamp', () => {
  it('should format a timestamp correctly', () => {
    const timestamp = 1672531199000;
    const formatted = formatTimestamp(timestamp);
    expect(formatted).toBe('11:43:20 PM (UTC)');
  });
});
