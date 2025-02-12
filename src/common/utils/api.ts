import { ApiResponseWithCursorPagination } from '../types/api';

export function getPreviousPageCursorParam<T>(response?: ApiResponseWithCursorPagination<T>) {
  return response?.prev_cursor;
}

export function getNextPageCursorParam<T>(response?: ApiResponseWithCursorPagination<T>) {
  return response?.next_cursor;
}
