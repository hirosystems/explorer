import * as React from 'react';
import { Formik } from 'formik';
import { Flex, Stack, Box, Button } from '@blockstack/ui';
import { Field, Wrapper } from '@components/sandbox/common';
import { Select } from '@components/select';
import { SampleContracts } from '@common/sandbox/examples';
import { fetchTransaction } from '@store/transactions';
import { useSandboxState, network } from '@common/sandbox';
import { broadcastTransaction, fetchAccount } from '@store/sandbox';
import { makeSmartContractDeploy } from '@blockstack/stacks-transactions';
import { useDispatch } from 'react-redux';
import { useLoading } from '@common/hooks/use-loading';
import { useTxToast, openContractDeploy } from '@common/sandbox';
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
      {...props}
    />
  );
};

export const ContractDeploy = (props: any) => {
  const [error, setError] = useState<{ name: string; message: string } | undefined>();
  const { identity, stxAddress } = useSandboxState();
  const showToast = useTxToast();
  const dispatch = useDispatch();
  const { isLoading, doFinishLoading, doStartLoading } = useLoading();

  const handleError = (message: string) => {
    setError({
      name: 'Error',
      message,
    });
  };

  const initialValues = {
    contractName: SampleContracts[0].name,
    codeBody: SampleContracts[0].source,
  };

  const onSubmit = async ({ contractName, codeBody }: any) => {
    if (!stxAddress) {
      handleError('Are you logged in?');
      return;
    }
    try {
      setError(undefined);
      doStartLoading();
      await dispatch(fetchAccount(stxAddress));

      const data = await openContractDeploy({
        contractName,
        contractSource: codeBody,
        finished: () => {
          doFinishLoading();
        },
      });
      //
      //
      // const { payload, error } = await dispatch(
      //   broadcastTransaction({ principal: identity?.address, tx })
      // );
      // if (error) return doFinishLoading();
      //
      // props.showTransactionDialog();
      // showToast(payload.transactions[0].txId);
      // setTimeout(async () => {
      //   const initialFetch = await dispatch(fetchTransaction(payload.transactions[0].txId));
      //
      //   // todo: typing fix -- asyncThunk
      //   if ((initialFetch as any).error) {
      //     await dispatch(fetchTransaction(payload.transactions[0].txId));
      //   }
      //   await dispatch(fetchAccount(identity?.address));
      //   doFinishLoading();
      // }, 3500);
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
            <Flex alignItems="flex-start" width="100%">
              <Stack spacing="base" width="100%">
                <Field name="contractName" label="Contract name" />
                <Sample flexGrow={1} setFieldValue={setFieldValue} />
                <Button type="submit" isLoading={isLoading}>
                  Submit
                </Button>
              </Stack>
              <Box ml="base">
                <Field label="Contract source code (editable)" name="codeBody" type="code" />
              </Box>
            </Flex>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
};
