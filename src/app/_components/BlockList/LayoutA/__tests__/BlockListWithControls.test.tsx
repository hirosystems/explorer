import { render } from '@testing-library/react';

import { UIBlock, UIBlockType } from '../../types';
import { BlockListWithControls } from '../BlockListWithControls';
import { BlockListProvider } from '../Provider';

const date = new Date('2024-01-01T00:00:00Z').getTime();

describe('BlockListWithControls', () => {
  it('renders correctly', () => {
    const blockList: UIBlock[] = [
      {
        type: UIBlockType.Block,
        height: 1,
        hash: 'hash1',
        timestamp: date,
        txsCount: 5,
      },
      {
        type: UIBlockType.Block,
        height: 2,
        hash: 'hash2',
        timestamp: date,
        txsCount: 10,
      },
      {
        type: UIBlockType.Block,
        height: 3,
        hash: 'hash3',
        timestamp: date,
        txsCount: 15,
      },
      {
        type: UIBlockType.BurnBlock,
        height: 4,
        hash: 'hash4',
        timestamp: date,
        txsCount: 30,
      },
      {
        type: UIBlockType.Count,
        count: 25,
      },
    ];
    const latestBlocksCount = 0; // replace with actual data
    const updateList = jest.fn();
    const enablePagination = false;
    const isFetchingNextPage = false;
    const hasNextPage = false;
    const fetchNextPage = jest.fn();

    const { asFragment } = render(
      <BlockListProvider>
        <BlockListWithControls
          blockList={blockList}
          latestBlocksCount={latestBlocksCount}
          updateList={updateList}
          enablePagination={enablePagination}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      </BlockListProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
