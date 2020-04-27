import React from 'react';
import { Box, Button } from '@blockstack/ui';
// @ts-ignore
import { useConnect, ContractCallArgumentType } from '@blockstack/connect';

const authOrigin = 'https://deploy-preview-301--stacks-authenticator.netlify.app';

export const ContractCall = () => {
  const { doContractCall } = useConnect();

  const handleContractCall = async () => {
    await doContractCall({
      authOrigin,
      contractAddress: 'STRYYQQ9M8KAF4NS7WNZQYY59X93XEKR31JP64CP',
      functionName: 'set-value',
      functionArgs: [{ value: 'testing', type: ContractCallArgumentType.BUFFER }], // def wrong
      contractName: 'testing-asdasda',
      finished: (data: any) => {
        console.log('finished!', data);
      },
    });
  };
  return (
    <Box>
      <Button onClick={handleContractCall}>Contract Call</Button>
    </Box>
  );
};
