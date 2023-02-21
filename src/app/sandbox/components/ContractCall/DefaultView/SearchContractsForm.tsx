'use client';

import { buildUrl } from '@/app/common/utils/buildUrl';
import { useGlobalContext } from '@/common/context/useAppContext';
import { onPaste, validateStacksAddress } from '@/common/utils';
import { Box, Button, Flex, Input, Stack, TextLink } from '@/ui/components';
import { Caption, Text, Title } from '@/ui/typography';
import { useColorMode } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';

export const SearchContractsForm: FC<{ rootContractAddress: string }> = ({
  rootContractAddress,
}) => {
  const router = useRouter();
  const network = useGlobalContext().activeNetwork;
  const { colorMode } = useColorMode();

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      enableReinitialize={true}
      initialValues={{
        principal: rootContractAddress,
        contract_name: 'pox',
      }}
      validate={values => {
        const errors: any = {};
        const validPrincipal = validateStacksAddress(values.principal);
        if (!validPrincipal) {
          errors['principal'] = 'Invalid Stacks address.';
        }
        if (!values.contract_name) {
          errors['contract_name'] = 'Contract name required.';
        }
        return errors;
      }}
      onSubmit={({ principal, contract_name }) => {
        router.push(buildUrl(`/sandbox/contract-call/${principal}.${contract_name}`, network));
      }}
      render={({ handleChange, handleBlur, values, setValues, errors, handleSubmit }) => (
        <Form>
          <Flex flexDirection="column" p="24px">
            <Box as="form">
              <Stack spacing="16px">
                <Title fontSize="24px">Call a contract</Title>
                <Text color={'textBody'} maxWidth="42ch" lineHeight="1.6" display="block" my={0}>
                  Manually enter contract details below, or load a contract from your transactions
                  to see available functions.
                </Text>
                <Caption>
                  Hint: you can paste the{' '}
                  <TextLink
                    display="inline"
                    textDecoration="underline"
                    href="https://docs.blockstack.org/smart-contracts/principals#smart-contracts-as-principals"
                    target="_blank"
                  >
                    smart contracts' identifier
                  </TextLink>{' '}
                  in this format: [principal].[contract-name]
                </Caption>
                {Object.keys(errors)?.length ? (
                  <Box
                    borderRadius="6px"
                    bg="rgba(207,0,0,0.05)"
                    border="1px solid rgba(207,0,0,0.1)"
                    px="16px"
                    py="8px"
                    color="red"
                    lineHeight="1.8"
                    fontSize="14px"
                    wordBreak="break-all"
                  >
                    {errors?.principal || errors?.contract_name}
                  </Box>
                ) : null}
                <Input
                  id="principal"
                  name="principal"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.principal}
                  placeholder="Enter the contract address"
                  color={colorMode === 'light' ? '#000' : '#fff'}
                  onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
                    onPaste(e, (value: string) => {
                      const cleanValue = value.trim().toString();
                      if (cleanValue.includes('.')) {
                        const [principal, contract_name] = cleanValue.split('.');

                        setTimeout(() => {
                          void setValues({
                            principal,
                            contract_name,
                          });
                        }, 0);
                      }
                    })
                  }
                />
                <Input
                  id="contract_name"
                  name="contract_name"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.contract_name}
                  placeholder="Enter the contract name"
                  color={colorMode === 'light' ? '#000' : '#fff'}
                />
                <Box>
                  <Button onClick={() => handleSubmit()}>Get contract</Button>
                </Box>
              </Stack>
            </Box>
          </Flex>
        </Form>
      )}
    />
  );
};
