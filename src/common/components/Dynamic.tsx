import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

function DynamicWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
export default dynamic(() => Promise.resolve(DynamicWrapper), {
  ssr: false,
});
