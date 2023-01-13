import { Title } from '@/ui/typography';
import { FC } from 'react';

export const PageTitle: FC = props => (
  <Title as="h1" color="white" fontSize="36px" mt={'72px'} mb={'36px'} {...props} />
);
