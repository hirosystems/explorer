'use client';

import { ListFooter } from '@/common/components/ListFooter';
import { Box } from '@/ui/Box';
import { Suspense } from 'react';

import { Section } from '../../../../common/components/Section';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { useBlockListContext } from '../BlockListContext';
import { UpdateBar } from '../UpdateBar';
import { FADE_DURATION } from '../consts';
import { UngroupedBlockList } from './UngroupedBlocksList';
import { BlocksPageBlockListUngroupedSkeleton } from './skeleton';
import { useUngroupedBlockListBlocksPage } from './useUngroupedBlockListBlocksPage';

function runAfterFadeOut(callback: () => void) {
  setTimeout(callback, FADE_DURATION);
}

function BlocksPageUngroupedBlockListBase() {
  const { liveUpdates } = useBlockListContext();

  // // TODO: dont really need to have a separate hook for this. This is just doing all the organizing of the data behind the hook
  // const { initialBlockList, initialBurnBlocks, hasNextPage, isFetchingNextPage, fetchNextPage } =
  //   useUngroupedBlockList();

  // const [latestBlocksToShow, setLatestBlocksToShow] = useState<UISingleBlock[]>([]);
  // const blockList = useMemo(
  //   () => [...latestBlocksToShow, ...initialBlockList],
  //   [initialBlockList, latestBlocksToShow]
  // );

  // const blockHashes = useMemo(() => {
  //   return new Set(initialBlockList.map(block => block.hash));
  // }, [initialBlockList]);

  // const burnBlockHashes = useMemo(() => {
  //   return new Set(Object.keys(initialBurnBlocks));
  // }, [initialBurnBlocks]);

  // const {
  //   latestUIBlocks: latestUIBlockFromWebSocket,
  //   latestStxBlocksCount: latestStxBlocksCountFromWebSocket,
  //   clearLatestBlocks: clearLatestBlocksFromWebSocket,
  // } = useBlockListWebSocket(blockHashes, burnBlockHashes);

  // const [blockListUpdateCounter, setBlockListUpdateCounter] = useState(0);
  // // This is used to trigger a fade out effect when the block list is updated. When the counter is updated, we finish loading and show the fade in effect
  // const prevBlockListUpdateCounterRef = useRef(blockListUpdateCounter);

  // useEffect(() => {
  //   if (prevBlockListUpdateCounterRef.current !== blockListUpdateCounter) {
  //     runAfterFadeOut(() => {
  //       setBlockListLoading(false);
  //     });
  //   }
  // }, [blockListUpdateCounter, clearLatestBlocksFromWebSocket, setBlockListLoading]);

  // const showLatestBlocks = useCallback(() => {
  //   setBlockListLoading(true);
  //   runAfterFadeOut(() => {
  //     setLatestBlocksToShow(prevBlockList => {
  //       return [...latestUIBlockFromWebSocket, ...prevBlockList];
  //     });
  //     clearLatestBlocksFromWebSocket();
  //     setBlockListUpdateCounter(prev => prev + 1);
  //   });
  // }, [
  //   latestUIBlockFromWebSocket,
  //   setLatestBlocksToShow,
  //   setBlockListLoading,
  //   clearLatestBlocksFromWebSocket,
  // ]);

  // const queryClient = useQueryClient();
  // const updateBlockListWithQuery = useCallback(
  //   async function () {
  //     setBlockListLoading(true);
  //     runAfterFadeOut(async () => {
  //       await Promise.all([
  //         // Invalidates queries so they will be refetched
  //         queryClient.invalidateQueries({ queryKey: [BLOCK_LIST_QUERY_KEY] }),
  //       ]).then(() => {
  //         clearLatestBlocksFromWebSocket();
  //         setBlockListUpdateCounter(prev => prev + 1);
  //       });
  //     });
  //   },
  //   [clearLatestBlocksFromWebSocket, queryClient, setBlockListLoading]
  // );

  // const prevLiveUpdatesRef = useRef(isLiveUpdatesEnabled);
  // const prevLatestBlocksCountRef = useRef(latestStxBlocksCountFromWebSocket);

  // useEffect(() => {
  //   const liveUpdatesToggled = prevLiveUpdatesRef.current !== isLiveUpdatesEnabled;

  //   const receivedLatestStxBlockFromLiveUpdates =
  //     isLiveUpdatesEnabled &&
  //     latestStxBlocksCountFromWebSocket > 0 &&
  //     prevLatestBlocksCountRef.current !== latestStxBlocksCountFromWebSocket;

  //   if (liveUpdatesToggled) {
  //     updateBlockListWithQuery();
  //   } else if (receivedLatestStxBlockFromLiveUpdates) {
  //     showLatestBlocks();
  //   }

  //   prevLiveUpdatesRef.current = isLiveUpdatesEnabled;
  //   prevLatestBlocksCountRef.current = latestStxBlocksCountFromWebSocket;
  // }, [
  //   isLiveUpdatesEnabled,
  //   latestStxBlocksCountFromWebSocket,
  //   showLatestBlocks,
  //   updateBlockListWithQuery,
  // ]);

  const {
    blockList,
    latestStxBlocksCountFromWebSocket,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    updateBlockList,
  } = useUngroupedBlockListBlocksPage();

  return (
    <Box pb={6}>
      {!liveUpdates && (
        <UpdateBar
          latestBlocksCount={latestStxBlocksCountFromWebSocket}
          onClick={updateBlockList}
        />
      )}
      <UngroupedBlockList ungroupedBlockList={blockList} />
      <Box pt={4}>
        {!liveUpdates && (
          <ListFooter
            isLoading={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            label={'blocks'}
          />
        )}
      </Box>
    </Box>
  );
}

export function BlocksPageUngroupedBlockList() {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{
        title: 'Recent Blocks',
        gridColumnStart: ['1', '1', '2'],
        gridColumnEnd: ['2', '2', '3'],
        minWidth: 0,
      }}
      tryAgainButton
    >
      <Suspense fallback={<BlocksPageBlockListUngroupedSkeleton />}>
        <BlocksPageUngroupedBlockListBase />
      </Suspense>
    </ExplorerErrorBoundary>
  );
}
