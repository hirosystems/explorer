import dynamic from 'next/dynamic';
import { FC, PropsWithChildren } from 'react';

const DynamicWrapper: FC<PropsWithChildren> = ({ children }) => <>{children}</>;
export default dynamic(() => Promise.resolve(DynamicWrapper), {
  ssr: false,
});
