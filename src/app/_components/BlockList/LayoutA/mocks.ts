jest.mock('./context', () => ({
  useBlockListContext: jest.fn().mockImplementation(() => ({
    setIsUpdateListLoading: jest.fn(),
    isUpdateListLoading: false,
    setLiveUpdates: jest.fn(),
    liveUpdates: false,
    setGroupedByBtc: jest.fn(),
    groupedByBtc: false,
  })),
}));

jest.mock('./useBlockListWebSocket', () => ({
  useBlockListWebSocket: jest.fn().mockImplementation(() => ({
    latestUIBlocks: [],
    latestBlocksCount: 0,
    clearLatestBlocks: jest.fn(),
    latestBlock: undefined,
  })),
}));
