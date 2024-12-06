import { Input } from '@chakra-ui/react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import { Section } from '../../../common/components/Section';
import { useDebounce } from '../../../common/hooks/useDebounce';
import { useColorMode } from '../../../components/ui/color-mode';
import { InputGroup } from '../../../components/ui/input-group';
import { Icon } from '../../../ui/Icon';
import { TokenTableSkeleton } from './TokenTableSkeleton';

const TokenTable = dynamic(() => import('./TokenTable').then(module => module.TokenTable), {
  ssr: false,
  loading: () => <TokenTableSkeleton />,
});

export function TokensList() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const colorMode = useColorMode();

  return (
    <Section
      title={'Tokens'}
      gridColumnStart={['1', '1', '2']}
      gridColumnEnd={['2', '2', '3']}
      minWidth={0}
      topRight={
        <InputGroup
          endElement={
            <Icon color={`textCaption.${colorMode}`} pointerEvents="none">
              <MagnifyingGlass />
            </Icon>
          }
        >
          <Input
            variant={'outline'}
            type="text"
            placeholder="Token name, symbol or address"
            width={['200px', '300px']}
            paddingRight={'35px'}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      }
    >
      <TokenTable debouncedSearchTerm={debouncedSearchTerm} />
    </Section>
  );
}
