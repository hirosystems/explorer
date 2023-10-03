import { FunctionSummaryClarityValue } from '@/components/function-summary/value';
import { Box, Flex, Stack } from '@/ui/components';
import { Caption, Pre } from '@/ui/typography';
import { TbAlertTriangle, TbCircleCheck } from 'react-icons/tb';

import { ClarityType, cvToJSON, hexToCV } from '@stacks/transactions';
import { AbstractTransaction } from '@stacks/stacks-blockchain-api-types/generated';

interface ReprValueProps {
  type: string;
  value: string | number | (string | number)[];
}

interface ClarityJson {
  type: string;
  value: boolean | string | null | ClarityJson | ClarityJson[] | Record<string, ClarityJson>;
  success: boolean;
}

const getReprValue = ({ type, value }: ReprValueProps) => {
  let reprValue = value ?? 'none';
  if (type.includes('list') && Array.isArray(value)) {
    reprValue = value.map((listEntry: any) => listEntry.value).join(', ');
  }
  return typeof reprValue === 'object' ? JSON.stringify(reprValue) : reprValue;
};

export function FunctionSummaryResult({ result }: { result?: AbstractTransaction['tx_result'] }) {
  if (!result) return null;
  const resultHex = result.hex;
  const clarityValue = hexToCV(result.hex);
  const { success, type, value } = cvToJSON(clarityValue) as ClarityJson; // missing Stacks.js type
  const hasType = !type?.includes('UnknownType');

  if (clarityValue.type === ClarityType.Tuple) {
    return (
      <Box width="100%">
        <Pre>{clarityValue.type}</Pre>
        <Stack mt="32px" spacing="16px" width="100%">
          {Object.keys(value).map((name: string, index: number) => {
            const isLast = Object.keys(value.value).length <= index + 1;
            const entry = value.value[name];
            const repr = getReprValue(entry);
            return (
              <Box
                borderBottom={!isLast ? '1px solid' : undefined}
                pb={!isLast ? '16px' : undefined}
                key={name}
                width="100%"
              >
                <Caption display="inline-block" mb="8px" fontSize={'14px'}>
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
            <Box mr="8px" color={'feedbackSuccess'} as={TbCircleCheck} />
          ) : (
            <Box mr="8px" color={'feedbackError'} as={TbAlertTriangle} />
          )}
          <Pre>{hasType ? type : success ? 'Success' : 'Failed'}</Pre>
        </Flex>
        <Stack mt="32px" spacing="16px" width="100%">
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
}
