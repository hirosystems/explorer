import { useMemo } from 'react';

import { ReverseAccordion, ReverseAccordionItem } from './ReverseAccordion';

export function FAQ() {
  const items: ReverseAccordionItem[] = useMemo(
    () => [
      {
        title: 'What is Stacking',
        text: "Stacking is a way to earn Bitcoin (BTC) by temporarily locking up STX tokens to support the Stacks network's security through the Proof of Transfer (PoX) consensus mechanism.",
        link: 'https://docs.stacks.co',
        linkLabel: 'Learn more',
      },
      {
        title: 'What is a pool and how to pool',
        text: 'A pool is a collection of STX that is used to participate in the Stacking Protocol. You can pool your STX with other users to earn rewards.',
        link: 'https://docs.stacks.co',
        linkLabel: 'See active pools',
      },
      {
        title: 'How to start Stacking',
        text: 'First, you need some STX tokens. If you meet the minimum required to stack independently, you can stack by running your own Signer. If you have fewer tokens, you can delegate to a Stacking pool provider.',
        link: 'https://docs.stacks.co',
        linkLabel: 'Learn more',
      },
    ],
    []
  );

  return <ReverseAccordion items={items} />;
}
