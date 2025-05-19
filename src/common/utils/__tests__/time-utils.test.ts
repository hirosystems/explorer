import {
  formatTimestamp,
  formatTimestampTo12HourTime,
  formatTimestampToRelativeTime,
} from '../time-utils';

describe('Timezones', () => {
  it('should always be UTC', () => {
    expect(new Date().getTimezoneOffset()).toBe(0);
  });
});

describe('formatTimestampTo12HourTime', () => {
  it('formats timestamp as 12-hour time in UTC by default', () => {
    const timestamp = 1718064000;
    expect(formatTimestampTo12HourTime(timestamp)).toBe('12:00:00 AM (UTC)');
  });

  it('formats timestamp as 12-hour time in UTC (explicit)', () => {
    const timestamp = 1718101530;
    expect(formatTimestampTo12HourTime(timestamp, { useLocalTime: false })).toBe(
      '10:25:30 AM (UTC)'
    );
  });

  it('formats timestamp as 12-hour time in local time', () => {
    const timestamp = 1718101530;
    const originalDate = global.Date;

    // Mock Date to return consistent values
    global.Date = class extends Date {
      constructor() {
        super();
      }
      getHours() {
        return 5;
      }
      getMinutes() {
        return 25;
      }
      getSeconds() {
        return 30;
      }
    } as any;

    expect(formatTimestampTo12HourTime(timestamp, { useLocalTime: true })).toBe('5:25:30 AM');

    // Restore original Date
    global.Date = originalDate;
  });
});

describe('formatTimestampToRelativeTime', () => {
  beforeAll(() => {
    // Freeze time for consistent test results
    jest.spyOn(Date, 'now').mockImplementation(() => new Date('2024-06-01T12:34:56Z').getTime());
  });

  afterAll(() => {
    // Restore Date.now
    (Date.now as jest.Mock).mockRestore();
  });

  it('formats a timestamp to relative time', () => {
    // 10 minutes ago from the frozen time
    const tenMinutesAgo = Math.floor(new Date('2024-06-01T12:24:56Z').getTime() / 1000);
    expect(formatTimestampToRelativeTime(tenMinutesAgo)).toBe('10 minutes ago');
  });

  it('formats timestamps under one minute to \"<1 minute ago\"', () => {
    // 30 seconds ago from the frozen time
    const thirtySecondsAgo = Math.floor(new Date('2024-06-01T12:34:26Z').getTime() / 1000);
    expect(formatTimestampToRelativeTime(thirtySecondsAgo)).toBe('<1 minute ago');
  });
});

describe('formatTimestamp', () => {
  it('formats a timestamp to the default format', () => {
    // 2024-06-01 12:34:56 UTC
    const timestamp = 1717248896;
    // The expected string is what you would get from new Date(1717248896 * 1000)
    expect(formatTimestamp(timestamp)).toBe('2024-06-01 13:34:56');
  });

  it('formats a timestamp to a custom format', () => {
    const timestamp = 1717248896;
    expect(formatTimestamp(timestamp, 'MM/dd/yyyy')).toBe('06/01/2024');
  });
});
