import { formatTimestampTo12HourTime } from '../time-utils';

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
