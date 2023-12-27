import { useColorMode } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { TbSearch } from 'react-icons/tb';

import { Section } from '../../../common/components/Section';
import { useDebounce } from '../../../common/hooks/useDebounce';
import { Icon } from '../../../ui/Icon';
import { Input } from '../../../ui/Input';
import { InputGroup } from '../../../ui/InputGroup';
import { InputRightElement } from '../../../ui/InputRightElement';
import { TokenTableSkeleton } from './TokenTableSkeleton';

const TokenTable = dynamic(() => import('./TokenTable').then(module => module.TokenTable), {
  ssr: false,
  loading: () => <TokenTableSkeleton />,
});

export function TokensList() {
  const colorMode = useColorMode().colorMode;
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return (
    <Section
      title={'Tokens'}
      gridColumnStart={['1', '1', '2']}
      gridColumnEnd={['2', '2', '3']}
      minWidth={0}
      topRight={
        <InputGroup>
          <InputRightElement pointerEvents="none">
            <Icon as={TbSearch} color={`textCaption.${colorMode}`} />
          </InputRightElement>
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
