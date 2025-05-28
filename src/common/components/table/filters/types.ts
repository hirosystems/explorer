export enum FilterSearchParam {
  FROM_ADDRESS = 'fromAddress',
  TO_ADDRESS = 'toAddress',
  START_TIME = 'startTime',
  END_TIME = 'endTime',
  TRANSACTION_TYPE = 'transactionType',
}

export const filterSearchParamsList: FilterSearchParam[] = [
  FilterSearchParam.FROM_ADDRESS,
  FilterSearchParam.TO_ADDRESS,
  FilterSearchParam.START_TIME,
  FilterSearchParam.END_TIME,
  FilterSearchParam.TRANSACTION_TYPE,
];

export type FilterSearchParams = {
  [FilterSearchParam.FROM_ADDRESS]: string;
  [FilterSearchParam.TO_ADDRESS]: string;
  [FilterSearchParam.START_TIME]: string;
  [FilterSearchParam.END_TIME]: string;
  [FilterSearchParam.TRANSACTION_TYPE]: string[];
};
