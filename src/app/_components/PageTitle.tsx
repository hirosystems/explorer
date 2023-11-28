import { ReactNode } from 'react';

import { TextProps, Title } from '../../ui/typography';

export function PageTitle({ children, ...props }: { children: ReactNode } & TextProps) {
  return (
    <Title
      as="h1"
      fontSize="36px"
      display="block"
      width="100%"
      mt="40px"
      mb="0"
      data-test="homepage-title"
      color="white"
      gridColumnStart={'1'}
      gridColumnEnd={['2', '2', '3']}
      {...props}
    >
      {children}
    </Title>
  );
}
