import { TbChevronRight } from 'react-icons/tb';
import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { Badge } from '@/common/components/Badge';
import { TxLink } from '@/components/links';
import { Section } from '@/components/section';
import { Box, BoxProps, CodeEditor } from '@/ui/components';

export function ContractSource({
  sourceTx,
  source,
  contractCall,
  claritySyntax,
}: {
  sourceTx?: string;
  source?: string;
  contractCall?:
    | MempoolContractCallTransaction['contract_call']
    | ContractCallTransaction['contract_call'];
  claritySyntax: Record<string, any>;
} & BoxProps) {
  return source ? (
    <Section
      title="Source code"
      topRight={
        sourceTx ? (
          <TxLink txId={sourceTx}>
            <Badge
              as="a"
              _hover={{ bg: '#eee', cursor: 'pointer' }}
              color="textBody"
              bg="bgAlt"
              target="_blank"
              labelProps={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap' }}
              border="none"
            >
              View deployment
              <Box as={TbChevronRight} ml="4px" size="14px" display="inline" />
            </Badge>
          </TxLink>
        ) : null
      }
    >
      <CodeEditor code={source} claritySyntax={claritySyntax} />
    </Section>
  ) : null;
}
