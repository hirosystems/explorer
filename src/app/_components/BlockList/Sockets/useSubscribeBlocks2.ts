// import { useEffect, useRef } from 'react';

// import { NakamotoBlock } from '@stacks/blockchain-api-client/src/generated/models';
// import { Block } from '@stacks/stacks-blockchain-api-types';

// import { useGlobalContext } from '../../../../common/context/useAppContext';

// interface Subscription {
//   unsubscribe(): void;
// }

// export function useSubscribeBlocks2(handleBlock: (block: NakamotoBlock) => any) {
//   const subscription = useRef<Subscription | undefined>(undefined);
//   const { stacksApiSocketClient } = useGlobalContext();

//   useEffect(() => {
//     const subscribe = async () => {
//       console.log('subscribing to blocks');
//       subscription.current = stacksApiSocketClient?.subscribeBlocks((block: Block) => {
//         console.log('handling block', block);
//         handleBlock({
//           ...block,
//           parent_index_block_hash: '',
//           tx_count: 0,
//         });
//       });
//     };
//     if (stacksApiSocketClient?.socket.connected) {
//       subscribe();
//     }
//     return () => {
//       subscription?.current?.unsubscribe();
//     };
//   }, [stacksApiSocketClient, handleBlock]);
//   return subscription;
// }
