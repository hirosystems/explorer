import { Box, Flex } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import { ClarityAbiFunction, ClarityValue } from '@stacks/transactions';

import { Section } from '../../../../common/components/Section';
import { useStacksNetwork } from '../../../../common/hooks/useStacksNetwork';
import { useCallReadOnlyFunction } from '../../../../common/queries/useCallReadOnlyFunction';
import { CodeEditor } from '../../../../ui/CodeEditor';
import { useUser } from '../../hooks/useUser';
import { parseReadOnlyResponse } from '../../utils';

interface ReadOnlyProps {
  readOnlyValue: ClarityValue[];
  contractId: string;
  fn: ClarityAbiFunction;
  cancelButton: ReactNode;
}

export const ReadOnlyField: FC<ReadOnlyProps> = ({
  readOnlyValue,
  contractId,
  fn,
  cancelButton,
}) => {
  const { stxAddress } = useUser();
  const stacksNetwork = useStacksNetwork();

  const { data } = useCallReadOnlyFunction({
    contractId,
    fn,
    readOnlyValue,
    stacksNetwork,
    stxAddress,
  });

  if (!data) return null;

  return (
    <Box p={4}>
      {data.okay ? (
        <Section title="Response">
          <CodeEditor code={parseReadOnlyResponse(data)} />
        </Section>
      ) : (
        <Box>{data.result}</Box>
      )}
      <Flex alignItems="center" justifyContent="center" pt={4}>
        {cancelButton}
      </Flex>
    </Box>
  );
};
