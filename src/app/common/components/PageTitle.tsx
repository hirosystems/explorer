import { Title } from '@/ui/typography';
import { FC, PropsWithChildren } from 'react';

export const PageTitle: FC<PropsWithChildren> = props => (
  <Title as="h1" color="white" fontSize="36px" mt={'72px'} mb={'36px'} {...props} />
);
