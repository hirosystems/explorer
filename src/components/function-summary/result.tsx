import { IconAlertTriangle, IconCircleCheck } from '@tabler/icons';

import type { Transaction } from '@stacks/stacks-blockchain-api-types';
import { cvToJSON, hexToCV } from '@stacks/transactions';
import { Box, Flex, Stack, color } from '@stacks/ui';

import { border } from '@common/utils';

import { FunctionSummaryClarityValue } from '@components/function-summary/value';
import { Caption, Pre } from '@components/typography';

interface FunctionSummaryResultProps {
  result: Transaction['tx_result'];
  txStatus: string | undefined;
}

export const FunctionSummaryResult = ({ result, txStatus }: FunctionSummaryResultProps) => {
  if (!result) return null;
  const { success, type, value } = cvToJSON(hexToCV(result.hex));
  const hasType = !type?.includes('UnknownType');

  if (type?.includes('tuple')) {
    return (
      <Box width="100%">
        <Pre>{value.type}</Pre>
        <Stack mt="extra-loose" spacing="base" width="100%">
          {Object.keys(value.value).map((name: string, index: number) => {
            const isLast = Object.keys(value.value).length <= index + 1;
            const entry = value.value[name];
            let repr = entry.value === null ? 'none' : entry.value.toString();
            if (entry.type.includes('list')) {
              repr = entry.value.map((listEntry: any) => listEntry.value).join(', ');
            }
            return (
              <Box
                borderBottom={!isLast ? border() : undefined}
                pb={!isLast ? 'base' : undefined}
                key={name}
              >
                <Caption display="inline-block" mb="tight">
                  {name}
                </Caption>
                <FunctionSummaryClarityValue
                  btc={null}
                  arg={{
                    type: entry.type,
                    repr,
                    name,
                  }}
                />
              </Box>
            );
          })}
        </Stack>
      </Box>
    );
  } else {
    return (
      <Box width="100%">
        <Flex alignItems="center">
          {success ? (
            <Box mr="tight" color={color('feedback-success')} as={IconCircleCheck} />
          ) : (
            <Box mr="tight" color={color('feedback-error')} as={IconAlertTriangle} />
          )}
          <Pre>{hasType ? type : success ? 'Success' : 'Failed'}</Pre>
        </Flex>
        <Stack mt="extra-loose" spacing="base" width="100%">
          <FunctionSummaryClarityValue
            btc={null}
            arg={{
              type: type.replace(' UnknownType', ''),
              repr: result?.repr,
            }}
          />
        </Stack>
      </Box>
    );
  }
};
