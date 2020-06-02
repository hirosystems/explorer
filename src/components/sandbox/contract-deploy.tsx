import * as React from 'react';
import { Formik } from 'formik';
import { Flex, Stack, Box, Button } from '@blockstack/ui';
import { Field, Wrapper } from '@components/sandbox/common';
import { Select } from '@components/select';
import { SampleContracts } from '@common/sandbox/examples';
import { fetchTransaction } from '@store/transactions';
import { useDebugState, network } from '@common/sandbox';
import { broadcastTransaction, fetchAccount } from '@store/sandbox';
import { makeSmartContractDeploy } from '@blockstack/stacks-transactions';
import { useDispatch } from 'react-redux';
import { useLoading } from '@common/hooks/use-loading';
import { useTxToast } from '@common/sandbox';
import BN from 'bn.js';
import { useConfigState } from '@common/hooks/use-config-state';
import { useState } from 'react';

const Sample = (props: any) => {
  return (
    <Select
      name="codeBody"
      label="Choose from sample"
      setFieldValue={props.setFieldValue}
      options={SampleContracts.map(({ name, source }, key: number) => ({
        label: name,
        value: source,
        key,
      }))}
      flexGrow={1}
    />
  );
};

export const ContractDeploy = (props: any) => {
  const [error, setError] = useState<{ name: string; message: string } | undefined>();
  const { identity } = useDebugState();
  const showToast = useTxToast();
  const dispatch = useDispatch();
  const { isLoading, doFinishLoading, doStartLoading } = useLoading();
  const { apiServer } = useConfigState();

  const handleError = (message: string) => {
    setError({
      name: 'Error',
      message,
    });
  };

  const initialValues = {
    senderKey: identity?.privateKey,
    contractName: SampleContracts[0].name,
    codeBody: SampleContracts[0].source,
    fee: 2000,
  };

  const onSubmit = async ({ senderKey, contractName, codeBody, fee }: any) => {
    const address = identity?.address;
    if (!address) {
      handleError('Are you logged in?');
      return;
    }
    try {
      setError(undefined);
      doStartLoading();
      await dispatch(fetchAccount(identity?.address as string));

      const tx = await makeSmartContractDeploy({
        senderKey,
        contractName,
        codeBody,
        fee: new BN(fee),
        network: network(apiServer as string),
      });

      const { payload, error } = await dispatch(
        broadcastTransaction({ principal: identity?.address, tx })
      );
      if (error) return doFinishLoading();

      props.showTransactionDialog();
      showToast(payload.transactions[0].txId);
      setTimeout(async () => {
        const initialFetch = await dispatch(fetchTransaction(payload.transactions[0].txId));

        // todo: typing fix -- asyncThunk
        if ((initialFetch as any).error) {
          await dispatch(fetchTransaction(payload.transactions[0].txId));
        }
        await dispatch(fetchAccount(identity?.address));
        doFinishLoading();
      }, 3500);
    } catch (e) {
      handleError(e.message);
      return doFinishLoading();
    }
  };

  return (
    <Wrapper
      error={error?.message}
      clearError={() => setError(undefined)}
      loading={isLoading}
      title="Contract deploy"
      {...props}
    >
      <Formik enableReinitialize initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit} method="post">
            <Flex width="100%">
              <Stack spacing="base" width="100%">
                <Stack isInline spacing="base" width="100%">
                  <Field width="33%" name="contractName" label="Contract name" />
                  <Field width="33%" name="fee" label="Fee" />
                  <Sample flexGrow={1} setFieldValue={setFieldValue} />
                </Stack>
                <Box>
                  <Field
                    maxHeight="500px"
                    label="Contract source code (editable)"
                    name="codeBody"
                    type="code"
                  />
                </Box>
                <Box>
                  <Button type="submit" isLoading={isLoading}>
                    Deploy contract
                  </Button>
                </Box>
              </Stack>
            </Flex>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
};
