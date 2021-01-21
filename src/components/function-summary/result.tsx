import { cvToJSON, hexToCV } from '@stacks/transactions';
import type { Transaction } from '@blockstack/stacks-blockchain-api-types';
import { Box, Flex, Stack, color } from '@stacks/ui';
import { Caption, Pre } from '@components/typography';
import { border } from '@common/utils';
import { FunctionSummaryClarityValue } from '@components/function-summary/value';
import { IconAlertTriangle, IconCircleCheck } from '@tabler/icons';

export const FunctionSummaryResult = ({ result }: { result: Transaction['tx_result'] }) => {
  const { success, type, value } = cvToJSON(hexToCV((result as any).hex as string));

  const hasType = !type?.includes('UnknownType');

  if (type?.includes('tuple')) {
    return (
      <Box width="100%">
        <Pre>{value.type}</Pre>
        <Stack mt="extra-loose" spacing="base" width="100%">
          {Object.keys(value.value).map((name: string, index: number) => {
            const isLast = Object.keys(value.value).length <= index + 1;
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
                  arg={{
                    type: value.value[name].type,
                    repr: value.value[name].value.toString(),
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
