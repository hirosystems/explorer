import React, { FC, ReactNode } from 'react';

import { ClarityAbiFunction, ClarityValue } from '@stacks/transactions';

import { Section } from '../../../../common/components/Section';
import { useStacksNetwork } from '../../../../common/hooks/useStacksNetwork';
import { useCallReadOnlyFunction } from '../../../../common/queries/useCallReadOnlyFunction';
import { Box } from '../../../../ui/Box';
import { CodeEditor } from '../../../../ui/CodeEditor';
import { Flex } from '../../../../ui/Flex';
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
    contractId: contractId,
    fn: fn,
    readOnlyValue: readOnlyValue,
    stacksNetwork: stacksNetwork,
    stxAddress: stxAddress,
  });

  if (!data) return null;

  return (
    <Box p="16px">
      {data.okay ? (
        <Section title="Response">
          <CodeEditor code={parseReadOnlyResponse(data)} />
        </Section>
      ) : (
        <Box>{data.result}</Box>
      )}
      <Flex alignItems="center" justifyContent="center" pt="16px">
        {cancelButton}
      </Flex>
    </Box>
  );
};
