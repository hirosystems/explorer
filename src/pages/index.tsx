import * as React from 'react';
import Link from 'next/link';
import { Button, Flex } from '@blockstack/ui';

export default () => (
  <Flex height="100vh" width="100%" align="center" justify="center">
    <Link href="/components">
      <Button>Components</Button>
    </Link>
  </Flex>
);
