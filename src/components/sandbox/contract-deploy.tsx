import * as React from 'react';
import { Formik } from 'formik';
import { Flex, Stack, Box, Button } from '@blockstack/ui';
import { Field, Wrapper } from '@components/sandbox/common';
import { Select } from '@components/select';
import { SampleContracts } from '@common/sandbox/examples';
import { fetchTransaction } from '@store/transactions';
import { network } from '@common/sandbox';
import { broadcastTransaction, fetchAccount } from '@store/sandbox';
import { makeSmartContractDeploy } from '@blockstack/stacks-transactions';
import { useDispatch } from 'react-redux';
import { useLoading } from '@common/hooks/use-loading';
import BN from 'bn.js';
import { useConfigState } from '@common/hooks/use-config-state';
import { useState } from 'react';
import { useSandboxState } from '@common/hooks/use-sandbox-state';

import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

const customConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: '-',
  length: 3,
};

const generateContractName = () => uniqueNamesGenerator(customConfig);

const Sample = ({ onItemClick, setFieldValue }: any) => {
  return (
    <Select
      name="codeBody"
      label="Choose from sample"
      setFieldValue={setFieldValue}
      onItemClick={onItemClick}
      options={SampleContracts.map(({ name, source }, key: number) => ({
        label: name,
        value: source,
        key,
      }))}
      flexGrow={1}
    />
  );
};

export const ContractDeploy = React.memo((props: any) => {
  const [error, setError] = useState<{ name: string; message: string } | undefined>();
  const [defaultName, setDefaultName] = React.useState(generateContractName());
  const [defaultContract, setDefaultContract] = React.useState(SampleContracts[0].source);
  const { identity, doFetchAccount, doBroadcastTransaction } = useSandboxState();
  const dispatch = useDispatch();
  const { isLoading, doFinishLoading, doStartLoading } = useLoading();
  const { apiServer } = useConfigState();

  const handleError = (message: string) => {
    setError({
      name: 'Error',
      message,
    });
  };

  const handleGenerateNewName = () => {
    setDefaultName(generateContractName());
  };

  const initialValues = {
    senderKey: identity?.privateKey,
    contractName: defaultName,
    codeBody: defaultContract,
    fee: 2000,
  };

  const onSubmit = async ({ senderKey, contractName, codeBody, fee }: any) => {
    if (!identity) {
      handleError('Are you logged in?');
      return;
    }

    doStartLoading();
    try {
      setError(undefined);
      await doFetchAccount(identity.address);

      const tx = await makeSmartContractDeploy({
        senderKey,
        contractName,
        codeBody,
        fee: new BN(fee),
        network: network(apiServer as string),
      });

      const response: any = await doBroadcastTransaction({
        principal: identity?.address as string,
        tx,
      });

      if (response.error || !response.transactions[0].txId) return doFinishLoading();

      props.showTransactionDialog();

      await Promise.all([
        dispatch(fetchTransaction(response.transactions[0].txId)),
        doFetchAccount(identity.address),
      ]);
      handleGenerateNewName();
      doFinishLoading();
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
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit} method="post">
            <Flex width="100%">
              <Stack width="40%" pr="base" spacing="base" flexGrow={1}>
                <Field name="contractName" label="Contract name" />
                <Field name="fee" label="Fee" />
                <Box>
                  <Button type="submit" isLoading={isLoading}>
                    Deploy contract
                  </Button>
                </Box>
              </Stack>

              <Box maxWidth="60%">
                <Box mb="base">
                  <Sample
                    onItemClick={(value: string) => setDefaultContract(value)}
                    flexGrow={1}
                    setFieldValue={setFieldValue}
                  />
                </Box>
                <Field
                  flexGrow={1}
                  label="Contract source code (editable)"
                  name="codeBody"
                  type="code"
                  maxWidth="100%"
                />
              </Box>
            </Flex>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
});
