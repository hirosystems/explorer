import * as React from 'react';

import { Formik } from 'formik';
import { Flex, Box, Stack, Button } from '@blockstack/ui';
import { Field, Wrapper } from '@components/sandbox/common';

import { fetchContract, selectContractAbi, selectContractSource } from '@store/contracts';
import { useDispatch, useSelector } from 'react-redux';
import { Function } from '@components/sandbox/contract-call/functions';
import { Title } from '@components/typography';
import { useLoading } from '@common/hooks/use-loading';
import { RootState } from '@store';

export const ContractCall = (props: any) => {
  const { isLoading, doStartLoading, doFinishLoading } = useLoading();
  const [contractName, setContractName] = React.useState<string | undefined>(undefined);
  const [contractAddress, setAddress] = React.useState<string | undefined>(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const dispatch = useDispatch();

  const fullyRealizedName =
    contractAddress && contractName ? contractAddress + '.' + contractName : '';

  const { abi } = useSelector((state: RootState) => ({
    abi: selectContractAbi(fullyRealizedName)(state),
    code: selectContractSource(fullyRealizedName)(state),
  }));

  const initialValues = {
    contractAddress: '',
    contractName: '',
  };

  const onSubmit = async ({ contractAddress, contractName }: any) => {
    if (!contractAddress && !contractName) {
      setError('Check your fields, please.');
      return;
    }
    setContractName(contractName);
    setAddress(contractAddress);
    try {
      setError(undefined);
      doStartLoading();
      await dispatch(fetchContract(contractAddress + '.' + contractName));
      doFinishLoading();
    } catch (e) {
      setError('Something went wrong!');
      doFinishLoading();
    }
  };

  const funcs = abi
    ? // @ts-ignore
      JSON.parse(abi as any).functions.map((func: any) => {
        return (
          <Function
            contractName={contractName as string}
            contractAddress={contractAddress as string}
            func={func}
            key={func.name}
          />
        );
      })
    : null;

  return (
    <Wrapper title="Contract call" error={error} {...props}>
      <Stack isInline spacing="base" width="100%">
        <Box width="100%">
          <Formik enableReinitialize initialValues={initialValues} onSubmit={onSubmit}>
            {({ handleSubmit }) => (
              <Box
                as="form"
                // @ts-ignore
                onSubmit={handleSubmit}
                method="post"
                style={{ width: '100%' }}
              >
                <Flex width="100%">
                  <Stack spacing="base" width="100%">
                    <Field
                      label="Contract address"
                      placeholder="STRYYQQ9M8KAF4NS7WNZQYY59X93XEKR31JP64CP"
                      name="contractAddress"
                    />
                    <Field
                      label="Contract Name"
                      placeholder="hello-world-contract"
                      name="contractName"
                    />
                    <Box>
                      <Button type="submit" isLoading={isLoading}>
                        Fetch
                      </Button>
                    </Box>
                  </Stack>
                </Flex>
              </Box>
            )}
          </Formik>
        </Box>
        <Box maxWidth="60%" flexShrink={0} width="100%">
          {funcs ? (
            <Box>
              <Title as="h3" mb="base">
                Available functions
              </Title>
              {funcs}
            </Box>
          ) : null}
        </Box>
      </Stack>
    </Wrapper>
  );
};
