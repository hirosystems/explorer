import { useColorMode } from '@chakra-ui/react';
import React from 'react';

import { Circle } from '../../../common/components/Circle';
import { AddressLink } from '../../../common/components/ExplorerLinks';
import { useAccountStxBalance } from '../../../common/queries/useAccountStxBalance';
import { FoundResult } from '../../../common/types/search-results';
import { microToStacksFormatted, truncateMiddle } from '../../../common/utils/utils';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import WalletIcon from '../../../ui/icons/WalletIcon';
import { Caption, Title } from '../../../ui/typography';
import { ResultItemWrapper } from './result-item-wrapper';

interface AddressResultItemProps {
  result: FoundResult;
}

export const AddressResultItem: React.FC<AddressResultItemProps> = ({ result }) => {
  const principal = result.result.entity_id;
  const displayName =
    result.result.entity_type === 'standard_address' ? result.result.display_name : '';
  const truncatedPrincipal = truncateMiddle(principal, 4);
  const { data: stxBalance } = useAccountStxBalance(principal);
  const colorMode = useColorMode().colorMode;
  return (
    <AddressLink principal={principal}>
      <ResultItemWrapper>
        <Flex alignItems="center">
          <Circle size={12}>
            <WalletIcon size="16px" />
          </Circle>
          <Box ml="16px">
            <Title
              display="block"
              mb="4px"
              className={'search-result-title'}
              color={`links.${colorMode}`}
            >
              {displayName ? `${displayName} (${truncatedPrincipal})` : truncatedPrincipal}
            </Title>
            <Caption>{`${microToStacksFormatted(stxBalance?.balance || 0)} STX`}</Caption>
          </Box>
        </Flex>
      </ResultItemWrapper>
    </AddressLink>
  );
};
