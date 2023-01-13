import * as React from 'react';

const ExplorerSSRPageBase = ({ params, searchParams, children }: any) => {
  // console.log('params', params);
  // console.log('searchParams', searchParams);
  // SSRData.getInstance().setCustomApiUrl(searchParams.api);
  // SSRData.getInstance().setNetworkMode(searchParams.chain);
  return <>{children}</>;
};

export default ExplorerSSRPageBase;

export const ExplorerSSRPage = ExplorerSSRPageBase;

// export const ExplorerSSRPage = dynamic(() => import('./ExplorerSSRPage'), {
//   loading: () => <h2 style={{ color: 'red', fontSize: '60px' }}> SSR Loading!</h2>,
// });
