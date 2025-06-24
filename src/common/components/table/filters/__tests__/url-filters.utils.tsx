import { act, renderHook } from '@testing-library/react';

import {
  FilterQueryKey,
  addressFilterMutator,
  dateFilterMutator,
  transactionTypeFilterMutator,
  useQueryUpdater,
} from '../table-filters-utils';

// Mock useRouter and useSearchParams
const mockReplace = jest.fn();
const mockShallowReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => new URLSearchParams('foo=bar'),
}));

jest.mock('@/common/hooks/useShallowRouter', () => ({
  useShallowRouter: () => ({ replace: mockShallowReplace }),
}));

describe('FilterQueryKey enum', () => {
  it('should have correct values', () => {
    expect(FilterQueryKey.StartTime).toBe('startTime');
    expect(FilterQueryKey.EndTime).toBe('endTime');
    expect(FilterQueryKey.FromAddress).toBe('fromAddress');
    expect(FilterQueryKey.ToAddress).toBe('toAddress');
    expect(FilterQueryKey.TransactionType).toBe('transactionType');
  });
});

describe('dateFilterMutator', () => {
  it('sets startTime and endTime when provided', () => {
    const params = new URLSearchParams();
    const result = dateFilterMutator(params, 123, 456);
    expect(result.get('startTime')).toBe('123');
    expect(result.get('endTime')).toBe('456');
  });

  it('removes startTime and endTime when undefined', () => {
    const params = new URLSearchParams({ startTime: '100', endTime: '200' });
    const result = dateFilterMutator(params);
    expect(result.has('startTime')).toBe(false);
    expect(result.has('endTime')).toBe(false);
  });

  it('sets only startTime if only startTime is provided', () => {
    const params = new URLSearchParams();
    const result = dateFilterMutator(params, 789);
    expect(result.get('startTime')).toBe('789');
    expect(result.has('endTime')).toBe(false);
  });

  it('sets only endTime if only endTime is provided', () => {
    const params = new URLSearchParams();
    const result = dateFilterMutator(params, undefined, 321);
    expect(result.get('endTime')).toBe('321');
    expect(result.has('startTime')).toBe(false);
  });
});

describe('addressFilterMutator', () => {
  it('sets fromAddress and toAddress when provided', () => {
    const params = new URLSearchParams();
    const result = addressFilterMutator(params, 'from', 'to');
    expect(result.get('fromAddress')).toBe('from');
    expect(result.get('toAddress')).toBe('to');
  });

  it('removes fromAddress and toAddress when undefined', () => {
    const params = new URLSearchParams({ fromAddress: 'a', toAddress: 'b' });
    const result = addressFilterMutator(params);
    expect(result.has('fromAddress')).toBe(false);
    expect(result.has('toAddress')).toBe(false);
  });

  it('sets only fromAddress if only fromAddress is provided', () => {
    const params = new URLSearchParams();
    const result = addressFilterMutator(params, 'from');
    expect(result.get('fromAddress')).toBe('from');
    expect(result.has('toAddress')).toBe(false);
  });

  it('sets only toAddress if only toAddress is provided', () => {
    const params = new URLSearchParams();
    const result = addressFilterMutator(params, undefined, 'to');
    expect(result.get('toAddress')).toBe('to');
    expect(result.has('fromAddress')).toBe(false);
  });
});

describe('transactionTypeFilterMutator', () => {
  it('sets transactionType when provided', () => {
    const params = new URLSearchParams();
    const result = transactionTypeFilterMutator(params, ['a', 'b', 'c']);
    expect(result.get('transactionType')).toBe('a,b,c');
  });

  it('removes transactionType when undefined', () => {
    const params = new URLSearchParams({ transactionType: 'a,b' });
    const result = transactionTypeFilterMutator(params);
    expect(result.has('transactionType')).toBe(false);
  });

  it('sets transactionType to empty string if empty array is provided', () => {
    const params = new URLSearchParams();
    const result = transactionTypeFilterMutator(params, []);
    expect(result.get('transactionType')).toBe('');
  });
});

describe('useQueryUpdater', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockShallowReplace.mockClear();
  });

  it('applies the mutator and calls shallowRouter.replace by default', () => {
    const mutator = jest.fn((params, value) => {
      params.set('test', value);
      return params;
    });
    const { result: queryUpdater } = renderHook(() => useQueryUpdater(mutator));
    act(() => {
      queryUpdater.current('baz');
    });
    expect(mutator).toHaveBeenCalledWith(expect.any(URLSearchParams), 'baz');
    expect(mockShallowReplace).toHaveBeenCalledWith(null, '', '?foo=bar&test=baz');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('calls router.replace when useShallow is false', () => {
    const mutator = jest.fn((params, value) => {
      params.set('test', value);
      return params;
    });
    const { result: queryUpdater } = renderHook(() => useQueryUpdater(mutator, false));
    act(() => {
      queryUpdater.current('bob');
    });
    expect(mockReplace).toHaveBeenCalledWith('?foo=bar&test=bob');
    expect(mockShallowReplace).not.toHaveBeenCalled();
  });

  it('works with no arguments', () => {
    const mutator = jest.fn(params => {
      params.set('called', 'yes');
      return params;
    });
    const { result: queryUpdater } = renderHook(() => useQueryUpdater(mutator));
    act(() => {
      queryUpdater.current();
    });
    expect(mutator).toHaveBeenCalledWith(expect.any(URLSearchParams));
    expect(mockShallowReplace).toHaveBeenCalledWith(null, '', '?foo=bar&called=yes');
  });

  it('can be used with a real filter mutator', () => {
    const { result } = renderHook(() =>
      useQueryUpdater((params, start, end) => {
        if (start) params.set(FilterQueryKey.StartTime, start.toString());
        if (end) params.set(FilterQueryKey.EndTime, end.toString());
        return params;
      })
    );
    act(() => {
      result.current(123, 456);
    });
    expect(mockShallowReplace).toHaveBeenCalledWith(null, '', '?foo=bar&startTime=123&endTime=456');
  });
});
