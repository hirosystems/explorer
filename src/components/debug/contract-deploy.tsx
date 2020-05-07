import * as React from 'react';
import BigNum from 'bn.js';
import { Formik } from 'formik';
import { Flex, Stack, Button } from '@blockstack/ui';
import { Field, Wrapper } from '@components/debug/common';
import { SampleContracts } from '@common/debug/examples';
import { fetchTransaction } from '@store/transactions';
import { useDebugState, network } from '@common/debug';
import { broadcastTransaction, fetchAccount } from '@store/debug';
import {
  makeSmartContractDeploy,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
} from '@blockstack/stacks-transactions';
import { useDispatch } from 'react-redux';
import { useLoading } from '@common/hooks/use-loading';

export const ContractDeploy = (props: any) => {
  const { identity } = useDebugState();
  const dispatch = useDispatch();
  const { isLoading, doFinishLoading, doStartLoading } = useLoading();

  const initialValues = {
    senderKey: identity?.privateKey,
    contractName: SampleContracts[0].contractName,
    codeBody: SampleContracts[0].contractSource,
    fee: 2000,
  };

  const onSubmit = async ({ senderKey, contractName, codeBody, fee, memo }: any) => {
    const address = identity?.address;
    if (!address) return;
    try {
      doStartLoading();
      await dispatch(fetchAccount(identity?.address));

      // hardcode some post conditions for now :)
      const postConditions = [
        makeStandardSTXPostCondition(address, FungibleConditionCode.Greater, new BigNum(1)),
        makeStandardSTXPostCondition(address, FungibleConditionCode.Greater, new BigNum(2)),
        makeStandardSTXPostCondition(address, FungibleConditionCode.Greater, new BigNum(3)),
        makeStandardSTXPostCondition(address, FungibleConditionCode.Greater, new BigNum(4)),
      ];

      const tx = await makeSmartContractDeploy({
        senderKey,
        contractName,
        codeBody,
        fee: new BigNum(fee),
        postConditions,
        network,
      });

      const { payload, error } = await dispatch(
        broadcastTransaction({ principal: identity?.address, tx })
      );
      if (error) return doFinishLoading();

      setTimeout(async () => {
        const initialFetch = await dispatch(fetchTransaction(payload.transactions[0].txId));
        // @ts-ignore
        if (initialFetch.error) {
          await dispatch(fetchTransaction(payload.transactions[0].txId));
        }
        await dispatch(fetchAccount(identity?.address));
        doFinishLoading();
      }, 3500);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper loading={isLoading} title="Contract deploy" {...props}>
      <Formik enableReinitialize initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} method="post">
            <Flex width="100%">
              <Stack spacing="base" width="100%">
                <Field label="Sender key" name="senderKey" />
                <Field type="number" name="fee" label="Fee rate" />
                <Field name="contractName" label="Contract name" />
                <Field label="Contract source code" name="codeBody" type="code" />
                <Button type="submit" isLoading={isLoading}>
                  Submit
                </Button>
              </Stack>
            </Flex>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
};
