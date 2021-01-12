import { cvToJSON, hexToCV } from '@stacks/transactions';
import type { Transaction } from '@blockstack/stacks-blockchain-api-types';
import { Box, Stack } from '@stacks/ui';
import { Caption, Pre } from '@components/typography';
import { border } from '@common/utils';
import { FunctionSummaryClarityValue } from '@components/function-summary/value';

export const FunctionSummaryResult = ({ result }: { result: Transaction['tx_result'] }) => {
  const { success, type, value } = cvToJSON(hexToCV((result as any).hex as string));

  if (type?.includes('tuple')) {
    return (
      <Box width="100%">
        <Pre>{value.type}</Pre>
        <Stack mt="extra-loose" spacing="base" width="100%">
          {Object.keys(value.value).map((name: string) => (
            <Box borderBottom={border()} pb="base">
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
          ))}
        </Stack>
      </Box>
    );
  } else {
    return null;
  }

  // if (!_result?.repr.includes('tuple')) {
  //   const type = resultValue(result).type;
  //   const success = type.includes('responseOk');
  //
  //   return (
  //     <Flex width="100%" alignItems="center">
  //       {success && <Box mr="tight" color={color('feedback-success')} as={IconCircleCheck} />}
  //       {failed && <Box mr="tight" color={color('feedback-error')} as={IconAlertTriangle} />}
  //       <Flex flexGrow={1} alignItems="baseline" justifyContent="space-between" width="100%">
  //         <Box>{_result?.repr}</Box>
  //         <Caption>{resultValue(result).type}</Caption>
  //       </Flex>
  //     </Flex>
  //   );
  // } else {
  //   return (
  //     <Box width="100%">
  //       <Pre>{result?.type}</Pre>
  //       <Stack mt="extra-loose" spacing="base" width="100%">
  //         {(result as any)?.value?.map((value: any) => (
  //           <Box borderBottom={border()} pb="base">
  //             <Caption display="inline-block" mb="tight">
  //               {value.name}
  //             </Caption>
  //             <Value arg={value} />
  //           </Box>
  //         ))}
  //       </Stack>
  //     </Box>
  //   );
  // }
};
