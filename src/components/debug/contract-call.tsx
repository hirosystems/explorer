import * as React from 'react';

import { Formik } from 'formik';
import { Flex, Box, Stack, Button } from '@blockstack/ui';
import { Field, Wrapper } from '@components/debug/common';
import { fetchContractInterface } from '@common/debug';
import { Function } from '@components/debug/contract-call/functions';
import { Title } from '@components/typography';

export const ContractCall = (props: any) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [abi, setAbi] = React.useState(null);

  const initialValues = {
    contractAddress: '',
  };

  const onSubmit = async ({ contractAddress }: any) => {
    if (!contractAddress || !contractAddress.includes('.')) {
      setError('Check your fields, please.');
      return;
    }
    try {
      setError(undefined);
      setLoading(true);
      const functions = await fetchContractInterface(
        contractAddress,
        contractAddress.split('.')[1]
      );
      setAbi(JSON.parse(functions.abi));
      setLoading(false);
    } catch (e) {
      setError('Something went wrong!');
      setLoading(false);
    }
  };

  const funcs = abi
    ? // @ts-ignore
      (abi as any).functions.map((func: any) => {
        return (
          <Function
            func={func}
            contractName={'hello-world-contract'}
            contractAddress={'ST3WGBKAME0AETNMRCXDV3A18WFJRAVBFD9VRK9K8'}
            key={func.name}
          />
        );
      })
    : null;

  return (
    <Wrapper title="Contract call" error={error} {...props}>
      <>
        <Formik enableReinitialize initialValues={initialValues} onSubmit={onSubmit}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit} method="post">
              <Flex width="100%">
                <Stack spacing="base" width="100%">
                  <Field
                    label="Contract address"
                    placeholder="STRYYQQ9M8KAF4NS7WNZQYY59X93XEKR31JP64CP.hello-world-contract"
                    name="contractAddress"
                  />
                  <Button type="submit" isLoading={loading}>
                    Submit
                  </Button>
                </Stack>
              </Flex>
            </form>
          )}
        </Formik>
        <Box mt="48px" pt="loose" borderTop="1px solid var(--colors-border)">
          <Title as="h3" mb="base">
            Functions
          </Title>
          {funcs}
        </Box>
      </>
    </Wrapper>
  );
};
