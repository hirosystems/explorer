import { formatDateShort } from '../date-utils';

describe('formatDateShort', () => {
  it('should format a timestamp to a short date format with day and month', () => {
    const date = new Date(2023, 0, 1);
    const timestamp = date.getTime();
    const formatted = formatDateShort(timestamp);
    expect(formatted).toBe('01 Jan');
  });

  it('should format different dates correctly', () => {
    expect(formatDateShort(new Date(2023, 1, 1).getTime())).toBe('01 Feb');
    expect(formatDateShort(new Date(2023, 11, 31).getTime())).toBe('31 Dec');
  });

  it('should handle date boundaries and leap year correctly', () => {
    expect(formatDateShort(new Date(2022, 0, 1).getTime())).toBe('01 Jan');
    expect(formatDateShort(new Date(2024, 1, 29).getTime())).toBe('29 Feb');
    expect(formatDateShort(new Date(2024, 0, 1).getTime())).toBe('01 Jan');
  });
});
