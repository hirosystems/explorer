import { Badge } from '@/common/components/Badge';
import { TxLink } from '@/components/links';
import { Section } from '@/components/section';
import { Box, BoxProps, CodeEditor } from '@/ui/components';
import * as React from 'react';
import { TbChevronRight } from 'react-icons/tb';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';

export const ContractSource: React.FC<
  {
    sourceTx?: string;
    source?: string;
    contractCall?:
      | MempoolContractCallTransaction['contract_call']
      | ContractCallTransaction['contract_call'];
    claritySyntax: Record<string, any>;
  } & BoxProps
> = ({ sourceTx, source, contractCall, claritySyntax }) => {
  return source ? (
    <Section
      title={'Source code'}
      topRight={
        sourceTx
          ? () => (
              <TxLink txId={sourceTx}>
                <Badge
                  as="a"
                  _hover={{ bg: '#eee', cursor: 'pointer' }}
                  color={'textBody'}
                  bg={'bgAlt'}
                  target="_blank"
                  labelProps={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap' }}
                  border={'none'}
                >
                  View deployment
                  <Box as={TbChevronRight} ml="4px" size="14px" display={'inline'} />
                </Badge>
              </TxLink>
            )
          : undefined
      }
    >
      <CodeEditor code={source} claritySyntax={claritySyntax} />
    </Section>
  ) : null;
};
