import { useUser } from '@/app/sandbox/hooks/useUser';
import { parseReadOnlyResponse } from '@/app/sandbox/utils';
import { CodeEditor, withControls } from '@/app/txid/[txId]/redesign/source/CodeEditor';
import { useGlobalContext } from '@/common/context/useGlobalContext';
import { useCallReadOnlyFunction } from '@/common/queries/useCallReadOnlyFunction';
import { ButtonLink } from '@/ui/ButtonLink';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';
import { FC, useMemo } from 'react';

import { ClarityAbiFunction, ClarityValue } from '@stacks/transactions';

interface ReadOnlyProps {
  readOnlyValue: ClarityValue[];
  contractId: string;
  fn: ClarityAbiFunction;
  handleCancel?: () => void;
}

export const ReadOnlyField: FC<ReadOnlyProps> = ({
  readOnlyValue,
  contractId,
  fn,
  handleCancel,
}) => {
  const { stxAddress } = useUser();
  const network = useGlobalContext().activeNetwork;

  const { data } = useCallReadOnlyFunction({
    contractId,
    fn,
    readOnlyValue,
    stacksNetwork: network,
    stxAddress,
  });

  const CodeEditorWithControls = useMemo(() => withControls(CodeEditor, true, false), []);

  if (!data) return null;

  return (
    <Stack gap={4}>
      {data.okay ? (
        <Stack gap={4}>
          <Text textStyle="text-medium-sm" color="textPrimary">
            Response
          </Text>
          <CodeEditorWithControls code={parseReadOnlyResponse(data)} />
        </Stack>
      ) : (
        <Text textStyle="text-regular-sm" color="textPrimary">
          {data.result}
        </Text>
      )}
      {handleCancel && (
        <ButtonLink
          href={'#'}
          onClick={handleCancel}
          buttonLinkSize="small"
          aria-label="Go back"
          buttonLinkDirection="backward"
        >
          Go back
        </ButtonLink>
      )}
    </Stack>
  );
};
