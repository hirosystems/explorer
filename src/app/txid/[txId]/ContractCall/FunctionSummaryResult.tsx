import { TbAlertTriangle, TbCircleCheck } from 'react-icons/tb';

import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { cvToJSON, hexToCV } from '@stacks/transactions';

import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Stack } from '../../../../ui/Stack';
import { Caption, Pre } from '../../../../ui/typography';
import { FunctionSummaryClarityValue } from './FunctionSummaryClarityValue';

interface FunctionSummaryResultProps {
  result: Transaction['tx_result'];
}
interface ReprValueProps {
  type: string;
  value: string | number | (string | number)[];
}

const getReprValue = ({ type, value }: ReprValueProps) => {
  let reprValue = value ?? 'none';
  if (type.includes('list') && Array.isArray(value)) {
    reprValue = value.map((listEntry: any) => listEntry.value).join(', ');
  }
  return typeof reprValue === 'object' ? JSON.stringify(reprValue) : reprValue;
};

export const FunctionSummaryResult = ({ result }: FunctionSummaryResultProps) => {
  if (!result) return null;
  const { success, type, value } = cvToJSON(hexToCV(result.hex));
  const hasType = !type?.includes('UnknownType');

  if (type?.includes('tuple')) {
    return (
      <Box width="100%">
        <Pre>{value.type}</Pre>
        <Stack mt="32px" gap={4} width="100%">
          {Object.keys(value.value).map((name: string, index: number) => {
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
        <Stack mt="32px" gap={4} width="100%">
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
