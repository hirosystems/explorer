import { Flex } from '@chakra-ui/react';
import { FC, forwardRef } from 'react';

import { Badge } from '../../../../common/components/Badge';
import { ExplorerLink } from '../../../../common/components/ExplorerLinks';
import { Section } from '../../../../common/components/Section';
import { ArrowRightIcon } from '../../../../common/components/icons/arrow-right';
import { ContractWithParsedAbi } from '../../../../common/types/contract';
import { showFn } from '../../../../common/utils/sandbox';
import { useColorMode } from '../../../../components/ui/color-mode';
import { Grid } from '../../../../ui/Grid';
import { Icon } from '../../../../ui/Icon';
import { Text } from '../../../../ui/Text';
import FunctionReadOnlyIcon from '../../../../ui/icons/FunctionReadOnly';
import FunctionXIcon from '../../../../ui/icons/FunctionX';

export const AbiFunction = forwardRef<
  HTMLDivElement,
  {
    abiFn: { access: string; name: string };
    onClick?: () => void;
  }
>(({ abiFn, onClick }, ref) => {
  const colorMode = useColorMode().colorMode;
  return (
    <Flex
      ref={ref}
      justifyContent="space-between"
      p="16px"
      _hover={{
        cursor: 'pointer',
        bg: `bgAlt.${useColorMode().colorMode}`,
      }}
      onClick={onClick}
    >
      <Flex alignItems="center">
        <Flex alignItems="center">
          <Grid placeItems="center" borderWidth="1px" borderRadius="100%" size="32px">
            {abiFn.access === 'read_only' ? (
              <Icon size={4}>
                <FunctionXIcon />
              </Icon>
            ) : (
              <Icon size={5}>
                <FunctionReadOnlyIcon />
              </Icon>
            )}
          </Grid>
          <Text fontSize="14px" fontFamily={`"Fira Code", monospace`} ml="16px" fontWeight="500">
            {abiFn.name}
          </Text>
        </Flex>
        {abiFn.access === 'read_only' && (
          <Badge ml="16px" bg={`bg.${colorMode}`} color={`textCaption.${colorMode}`}>
            {abiFn.access}
          </Badge>
        )}
      </Flex>
      <ArrowRightIcon width={'18px'} />
    </Flex>
  );
});

export const AvailableFunctionsView: FC<{
  contract: ContractWithParsedAbi;
  contractId: string;
}> = ({ contractId, contract }) => (
  <Section overflowY="auto" flexGrow={1} title="Available functions">
    {contract?.abi?.functions.map(
      (abiFn: any) =>
        showFn(contractId, abiFn) && (
          <ExplorerLink
            href={`/sandbox/contract-call/${contractId}/${abiFn.name}`}
            key={abiFn.name}
          >
            <AbiFunction abiFn={abiFn} />
          </ExplorerLink>
        )
    )}
  </Section>
);
