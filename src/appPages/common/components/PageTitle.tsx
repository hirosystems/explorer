import { ReactNode } from 'react';
import { Title } from '@/ui/typography';

export function PageTitle(props: { children: ReactNode }) {
  return <Title as="h1" color="white" fontSize="36px" mt="72px" mb="36px" {...props} />;
}
