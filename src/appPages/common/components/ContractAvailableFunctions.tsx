import { useState } from 'react';
import { ClarityAbiFunction } from '@stacks/transactions';
import { ContractWithParsedAbi } from '@/common/types/contract';
import { useUser } from '@/appPages/sandbox/hooks/useUser';
import { useAppDispatch } from '@/common/state/hooks';
import { Flex } from '@/ui/Flex';
import { Button } from '@/ui/Button';
import { setUserData } from '@/appPages/sandbox/sandbox-slice';
import { FunctionView } from '@/appPages/sandbox/components/ContractCall/FunctionView';
import { TextLink } from '@/ui/TextLink';
import { Caption } from '@/ui/typography';
import { showFn } from '@/appPages/common/utils/sandbox';
import { AbiFunction } from '@/appPages/sandbox/components/ContractCall/AvailableFunctionsView';

export function ContractAvailableFunctions({
  contractId,
  contract,
}: {
  contractId: string;
  contract: ContractWithParsedAbi;
}) {
  const { isConnected, connect } = useUser();
  const dispatch = useAppDispatch();
  const [functionName, setFunctionName] = useState('');
  const contractAbiFunctions = (contract?.abi?.functions as unknown as ClarityAbiFunction[]) || []; // missing API type
  return (
    <>
      {!isConnected ? (
        <Flex alignItems="center" justifyContent="center" py="24px">
          <Button
            onClick={() =>
              connect({
                onFinish: authData => {
                  dispatch(setUserData({ userData: authData.userSession.loadUserData() }));
                },
              })
            }
          >
            Connect Stacks Wallet
          </Button>
        </Flex>
      ) : functionName ? (
        <FunctionView
          contractId={contractId}
          fn={
            contractAbiFunctions.find(
              (fn: ClarityAbiFunction) => fn.name === functionName
            ) as unknown as ClarityAbiFunction // missing API type
          }
          cancelButton={
            <TextLink onClick={() => setFunctionName('')}>
              <Caption _hover={{ cursor: 'pointer', color: 'textTitle' }} mt="16px">
                Cancel
              </Caption>
            </TextLink>
          }
        />
      ) : (
        contractAbiFunctions.map(
          (abiFn: ClarityAbiFunction) =>
            showFn(contractId, abiFn) && (
              <AbiFunction
                key={abiFn.name}
                abiFn={abiFn}
                onClick={() => {
                  setFunctionName(abiFn.name);
                }}
              />
            )
        )
      )}
    </>
  );
}
