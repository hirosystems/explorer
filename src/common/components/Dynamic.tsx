import dynamic from 'next/dynamic';
import { FC } from 'react';

const DynamicWrapper: FC = ({ children }) => <>{children}</>;
export default dynamic(() => Promise.resolve(DynamicWrapper), {
  ssr: false,
});
