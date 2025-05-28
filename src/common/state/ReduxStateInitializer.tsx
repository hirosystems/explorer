import { useSearchParams } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// import { initializeNetworkState, initializeNetworks } from './slices/network-slice';

export const ReduxStateInitializer = ({
  children,
//   addedCustomNetworksCookie,
//   removedCustomNetworksCookie,
}: {
  children: ReactNode;
//   addedCustomNetworksCookie: string | undefined;
//   removedCustomNetworksCookie: string | undefined;
}) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

//   useEffect(() => {
//     const initNetworks = async () => {
//       const networkState = await initializeNetworkState(
//         searchParams,
//         addedCustomNetworksCookie,
//         removedCustomNetworksCookie
//       );

//       if (!isInitialized) {
//         dispatch(initializeNetworks(networkState));
//         setIsInitialized(true);
//       }
//     };

//     initNetworks();
//   }, [
//     dispatch,
//     addedCustomNetworksCookie,
//     removedCustomNetworksCookie,
//     searchParams,
//     isInitialized,
//   ]);

  return <>{children}</>;
};