import * as React from 'react';
import BigNum from 'bn.js';
import { Formik } from 'formik';
import { Flex, Stack, Box, Button } from '@blockstack/ui';
import { Field, FieldBase, Wrapper } from '@components/sandbox/common';
import { SampleContracts } from '@common/sandbox/examples';
import { fetchTransaction } from '@store/transactions';
import { useDebugState, network } from '@common/sandbox';
import { broadcastTransaction, fetchAccount } from '@store/sandbox';
import {
  makeSmartContractDeploy,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
} from '@blockstack/stacks-transactions';
import { useDispatch } from 'react-redux';
import { useLoading } from '@common/hooks/use-loading';
import { useTxToast } from '@common/sandbox';

const Sample = (props: any) => {
  return (
    <Box {...props}>
      <FieldBase
        label="Sample contracts"
        type="text"
        value={SampleContracts[0].contractName}
        name="sampleContracts"
        list="contract-samples"
        datalist={SampleContracts.map(({ contractName }) => contractName)}
      />
    </Box>
  );
};

export const ContractDeploy = (props: any) => {
  const { identity } = useDebugState();
  const showToast = useTxToast();
  const dispatch = useDispatch();
  const { isLoading, doFinishLoading, doStartLoading } = useLoading();

  const initialValues = {
    senderKey: identity?.privateKey,
    contractName: SampleContracts[0].contractName,
    codeBody: SampleContracts[3].contractSource,
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
        makeStandardSTXPostCondition(address, FungibleConditionCode.Less, new BigNum(2)),
        makeStandardSTXPostCondition(address, FungibleConditionCode.LessEqual, new BigNum(3)),
        makeStandardSTXPostCondition(address, FungibleConditionCode.Equal, new BigNum(4)),
        makeStandardSTXPostCondition(address, FungibleConditionCode.GreaterEqual, new BigNum(4)),
        makeStandardSTXPostCondition(address, FungibleConditionCode.Greater, new BigNum(1)),
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

      showToast(payload.transactions[0].txId);
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
              <Stack isInline spacing="base" width="100%">
                <Stack spacing="base" width="100%">
                  <Field label="Sender key" name="senderKey" />
                  <Field type="number" name="fee" label="Fee rate" />
                  <Field name="contractName" label="Contract name" />
                  <Button type="submit" isLoading={isLoading}>
                    Submit
                  </Button>
                </Stack>
                <Box maxWidth="60%" width="100%" flexShrink={0}>
                  <Stack spacing="base" width="100%">
                    <Sample />
                    <Field label="Contract source code (editable)" name="codeBody" type="code" />
                  </Stack>
                </Box>
              </Stack>
            </Flex>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
};
