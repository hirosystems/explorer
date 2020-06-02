import * as React from 'react';

import { Formik } from 'formik';
import { Flex, Box, Stack, Button, Transition } from '@blockstack/ui';
import { Field, Wrapper } from '@components/sandbox/common';

import { fetchContract, selectContractAbi, selectContractSource } from '@store/contracts';
import { useDispatch, useSelector } from 'react-redux';
import { Function } from '@components/sandbox/contract-call/functions';
import { Title } from '@components/typography';
import { useLoading } from '@common/hooks/use-loading';
import { RootState } from '@store';
import { ContractCard } from '@components/contract-card';
import { useRef } from 'react';

const Functions = ({ abi, contractName, contractAddress }: any) => {
  return abi.functions.map((func: any) => {
    return func.access !== 'private' ? (
      <Function
        contractName={contractName as string}
        contractAddress={contractAddress as string}
        func={func}
        key={func.name}
      />
    ) : null;
  });
};

export const ContractCall = (props: any) => {
  const { isLoading, doStartLoading, doFinishLoading } = useLoading();
  const [contractName, setContractName] = React.useState<string | undefined>(undefined);
  const [contractAddress, setAddress] = React.useState<string | undefined>(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [showSearch, setShowSearch] = React.useState<boolean>(true);
  const buttonRef = useRef<HTMLDivElement | null>(null);

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
    (buttonRef as any).current.blur();
    setContractName(contractName);
    setAddress(contractAddress);
    try {
      setError(undefined);
      doStartLoading();
      await dispatch(fetchContract(contractAddress + '.' + contractName));
      doFinishLoading();
      setShowSearch(false);
    } catch (e) {
      setError('Something went wrong!');
      doFinishLoading();
    }
  };

  const onPaste = (event: any, callback: (string: string) => any) => {
    if (typeof navigator === 'undefined' || typeof window === 'undefined') return;
    if (event.originalEvent && event.originalEvent.clipboardData) {
      // OriginalEvent is a property from jQuery, normalizing the event object
      callback(event.originalEvent.clipboardData.getData('text'));
    } else if (event.clipboardData) {
      // used in some browsers for clipboardData
      callback(event.clipboardData.getData('text/plain'));
    } else if ((window as any).clipboardData) {
      // Older clipboardData version for Internet Explorer only
      callback((window as any).clipboardData.getData('Text'));
    }
  };

  return (
    <Wrapper
      title="Contract call"
      error={error}
      position="relative"
      subtitle={
        !showSearch
          ? {
              onClick: () => setShowSearch(true),
              label: 'Back to search',
            }
          : undefined
      }
      {...props}
    >
      <Stack isInline spacing="base" width="100%">
        <Transition
          styles={{
            init: {
              width: '100%',
              opacity: 0,
              position: 'absolute',
              transform: 'translateY(5px)',
            },
            entered: {
              width: '100%',
              opacity: 1,
              position: 'relative',
              transform: 'none',
            },
            exiting: {
              width: '100%',
              opacity: 0,
              position: 'absolute',
              transform: 'translateY(10px)',
            },
          }}
          in={showSearch}
        >
          {styles => (
            <Box width="100%" position="absolute" style={styles}>
              <Formik enableReinitialize initialValues={initialValues} onSubmit={onSubmit}>
                {({ handleSubmit, setValues }) => {
                  const handlePaste = (e: any) =>
                    onPaste(e, (value: string) => {
                      const theValue = value.trim().toString();
                      if (theValue.includes('.')) {
                        const contractAddress = theValue.split('.')[0];
                        const contractName = theValue.split('.')[1];

                        setTimeout(() => {
                          setValues({
                            contractAddress,
                            contractName,
                          });
                        }, 0);
                      }
                    });

                  return (
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
                            onPaste={handlePaste}
                          />
                          <Field
                            label="Contract Name"
                            placeholder="hello-world-contract"
                            name="contractName"
                          />
                          <Box>
                            <Button ref={buttonRef as any} type="submit" isLoading={isLoading}>
                              Search
                            </Button>
                          </Box>
                        </Stack>
                      </Flex>
                    </Box>
                  );
                }}
              </Formik>
            </Box>
          )}
        </Transition>
        <Transition
          styles={{
            init: {
              width: '100%',
              opacity: 0,
              position: 'absolute',
              transform: 'translateY(5px)',
            },
            entered: {
              width: '100%',
              opacity: 1,
              position: 'relative',
              transform: 'none',
            },
            exiting: {
              width: '100%',
              opacity: 0,
              position: 'absolute',
              transform: 'translateY(10px)',
            },
          }}
          in={!showSearch}
        >
          {styles => (
            <Flex
              position="relative"
              zIndex={5}
              bg="var(--colors-bg)"
              flexShrink={0}
              width="100%"
              style={{ ...styles }}
            >
              {abi ? (
                <Box flexGrow={1} mr="base">
                  <Title as="h3" mb="base">
                    Available functions
                  </Title>
                  <Functions
                    contractName={contractName}
                    contractAddress={contractAddress}
                    abi={JSON.parse(abi as any)}
                  />
                </Box>
              ) : null}
              {contractName ? (
                <ContractCard title={contractName} contractId={fullyRealizedName} />
              ) : null}
            </Flex>
          )}
        </Transition>
      </Stack>
    </Wrapper>
  );
};
