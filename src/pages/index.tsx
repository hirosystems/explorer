import React from 'react';
import Link from 'next/link';
import { Button, Flex, Input } from '@blockstack/ui';
import { BehaviorSubject } from 'rxjs';

const searchTerm$ = new BehaviorSubject('');

export const Home = () => (
  <Flex flexDirection="column" height="100vh" width="100%" align="center" justify="center">
    <Link href="/components">
      <Button>Components</Button>
    </Link>
    <Input type="text" onChange={(e: any) => searchTerm$.next(e.target.value)} />
  </Flex>
);

export default Home;
