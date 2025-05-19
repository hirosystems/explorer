import { toRelativeTime } from '../utils';

describe('toRelativeTime', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01T00:01:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns "<1 minute ago" for timestamps within the last minute', () => {
    const ts = new Date('2023-01-01T00:00:30Z').getTime();
    const result = toRelativeTime(ts);
    expect(result).toBe('<1 minute ago');
  });
});
