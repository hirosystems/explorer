'use client';

// this is here due to a limited type in the @stacks/stacks-blockchain-api-client library
export interface ApiResponseWithResultsOffset<Data> {
  limit: number;
  offset: number;
  total: number;
  results: Data[];
}

export interface ApiResponseWithCursorPagination<Data> {
  limit: number;
  offset: number;
  total: number;
  next_cursor: string | null;
  prev_cursor: string | null;
  cursor: string;
  results: Data[];
}
