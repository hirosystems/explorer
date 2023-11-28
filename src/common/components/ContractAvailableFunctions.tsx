'use client';

import { FC, useState } from 'react';

import { ClarityAbiFunction } from '@stacks/transactions';

import { AbiFunction } from '../../app/sandbox/components/ContractCall/AvailableFunctionsView';
import { FunctionView } from '../../app/sandbox/components/ContractCall/FunctionView';
import { useUser } from '../../app/sandbox/hooks/useUser';
import { setUserData } from '../../app/sandbox/sandbox-slice';
import { Button } from '../../ui/Button';
import { Flex } from '../../ui/Flex';
import { TextLink } from '../../ui/TextLink';
import { Caption } from '../../ui/typography';
import { useAppDispatch } from '../state/hooks';
import { ContractWithParsedAbi } from '../types/contract';
import { showFn } from '../utils/sandbox';

export const ContractAvailableFunctions: FC<{
  contractId: string;
  contract: ContractWithParsedAbi;
}> = ({ contractId, contract }) => {
  const { isConnected, connect } = useUser();
  const dispatch = useAppDispatch();
  const [functionName, setFunctionName] = useState('');
  return (
    <>
      {!isConnected ? (
        <Flex alignItems={'center'} justifyContent={'center'} py={'24px'}>
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
            contract?.abi?.functions?.find(
              (fn: any) => fn.name === functionName
            ) as unknown as ClarityAbiFunction
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
        contract?.abi?.functions.map(
          (abiFn: any) =>
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
};
